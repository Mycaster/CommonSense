const config = require('./config')
const { syncQuestions } = require('./services/questionBank')

App({
  globalData: {
    sessionStreak: 0,
    questionsReady: false,
    isAdmin: false,
    openid: ''
  },

  onLaunch() {
    this.initCloud()
    this.syncBank()
  },

  initCloud() {
    if (!wx.cloud) {
      console.warn('基础库过低，无法使用云开发')
      return
    }
    if (!config.cloudEnvId) {
      // 未配置环境：保持本地题库模式
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
  }
})
