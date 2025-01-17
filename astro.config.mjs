import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'
import alpinejs from '@astrojs/alpinejs'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import icon from 'astro-icon'
import { SITE } from './src/config'
import vercel from '@astrojs/vercel/serverless'
import react from '@astrojs/react'
import path from 'path'

// https://astro.build/config
export default defineConfig({
  site: SITE.website,
  trailingSlash: 'never',
  integrations: [tailwind(), alpinejs(), mdx(), sitemap(), icon(), react()],
  output: 'server',
  adapter: vercel(),
  vite: {
    resolve: {
      alias: {
        '@images': path.resolve('./src/images'),
        '@components': path.resolve('./src/components'),
        '@layouts': path.resolve('./src/layouts'),
        '@config': path.resolve('./src/config.ts'),
      },
    },
  },
})
