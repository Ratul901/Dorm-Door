import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { api } from '../api/client'

const LanguageContext = createContext(null)

const LANGUAGE_STORAGE_KEY = 'dormdoor_language'
const DICTIONARY_STORAGE_KEY = 'dormdoor_bn_dictionary'
const ATTRIBUTES_TO_TRANSLATE = ['placeholder', 'title', 'aria-label']

const ORIGINAL_TEXT_KEY = '__dormdoorOriginalText'
const ORIGINAL_ATTRS_KEY = '__dormdoorOriginalAttrs'

const BASE_BN_DICTIONARY = {
  Home: 'হোম',
  'Browse Dorms': 'ডরম দেখুন',
  'Apply Now': 'এখনই আবেদন করুন',
  Login: 'লগইন',
  Signup: 'সাইনআপ',
  Support: 'সাপোর্ট',
  Dashboard: 'ড্যাশবোর্ড',
  Logout: 'লগআউট',
  'Create Account': 'অ্যাকাউন্ট তৈরি করুন',
  'Welcome Back': 'আবার স্বাগতম',
  Email: 'ইমেইল',
  Password: 'পাসওয়ার্ড',
  'Sign in': 'সাইন ইন',
  'Signing in...': 'সাইন ইন হচ্ছে...',
  Student: 'শিক্ষার্থী',
  Admin: 'অ্যাডমিন',
  'Dorm Admin': 'ডরম অ্যাডমিন',
  'New here?': 'নতুন এখানে?',
  'Already have an account?': 'ইতিমধ্যে অ্যাকাউন্ট আছে?',
  'Create an account': 'অ্যাকাউন্ট তৈরি করুন',
  'Create account': 'অ্যাকাউন্ট তৈরি করুন',
  'Creating account...': 'অ্যাকাউন্ট তৈরি হচ্ছে...',
  'Full name': 'পূর্ণ নাম',
  Role: 'ভূমিকা',
  Phone: 'ফোন',
  Department: 'বিভাগ',
  University: 'বিশ্ববিদ্যালয়',
  'Student ID': 'স্টুডেন্ট আইডি',
  'Demo Credentials': 'ডেমো তথ্য',
  Settings: 'সেটিংস',
  Overview: 'ওভারভিউ',
  Applications: 'আবেদনসমূহ',
  Documents: 'ডকুমেন্টস',
  Availability: 'উপলব্ধতা',
  Dorms: 'ডরমসমূহ',
  'Sign Out': 'সাইন আউট',
}

function normalizeText(value) {
  return String(value || '')
    .replace(/\s+/g, ' ')
    .trim()
}

function shouldSkipTextNode(node) {
  const parent = node.parentElement
  if (!parent) return true

  const tagName = parent.tagName
  if (tagName === 'SCRIPT' || tagName === 'STYLE' || tagName === 'NOSCRIPT') {
    return true
  }

  if (parent.closest('.material-symbols-outlined')) {
    return true
  }

  if (parent.closest('[data-no-translate="true"]')) {
    return true
  }

  return false
}

function isTranslatable(value) {
  const normalized = normalizeText(value)
  if (!normalized) return false
  if (/^[\d\s.,:%()+\-/$&]+$/.test(normalized)) return false
  return true
}

function pickTranslation(original, dictionary) {
  const normalized = normalizeText(original)
  if (!normalized) return null
  return dictionary[normalized] || null
}

function applyTextNodeTranslation(root, language, dictionary) {
  const missing = new Set()

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
  let node = walker.nextNode()

  while (node) {
    if (shouldSkipTextNode(node)) {
      node = walker.nextNode()
      continue
    }

    if (node[ORIGINAL_TEXT_KEY] === undefined) {
      node[ORIGINAL_TEXT_KEY] = node.nodeValue
    }

    const originalText = node[ORIGINAL_TEXT_KEY]

    if (!isTranslatable(originalText)) {
      node = walker.nextNode()
      continue
    }

    if (language === 'en') {
      if (node.nodeValue !== originalText) {
        node.nodeValue = originalText
      }
      node = walker.nextNode()
      continue
    }

    const translated = pickTranslation(originalText, dictionary)
    if (!translated) {
      missing.add(normalizeText(originalText))
      node = walker.nextNode()
      continue
    }

    const leadingSpaces = originalText.match(/^\s*/)?.[0] || ''
    const trailingSpaces = originalText.match(/\s*$/)?.[0] || ''
    const nextValue = `${leadingSpaces}${translated}${trailingSpaces}`
    if (node.nodeValue !== nextValue) {
      node.nodeValue = nextValue
    }

    node = walker.nextNode()
  }

  return missing
}

function applyAttributeTranslation(root, language, dictionary) {
  const missing = new Set()
  const selector = ATTRIBUTES_TO_TRANSLATE.map((attr) => `[${attr}]`).join(',')
  const nodes = root.querySelectorAll(selector)

  nodes.forEach((element) => {
    if (element.closest('[data-no-translate="true"]')) return

    if (!element[ORIGINAL_ATTRS_KEY]) {
      element[ORIGINAL_ATTRS_KEY] = {}
    }

    ATTRIBUTES_TO_TRANSLATE.forEach((attr) => {
      const currentValue = element.getAttribute(attr)
      if (!currentValue) return

      if (element[ORIGINAL_ATTRS_KEY][attr] === undefined) {
        element[ORIGINAL_ATTRS_KEY][attr] = currentValue
      }

      const original = element[ORIGINAL_ATTRS_KEY][attr]
      if (!isTranslatable(original)) return

      if (language === 'en') {
        if (element.getAttribute(attr) !== original) {
          element.setAttribute(attr, original)
        }
        return
      }

      const translated = pickTranslation(original, dictionary)
      if (!translated) {
        missing.add(normalizeText(original))
        return
      }

      if (element.getAttribute(attr) !== translated) {
        element.setAttribute(attr, translated)
      }
    })
  })

  return missing
}

function mergeDictionary(state, incoming) {
  const updates = {}
  Object.entries(incoming || {}).forEach(([key, value]) => {
    const normalizedKey = normalizeText(key)
    const normalizedValue = normalizeText(value)
    if (!normalizedKey || !normalizedValue) return
    updates[normalizedKey] = normalizedValue
  })

  return {
    ...state,
    ...updates,
  }
}

function loadStoredDictionary() {
  const raw = localStorage.getItem(DICTIONARY_STORAGE_KEY)
  if (!raw) return BASE_BN_DICTIONARY

  try {
    const parsed = JSON.parse(raw)
    return mergeDictionary(BASE_BN_DICTIONARY, parsed)
  } catch {
    return BASE_BN_DICTIONARY
  }
}

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY)
    return stored === 'bn' ? 'bn' : 'en'
  })
  const [dictionary, setDictionary] = useState(() => loadStoredDictionary())

  const dictionaryRef = useRef(dictionary)
  const inFlightRef = useRef(new Set())

  useEffect(() => {
    dictionaryRef.current = dictionary
    localStorage.setItem(DICTIONARY_STORAGE_KEY, JSON.stringify(dictionary))
  }, [dictionary])

  const requestMissingTranslations = useCallback(async (items) => {
    if (!items.length) return

    const pending = items.filter((item) => !inFlightRef.current.has(item))
    if (!pending.length) return

    pending.forEach((item) => inFlightRef.current.add(item))

    try {
      const { data } = await api.post('/translate', {
        target: 'bn',
        texts: pending,
      })

      const incoming = data?.translations || {}
      if (Object.keys(incoming).length) {
        setDictionary((current) => mergeDictionary(current, incoming))
      }
    } catch {
      // Silent fallback: base dictionary still applies when API translation is unavailable.
    } finally {
      pending.forEach((item) => inFlightRef.current.delete(item))
    }
  }, [])

  const applyLanguage = useCallback(() => {
    const root = document.getElementById('root')
    if (!root) return

    document.documentElement.lang = language

    const textMissing = applyTextNodeTranslation(root, language, dictionaryRef.current)
    const attrMissing = applyAttributeTranslation(root, language, dictionaryRef.current)
    const missing = [...new Set([...textMissing, ...attrMissing])]

    if (language === 'bn' && missing.length) {
      requestMissingTranslations(missing)
    }
  }, [language, requestMissingTranslations])

  useEffect(() => {
    applyLanguage()
  }, [applyLanguage, dictionary])

  useEffect(() => {
    const root = document.getElementById('root')
    if (!root) return

    let timeoutId = null
    const observer = new MutationObserver(() => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      timeoutId = setTimeout(() => {
        applyLanguage()
      }, 40)
    })

    observer.observe(root, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ATTRIBUTES_TO_TRANSLATE,
    })

    return () => {
      observer.disconnect()
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [applyLanguage])

  const setLanguage = useCallback((next) => {
    const resolved = next === 'bn' ? 'bn' : 'en'
    localStorage.setItem(LANGUAGE_STORAGE_KEY, resolved)
    setLanguageState(resolved)
  }, [])

  const toggleLanguage = useCallback(() => {
    setLanguage((language === 'bn' ? 'en' : 'bn'))
  }, [language, setLanguage])

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      toggleLanguage,
      isBangla: language === 'bn',
      isEnglish: language === 'en',
    }),
    [language, setLanguage, toggleLanguage],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used inside LanguageProvider')
  }
  return context
}
