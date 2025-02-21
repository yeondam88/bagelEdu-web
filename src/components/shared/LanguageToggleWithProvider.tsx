import React from 'react'
import { LanguageProvider } from './LanguageProvider'
import { LanguageToggle } from './LanguageToggle'

export const LanguageToggleWithProvider: React.FC = () => {
  return (
    <LanguageProvider>
      <LanguageToggle />
    </LanguageProvider>
  )
} 