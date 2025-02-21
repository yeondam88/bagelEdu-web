import { defineCollection, z } from 'astro:content'
import type { LocalizedString } from '../types'

const LocalizedStringSchema = z.object({
  en: z.string(),
  ko: z.string(),
})

const programsCollection = defineCollection({
  schema: ({ image }) =>
    z.object({
      name: LocalizedStringSchema,
      dropdownDescription: LocalizedStringSchema,
      featured: z.boolean(),
      image: image(),
      hero: z.object({
        tagline: z.string(),
        headline: LocalizedStringSchema,
        text: LocalizedStringSchema,
        action: z.object({
          label: LocalizedStringSchema,
          href: z.string(),
          icon: z.boolean(),
        }),
        image: z.object({
          src: image(),
          alt: z.string(),
        }),
        image2: z.object({
          src: image(),
          alt: z.string(),
        })
      }),
      infoSection: z.object({
        headline: LocalizedStringSchema.optional(),
        text: LocalizedStringSchema.optional(),
        ages: LocalizedStringSchema.optional(),
        duration: LocalizedStringSchema.optional(),
        schedule: LocalizedStringSchema.optional(),
        classSize: LocalizedStringSchema.optional(),
        program1: LocalizedStringSchema.optional(),
        program2: LocalizedStringSchema.optional(),
        program3: LocalizedStringSchema.optional(),
        program4: LocalizedStringSchema.optional(),
        features: z.array(z.object({
          icon: z.string().optional(),
          title: LocalizedStringSchema,
          description: LocalizedStringSchema,
        })).optional(),
        benefits: z.array(z.object({
          icon: z.string().optional(),
          title: LocalizedStringSchema,
          description: LocalizedStringSchema,
        })).optional(),
      }),
      AdditionalSection: z.object({
        headline1: LocalizedStringSchema.optional(),
        text1: LocalizedStringSchema.optional(),
        headline2: LocalizedStringSchema.optional(),
        text2: LocalizedStringSchema.optional(),
      }),
      pricingSection: z.object({
        headline: LocalizedStringSchema,
        text: LocalizedStringSchema,
        packages: z.array(z.object({
          title: LocalizedStringSchema,
          description: LocalizedStringSchema,
          price: LocalizedStringSchema,
          duration: LocalizedStringSchema,
        })),
      }),
      stemPrograms: z.object({
        title: LocalizedStringSchema,
        programs: z.array(z.object({
          name: z.string(),
          duration: z.string(),
          description: LocalizedStringSchema,
        })),
      }).optional(),

    }),
})

const staffCollection = defineCollection({
  type: 'data',
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      role: z.string(),
      image: image(),
      featured: z.boolean().optional(),
      portraitImage: image().optional(),
      social: z.array(
        z.object({
          name: z.string(),
          href: z.string(),
        }),
      ),
    }),
})

const testimonialsCollection = defineCollection({
  type: 'data',
  schema: ({ image }) =>
    z.object({
      name: LocalizedStringSchema,
      testimonial: LocalizedStringSchema,
      stars: z.number().min(1).max(5),
      image: image(),
    }),
})

const faqsCollection = defineCollection({
  schema: () =>
    z.object({
      question: LocalizedStringSchema,
      answer: LocalizedStringSchema
    }),
})

const eventsCollection = defineCollection({
  type: 'data',
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      description: z.string(),
      dates: z.string(),
      image: z.object({
        src: image(),
        alt: z.string(),
      }),
    }),
})

const newslettersCollection = defineCollection({
  type: 'data',
  schema: () =>
    z.object({
      name: z.string(),
      description: z.string(),
      url: z.string().url(),
    }),
})

const galleryCollection = defineCollection({
  type: 'data',
  schema: ({ image }) =>
    z.object({
      image: z.object({
        src: image(),
        alt: z.string(),
      }),
      category: z.enum([
        'Arts and Crafts',
        'Classroom',
        'Playground',
        'School Events',
      ]),
    }),
})

const blogCollection = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    title: z.object({
      en: z.string(),
      ko: z.string(),
    }),
    date: z.string(),
    author: z.string(),
    image: z.object({
      src: image(),
      alt: z.string(),
    }),
    excerpt: z.object({
      en: z.string(),
      ko: z.string(),
    }),
    description: z.object({
      en: z.string(),
      ko: z.string(),
    }).optional(),
    category: z.string(),
    authorImage: z.string(),
    tags: z.array(z.string()).optional(),
  }),
})

const admissionGuideCollection = defineCollection({
  schema: ({ image }) => z.object({
    name: LocalizedStringSchema,
    dropdownDescription: LocalizedStringSchema,
    image: image(),
    fullHeight: z.boolean().optional(),
  }),
})

export const collections = {
  programs: programsCollection,
  staff: staffCollection,
  testimonials: testimonialsCollection,
  faqs: faqsCollection,
  events: eventsCollection,
  newsletters: newslettersCollection,
  gallery: galleryCollection,
  blog: blogCollection,
  admissionGuide: admissionGuideCollection,
}
