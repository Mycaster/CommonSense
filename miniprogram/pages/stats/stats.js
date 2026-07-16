const { readStats, clearStats, getAccuracy } = require('../../utils/storage')
const { getCategories } = require('../../utils/quiz')
const {
  syncCheckins,
  getLocalSummary,
  getCalendarMonth
} = require('../../services/checkin')
const { shareToFriend, shareToTimeline, enableShareMenu } = require('../../utils/share')

Page({
  data: {
    total: 0,
    correct: 0,
    wrong: 0,
    accuracy: 0,
    categoryRows: [],
    hasData: false,
    // 打卡
    checkedToday: false,
    checkinStreak: 0,
    checkinDays: 0,
    calendarLabel: '',
    weekLabels: ['日', '一', '二', '三', '四', '五', '六'],
    calendarCells: [],
    recentCheckins: [],
    checkinSource: ''
  },

  monthOffset: 0,

  onLoad() {
    enableShareMenu()
  },

  onShow() {
    this.refresh()
    this.refreshCheckin()
  },

  onShareAppMessage() {
    const { accuracy, total, checkinStreak, checkinDays } = this.data
    let title = '文化常识自救 · 来一起打卡答题'
    if (checkinStreak > 1) {
      title = `文化常识自救 · 我已连续打卡 ${checkinStreak} 天`
    } else if (total > 0) {
      title = `文化常识自救 · 答了 ${total} 题，正确率 ${accuracy}%`
    } else if (checkinDays > 0) {
      title = `文化常识自救 · 累计打卡 ${checkinDays} 天`
    }
    return shareToFriend({
      title,
      path: '/pages/index/index'
    })
  },

  onShareTimeline() {
    const { checkinStreak } = this.data
    return shareToTimeline({
      title:
        checkinStreak > 1
          ? `文化常识自救 · 连续打卡 ${checkinStreak} 天`
          : '文化常识自救 · 每日一题，温故知新'
    })
  },

  refresh() {
    const stats = readStats()
    const categories = getCategories()
    const categoryRows = categories
      .map((name) => {
        const item = stats.byCategory[name] || { total: 0, correct: 0 }
        const accuracy = item.total ? Math.round((item.correct / item.total) * 100) : 0
        return {
          name,
          total: item.total,
          correct: item.correct,
          accuracy
        }
      })
      .filter((row) => row.total > 0)

    this.setData({
      total: stats.total,
      correct: stats.correct,
      wrong: Math.max(0, stats.total - stats.correct),
      accuracy: getAccuracy(stats),
      categoryRows,
      hasData: stats.total > 0
    })
  },

  applyCheckinSummary(summary) {
    const cal = getCalendarMonth(this.monthOffset)
    const recent = (summary.list || []).slice(0, 14)
    this.setData({
      checkedToday: !!summary.checkedToday,
      checkinStreak: summary.streak || 0,
      checkinDays: summary.totalDays || 0,
      calendarLabel: cal.label,
      calendarCells: cal.cells,
      recentCheckins: recent,
      checkinSource: summary.source || ''
    })
  },

  async refreshCheckin() {
    // 先渲染本地，再拉云端
    this.applyCheckinSummary(getLocalSummary())
    const summary = await syncCheckins()
    getApp().globalData.checkinSummary = summary
    this.applyCheckinSummary(summary)
  },

  onPrevMonth() {
    this.monthOffset -= 1
    const cal = getCalendarMonth(this.monthOffset)
    this.setData({
      calendarLabel: cal.label,
      calendarCells: cal.cells
    })
  },

  onNextMonth() {
    if (this.monthOffset >= 0) return
    this.monthOffset += 1
    const cal = getCalendarMonth(this.monthOffset)
    this.setData({
      calendarLabel: cal.label,
      calendarCells: cal.cells
    })
  },

  onClear() {
    wx.showModal({
      title: '清空成绩',
      content: '仅清空本机答题正确率统计，不会删除云端打卡历史。确定继续？',
      confirmColor: '#2f6f66',
      success: (res) => {
        if (res.confirm) {
          clearStats()
          this.refresh()
          wx.showToast({ title: '已清空成绩', icon: 'success' })
        }
      }
    })
  },

  goQuiz() {
    wx.navigateTo({ url: '/pages/quiz/quiz' })
  }
})
