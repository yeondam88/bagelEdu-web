import type { ImageMetadata } from 'astro'
import type { CollectionEntry } from 'astro:content'

export interface Feature {
  icon: string
  title: string
  description: string
}

export interface Benefit {
  icon: string
  title: string
  description: string
}

export interface Package {
  icon: string
  title: string
  description: string
  price: string
  duration: string
  features: string[]
}

export interface InfoSection {
  headline: string
  text: string
  ages?: string
  duration?: string
  schedule?: string
  classSize?: string
  program1?: string
  program2?: string
  program3?: string
  program4?: string
  features?: Feature[]
  benefits?: Benefit[]
}

export interface DescriptionSection {
  headline: string
  text: string
  portraitImage?: ImageMetadata
  squareImages?: ImageMetadata[]
}

export interface AdditionalSection {
  headline: string
  text: string
  features?: Feature[]
}

export interface PricingSection {
  headline: string
  text: string
  packages?: Package[]
}

export interface ProgramData {
  name: string
  dropdownDescription: string
  featured: boolean
  hero: {
    headline: string
    text: string
    image: ImageMetadata
    action: {
      label: string
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

export type Site = {
  website: string
  author: string
  description: string
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
