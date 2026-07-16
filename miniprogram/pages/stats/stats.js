const { readStats, clearStats, getAccuracy } = require('../../utils/storage')
const { getCategories } = require('../../utils/quiz')

Page({
  data: {
    total: 0,
    correct: 0,
    wrong: 0,
    accuracy: 0,
    categoryRows: [],
    hasData: false
  },

  onShow() {
    this.refresh()
  },

  refresh() {
    const stats = readStats()
    const categories = getCategories()
    const categoryRows = categories.map((name) => {
      const item = stats.byCategory[name] || { total: 0, correct: 0 }
      const accuracy = item.total ? Math.round((item.correct / item.total) * 100) : 0
      return {
        name,
        total: item.total,
        correct: item.correct,
        accuracy
      }
    }).filter((row) => row.total > 0)

    this.setData({
      total: stats.total,
      correct: stats.correct,
      wrong: Math.max(0, stats.total - stats.correct),
      accuracy: getAccuracy(stats),
      categoryRows,
      hasData: stats.total > 0
    })
  },

  onClear() {
    wx.showModal({
      title: '清空记录',
      content: '确定清空全部答题成绩吗？此操作不可恢复。',
      confirmColor: '#2f6f66',
      success: (res) => {
        if (res.confirm) {
          clearStats()
          this.refresh()
          wx.showToast({ title: '已清空', icon: 'success' })
        }
      }
    })
  },

  goQuiz() {
    wx.navigateTo({ url: '/pages/quiz/quiz' })
  }
})
