import { DEFAULT_LANGUAGE, FALLBACK_LANGUAGE, LANGUAGES, type Language } from '../config'

const LANGUAGE_KEY = 'preferred-language'

export const getStoredLanguage = (): Language | null => {
  if (typeof localStorage !== 'undefined') {
    const stored = localStorage.getItem(LANGUAGE_KEY)
    if (stored && stored in LANGUAGES) {
      return stored as Language
    }
  }
  return null
}

export const setStoredLanguage = (language: Language): void => {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(LANGUAGE_KEY, language)
  }
}

export const getBrowserLanguage = (): Language => {
  if (typeof navigator === 'undefined') return DEFAULT_LANGUAGE
  
  const [browserLang] = navigator.language.split('-')
  return browserLang === 'ko' ? 'ko' : 'en'
}

export const detectLanguage = async (): Promise<Language> => {
  // First check stored preference
  const storedLang = getStoredLanguage()
  if (storedLang) return storedLang

  // Then check browser language
  const browserLang = getBrowserLanguage()
  
  try {
    // Attempt to get location from IP
    const response = await fetch('https://ipapi.co/json/')
    const data = await response.json()
    
    // If in Korea, default to Korean
    if (data.country_code === 'KR') {
      return 'ko'
    }
    
    // Otherwise use browser language
    return browserLang
  } catch (error) {
    // If geolocation fails, fall back to browser language
    return browserLang
  }
}

export const loadTranslations = async (language: Language) => {
  try {
    const translations = await import(`../translations/${language}.json`)
    return translations.default
  } catch (error) {
    console.error(`Failed to load translations for ${language}`, error)
    // Fall back to English translations if loading fails
    const fallback = await import(`../translations/en.json`)
    return fallback.default
  }
}

export const formatDate = (date: Date | string, language: Language): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toLocaleDateString(LANGUAGES[language].locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export const formatNumber = (num: number, language: Language): string => {
  return num.toLocaleString(LANGUAGES[language].locale)
}

export const getTextDirection = (language: Language): 'ltr' | 'rtl' => {
  return LANGUAGES[language].direction
} 