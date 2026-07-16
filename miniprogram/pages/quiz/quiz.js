const { pickRandom, checkAnswer } = require('../../utils/quiz')
const { recordAnswer } = require('../../utils/storage')
const { punchAfterAnswer } = require('../../services/checkin')
const { shareToFriend, shareToTimeline, enableShareMenu } = require('../../utils/share')

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
    enableShareMenu()
    const category = options.category ? decodeURIComponent(options.category) : ''
    const title = category ? `${category}·答题` : '随机答题'
    wx.setNavigationBarTitle({ title })
    this.setData({ category })
    this.loadNext()
  },

  onShareAppMessage() {
    const { category, question, sessionTotal, sessionCorrect } = this.data
    let title = '文化常识自救 · 来答一题'
    if (question && question.question) {
      const q = question.question.length > 28
        ? `${question.question.slice(0, 28)}…`
        : question.question
      title = `文化常识自救 · ${q}`
    } else if (category) {
      title = `文化常识自救 · ${category}练习`
    } else if (sessionTotal > 0) {
      title = `文化常识自救 · 本局 ${sessionCorrect}/${sessionTotal}`
    }
    const path = category
      ? `/pages/quiz/quiz?category=${encodeURIComponent(category)}`
      : '/pages/quiz/quiz'
    return shareToFriend({ title, path })
  },

  onShareTimeline() {
    const { category, question } = this.data
    const title = question && question.question
      ? `文化常识自救 · ${question.question}`
      : '文化常识自救 · 随机一题温故知新'
    return shareToTimeline({
      title,
      query: category ? `category=${encodeURIComponent(category)}` : ''
    })
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
