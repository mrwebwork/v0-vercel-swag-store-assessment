import { withAxiom } from 'next-axiom'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheComponents: true,
  allowedDevOrigins: ['*.vusercontent.net'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.vercel-storage.com' },
      { protocol: 'https', hostname: '*.public.blob.vercel-storage.com' },
    ],
  },
}

export default withAxiom(nextConfig)
