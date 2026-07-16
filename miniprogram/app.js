const config = require('./config')
const { syncQuestions } = require('./services/questionBank')
const { syncCheckins } = require('./services/checkin')

App({
  globalData: {
    sessionStreak: 0,
    questionsReady: false,
    isAdmin: false,
    openid: '',
    checkinSummary: null
  },

  onLaunch() {
    this.initCloud()
    this.syncBank()
    this.syncCheckin()
  },

  initCloud() {
    if (!wx.cloud) {
      console.warn('基础库过低，无法使用云开发')
      return
    }
    if (!config.cloudEnvId) {
      return
    }
    wx.cloud.init({
      env: config.cloudEnvId,
      traceUser: true
    })
  },

  async syncBank() {
    try {
      const result = await syncQuestions()
      this.globalData.questionsReady = true
      this.globalData.questionSource = result.source
      if (typeof this._onQuestionsReady === 'function') {
        this._onQuestionsReady(result)
      }
    } catch (e) {
      this.globalData.questionsReady = true
      console.warn('题库同步失败', e)
    }
  },

  async syncCheckin() {
    try {
      const summary = await syncCheckins()
      this.globalData.checkinSummary = summary
    } catch (e) {
      console.warn('打卡同步失败', e)
    }
  }
})
