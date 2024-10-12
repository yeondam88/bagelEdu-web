# Bright - Astro

This is a modern early education site template built using [Tailwind CSS](https://tailwindcss.com), [Astro](https://astro.build/), and [Typescript](https://www.typescriptlang.org/).

This template is built with **Astro v4.15** and **Tailwind CSS v3.4**, leveraging the latest [View Transitions](https://docs.astro.build/en/guides/view-transitions/) and Image Optimizations. It incorporates many of Astro's native features, including [Content Collections](https://docs.astro.build/en/guides/content-collections/) and [MDX](https://mdxjs.com/) support for school program content. Additionally, the template uses [Alpine.js](https://alpinejs.dev/) for a dynamic and interactive user experience.

## Getting Started

First, install the dependencies. Navigate to the project directory in your terminal and run:

```bash
npm install
# or
yarn install  # if you use yarn
pnpm install # if you use pnpm
```

This will install all required dependencies and place them in a folder called `node_modules` in the root directory.

Once the dependencies are installed, you can run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm run dev
```

If all goes well, Astro should now be serving the template on [http://localhost:4321](http://localhost:4321)!

## Project Structure

```text
/
└── 📁public              # Contains favicon & OG image
└── 📁src                 # Core source files
    └── 📁components      # Reusable UI components
    └── 📁content         # Content (data) collections
        └── 📁events      # School events (yml files)
        └── 📁faqs        # Frequently asked questions (yml files)
        └── 📁gallery     # Gallery images data (yml files)
        └── 📁newsletters # Newsletters data (yml files)
        └── 📁programs    # School programs (mdx files)
        └── 📁staff       # School staff info (yml files)
        └── 📁testimon... # Testimonials (yml files)
        └── config.ts     # Collection schemas
    └── 📁icons           # SVG icons
    └── 📁images          # Images used across the project
    └── 📁layouts         # Site layouts
    └── 📁pages           # Our website pages
    └── 📁styles          # Contains tailwind.css for Tailwind CSS
    └── 📁utils           # Utility and helper functions
    └── config.ts         # Defines general site and reusable data
    └── types.ts          # TypeScript types for our data/content
└── astro.config.mjs      # Main Astro configuration file
└── prettier.config.cjs   # Prettier code formatting configuration
└── tailwind.config.cjs   # Tailwind CSS configuration
└── tsconfig.json         # TypeScript configuration
```

## Tailwind CSS

This theme uses the latest version of Tailwind CSS: v3.4.

Tailwind CSS and its dependencies were installed using [Astro's official Tailwind integration](https://docs.astro.build/en/guides/integrations-guide/tailwind/). If you are not familiar with the Tailwind CSS framework, I would recommend checking out the [Tailwind documentation](https://tailwindcss.com/docs).

You can find the `tailwind.config.js` file at the root of the directory.

You'll find the primary CSS file at `src/styles/tailwind.css`, which includes the `@tailwind` directives. The stylsheet also includes a handful of custom typography classes for headings which use Tailwind’s @apply directive to extract repeated patterns.

We have made an effort to streamline our CSS by primarily using Tailwind's utility classes, supplementing with just a few custom classes that are defined within the `tailwind.config.js` file. Our project includes a unique color palette and a custom typography theme, designed for both light and dark prose content. Furthermore, we have integrated three official Tailwind plugins: `@tailwindcss/forms`, `@tailwindcss/aspect-ratio`, and `@tailwindcss/typography`.

## Content

The template includes various types of organized content such as events, FAQs, gallery images, newsletters, programs, staff members, and testimonials. All the content is neatly organized within the `src/content` folder, divided into respective collection directories. Programs are stored and managed using MDX in order to leverage rich text for program descriptions. The rest of the site content is structured using YAML for simplicity.

Bright uses Astro's built-in [content collections](https://docs.astro.build/en/guides/content-collections/) to manage and author the site's content efficiently. Content collections offer a streamlined approach to organizing documents, validating frontmatter, and providing automatic TypeScript type-safety, making them an incredibly powerful tool for content management.

To maintain content integrity and ensure that each entry adheres to a consistent format, we define strict content schemas in `src/content/config.ts`. These schemas, built with Zod through Astro's content APIs, ensure consistent data structures and relationships across the site. They provide robust frontmatter validation and automatic TypeScript typings, enhancing both the developer experience and the site's integrity.

To add additional content to your site, such as a school program, staff member, or testimonial you simply need to create a new file in the corresponding folder within `src/content`, and adhere to the specific data format and structure for each type of content:

### Collections Breakdown

- **Programs Collection:** Manages individual school programs. Each program entry data structure is divided into metadata and the various page sections that make up the program page, such as the hero section, pricing section and info section. The content is stored in mdx files in order to support more advanced rich text for the program descriptions.
- **Staff Collection:** Contains detailed profiles of authors, including their names, avatars, roles, and social links. This data is displayed in the about page within the `src/components/about/Staff.astro` component, and in the home page in the `src/components/home/StaffAssurances.astro` component where staff members with the `featured` flag set to `true` are displayed.
- **Testimonials Collection:** Stores all parent testimonials. Each testimonial is defined with a name,testimonial text field, an image, and a rating between 1 and 5. All testimonials are displayed on the home page in the `src/components/home/Testimonials.astro` component.
- **FAQs Collection:** A collection of the most commonly asked questions and their answers. All of the FAQs are displayed on the home page in the `src/components/home/Faqs.astro` component.
- **Events Collection:** A collection of upcoming school events with the following fields: name, description, date, and image. All of the events are displayed in the `parents` page in the `src/components/parents/Events.astro` component.
- **Newsletters Collection:** Contains information for all of the past school newsletter issues including their names, descriptions, and urls. The links and info for the most recent newsletters are displayed on the `parents` page in the `src/components/parents/Newsletters.astro` component.
- **Gallery Collection:** Finally, the gallery collection is a list of `yml` files each containing an image and category field that's used in the gallery page to filter images by their category.

These collections are queried and utilized throughout the site with Astro's built-in content APIs. Whether it's rendering testimonials on the home page, showcasing staff members, or categorizing gallery images, these collections make it easy to access and display content as needed.

## Site Layout and Content Settings

Bright's `src/config.ts` file plays a crucial role in defining the global configuration of the site. One of its key features is the management of default SEO metadata using a global `SITE` variable.

### SEO and Sitemap Configuration

- **SEO Meta Tags:** Ensure to personalize the default SEO meta tags in the `SITE` variable, including the site title, description, and author.

- **Open Graph (OG) Image:** Update the `ogImage` property in the `SITE` variable with a custom image stored in the `/public` directory that effectively represents your site.

- **Production Website URL:** The website property in the `SITE` configuration, used for sitemap generation, should be updated with your actual production domain. This update is vital for ensuring accurate sitemap generation and search engine optimization.

```typescript
export const SITE: Site = {
  website: 'https://bright-astro.vercel.app',
  ogImage: 'bright-og.jpg',
  // ... other site properties
}
```

### Contact Info

The `CONTACT` object is prepopulated with a mock address, phone number and email. This data is used throughout the site in the header, footer and contact page. Make sure to update this information before you deploy your site.

```typescript
export const CONTACT: Contact = {
  address: '958 McKinley Avenue Littleton, CO 80120',
  phone: '+1-202-555-0132',
  email: 'hello@bright.com',
}
```

### Social Media Configuration

The `SOCIALS` array in the `src/config.ts` file is pre-populated with a set of social media platforms and mock URLs. This array is designed to be easily editable, allowing you to replace the placeholder data with your actual social media information.

```typescript
export const SOCIALS: SocialObjects = [
  // ... predefined social media data
]
```

The `SocialMedia` type, defined in `src/types.ts`, lists the supported social media platforms. If you wish to add a new social platform, you'll need to update the `SocialMedia` type and ensure that a corresponding icon for the new platform is added to the `src/icons` directory. The icon's file name should match the name used in the `SocialMedia` type for consistency.

```typescript
export type SocialMedia = 'github' | 'dribbble' | 'facebook'
// ... other social platforms
```

This global configuration system in `src/config.ts` offers a flexible yet structured way to manage global and reusable data on your school website, allowing for easy customization and updates.

## Typescript

Bright comes with full Typescript support, offering robust typing and advanced language features. Astro's built-in [support for TypeScript](https://docs.astro.build/en/guides/typescript/) allows for writing Typescript directly in Astro components, with benefits such as error prevention at runtime and enhanced code understanding through type definition of components and props.

### Typescript configuration

You can find the Typescript configuration at the root of the project: `tsconfig.json`. Our setup follows Astro's guidelines for TypeScript integration, using one of Astro's extendable `tsconfig.json` templates. We've chosen the 'strict' template for its balance between strictness and flexibility, and because it is the template recommended by Astro.

In the `tsconfig.json`, we also establish module path aliases, creating shortcuts for imports related to components, images, utility functions, and data, all pointing directly to the `/src` directory. This enables us to use succinct import statements like `import Staff from @components/about/Staff.astro`, streamlining file referencing and enhancing project readability.

### Types Definition

In `src/types.ts`, we define global data types for the site, facilitating consistency and ease of use across various components and modules. This ensures that the data structures used throughout the site are uniform, making the code more maintainable and reducing potential for errors.

### Enhanced Content Collections

TypeScript truly shines when combined with Astro's content collections, providing a robust and seamless experience in content management. By defining structured content schemas in `src/content/config.ts`, we establish uniform data structures for the site's content collections. These schemas ensure consistent frontmatter and data relationships, contributing to the overall integrity and predictability of the content.

Astro automatically generates TypeScript interfaces for our content. This means we have full support for content queries, including autocompletion and type-checking. This provides a more efficient, error-resistant development process, ensuring that all content adheres to the established schemas.

## Automatic Sitemap Generation

The template simplifies the creation of a sitemap, aiding search engines like Google in more efficiently crawling your site. We use `@astrojs/sitemap`, Astro's official integration, to automatically generate a sitemap during your project build, outlining all pages of your site.

The sitemap generation is configured in the `astro.config.mjs` file. Here, you need to specify the deployment/site URL using the site property. Our template uses the `SITE.website` variable defined in the `src/config.ts` global configuration file for this purpose. Remember to update the website property in `src/config.ts` with your actual production website URL when deploying your site.

```javascript
// src/config.ts
export const SITE: Site = {
  website: 'https://bright-astro.vercel.app', // replace this with your deployed domain
  // ... other site properties
}
```

## Font

This template uses the following Google fonts:

- [Roboto Flex](https://fonts.google.com/specimen/Roboto+Flex)
- [Gochi Hand](https://fonts.google.com/specimen/Gochi+Hand)

Bright uses [Fontsource](https://docs.astro.build/en/guides/fonts/#using-fontsource) to install and use the fonts.

## Icons

The icons used for this theme are part of the [Tabler Icons](https://github.com/tabler/tabler-icons) set that is free to use and published under the [MIT License](https://github.com/tailwindlabs/heroicons/blob/master/LICENSE).

This template uses [astro-icon](https://github.com/natemoo-re/astro-icon#readme) in order to make using these icons easier. It defines a straightforward Icon component for Astro that allows you to use custom SVG icons (sourced from the `src/icons` directory) or icons from common icon packs, powered by [Iconify](https://iconify.design/).

## Images

All of the images used in the template are free to use and are either from [Unsplash](https://unsplash.com/), [Pexels](https://www.pexels.com/), or custom-made.

## Deployment

The easiest way to deploy your Astro site is either with [Vercel](https://vercel.com/) or [Netlify](https://www.netlify.com/). To learn more you can read Astro's official docs on [deploying with Vercel](https://docs.astro.build/en/guides/deploy/vercel/) or [deploying with Netlify](https://docs.astro.build/en/guides/deploy/netlify/)

## License

This site template is a commercial product and is licensed under the [Tailwind Awesome license](https://www.tailwindawesome.com/license).

## Learn More

To learn more about Astro, take a look at the following resources you can check their [official documentation](https://docs.astro.build) or jump into their [Discord server](https://astro.build/chat).

## Additional Help

If you need additional help setting up the template or have any questions, feel free to contact me at <rodrigo@tailwindawesome.com>.
