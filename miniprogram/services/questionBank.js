const { questions: seedQuestions, CATEGORIES } = require('../data/questions')
const config = require('../config')
const { cloudEnabled, callFunction } = require('./cloud')

const CACHE_KEY = config.questionCacheKey
const META_KEY = config.questionMetaKey

function readCache() {
  try {
    const list = wx.getStorageSync(CACHE_KEY)
    if (Array.isArray(list) && list.length) {
      return list
    }
  } catch (e) {
    // ignore
  }
  return null
}

function writeCache(list, meta) {
  try {
    wx.setStorageSync(CACHE_KEY, list)
    wx.setStorageSync(META_KEY, meta || { syncedAt: Date.now(), source: 'remote' })
  } catch (e) {
    // ignore
  }
}

function readMeta() {
  try {
    return wx.getStorageSync(META_KEY) || {}
  } catch (e) {
    return {}
  }
}

/**
 * 合并增量：用 id 去重，远程覆盖本地同 id；已 archived 的从缓存移除
 */
function mergeQuestions(localList, remoteList) {
  const map = {}
  ;(localList || []).forEach((q) => {
    if (q && q.id) map[q.id] = q
  })
  ;(remoteList || []).forEach((q) => {
    if (!q || !q.id) return
    if (q.status === 'archived') {
      delete map[q.id]
      return
    }
    if (q.status && q.status !== 'published') {
      delete map[q.id]
      return
    }
    map[q.id] = {
      id: q.id,
      category: q.category,
      question: q.question,
      options: q.options,
      answer: q.answer,
      explain: q.explain || '',
      updatedAt: q.updatedAt || 0
    }
  })
  return Object.keys(map).map((k) => map[k])
}

function getSeedBank() {
  return seedQuestions.map((q) => ({
    id: q.id,
    category: q.category,
    question: q.question,
    options: q.options,
    answer: q.answer,
    explain: q.explain || ''
  }))
}

/**
 * 当前可用题库：缓存优先，否则种子
 */
function getQuestions() {
  return readCache() || getSeedBank()
}

function getCategories() {
  return CATEGORIES.slice()
}

/**
 * 启动同步：有云环境则拉远程；失败保留缓存/种子
 * @returns {{ questions, source, synced }}
 */
async function syncQuestions() {
  if (!cloudEnabled()) {
    const cached = readCache()
    const questions = cached || getSeedBank()
    if (!cached) {
      writeCache(questions, { syncedAt: Date.now(), source: 'seed' })
    }
    return { questions, source: cached ? 'cache' : 'seed', synced: false }
  }

  try {
    const meta = readMeta()
    const since = typeof meta.maxUpdatedAt === 'number' ? meta.maxUpdatedAt : 0
    const result = await callFunction('getQuestions', { since })

    if (!result.ok) {
      throw new Error(result.error || 'getQuestions failed')
    }

    const base = readCache() || getSeedBank()
    let merged
    if (since > 0) {
      merged = mergeQuestions(base, result.list || [])
    } else {
      // 全量
      const remote = (result.list || []).filter((q) => !q.status || q.status === 'published')
      merged = remote.length
        ? remote.map((q) => ({
            id: q.id,
            category: q.category,
            question: q.question,
            options: q.options,
            answer: q.answer,
            explain: q.explain || '',
            updatedAt: q.updatedAt || 0
          }))
        : base
    }

    let maxUpdatedAt = since
    merged.forEach((q) => {
      if (q.updatedAt && q.updatedAt > maxUpdatedAt) maxUpdatedAt = q.updatedAt
    })
    ;(result.list || []).forEach((q) => {
      if (q.updatedAt && q.updatedAt > maxUpdatedAt) maxUpdatedAt = q.updatedAt
    })

    writeCache(merged, {
      syncedAt: Date.now(),
      source: 'remote',
      maxUpdatedAt,
      serverTime: result.serverTime || Date.now()
    })

    return { questions: merged, source: 'remote', synced: true }
  } catch (e) {
    const questions = readCache() || getSeedBank()
    return { questions, source: 'fallback', synced: false, error: e.message || String(e) }
  }
}

/**
 * 管理员：把本地种子灌入云库（仅空库）
 */
async function seedRemoteFromLocal() {
  if (!cloudEnabled()) {
    return { ok: false, error: '未配置云环境' }
  }
  return callFunction('manageQuestions', {
    action: 'seed',
    questions: getSeedBank()
  })
}

module.exports = {
  getQuestions,
  getCategories,
  getSeedBank,
  syncQuestions,
  seedRemoteFromLocal,
  readMeta
}
