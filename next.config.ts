import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    reactCompiler: true,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.vercel-storage.com' },
      { protocol: 'https', hostname: '**.public.blob.vercel-storage.com' },
    ],
  },
  // Note: Turbopack is default in Next.js 16 but webpack is used in sandbox
  // In production deployment on Vercel, Turbopack will work fine
}

export default nextConfig
