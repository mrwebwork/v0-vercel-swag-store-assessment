// Re-export the OpenGraph image generator for Twitter cards
// Next.js App Router convention: twitter-image.tsx generates <meta name="twitter:image">
// This ensures Twitter/X uses the same branded image as other social platforms
export { default, alt, size, contentType } from './opengraph-image'
export { runtime } from './opengraph-image'
