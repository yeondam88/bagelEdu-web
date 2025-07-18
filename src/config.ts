import type { Site, Contact, SocialObjects } from './types'

export const LANGUAGES = {
  en: {
    name: 'English',
    locale: 'en-US',
    direction: 'ltr',
  },
  ko: {
    name: '한국어',
    locale: 'ko-KR',
    direction: 'ltr',
  },
} as const

export type Language = keyof typeof LANGUAGES
export type LanguageConfig = (typeof LANGUAGES)[Language]

export const DEFAULT_LANGUAGE: Language = 'ko'
export const FALLBACK_LANGUAGE: Language = 'en'

export const SITE: Site = {
  website: 'https://bageledu.com', // replace this with your deployed domain
  author: 'Yeondam Park',
  description: {
    en: 'Global Youth is a program that aims to help youth grow as members of society through critical thinking and self-reflection, finding capabilities that match their identity through self-branding. We aim to help elevate thinking patterns by developing smart and strategic thinking power.',
    ko: 'Global Youth 란 청소년의 비판적 사고와 자기 성찰을 통한 개인의 아이덴티티에 맞는 역량을 찾아 셀프 브랜딩을 통하여 사회의 구성원으로서 성장하는 것을 목표로 하는 프로그램입니다. 스마트하고 전략적인 사고의 힘을 키워 사고 방식을 한 단계 향상할 수 있도록 돕고자 합니다.',
  },
  title: 'BagelEdu - WE ARE ELITE',
  ogImage:
    'https://bageledu.sfo3.cdn.digitaloceanspaces.com/bageledu-og-image-v3.webp',
}

export const CONTACT: Contact = {
  address: '36, Banpo-daero 18-gil, Seocho-gu, Seoul',
  phone: '(US)+1-213-369-7088, (KR)+8210-3360-6558',
  email: 'bageledu@gmail.com, support@bageledu.com',
}

export const SOCIALS: SocialObjects = [
  {
    name: 'instagram',
    href: '#',
    label: 'Instagram',
    ariaLabel: 'Follow on Instagram',
  },
  {
    name: 'facebook',
    href: '#',
    label: 'Facebook',
    ariaLabel: 'Follow on Facebook',
  },
  {
    name: 'x',
    href: '#',
    label: 'Twitter / X',
    ariaLabel: 'Follow on X',
  },
]
