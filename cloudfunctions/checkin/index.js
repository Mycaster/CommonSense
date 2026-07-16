const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()
const _ = db.command
const MAX_LIMIT = 100

function todayStr(ts) {
  const d = new Date(typeof ts === 'number' ? ts : Date.now())
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function dayBefore(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number)
  const dt = new Date(y, m - 1, d)
  dt.setDate(dt.getDate() - 1)
  return todayStr(dt.getTime())
}

function calcStreak(dateSet, today) {
  let streak = 0
  let cursor = today
  // 若今天还没打卡，从昨天起算连续
  if (!dateSet[cursor]) {
    cursor = dayBefore(cursor)
  }
  while (dateSet[cursor]) {
    streak += 1
    cursor = dayBefore(cursor)
  }
  return streak
}

async function fetchUserHistory(openid, limit) {
  const collection = db.collection('checkins')
  const where = { openid }
  const countRes = await collection.where(where).count()
  const total = countRes.total
  const take = Math.min(limit || 120, total)
  const batchTimes = Math.ceil(take / MAX_LIMIT) || 0
  const list = []

  for (let i = 0; i < batchTimes; i += 1) {
    const res = await collection
      .where(where)
      .orderBy('date', 'desc')
      .skip(i * MAX_LIMIT)
      .limit(Math.min(MAX_LIMIT, take - list.length))
      .get()
    ;(res.data || []).forEach((doc) => {
      list.push({
        _id: doc._id,
        date: doc.date,
        answered: doc.answered || 0,
        correct: doc.correct || 0,
        updatedAt: doc.updatedAt || 0
      })
    })
    if (list.length >= take) break
  }
  return { list, totalDays: total }
}

/**
 * event.action:
 *  - punch { date?, answeredDelta?, correctDelta? }  当日答题累加，形成打卡
 *  - history { limit? }  历史列表
 *  - summary { limit? }  连续天数 + 历史
 */
exports.main = async (event) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID
  if (!openid) {
    return { ok: false, error: '无法获取用户身份' }
  }

  const action = event.action || 'summary'

  try {
    if (action === 'punch') {
      const date = event.date || todayStr()
      const answeredDelta = Math.max(0, Number(event.answeredDelta) || 1)
      const correctDelta = Math.max(0, Number(event.correctDelta) || 0)
      const now = Date.now()
      const collection = db.collection('checkins')

      const found = await collection.where({ openid, date }).limit(1).get()
      if (found.data && found.data.length) {
        const doc = found.data[0]
        await collection.doc(doc._id).update({
          data: {
            answered: _.inc(answeredDelta),
            correct: _.inc(correctDelta),
            updatedAt: now
          }
        })
        const fresh = await collection.doc(doc._id).get()
        return {
          ok: true,
          item: {
            date: fresh.data.date,
            answered: fresh.data.answered || 0,
            correct: fresh.data.correct || 0,
            updatedAt: fresh.data.updatedAt || now
          }
        }
      }

      const doc = {
        openid,
        date,
        answered: answeredDelta,
        correct: correctDelta,
        createdAt: now,
        updatedAt: now
      }
      const addRes = await collection.add({ data: doc })
      return {
        ok: true,
        item: {
          _id: addRes._id,
          date,
          answered: answeredDelta,
          correct: correctDelta,
          updatedAt: now
        }
      }
    }

    if (action === 'history' || action === 'summary') {
      const limit = Number(event.limit) || 90
      const { list, totalDays } = await fetchUserHistory(openid, limit)
      const dateSet = {}
      list.forEach((item) => {
        dateSet[item.date] = true
      })
      const today = todayStr()
      const streak = calcStreak(dateSet, today)
      const checkedToday = !!dateSet[today]

      return {
        ok: true,
        today,
        checkedToday,
        streak,
        totalDays,
        list
      }
    }

    return { ok: false, error: `未知 action: ${action}` }
  } catch (err) {
    return { ok: false, error: err.message || String(err) }
  }
}
