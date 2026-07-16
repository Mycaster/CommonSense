const { questions, CATEGORIES } = require('../data/questions')

/**
 * 按分类筛选题库；不传则返回全部
 */
function getPool(category) {
  if (!category || category === '全部') {
    return questions.slice()
  }
  return questions.filter((q) => q.category === category)
}

/**
 * 从池中随机抽一题，尽量避开 recentIds 中最近出现过的题
 */
function pickRandom(category, recentIds) {
  const pool = getPool(category)
  if (!pool.length) {
    return null
  }

  const recent = Array.isArray(recentIds) ? recentIds : []
  let candidates = pool.filter((q) => !recent.includes(q.id))
  if (!candidates.length) {
    candidates = pool
  }

  const index = Math.floor(Math.random() * candidates.length)
  return candidates[index]
}

/**
 * 判题：selectedIndex 是否等于正确答案下标
 */
function checkAnswer(question, selectedIndex) {
  if (!question || typeof selectedIndex !== 'number') {
    return false
  }
  return selectedIndex === question.answer
}

/**
 * 获取所有分类
 */
function getCategories() {
  return CATEGORIES.slice()
}

/**
 * 各分类题目数量
 */
function getCategoryCounts() {
  const counts = {}
  CATEGORIES.forEach((c) => {
    counts[c] = 0
  })
  questions.forEach((q) => {
    if (counts[q.category] != null) {
      counts[q.category] += 1
    }
  })
  return counts
}

module.exports = {
  pickRandom,
  checkAnswer,
  getPool,
  getCategories,
  getCategoryCounts,
  totalCount: questions.length
}
