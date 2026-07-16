const config = require('../config')

function cloudEnabled() {
  return !!(wx.cloud && config.cloudEnvId)
}

function callFunction(name, data) {
  return wx.cloud.callFunction({ name, data }).then((res) => res.result || {})
}

module.exports = {
  cloudEnabled,
  callFunction
}
