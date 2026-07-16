const { getQuestions, getCategories } = require('../services/questionBank')

/**
 * 按分类筛选题库；不传则返回全部
 */
function getPool(category) {
  const questions = getQuestions()
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
 * 各分类题目数量
 */
function getCategoryCounts() {
  const categories = getCategories()
  const questions = getQuestions()
  const counts = {}
  categories.forEach((c) => {
    counts[c] = 0
  })
  questions.forEach((q) => {
    if (counts[q.category] != null) {
      counts[q.category] += 1
    }
  })
  return counts
}

function totalCount() {
  return getQuestions().length
}

module.exports = {
  pickRandom,
  checkAnswer,
  getPool,
  getCategories,
  getCategoryCounts,
  totalCount
}
