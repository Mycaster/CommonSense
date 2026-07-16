const { callFunction, cloudEnabled } = require('./cloud')

async function checkAdmin() {
  if (!cloudEnabled()) {
    return { ok: true, isAdmin: false, openid: '', cloud: false }
  }
  try {
    const res = await callFunction('manageQuestions', { action: 'checkAdmin' })
    return {
      ok: !!res.ok,
      isAdmin: !!res.isAdmin,
      openid: res.openid || '',
      cloud: true,
      error: res.error
    }
  } catch (e) {
    return { ok: false, isAdmin: false, openid: '', cloud: true, error: e.message || String(e) }
  }
}

function manage(action, payload) {
  return callFunction('manageQuestions', Object.assign({ action }, payload || {}))
}

module.exports = {
  checkAdmin,
  manage
}
