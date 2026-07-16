const STORAGE_KEY = 'cultural_trivia_stats'

const emptyStats = () => ({
  total: 0,
  correct: 0,
  byCategory: {}
})

function readStats() {
  try {
    const data = wx.getStorageSync(STORAGE_KEY)
    if (data && typeof data === 'object') {
      return {
        total: data.total || 0,
        correct: data.correct || 0,
        byCategory: data.byCategory || {}
      }
    }
  } catch (e) {
    // ignore
  }
  return emptyStats()
}

function writeStats(stats) {
  try {
    wx.setStorageSync(STORAGE_KEY, stats)
  } catch (e) {
    // ignore
  }
}

/**
 * 记录一次答题结果
 */
function recordAnswer(category, isCorrect) {
  const stats = readStats()
  stats.total += 1
  if (isCorrect) {
    stats.correct += 1
  }

  if (!stats.byCategory[category]) {
    stats.byCategory[category] = { total: 0, correct: 0 }
  }
  stats.byCategory[category].total += 1
  if (isCorrect) {
    stats.byCategory[category].correct += 1
  }

  writeStats(stats)
  return stats
}

function clearStats() {
  const stats = emptyStats()
  writeStats(stats)
  return stats
}

function getAccuracy(stats) {
  const s = stats || readStats()
  if (!s.total) {
    return 0
  }
  return Math.round((s.correct / s.total) * 100)
}

module.exports = {
  readStats,
  recordAnswer,
  clearStats,
  getAccuracy
}
