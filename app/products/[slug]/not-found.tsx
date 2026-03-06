import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Product Not Found',
  description: 'The product you are looking for does not exist.',
}

export default function ProductNotFound() {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white">Product Not Found</h1>
        <p className="mt-2 text-zinc-400">
          Sorry, we couldn't find the product you're looking for.
        </p>
        <Link
          href="/search"
          className="mt-8 inline-block rounded-lg bg-white px-6 py-3 text-sm font-medium text-black transition-colors hover:bg-zinc-200"
        >
          Browse all products
        </Link>
      </div>
    </main>
  )
}
