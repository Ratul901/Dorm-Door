import express from 'express'

const router = express.Router()

function normalizeText(value) {
  return String(value || '')
    .replace(/\s+/g, ' ')
    .trim()
}

async function translateText(text, target = 'bn') {
  const query = new URL('https://translate.googleapis.com/translate_a/single')
  query.searchParams.set('client', 'gtx')
  query.searchParams.set('sl', 'en')
  query.searchParams.set('tl', target)
  query.searchParams.set('dt', 't')
  query.searchParams.set('q', text)

  const response = await fetch(query, {
    headers: {
      Accept: 'application/json',
      'User-Agent': 'DormDoor/1.0',
    },
  })

  if (!response.ok) {
    throw new Error(`Translation service failed with status ${response.status}`)
  }

  const data = await response.json()
  if (!Array.isArray(data) || !Array.isArray(data[0])) {
    return text
  }

  return data[0]
    .map((part) => (Array.isArray(part) ? part[0] : ''))
    .join('')
    .trim()
}

router.post('/', async (req, res, next) => {
  try {
    const target = req.body?.target || 'bn'
    const incoming = Array.isArray(req.body?.texts) ? req.body.texts : []
    const normalized = [...new Set(incoming.map(normalizeText).filter(Boolean))].slice(0, 120)

    if (normalized.length === 0) {
      return res.json({ success: true, target, translations: {} })
    }

    const translations = {}

    for (const text of normalized) {
      try {
        translations[text] = await translateText(text, target)
      } catch {
        translations[text] = text
      }
    }

    return res.json({ success: true, target, translations })
  } catch (error) {
    return next(error)
  }
})

export default router
