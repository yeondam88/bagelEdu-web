import type { Site, Contact, SocialObjects } from './types'

export const SITE: Site = {
  website: 'https://bright-astro.tailwindawesome.com', // replace this with your deployed domain
  author: 'Yeondam Park',
  description:
    'At Bright School, we believe every child deserves a brighter future. and strive to give every student a personalized education that will promote their individual strengths and creativity.',
  title: 'BagelEdu',
  ogImage: 'bright-og.png',
}

export const CONTACT: Contact = {
  address: '36, Banpo-daero 18-gil, Seocho-gu, Seoul',
  phone: '(US)+1-818-732-0180 / (KR)+8210-3360-6558',
  email: 'bageledu@gmail.com',
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
