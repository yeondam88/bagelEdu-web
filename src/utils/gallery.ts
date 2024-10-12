import { getCollection } from 'astro:content'
import type { GalleryEntry } from '@types'

export async function getGalleryCategories() {
  const gallery: GalleryEntry[] = await getCollection('gallery')
  // get unique categories (filter out repeated categories)
  const categories = [
    ...new Set(gallery.map((item) => item.data.category)),
  ].map((category) => {
    return {
      name: category,
      slug: category.toLowerCase().replace(' ', '-'),
    }
  })
  return categories
}
