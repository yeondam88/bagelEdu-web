// Basic i18n utilities for URL handling and language detection

import { LANGUAGES, DEFAULT_LANGUAGE, type Language } from '../config';

/**
 * Get the language from the URL
 */
export function getLangFromUrl(url: URL): Language {
  const [, lang] = url.pathname.split('/');
  if (lang in LANGUAGES) {
    return lang as Language;
  }
  return DEFAULT_LANGUAGE;
}

/**
 * Get a localized pathname for a specific language
 */
export function getLocalizedPathname(pathname: string, lang: Language): string {
  // Check if the pathname already starts with a language
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0];
  
  if (firstSegment && firstSegment in LANGUAGES) {
    // Replace the language segment
    segments[0] = lang;
    return `/${segments.join('/')}`;
  }
  
  // Add the language to the start
  return `/${lang}${pathname}`;
}

/**
 * Format a date according to the locale
 */
export function formatDate(date: Date, locale: string = 'en'): string {
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Get a translation function for a specific language
 */
export function getTranslator(lang: Language) {
  return function translate(key: string, vars?: Record<string, string>): string {
    // This is a simple implementation - in real app, you'd use a full i18n library
    // and load translations from JSON files
    const translations: Record<string, Record<string, string>> = {
      en: {
        'nav.home': 'Home',
        'nav.about': 'About',
        'nav.programs': 'Programs',
        'nav.blog': 'Blog',
        'nav.contact': 'Contact',
      },
      ko: {
        'nav.home': '홈',
        'nav.about': '소개',
        'nav.programs': '프로그램',
        'nav.blog': '블로그',
        'nav.contact': '연락처',
      },
    };
    
    let text = translations[lang]?.[key] || translations[DEFAULT_LANGUAGE][key] || key;
    
    if (vars) {
      Object.entries(vars).forEach(([key, value]) => {
        text = text.replace(`{${key}}`, value);
      });
    }
    
    return text;
  };
} 