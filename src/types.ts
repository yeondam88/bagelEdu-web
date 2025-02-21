import type { ImageMetadata } from 'astro'
import type { CollectionEntry } from 'astro:content'

export interface Feature {
  icon: string
  title: LocalizedString
  description: LocalizedString
}

export interface Benefit {
  icon: string
  title: LocalizedString
  description: LocalizedString
}

export interface Package {
  icon: string
  title: LocalizedString
  description: LocalizedString
  price: LocalizedString
  duration: LocalizedString
  features: LocalizedString[]
}

export interface InfoSection {
  headline: LocalizedString
  text: LocalizedString
  ages?: LocalizedString
  duration?: LocalizedString
  schedule?: LocalizedString
  classSize?: LocalizedString
  program1?: LocalizedString
  program2?: LocalizedString
  program3?: LocalizedString
  program4?: LocalizedString
  features?: Feature[]
  benefits?: Benefit[]
}

export interface DescriptionSection {
  headline: LocalizedString
  text: LocalizedString
  portraitImage?: ImageMetadata
  squareImages?: ImageMetadata[]
}

export interface AdditionalSection {
  headline: LocalizedString
  text: LocalizedString
  features?: Feature[]
}

export interface PricingSection {
  headline: LocalizedString
  text: LocalizedString
  packages?: Package[]
}

export interface ProgramData {
  name: LocalizedString
  dropdownDescription: LocalizedString
  featured: boolean
  hero: {
    headline: LocalizedString
    text: LocalizedString
    image: ImageMetadata
    action: {
      label: LocalizedString
      href: string
      icon?: string
    }
  }
  descriptionSection?: DescriptionSection
  infoSection?: InfoSection
  AdditionalSection?: AdditionalSection
  pricingSection?: PricingSection
}

export type Program = CollectionEntry<'programs'>

export interface AdmissionGuide {
  id: string
  slug: string
  data: {
    name: string
    dropdownDescription: string
    featured: boolean
    hero: {
      headline: string
      text: string
      image: ImageMetadata
    }
  }
}

export interface Resource {
  id: string
  slug: string
  data: {
    name: string
    dropdownDescription: string
    featured: boolean
    hero: {
      headline: string
      text: string
      image: ImageMetadata
    }
  }
}

export type GalleryEntry = CollectionEntry<'gallery'>
export type StaffMember = CollectionEntry<'staff'>
export type Testimonial = CollectionEntry<'testimonials'>

export type LocalizedString = {
  en: string
  ko: string
}

export type Site = {
  website: string
  author: string
  description: LocalizedString
  title: string
  ogImage: string
}

export type Contact = {
  address: string
  phone: string
  email: string
}

export type SocialObjects = {
  name: SocialMedia
  href: string
  label: string
  ariaLabel: string
}[]

export type SocialMedia =
  | 'github'
  | 'dribbble'
  | 'facebook'
  | 'instagram'
  | 'linkedin'
  | 'mail'
  | 'twitter'
  | 'x'

type Logo = {
  src: string | ImageMetadata
  alt: string
  href: string
}
