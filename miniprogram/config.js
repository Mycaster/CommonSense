/**
 * 小程序端配置
 * 开通云开发后，把 cloudEnvId 改成你的环境 ID
 * 未配置时自动降级为本地题库 / 本地打卡
 */
module.exports = {
  // 例：'cloud1-xxxxx'；留空则不走云端
  cloudEnvId: '',

  // 题库本地缓存 key
  questionCacheKey: 'cultural_trivia_question_bank',
  questionMetaKey: 'cultural_trivia_question_meta',

  // 打卡本地缓存
  checkinCacheKey: 'cultural_trivia_checkins'
}
