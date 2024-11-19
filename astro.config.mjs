import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'
import alpinejs from '@astrojs/alpinejs'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import icon from 'astro-icon'
import { SITE } from './src/config'

// https://astro.build/config
export default defineConfig({
  site: SITE.website,
  trailingSlash: 'never',
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    alpinejs(),
    mdx(),
    sitemap(),
    icon(),
  ],
  vite: {
    build: {
      rollupOptions: {
        external: ['@images/bageledu/jenny-sohn.jpg'],
      },
    },
  },
})
