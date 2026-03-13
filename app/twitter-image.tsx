// Next.js App Router convention: twitter-image.tsx generates <meta name="twitter:image">
// This ensures Twitter(X) uses the same branded image as other social platforms
// Note: runtime must be declared directly, not re-exported (Turbopack requirement)
export { default, alt, size, contentType } from './opengraph-image'
export const runtime = 'edge'
