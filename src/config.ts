import type { Site, Contact, SocialObjects } from './types'

export const SITE: Site = {
  website: 'https://bright-astro.tailwindawesome.com', // replace this with your deployed domain
  author: 'Rodrigo Aguilar',
  description:
    'At Bright School, we believe every child deserves a brighter future. and strive to give every student a personalized education that will promote their individual strengths and creativity.',
  title: 'Bright School',
  ogImage: 'bright-og.png',
}

export const CONTACT: Contact = {
  address: '958 McKinley Avenue Littleton, CO 80120',
  phone: '+1-202-555-0132',
  email: 'hello@bright.com',
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
