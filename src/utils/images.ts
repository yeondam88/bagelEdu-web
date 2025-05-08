/**
 * Helper function to check if an image source is a remote URL
 * 
 * @param src The image source (URL string or imported image)
 * @returns Boolean indicating if the source is a remote URL
 */
export function isRemoteImage(src: any): boolean {
  return typeof src === 'string' && (src.startsWith('http://') || src.startsWith('https://'));
}

/**
 * Gets the appropriate source value for an image, handling both remote URLs and local imports
 * 
 * @param src The image source (URL string or imported image)
 * @returns The properly formatted image source
 */
export function getImageSource(src: any): any {
  // If it's a remote URL, return it as is
  if (isRemoteImage(src)) {
    return src;
  }
  
  // For local imports, return the entire import object which contains metadata needed by Astro's Image component
  return src;
} 