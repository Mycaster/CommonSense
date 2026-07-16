const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()
const _ = db.command
const MAX_LIMIT = 100

/**
 * 拉取已发布题目（支持增量：传 since = updatedAt）
 * event: { since?: number }
 */
exports.main = async (event) => {
  const since = typeof event.since === 'number' ? event.since : 0
  const collection = db.collection('questions')

  try {
    // 全量：仅已发布；增量：返回 since 之后所有状态变更（便于客户端剔除下架题）
    const where = since > 0
      ? { updatedAt: _.gt(since) }
      : { status: 'published' }

    const countRes = await collection.where(where).count()
    const total = countRes.total
    const batchTimes = Math.ceil(total / MAX_LIMIT) || 0
    const tasks = []

    for (let i = 0; i < batchTimes; i += 1) {
      tasks.push(
        collection
          .where(where)
          .skip(i * MAX_LIMIT)
          .limit(MAX_LIMIT)
          .orderBy('updatedAt', 'asc')
          .get()
      )
    }

    const results = await Promise.all(tasks)
    const list = []
    results.forEach((r) => {
      ;(r.data || []).forEach((doc) => {
        list.push(normalize(doc))
      })
    })

    return {
      ok: true,
      total: list.length,
      since,
      serverTime: Date.now(),
      list
    }
  } catch (err) {
    return {
      ok: false,
      error: err.message || String(err),
      list: []
    }
  }
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
    updatedAt: doc.updatedAt || 0
  }
}
