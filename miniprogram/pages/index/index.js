const { getCategories, getCategoryCounts, totalCount } = require('../../utils/quiz')
const { readStats, getAccuracy } = require('../../utils/storage')
const { checkAdmin } = require('../../services/admin')
const { shareToFriend, shareToTimeline, enableShareMenu } = require('../../utils/share')

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
    enableShareMenu()
    const app = getApp()
    app._onQuestionsReady = () => {
      this.refreshBank()
    }
  },

  onShareAppMessage() {
    const { totalCount, accuracy, answered } = this.data
    const title =
      answered > 0
        ? `文化常识自救 · 我答了 ${answered} 题，正确率 ${accuracy}%`
        : `文化常识自救 · ${totalCount} 道文化常识等你来答`
    return shareToFriend({
      title,
      path: '/pages/index/index'
    })
  },

  onShareTimeline() {
    return shareToTimeline({
      title: '文化常识自救 · 用知识武装大脑',
      query: ''
    })
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
