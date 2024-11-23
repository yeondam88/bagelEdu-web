import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'
import alpinejs from '@astrojs/alpinejs'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import icon from 'astro-icon'
import { SITE } from './src/config'
import vercel from '@astrojs/vercel/static';

// https://astro.build/config
export default defineConfig({
  site: SITE.website,
  trailingSlash: 'never',
  integrations: [tailwind(), alpinejs(), mdx(), sitemap(), icon()],
  output: 'static',
  adapter: vercel(),
})
