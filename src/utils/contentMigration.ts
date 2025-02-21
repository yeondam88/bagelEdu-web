import type { LocalizedString } from '../types'

export const createLocalizedString = (text: string, isKorean = true): LocalizedString => {
  return {
    ko: isKorean ? text : '',
    en: !isKorean ? text : '',
  }
}

export const migrateToLocalized = (
  content: Record<string, unknown>,
  koreanFields: string[] = [],
  englishFields: string[] = []
): Record<string, unknown> => {
  const result = { ...content }

  for (const field of koreanFields) {
    if (typeof result[field] === 'string') {
      result[field] = createLocalizedString(result[field] as string, true)
    }
  }

  for (const field of englishFields) {
    if (typeof result[field] === 'string') {
      result[field] = createLocalizedString(result[field] as string, false)
    }
  }

  return result
}

export const mergeLocalizedStrings = (
  korean: string,
  english: string
): LocalizedString => {
  return {
    ko: korean,
    en: english,
  }
}

export const extractLocalizedString = (
  text: LocalizedString | string,
  language: 'ko' | 'en'
): string => {
  if (typeof text === 'string') return text
  return text[language] || text[language === 'ko' ? 'en' : 'ko'] || ''
} 