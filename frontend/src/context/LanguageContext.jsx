import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { api } from '../api/client'

const LanguageContext = createContext(null)

const LANGUAGE_STORAGE_KEY = 'dormdoor_language'
const DICTIONARY_STORAGE_KEY = 'dormdoor_bn_dictionary'
const ATTRIBUTES_TO_TRANSLATE = ['placeholder', 'title', 'aria-label']
const UI_LABEL_TAGS = new Set(['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'BUTTON', 'A', 'LABEL', 'OPTION', 'TH', 'LEGEND', 'SUMMARY'])

const ORIGINAL_TEXT_KEY = '__dormdoorOriginalText'
const ORIGINAL_ATTRS_KEY = '__dormdoorOriginalAttrs'
const LAST_TRANSLATED_TEXT_KEY = '__dormdoorLastTranslatedText'
const LAST_TRANSLATED_ATTRS_KEY = '__dormdoorLastTranslatedAttrs'

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
  'Login / Dashboard': 'লগইন / ড্যাশবোর্ড',
  'Dorm Door': 'ডরম ডোর',
  'Search Dorms': 'ডরম খুঁজুন',
  'Find Your Perfect': 'আপনার পছন্দের',
  'Dorm Easily': 'ডরম সহজে খুঁজুন',
  'Curated student living spaces designed for focus and community. Experience premium housing that feels like home.':
    'মনোযোগ ও কমিউনিটির জন্য সাজানো শিক্ষার্থী আবাসন। ঘরের মতো আরামদায়ক প্রিমিয়াম থাকার অভিজ্ঞতা নিন।',
  Location: 'লোকেশন',
  'Which campus?': 'কোন ক্যাম্পাস?',
  'Room Type': 'রুমের ধরন',
  'All Room Types': 'সব রুমের ধরন',
  Building: 'ভবন',
  Budget: 'বাজেট',
  Amenities: 'সুবিধাসমূহ',
  'Student Satisfaction Rating': 'শিক্ষার্থী সন্তুষ্টির রেটিং',
  'Quick Filters': 'দ্রুত ফিল্টার',
  'Curated Residences': 'নির্বাচিত আবাসন',
  'Hand-picked living spaces that prioritize your academic success and comfort.':
    'আপনার পড়াশোনার সাফল্য ও আরামকে গুরুত্ব দিয়ে বাছাই করা থাকার জায়গা।',
  Showing: 'দেখানো হচ্ছে',
  match: 'টি মিল',
  matches: 'টি মিল',
  'Search In Browse': 'ব্রাউজে খুঁজুন',
  'No dorms match your current filters': 'আপনার বর্তমান ফিল্টারের সাথে কোনো ডরম মেলেনি',
  'Adjust location, room type, or quick filters and try again.':
    'লোকেশন, রুমের ধরন বা দ্রুত ফিল্টার বদলে আবার চেষ্টা করুন।',
  'Find available dorms by room type, price, and facilities in our curated sanctuary.':
    'রুমের ধরন, মূল্য ও সুবিধা অনুযায়ী উপলব্ধ ডরম খুঁজুন।',
  'Quick search by name or location...': 'নাম বা লোকেশন দিয়ে দ্রুত খুঁজুন...',
  'Block / Building': 'ব্লক / ভবন',
  'Block A (North)': 'ব্লক এ (উত্তর)',
  'Block B (South)': 'ব্লক বি (দক্ষিণ)',
  'Executive Annex': 'এক্সিকিউটিভ অ্যানেক্স',
  'All Types': 'সব ধরন',
  'Budget Range (Monthly)': 'বাজেট সীমা (মাসিক)',
  'Up to BDT': 'সর্বোচ্চ বিডিটি',
  WiFi: 'ওয়াইফাই',
  AC: 'এসি',
  Bath: 'বাথ',
  Laundry: 'লন্ড্রি',
  Available: 'খালি আছে',
  'Limited Seats': 'সীমিত সিট',
  Full: 'পূর্ণ',
  'matching dormitory spaces': 'টি মিল থাকা ডরম স্পেস',
  'Sort by:': 'সাজান:',
  'Price (Low to High)': 'মূল্য (কম থেকে বেশি)',
  'Price (High to Low)': 'মূল্য (বেশি থেকে কম)',
  'Name (A-Z)': 'নাম (A-Z)',
  'No matching dorms found': 'মিল থাকা কোনো ডরম পাওয়া যায়নি',
  'Try clearing one or two filters to see more options.':
    'আরও বিকল্প দেখতে এক-দুটি ফিল্টার সরিয়ে চেষ্টা করুন।',
  'View Details': 'বিস্তারিত দেখুন',
  '/mo': '/মাস',
  'Single Room': 'সিঙ্গেল রুম',
  'Studio Suite': 'স্টুডিও স্যুট',
  'Loft Suite': 'লফট স্যুট',
  'Shared (4 Bed)': 'শেয়ার্ড (৪ বেড)',
  'Double Room': 'ডাবল রুম',
  'Student Portal': 'শিক্ষার্থী পোর্টাল',
  'Room Applications': 'রুম আবেদনসমূহ',
  Maintenance: 'মেইনটেন্যান্স',
  Reviews: 'রিভিউ',
  Profile: 'প্রোফাইল',
  'Search portal...': 'পোর্টালে খুঁজুন...',
  'Search resources...': 'রিসোর্স খুঁজুন...',
  Notifications: 'নোটিফিকেশন',
  'Mark all read': 'সব পড়া হিসেবে চিহ্নিত করুন',
  'Loading notifications...': 'নোটিফিকেশন লোড হচ্ছে...',
  'No notifications yet.': 'এখনও কোনো নোটিফিকেশন নেই।',
  'Edit Profile': 'প্রোফাইল সম্পাদনা',
  'Go to profile': 'প্রোফাইলে যান',
  Application: 'আবেদন',
  'Loading...': 'লোড হচ্ছে...',
  Total: 'মোট',
  Dorm: 'ডরম',
  Verified: 'যাচাইকৃত',
  Pending: 'অপেক্ষমাণ',
  Complete: 'সম্পূর্ণ',
  Alerts: 'সতর্কতা',
  Unread: 'অপঠিত',
  'Up to date': 'আপ টু ডেট',
  'Current Application': 'বর্তমান আবেদন',
  'No application yet': 'এখনও কোনো আবেদন নেই',
  'No dorm selected': 'কোনো ডরম নির্বাচন করা হয়নি',
  'No block yet': 'এখনও কোনো ব্লক নেই',
  'Room pending': 'রুম অপেক্ষমাণ',
  'Submit your first application to begin': 'শুরু করতে প্রথম আবেদন জমা দিন',
  'Assigned Room': 'বরাদ্দকৃত রুম',
  'Pending assignment': 'বরাদ্দ অপেক্ষমাণ',
  'View Timeline': 'টাইমলাইন দেখুন',
  'Required Documents': 'প্রয়োজনীয় ডকুমেন্ট',
  'Open Documents': 'ডকুমেন্ট খুলুন',
  'Passport Photo': 'পাসপোর্ট ছবি',
  'Admission Certificate': 'ভর্তির সনদ',
  'Not uploaded': 'আপলোড করা হয়নি',
  'Needs Update': 'আপডেট প্রয়োজন',
  'Re-upload': 'পুনরায় আপলোড',
  Rejected: 'বাতিল',
  VERIFIED: 'যাচাইকৃত',
  PENDING: 'অপেক্ষমাণ',
  'RE-UPLOAD': 'পুনরায় আপলোড',
  'NOT UPLOADED': 'আপলোড হয়নি',
  Upload: 'আপলোড',
  'Student Profile': 'শিক্ষার্থী প্রোফাইল',
  EDIT: 'সম্পাদনা',
  'New Student': 'নতুন শিক্ষার্থী',
  'Not assigned yet': 'এখনও বরাদ্দ হয়নি',
  'Add in profile': 'প্রোফাইলে যোগ করুন',
  'No email': 'ইমেইল নেই',
  'Recent Activity': 'সাম্প্রতিক কার্যকলাপ',
  Recently: 'সম্প্রতি',
  'No recent activity yet': 'এখনও কোনো সাম্প্রতিক কার্যকলাপ নেই',
  'Create your first application or upload documents to get started.':
    'শুরু করতে প্রথম আবেদন তৈরি করুন বা ডকুমেন্ট আপলোড করুন।',
  'Need Support?': 'সহায়তা দরকার?',
  'Our team is available 24/7 for any housing assistance.':
    'আবাসন সংক্রান্ত যেকোনো সহায়তার জন্য আমাদের টিম ২৪/৭ প্রস্তুত।',
  'Chat Support': 'সাপোর্টে চ্যাট করুন',
  'Typical response time: under 30 minutes': 'সাধারণ উত্তর সময়: ৩০ মিনিটের কম',
  'Application Updated': 'আবেদন আপডেট হয়েছে',
  'Your latest room application is now under review.': 'আপনার সর্বশেষ রুম আবেদন এখন পর্যালোচনাধীন।',
  'Document Review': 'ডকুমেন্ট পর্যালোচনা',
  'Passport photo has been verified successfully.': 'পাসপোর্ট ছবি সফলভাবে যাচাই হয়েছে।',
  'Support Reply Received': 'সাপোর্টের উত্তর পাওয়া গেছে',
  'Dorm admin responded to your support ticket.': 'ডরম অ্যাডমিন আপনার সাপোর্ট টিকিটে উত্তর দিয়েছেন।',
  'Under Review': 'পর্যালোচনাধীন',
  Approved: 'অনুমোদিত',
  'Re-upload Requested': 'পুনরায় আপলোড চাওয়া হয়েছে',
  'Application under review': 'আবেদন পর্যালোচনাধীন',
  'Application created': 'আবেদন তৈরি হয়েছে',
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

function isLikelyUserContent(value, element) {
  const normalized = normalizeText(value)
  if (!normalized) return false

  if (element?.closest('[data-user-content="true"]')) {
    return true
  }

  if (normalized.includes('@')) return true
  if (/^https?:\/\//i.test(normalized)) return true
  if (/\b[^\s\\/]+\.(pdf|doc|docx|jpg|jpeg|png|webp|heic|heif|zip|rar)\b/i.test(normalized)) return true
  if (/^\+?[\d\s().-]{6,}$/.test(normalized)) return true
  if (/\b[a-z]*\d+[a-z\d-]*\b/i.test(normalized) && !UI_LABEL_TAGS.has(element?.tagName || '')) return true

  // Names should stay in the language the user entered. Keep them from auto-translation in non-label contexts.
  if (!UI_LABEL_TAGS.has(element?.tagName || '') && /^[A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3}$/.test(normalized)) {
    return true
  }

  return false
}

function pickTranslation(original, dictionary) {
  const normalized = normalizeText(original)
  if (!normalized) return null
  if (dictionary[normalized]) return dictionary[normalized]

  const countPrefix = normalized.match(/^([\d,]+(?:\/[\d,]+)?)\s+(.+)$/)
  if (countPrefix && dictionary[countPrefix[2]]) {
    return `${countPrefix[1]} ${dictionary[countPrefix[2]]}`
  }

  const countSuffix = normalized.match(/^(.+?)\s+([\d,]+(?:\/[\d,]+)?)$/)
  if (countSuffix && dictionary[countSuffix[1]]) {
    return `${dictionary[countSuffix[1]]} ${countSuffix[2]}`
  }

  return null
}

function formatTranslatedText(originalText, translated) {
  const leadingSpaces = originalText.match(/^\s*/)?.[0] || ''
  const trailingSpaces = originalText.match(/\s*$/)?.[0] || ''
  return `${leadingSpaces}${translated}${trailingSpaces}`
}

function reconcileTextNodeOriginal(node, dictionary) {
  if (node[ORIGINAL_TEXT_KEY] === undefined) {
    node[ORIGINAL_TEXT_KEY] = node.nodeValue
    return node[ORIGINAL_TEXT_KEY]
  }

  const originalText = node[ORIGINAL_TEXT_KEY]
  const currentValue = node.nodeValue
  const translated = pickTranslation(originalText, dictionary)
  const expectedTranslatedValue = translated ? formatTranslatedText(originalText, translated) : null
  const lastTranslatedValue = node[LAST_TRANSLATED_TEXT_KEY] || null

  if (
    currentValue !== originalText &&
    currentValue !== expectedTranslatedValue &&
    currentValue !== lastTranslatedValue
  ) {
    node[ORIGINAL_TEXT_KEY] = currentValue
    node[LAST_TRANSLATED_TEXT_KEY] = undefined
  }

  return node[ORIGINAL_TEXT_KEY]
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

    const originalText = reconcileTextNodeOriginal(node, dictionary)
    const parent = node.parentElement

    if (!isTranslatable(originalText)) {
      node = walker.nextNode()
      continue
    }

    if (isLikelyUserContent(originalText, parent)) {
      if (node.nodeValue !== originalText) {
        node.nodeValue = originalText
      }
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

    const nextValue = formatTranslatedText(originalText, translated)
    if (node.nodeValue !== nextValue) {
      node.nodeValue = nextValue
    }
    node[LAST_TRANSLATED_TEXT_KEY] = nextValue

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
    if (!element[LAST_TRANSLATED_ATTRS_KEY]) {
      element[LAST_TRANSLATED_ATTRS_KEY] = {}
    }

    ATTRIBUTES_TO_TRANSLATE.forEach((attr) => {
      const currentValue = element.getAttribute(attr)
      if (!currentValue) return

      if (element[ORIGINAL_ATTRS_KEY][attr] === undefined) {
        element[ORIGINAL_ATTRS_KEY][attr] = currentValue
      } else {
        const originalValue = element[ORIGINAL_ATTRS_KEY][attr]
        const translatedValue = pickTranslation(originalValue, dictionary)
        const lastTranslatedValue = element[LAST_TRANSLATED_ATTRS_KEY][attr] || null

        if (
          currentValue !== originalValue &&
          currentValue !== translatedValue &&
          currentValue !== lastTranslatedValue
        ) {
          element[ORIGINAL_ATTRS_KEY][attr] = currentValue
          element[LAST_TRANSLATED_ATTRS_KEY][attr] = undefined
        }
      }

      const original = element[ORIGINAL_ATTRS_KEY][attr]
      if (!isTranslatable(original)) return

      if (isLikelyUserContent(original, element)) {
        if (element.getAttribute(attr) !== original) {
          element.setAttribute(attr, original)
        }
        return
      }

      if (language === 'en') {
        if (element.getAttribute(attr) !== original) {
          element.setAttribute(attr, original)
        }
        return
      }

      const translated = pickTranslation(original, dictionary)
      if (!translated) {
        if (!isLikelyUserContent(original, element)) {
          missing.add(normalizeText(original))
        }
        return
      }

      if (element.getAttribute(attr) !== translated) {
        element.setAttribute(attr, translated)
      }
      element[LAST_TRANSLATED_ATTRS_KEY][attr] = translated
    })
  })

  return missing
}

function getElementFromMutationTarget(target) {
  if (!target) return null
  if (target.nodeType === Node.TEXT_NODE) {
    return target.parentElement
  }
  if (target.nodeType === Node.ELEMENT_NODE) {
    return target
  }
  return null
}

function mergeDictionary(state, incoming) {
  const updates = {}
  Object.entries(incoming || {}).forEach(([key, value]) => {
    const normalizedKey = normalizeText(key)
    const normalizedValue = normalizeText(value)
    if (!normalizedKey || !normalizedValue) return
    if (normalizedKey === normalizedValue) return
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
    return mergeDictionary(mergeDictionary({}, parsed), BASE_BN_DICTIONARY)
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
  const untranslatedRef = useRef(new Set())

  useEffect(() => {
    dictionaryRef.current = dictionary
    localStorage.setItem(DICTIONARY_STORAGE_KEY, JSON.stringify(dictionary))
  }, [dictionary])

  const requestMissingTranslations = useCallback(async (items) => {
    if (!items.length) return

    const pending = items.filter((item) => !inFlightRef.current.has(item) && !untranslatedRef.current.has(item))
    if (!pending.length) return

    pending.forEach((item) => inFlightRef.current.add(item))

    try {
      const { data } = await api.post('/translate', {
        target: 'bn',
        texts: pending,
      })

      const incoming = data?.translations || {}
      const translatedEntries = {}
      Object.entries(incoming).forEach(([key, value]) => {
        const normalizedKey = normalizeText(key)
        const normalizedValue = normalizeText(value)
        if (!normalizedKey || !normalizedValue) return
        if (normalizedKey === normalizedValue) {
          untranslatedRef.current.add(normalizedKey)
          return
        }
        translatedEntries[normalizedKey] = normalizedValue
      })

      if (Object.keys(translatedEntries).length) {
        setDictionary((current) => mergeDictionary(current, translatedEntries))
      }
    } catch {
      // Silent fallback: base dictionary still applies when API translation is unavailable.
    } finally {
      pending.forEach((item) => inFlightRef.current.delete(item))
    }
  }, [])

  const applyLanguage = useCallback((scopeNode) => {
    const appRoot = document.getElementById('root')
    if (!appRoot) return

    const root =
      scopeNode && appRoot.contains(scopeNode)
        ? scopeNode
        : appRoot

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
    const pendingElements = new Set()

    const flushPending = () => {
      if (pendingElements.size === 0) {
        applyLanguage()
        return
      }

      const next = [...pendingElements]
      pendingElements.clear()
      next.forEach((element) => applyLanguage(element))
    }

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        const mutationRoot = getElementFromMutationTarget(mutation.target)
        if (mutationRoot) {
          pendingElements.add(mutationRoot)
        }

        mutation.addedNodes.forEach((node) => {
          const addedRoot = getElementFromMutationTarget(node)
          if (addedRoot) {
            pendingElements.add(addedRoot)
          }
        })
      })

      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      timeoutId = setTimeout(() => {
        flushPending()
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
