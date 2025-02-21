import { useLanguage } from '../components/shared/LanguageProvider'
import type { Language } from '../config'
import type { LocalizedString } from '../types'

export const useTranslation = () => {
  const { language, translations } = useLanguage()

  const t = (key: string): string => {
    const keys = key.split('.')
    let value: any = translations

    for (const k of keys) {
      if (!value || !value[k]) {
        console.warn(`Translation key not found: ${key}`)
        return key
      }
      value = value[k]
    }

    return value
  }

  const getLocalizedString = (text: LocalizedString | string): string => {
    if (typeof text === 'string') return text
    return text[language] || text[language === 'ko' ? 'en' : 'ko'] || ''
  }

  return {
    t,
    getLocalizedString,
    language,
  }
} 