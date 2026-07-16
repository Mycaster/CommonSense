const config = require('../config')
const { cloudEnabled, callFunction } = require('./cloud')

const CACHE_KEY = config.checkinCacheKey

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

function readLocal() {
  try {
    const data = wx.getStorageSync(CACHE_KEY)
    if (data && typeof data === 'object' && data.byDate) {
      return data
    }
  } catch (e) {
    // ignore
  }
  return { byDate: {}, syncedAt: 0 }
}

function writeLocal(store) {
  try {
    wx.setStorageSync(CACHE_KEY, store)
  } catch (e) {
    // ignore
  }
}

function calcStreak(byDate, today) {
  let streak = 0
  let cursor = today
  if (!byDate[cursor]) {
    cursor = dayBefore(cursor)
  }
  while (byDate[cursor]) {
    streak += 1
    cursor = dayBefore(cursor)
  }
  return streak
}

function toSummary(store) {
  const today = todayStr()
  const byDate = store.byDate || {}
  const dates = Object.keys(byDate).sort()
  const list = dates
    .slice()
    .reverse()
    .map((date) => ({
      date,
      answered: byDate[date].answered || 0,
      correct: byDate[date].correct || 0,
      updatedAt: byDate[date].updatedAt || 0
    }))

  return {
    today,
    checkedToday: !!byDate[today],
    streak: calcStreak(byDate, today),
    totalDays: dates.length,
    list,
    source: store.source || 'local'
  }
}

function upsertLocalDay(date, answeredDelta, correctDelta) {
  const store = readLocal()
  if (!store.byDate[date]) {
    store.byDate[date] = { answered: 0, correct: 0, updatedAt: 0 }
  }
  store.byDate[date].answered += answeredDelta
  store.byDate[date].correct += correctDelta
  store.byDate[date].updatedAt = Date.now()
  store.syncedAt = Date.now()
  writeLocal(store)
  return store
}

function mergeRemoteList(list) {
  const store = readLocal()
  ;(list || []).forEach((item) => {
    if (!item || !item.date) return
    const prev = store.byDate[item.date]
    // 云端为准（同日取云端计数）
    if (!prev || (item.updatedAt || 0) >= (prev.updatedAt || 0)) {
      store.byDate[item.date] = {
        answered: item.answered || 0,
        correct: item.correct || 0,
        updatedAt: item.updatedAt || Date.now()
      }
    }
  })
  store.syncedAt = Date.now()
  store.source = 'remote'
  writeLocal(store)
  return store
}

/**
 * 答一题后打卡：先写本地，有云则同步上云
 */
async function punchAfterAnswer(isCorrect) {
  const date = todayStr()
  const answeredDelta = 1
  const correctDelta = isCorrect ? 1 : 0
  upsertLocalDay(date, answeredDelta, correctDelta)

  if (!cloudEnabled()) {
    return toSummary(readLocal())
  }

  try {
    const res = await callFunction('checkin', {
      action: 'punch',
      date,
      answeredDelta,
      correctDelta
    })
    if (res.ok && res.item) {
      const store = readLocal()
      store.byDate[res.item.date] = {
        answered: res.item.answered,
        correct: res.item.correct,
        updatedAt: res.item.updatedAt || Date.now()
      }
      store.source = 'remote'
      store.syncedAt = Date.now()
      writeLocal(store)
    }
  } catch (e) {
    // 保留本地，下次拉取时再对齐
  }

  return toSummary(readLocal())
}

/**
 * 拉取云端历史并合并本地
 */
async function syncCheckins() {
  if (!cloudEnabled()) {
    return toSummary(readLocal())
  }

  try {
    const res = await callFunction('checkin', {
      action: 'summary',
      limit: 120
    })
    if (!res.ok) {
      throw new Error(res.error || 'sync failed')
    }
    const store = mergeRemoteList(res.list || [])
    const summary = toSummary(store)
    summary.source = 'remote'
    summary.streak = res.streak != null ? res.streak : summary.streak
    summary.totalDays = res.totalDays != null ? res.totalDays : summary.totalDays
    summary.checkedToday = !!res.checkedToday
    return summary
  } catch (e) {
    const summary = toSummary(readLocal())
    summary.error = e.message || String(e)
    return summary
  }
}

function getLocalSummary() {
  return toSummary(readLocal())
}

/**
 * 生成当月日历格子（含上月末尾占位）
 */
function buildMonthCalendar(year, month, byDate) {
  // month: 1-12
  const first = new Date(year, month - 1, 1)
  const startWeekday = first.getDay() // 0 Sun
  const daysInMonth = new Date(year, month, 0).getDate()
  const today = todayStr()
  const cells = []

  for (let i = 0; i < startWeekday; i += 1) {
    cells.push({ empty: true })
  }

  for (let d = 1; d <= daysInMonth; d += 1) {
    const date = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    const rec = byDate[date]
    cells.push({
      empty: false,
      day: d,
      date,
      checked: !!rec,
      answered: rec ? rec.answered : 0,
      isToday: date === today
    })
  }

  return cells
}

function getCalendarMonth(offset) {
  const now = new Date()
  const base = new Date(now.getFullYear(), now.getMonth() + (offset || 0), 1)
  const year = base.getFullYear()
  const month = base.getMonth() + 1
  const store = readLocal()
  return {
    year,
    month,
    label: `${year}年${month}月`,
    cells: buildMonthCalendar(year, month, store.byDate || {})
  }
}

module.exports = {
  todayStr,
  punchAfterAnswer,
  syncCheckins,
  getLocalSummary,
  getCalendarMonth,
  readLocal
}
