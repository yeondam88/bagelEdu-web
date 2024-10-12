import { z, defineCollection } from 'astro:content'

const programsCollection = defineCollection({
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      dropdownDescription: z.string(),
      featured: z.boolean(),
      hero: z.object({
        tagline: z.string(),
        headline: z.string(),
        text: z.string(),
        action: z.object({
          label: z.string(),
          href: z.string(),
          icon: z.boolean(),
        }),
        image: z.object({
          src: image(),
          alt: z.string(),
        }),
      }),
      infoSection: z.object({
        headline: z.string(),
        text: z.string(),
        ages: z.string(),
        duration: z.string(),
        schedule: z.string(),
        classSize: z.string(),
      }),
      descriptionSection: z.object({
        portraitImage: z.object({
          src: image(),
          alt: z.string(),
        }),
        squareImages: z.array(
          z.object({
            src: image(),
            alt: z.string(),
          }),
        ),
      }),
      pricingSection: z.object({
        tagline: z.string(),
        headline: z.string(),
        text: z.string(),
        pricingOptions: z.array(
          z.object({
            name: z.string(),
            price: z.string(),
            interval: z.string(),
            shortDescription: z.string(),
            features: z.array(z.string()),
            action: z.object({
              label: z.string(),
              href: z.string(),
              icon: z.boolean(),
            }),
          }),
        ),
      }),
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
      name: z.string(),
      testimonial: z.string(),
      stars: z.number().min(1).max(5),
      image: image(),
    }),
})

const faqsCollection = defineCollection({
  type: 'data',
  schema: () =>
    z.object({
      question: z.string(),
      answer: z.string(),
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

export const collections = {
  programs: programsCollection,
  staff: staffCollection,
  testimonials: testimonialsCollection,
  faqs: faqsCollection,
  events: eventsCollection,
  newsletters: newslettersCollection,
  gallery: galleryCollection,
}
