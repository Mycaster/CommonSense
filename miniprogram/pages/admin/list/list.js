const { checkAdmin, manage } = require('../../../services/admin')
const { seedRemoteFromLocal, syncQuestions } = require('../../../services/questionBank')

Page({
  data: {
    loading: true,
    list: [],
    keyword: '',
    statusFilter: 'all',
    statusOptions: [
      { value: 'all', label: '全部' },
      { value: 'published', label: '已发布' },
      { value: 'draft', label: '草稿' },
      { value: 'archived', label: '已下架' }
    ],
    openid: '',
    total: 0
  },

  async onShow() {
    const auth = await checkAdmin()
    if (!auth.isAdmin) {
      wx.showToast({ title: '无管理权限', icon: 'none' })
      setTimeout(() => wx.navigateBack({ fail: () => wx.reLaunch({ url: '/pages/index/index' }) }), 500)
      return
    }
    this.setData({ openid: auth.openid || '' })
    this.loadList()
  },

  async loadList() {
    this.setData({ loading: true })
    const { statusFilter, keyword } = this.data
    const payload = {}
    if (statusFilter !== 'all') payload.status = statusFilter
    if (keyword) payload.keyword = keyword

    const res = await manage('list', payload)
    if (!res.ok) {
      this.setData({ loading: false })
      wx.showToast({ title: res.error || '加载失败', icon: 'none' })
      return
    }
    this.setData({
      loading: false,
      list: res.list || [],
      total: (res.list || []).length
    })
  },

  onKeywordInput(e) {
    this.setData({ keyword: e.detail.value })
  },

  onSearch() {
    this.loadList()
  },

  onStatusTap(e) {
    const value = e.currentTarget.dataset.value
    this.setData({ statusFilter: value }, () => this.loadList())
  },

  goCreate() {
    wx.navigateTo({ url: '/pages/admin/edit/edit' })
  },

  goEdit(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({ url: `/pages/admin/edit/edit?id=${id}` })
  },

  async onArchive(e) {
    const { id, status } = e.currentTarget.dataset
    const next = status === 'archived' ? 'published' : 'archived'
    const label = next === 'archived' ? '下架' : '重新发布'
    const confirm = await new Promise((resolve) => {
      wx.showModal({
        title: label,
        content: `确定${label}该题吗？`,
        confirmColor: '#2f6f66',
        success: (r) => resolve(!!r.confirm)
      })
    })
    if (!confirm) return

    const res = await manage('setStatus', { _id: id, status: next })
    if (!res.ok) {
      wx.showToast({ title: res.error || '操作失败', icon: 'none' })
      return
    }
    await syncQuestions()
    wx.showToast({ title: '已更新', icon: 'success' })
    this.loadList()
  },

  async onSeed() {
    const confirm = await new Promise((resolve) => {
      wx.showModal({
        title: '灌入种子题库',
        content: '仅当云端题库为空时可灌入本地 62 道种子题。确定继续？',
        confirmColor: '#2f6f66',
        success: (r) => resolve(!!r.confirm)
      })
    })
    if (!confirm) return

    wx.showLoading({ title: '灌入中' })
    const res = await seedRemoteFromLocal()
    wx.hideLoading()
    if (!res.ok) {
      wx.showToast({ title: res.error || '灌入失败', icon: 'none' })
      return
    }
    await syncQuestions()
    wx.showToast({ title: `已灌入 ${res.inserted} 题`, icon: 'success' })
    this.loadList()
  },

  onCopyOpenid() {
    if (!this.data.openid) return
    wx.setClipboardData({ data: this.data.openid })
  }
})
