import React, { createContext, useContext, useEffect, useState } from 'react'
import type { Language } from '../../config'
import { DEFAULT_LANGUAGE, LANGUAGES } from '../../config'
import { detectLanguage, loadTranslations, setStoredLanguage, getTextDirection } from '../../utils/language'

interface LanguageContextType {
  language: Language
  translations: Record<string, any>
  setLanguage: (lang: Language) => Promise<void>
  textDirection: 'ltr' | 'rtl'
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

interface LanguageProviderProps {
  children: React.ReactNode
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(DEFAULT_LANGUAGE)
  const [translations, setTranslations] = useState<Record<string, any>>({})
  const [textDirection, setTextDirection] = useState<'ltr' | 'rtl'>(LANGUAGES[DEFAULT_LANGUAGE].direction)

  const setLanguage = async (newLanguage: Language) => {
    const newTranslations = await loadTranslations(newLanguage)
    setLanguageState(newLanguage)
    setTranslations(newTranslations)
    setTextDirection(getTextDirection(newLanguage))
    setStoredLanguage(newLanguage)
    document.documentElement.dir = getTextDirection(newLanguage)
    document.documentElement.lang = newLanguage
  }

  useEffect(() => {
    const initLanguage = async () => {
      const detectedLanguage = await detectLanguage()
      await setLanguage(detectedLanguage)
    }

    initLanguage()
  }, [])

  return (
    <LanguageContext.Provider value={{ language, translations, setLanguage, textDirection }}>
      {children}
    </LanguageContext.Provider>
  )
} 