const { checkAdmin, manage } = require('../../../services/admin')
const { syncQuestions } = require('../../../services/questionBank')
const { getCategories } = require('../../../utils/quiz')

Page({
  data: {
    _id: '',
    isNew: true,
    categories: [],
    categoryIndex: 0,
    form: {
      id: '',
      category: '历史',
      question: '',
      options: ['', '', '', ''],
      answer: 0,
      explain: '',
      status: 'published'
    },
    answerLabels: ['A', 'B', 'C', 'D'],
    statusOptions: [
      { value: 'published', label: '已发布' },
      { value: 'draft', label: '草稿' },
      { value: 'archived', label: '已下架' }
    ],
    saving: false
  },

  async onLoad(options) {
    const auth = await checkAdmin()
    if (!auth.isAdmin) {
      wx.showToast({ title: '无管理权限', icon: 'none' })
      setTimeout(() => wx.navigateBack(), 400)
      return
    }

    const categories = getCategories()
    this.setData({ categories })

    if (options.id) {
      this.setData({ _id: options.id, isNew: false })
      wx.setNavigationBarTitle({ title: '编辑题目' })
      this.loadItem(options.id)
    } else {
      wx.setNavigationBarTitle({ title: '新建题目' })
      this.setData({
        form: Object.assign({}, this.data.form, { category: categories[0] || '历史' })
      })
    }
  },

  async loadItem(_id) {
    const res = await manage('get', { _id })
    if (!res.ok || !res.item) {
      wx.showToast({ title: res.error || '加载失败', icon: 'none' })
      return
    }
    const item = res.item
    const options = (item.options || []).slice()
    while (options.length < 4) options.push('')
    const categoryIndex = Math.max(0, this.data.categories.indexOf(item.category))
    this.setData({
      form: {
        id: item.id || '',
        category: item.category,
        question: item.question || '',
        options: options.slice(0, 4),
        answer: typeof item.answer === 'number' ? item.answer : 0,
        explain: item.explain || '',
        status: item.status || 'published'
      },
      categoryIndex
    })
  },

  onIdInput(e) {
    this.setData({ 'form.id': e.detail.value })
  },

  onQuestionInput(e) {
    this.setData({ 'form.question': e.detail.value })
  },

  onExplainInput(e) {
    this.setData({ 'form.explain': e.detail.value })
  },

  onOptionInput(e) {
    const idx = Number(e.currentTarget.dataset.index)
    this.setData({ [`form.options[${idx}]`]: e.detail.value })
  },

  onCategoryChange(e) {
    const categoryIndex = Number(e.detail.value)
    this.setData({
      categoryIndex,
      'form.category': this.data.categories[categoryIndex]
    })
  },

  onAnswerTap(e) {
    this.setData({ 'form.answer': Number(e.currentTarget.dataset.index) })
  },

  onStatusTap(e) {
    this.setData({ 'form.status': e.currentTarget.dataset.value })
  },

  async onSave() {
    if (this.data.saving) return
    const form = this.data.form
    const options = (form.options || []).map((s) => String(s || '').trim()).filter(Boolean)
    if (options.length < 2) {
      wx.showToast({ title: '至少填写 2 个选项', icon: 'none' })
      return
    }
    if (!form.question.trim()) {
      wx.showToast({ title: '请填写题干', icon: 'none' })
      return
    }
    if (form.answer < 0 || form.answer >= options.length) {
      wx.showToast({ title: '请选择正确答案', icon: 'none' })
      return
    }

    const data = {
      id: form.id.trim() || undefined,
      category: form.category,
      question: form.question.trim(),
      options,
      answer: form.answer,
      explain: form.explain.trim(),
      status: form.status
    }

    this.setData({ saving: true })
    let res
    if (this.data.isNew) {
      res = await manage('create', { data })
    } else {
      res = await manage('update', { _id: this.data._id, data })
    }
    this.setData({ saving: false })

    if (!res.ok) {
      wx.showToast({ title: res.error || '保存失败', icon: 'none' })
      return
    }

    await syncQuestions()
    wx.showToast({ title: '已保存', icon: 'success' })
    setTimeout(() => wx.navigateBack(), 400)
  },

  async onDelete() {
    if (this.data.isNew || !this.data._id) return
    const confirm = await new Promise((resolve) => {
      wx.showModal({
        title: '删除题目',
        content: '物理删除后不可恢复，确定吗？',
        confirmColor: '#a8483c',
        success: (r) => resolve(!!r.confirm)
      })
    })
    if (!confirm) return

    const res = await manage('remove', { _id: this.data._id })
    if (!res.ok) {
      wx.showToast({ title: res.error || '删除失败', icon: 'none' })
      return
    }
    await syncQuestions()
    wx.showToast({ title: '已删除', icon: 'success' })
    setTimeout(() => wx.navigateBack(), 400)
  }
})
