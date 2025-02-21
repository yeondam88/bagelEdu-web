import React, { useEffect } from 'react'
import { useLanguage } from './LanguageProvider'

declare global {
  interface Window {
    Alpine: {
      store: (key: string, value: any) => void
    }
  }
}

export const LanguageToggle: React.FC = () => {
  const { language, setLanguage } = useLanguage()

  useEffect(() => {
    // Sync language with Alpine store whenever it changes
    window.Alpine?.store('language', language)
  }, [language])

  const toggleLanguage = () => {
    const newLanguage = language === 'ko' ? 'en' : 'ko'
    setLanguage(newLanguage)
  }

  return (
    <button
      onClick={toggleLanguage}
      className="px-3 py-1 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      aria-label={`Switch to ${language === 'ko' ? 'English' : '한국어'}`}
    >
      {language === 'ko' ? 'EN' : 'KO'}
    </button>
  )
} 