const { getCategories, getCategoryCounts, totalCount } = require('../../utils/quiz')
const { readStats, getAccuracy } = require('../../utils/storage')
const { checkAdmin } = require('../../services/admin')

Page({
  data: {
    totalCount: 0,
    categories: [],
    accuracy: 0,
    answered: 0,
    isAdmin: false,
    bankSource: ''
  },

  onLoad() {
    const app = getApp()
    app._onQuestionsReady = () => {
      this.refreshBank()
    }
  },

  onShow() {
    this.refreshBank()
    this.refreshAdmin()
  },

  refreshBank() {
    const stats = readStats()
    const counts = getCategoryCounts()
    const categories = getCategories().map((name) => ({
      name,
      count: counts[name] || 0
    }))
    const app = getApp()

    this.setData({
      totalCount: totalCount(),
      categories,
      accuracy: getAccuracy(stats),
      answered: stats.total,
      bankSource: app.globalData.questionSource || ''
    })
  },

  async refreshAdmin() {
    const res = await checkAdmin()
    const app = getApp()
    app.globalData.isAdmin = !!res.isAdmin
    app.globalData.openid = res.openid || ''
    this.setData({ isAdmin: !!res.isAdmin })
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
  },

  goAdmin() {
    if (!this.data.isAdmin) return
    wx.navigateTo({ url: '/pages/admin/list/list' })
  },

  /** 长按品牌名：非管理员可复制 openid 便于加白名单 */
  async onBrandLongPress() {
    const res = await checkAdmin()
    if (res.isAdmin) {
      wx.navigateTo({ url: '/pages/admin/list/list' })
      return
    }
    if (res.openid) {
      wx.setClipboardData({
        data: res.openid,
        success: () => {
          wx.showToast({ title: '已复制 openid', icon: 'none' })
        }
      })
    } else if (!res.cloud) {
      wx.showToast({ title: '未开通云开发', icon: 'none' })
    } else {
      wx.showToast({ title: '无法获取 openid', icon: 'none' })
    }
  }
})
