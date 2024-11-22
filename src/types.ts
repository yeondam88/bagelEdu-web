import type { CollectionEntry } from 'astro:content'

export type Program = CollectionEntry<'programs'>
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
  src: string | ImageMetadata;
  alt: string;
  href: string;
}
