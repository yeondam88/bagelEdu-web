import { z, defineCollection } from 'astro:content'

const programsCollection = defineCollection({
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      dropdownDescription: z.string(),
      featured: z.boolean(),
      image: image(),
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
        image2: z.object({
          src: image(),
          alt: z.string(),
        })
      }),
      infoSection: z.object({
        headline: z.string(),
        text: z.string().optional(),
        ages: z.string().optional(),
        duration: z.string().optional(),
        schedule: z.string().optional(),
        classSize: z.string().optional(),
        program1: z.string().optional(),
        program2: z.string().optional(),
        program3: z.string().optional(),
        program4: z.string().optional(),
        features: z.array(z.object({
          icon: z.string().optional(),
          title: z.string(),
          description: z.string(),
        })).optional(),
        benefits: z.array(z.object({
          icon: z.string().optional(),
          title: z.string(),
          description: z.string(),
        })).optional(),
      }),
      AdditionalSection: z.object({
        headline1: z.string(),
        text1: z.string(),
        headline2: z.string(),
        text2: z.string(),
      }),
      pricingSection: z.object({
        headline: z.string(),
        text: z.string(),
        packages: z.array(z.object({
          title: z.string(),
          description: z.string(),
          price: z.string(),
          duration: z.string(),
        })),
      }),
      stemPrograms: z.object({
        title: z.string(),
        programs: z.array(z.object({
          name: z.string(),
          duration: z.string(),
          description: z.string(),
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
      name: z.string(),
      testimonial: z.string(),
      stars: z.number().min(1).max(5),
      image: image(),
    }),
})

const faqsCollection = defineCollection({
  schema: () =>
    z.object({
      question: z.string()
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
  schema: ({ image }) => z.object({
    title: z.string(),
    date: z.string(),
    author: z.string(),
    image: z.object({
      url: z.string(),
      alt: z.string()
    }),
    excerpt: z.string(),
    category: z.string().optional(),
    authorImage: z.string(),
    tags: z.array(z.string()).optional(),
  }),
});

const admissionGuideCollection = defineCollection({
  schema: ({ image }) => z.object({
    name: z.string(),
    dropdownDescription: z.string(),
    image: image(),
    fullHeight: z.boolean().optional(),
  }),
});

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
