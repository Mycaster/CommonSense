const { getCategories, getCategoryCounts, totalCount } = require('../../utils/quiz')
const { readStats, getAccuracy } = require('../../utils/storage')

Page({
  data: {
    totalCount: 0,
    categories: [],
    accuracy: 0,
    answered: 0
  },

  onShow() {
    const stats = readStats()
    const counts = getCategoryCounts()
    const categories = getCategories().map((name) => ({
      name,
      count: counts[name] || 0
    }))

    this.setData({
      totalCount,
      categories,
      accuracy: getAccuracy(stats),
      answered: stats.total
    })
  },

  startQuiz() {
    wx.navigateTo({ url: '/pages/quiz/quiz' })
  },

  startCategory(e) {
    const { name } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/quiz/quiz?category=${encodeURIComponent(name)}`
    })
  },

  goStats() {
    wx.navigateTo({ url: '/pages/stats/stats' })
  }
})
