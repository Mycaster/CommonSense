const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()
const _ = db.command
const MAX_LIMIT = 100

/**
 * 管理员 openid 白名单（逗号分隔）
 * 可在云函数环境变量 ADMIN_OPENIDS 中配置，例如：
 * oXXXX,oYYYY
 * 也可在云数据库 admins 集合中写入 { openid: 'oXXXX' }
 */
function envAdminList() {
  const raw = process.env.ADMIN_OPENIDS || ''
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

async function isAdmin(openid) {
  if (!openid) return false
  if (envAdminList().includes(openid)) return true

  try {
    const res = await db.collection('admins').where({ openid }).limit(1).get()
    return !!(res.data && res.data.length)
  } catch (e) {
    // admins 集合不存在时忽略
    return false
  }
}

function assertFields(payload, creating) {
  const errors = []
  if (!payload.category) errors.push('缺少分类')
  if (!payload.question) errors.push('缺少题干')
  if (!Array.isArray(payload.options) || payload.options.length < 2) {
    errors.push('选项至少 2 个')
  }
  if (typeof payload.answer !== 'number' || payload.answer < 0) {
    errors.push('正确答案下标无效')
  }
  if (
    Array.isArray(payload.options) &&
    typeof payload.answer === 'number' &&
    payload.answer >= payload.options.length
  ) {
    errors.push('正确答案下标超出选项范围')
  }
  if (creating && !payload.id) {
    // id 可自动生成
  }
  return errors
}

function normalize(doc) {
  return {
    _id: doc._id,
    id: doc.id || doc._id,
    category: doc.category,
    question: doc.question,
    options: doc.options || [],
    answer: doc.answer,
    explain: doc.explain || '',
    status: doc.status || 'published',
    updatedAt: doc.updatedAt || 0,
    createdAt: doc.createdAt || 0
  }
}

async function fetchAll(where) {
  const collection = db.collection('questions')
  const query = Object.keys(where).length ? collection.where(where) : collection
  const countRes = await query.count()
  const total = countRes.total
  const batchTimes = Math.ceil(total / MAX_LIMIT) || 0
  const list = []
  for (let i = 0; i < batchTimes; i += 1) {
    const res = await query
      .skip(i * MAX_LIMIT)
      .limit(MAX_LIMIT)
      .orderBy('updatedAt', 'desc')
      .get()
    ;(res.data || []).forEach((doc) => list.push(normalize(doc)))
  }
  return list
}

/**
 * event.action:
 *  - checkAdmin
 *  - list { status?, category?, keyword? }
 *  - get { _id }
 *  - create { data }
 *  - update { _id, data }
 *  - setStatus { _id, status }  // published | draft | archived
 *  - remove { _id }            // 物理删除（慎用）
 *  - seed { questions: [] }    // 首次灌入种子题（仅库为空时）
 */
exports.main = async (event) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID
  const action = event.action || 'checkAdmin'

  if (action === 'checkAdmin') {
    const admin = await isAdmin(openid)
    return { ok: true, isAdmin: admin, openid }
  }

  const admin = await isAdmin(openid)
  if (!admin) {
    return { ok: false, error: '无管理权限', openid }
  }

  try {
    if (action === 'list') {
      const where = {}
      if (event.status) where.status = event.status
      if (event.category) where.category = event.category
      let list = await fetchAll(Object.keys(where).length ? where : {})
      if (event.keyword) {
        const kw = String(event.keyword).trim()
        list = list.filter(
          (q) =>
            (q.question && q.question.indexOf(kw) >= 0) ||
            (q.id && q.id.indexOf(kw) >= 0)
        )
      }
      return { ok: true, list, total: list.length }
    }

    if (action === 'get') {
      const res = await db.collection('questions').doc(event._id).get()
      return { ok: true, item: normalize(res.data) }
    }

    if (action === 'create') {
      const data = event.data || {}
      const errors = assertFields(data, true)
      if (errors.length) return { ok: false, error: errors.join('；') }

      const now = Date.now()
      const id = data.id || `q-${now}`
      const doc = {
        id,
        category: data.category,
        question: data.question,
        options: data.options,
        answer: data.answer,
        explain: data.explain || '',
        status: data.status || 'published',
        createdAt: now,
        updatedAt: now
      }
      const addRes = await db.collection('questions').add({ data: doc })
      return { ok: true, _id: addRes._id, item: normalize({ _id: addRes._id, ...doc }) }
    }

    if (action === 'update') {
      if (!event._id) return { ok: false, error: '缺少 _id' }
      const data = event.data || {}
      const errors = assertFields(
        {
          category: data.category,
          question: data.question,
          options: data.options,
          answer: data.answer
        },
        false
      )
      if (errors.length) return { ok: false, error: errors.join('；') }

      const patch = {
        category: data.category,
        question: data.question,
        options: data.options,
        answer: data.answer,
        explain: data.explain || '',
        updatedAt: Date.now()
      }
      if (data.id) patch.id = data.id
      if (data.status) patch.status = data.status

      await db.collection('questions').doc(event._id).update({ data: patch })
      const res = await db.collection('questions').doc(event._id).get()
      return { ok: true, item: normalize(res.data) }
    }

    if (action === 'setStatus') {
      if (!event._id) return { ok: false, error: '缺少 _id' }
      const status = event.status
      if (!['published', 'draft', 'archived'].includes(status)) {
        return { ok: false, error: '非法 status' }
      }
      await db.collection('questions').doc(event._id).update({
        data: { status, updatedAt: Date.now() }
      })
      return { ok: true }
    }

    if (action === 'remove') {
      if (!event._id) return { ok: false, error: '缺少 _id' }
      await db.collection('questions').doc(event._id).remove()
      return { ok: true }
    }

    if (action === 'seed') {
      const countRes = await db.collection('questions').count()
      if (countRes.total > 0) {
        return { ok: false, error: `题库已有 ${countRes.total} 题，拒绝重复灌入` }
      }
      const questions = Array.isArray(event.questions) ? event.questions : []
      if (!questions.length) return { ok: false, error: '种子题为空' }

      const now = Date.now()
      // 云开发单次最多约 20 条写入，分批
      let inserted = 0
      for (let i = 0; i < questions.length; i += 1) {
        const q = questions[i]
        await db.collection('questions').add({
          data: {
            id: q.id || `seed-${i + 1}`,
            category: q.category,
            question: q.question,
            options: q.options,
            answer: q.answer,
            explain: q.explain || '',
            status: 'published',
            createdAt: now,
            updatedAt: now
          }
        })
        inserted += 1
      }
      return { ok: true, inserted }
    }

    return { ok: false, error: `未知 action: ${action}` }
  } catch (err) {
    return { ok: false, error: err.message || String(err) }
  }
}
