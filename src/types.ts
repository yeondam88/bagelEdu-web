import type { CollectionEntry } from 'astro:content'

interface InfoSection {
  headline: string;
  text?: string;
  ages?: string;
  duration?: string;
  schedule?: string;
  classSize?: string;
  program1?: string;
  program2?: string;
  program3?: string;
  program4?: string;
  features?: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
  benefits?: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
}

export interface Program {
  id: string;
  slug: string;
  data: {
    name: string;
    dropdownDescription?: string;
    featured?: boolean;
    hero: {
      headline: string;
      text: string;
      image: ImageMetadata;
      action: {
        label: string;
        href: string;
      };
    };
    infoSection: InfoSection;
  };
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
  src: string | ImageMetadata;
  alt: string;
  href: string;
}
