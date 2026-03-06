import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Page Not Found',
  description: 'The page you are looking for does not exist.',
}

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16">
      {/* Vercel-style 404 */}
      <div className="flex items-center gap-4">
        <span className="text-2xl font-semibold text-white">404</span>
        <span className="h-12 w-px bg-zinc-700" aria-hidden="true" />
        <span className="text-zinc-400">This page could not be found.</span>
      </div>
      
      <Link
        href="/"
        className="mt-8 rounded-lg bg-white px-6 py-3 text-sm font-medium text-black transition-colors hover:bg-zinc-200"
      >
        Go back home
      </Link>
    </div>
  )
}
