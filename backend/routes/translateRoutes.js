import express from 'express'
import { env } from '../config/env.js'

const router = express.Router()

const MAX_BATCH_SIZE = 120
const CACHE_TTL_MS = 24 * 60 * 60 * 1000
const translationCache = new Map()

function normalizeText(value) {
  return String(value || '')
    .replace(/\s+/g, ' ')
    .trim()
}

function cacheKey(text, target) {
  return `${target}:${text}`
}

function readCache(text, target) {
  const key = cacheKey(text, target)
  const cached = translationCache.get(key)
  if (!cached) return null

  if (Date.now() - cached.savedAt > CACHE_TTL_MS) {
    translationCache.delete(key)
    return null
  }

  return cached.value
}

function writeCache(text, target, value) {
  translationCache.set(cacheKey(text, target), {
    value,
    savedAt: Date.now(),
  })
}

async function translateWithGoogleCloud(text, target = 'bn') {
  if (!env.googleTranslateApiKey) {
    return null
  }

  const response = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${env.googleTranslateApiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'User-Agent': 'DormDoor/1.0',
    },
    body: JSON.stringify({
      q: text,
      source: 'en',
      target,
      format: 'text',
    }),
  })

  if (!response.ok) {
    throw new Error(`Translation service failed with status ${response.status}`)
  }

  const data = await response.json()
  const translated = data?.data?.translations?.[0]?.translatedText
  return normalizeText(translated)
}

async function translateText(text, target = 'bn') {
  const cached = readCache(text, target)
  if (cached) {
    return cached
  }

  if (target === 'en') {
    writeCache(text, target, text)
    return text
  }

  let translated = text
  try {
    const fromCloud = await translateWithGoogleCloud(text, target)
    if (fromCloud) {
      translated = fromCloud
    }
  } catch {
    translated = text
  }

  writeCache(text, target, translated)
  return translated
}

router.post('/', async (req, res, next) => {
  try {
    const target = normalizeText(req.body?.target) || 'bn'
    const incoming = Array.isArray(req.body?.texts) ? req.body.texts : []
    const normalized = [...new Set(incoming.map(normalizeText).filter(Boolean))].slice(0, MAX_BATCH_SIZE)

    if (normalized.length === 0) {
      return res.json({ success: true, target, translations: {} })
    }

    const translatedPairs = await Promise.all(
      normalized.map(async (text) => [text, await translateText(text, target)]),
    )
    const translations = Object.fromEntries(translatedPairs)

    return res.json({ success: true, target, translations })
  } catch (error) {
    return next(error)
  }
})

export default router
