const { pickRandom, checkAnswer } = require('../../utils/quiz')
const { recordAnswer } = require('../../utils/storage')
const { punchAfterAnswer } = require('../../services/checkin')

const RECENT_LIMIT = 12
const OPTION_LABELS = ['A', 'B', 'C', 'D']

Page({
  data: {
    category: '',
    question: null,
    optionLabels: OPTION_LABELS,
    selectedIndex: -1,
    answered: false,
    isCorrect: false,
    streak: 0,
    sessionTotal: 0,
    sessionCorrect: 0,
    checkedToday: false
  },

  recentIds: [],

  onLoad(options) {
    const category = options.category ? decodeURIComponent(options.category) : ''
    const title = category ? `${category}·答题` : '随机答题'
    wx.setNavigationBarTitle({ title })
    this.setData({ category })
    this.loadNext()
  },

  loadNext() {
    const question = pickRandom(this.data.category, this.recentIds)
    if (!question) {
      wx.showToast({ title: '暂无题目', icon: 'none' })
      return
    }

    this.recentIds = [question.id].concat(this.recentIds).slice(0, RECENT_LIMIT)

    this.setData({
      question,
      selectedIndex: -1,
      answered: false,
      isCorrect: false
    })
  },

  async onSelect(e) {
    if (this.data.answered) {
      return
    }

    const selectedIndex = Number(e.currentTarget.dataset.index)
    const { question, streak, sessionTotal, sessionCorrect } = this.data
    const isCorrect = checkAnswer(question, selectedIndex)

    recordAnswer(question.category, isCorrect)

    this.setData({
      selectedIndex,
      answered: true,
      isCorrect,
      streak: isCorrect ? streak + 1 : 0,
      sessionTotal: sessionTotal + 1,
      sessionCorrect: sessionCorrect + (isCorrect ? 1 : 0)
    })

    try {
      const summary = await punchAfterAnswer(isCorrect)
      if (summary && summary.checkedToday && !this.data.checkedToday) {
        this.setData({ checkedToday: true })
      }
    } catch (err) {
      // 忽略打卡失败，不影响答题
    }
  },

  onNext() {
    this.loadNext()
  }
})
