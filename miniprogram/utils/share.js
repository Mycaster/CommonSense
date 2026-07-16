/**
 * 分享文案与路径
 */
function shareToFriend(options) {
  const opts = options || {}
  return {
    title: opts.title || '文化常识自救 · 随机一题温故知新',
    path: opts.path || '/pages/index/index',
    imageUrl: opts.imageUrl || ''
  }
}

function shareToTimeline(options) {
  const opts = options || {}
  return {
    title: opts.title || '文化常识自救 · 用知识武装大脑',
    query: opts.query || '',
    imageUrl: opts.imageUrl || ''
  }
}

/** 开启右上角「转发 / 分享到朋友圈」 */
function enableShareMenu() {
  try {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
  } catch (e) {
    // 低版本忽略
  }
}

module.exports = {
  shareToFriend,
  shareToTimeline,
  enableShareMenu
}
