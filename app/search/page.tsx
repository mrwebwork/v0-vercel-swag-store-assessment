import { Suspense } from 'react'
import { cacheLife, cacheTag } from 'next/cache'
import Link from 'next/link'
import { fetchCategories } from '@/lib/api'
import SearchBar from '@/components/search-bar'
import CategoryFilter from '@/components/category-filter'
import { SearchResults } from '@/components/search-results'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Shop All Products',
  description: 'Browse and search the full Vercel Swag Store collection. Filter by category, find your favorite merch.',
  openGraph: {
    title: 'Shop All Products | Vercel Swag Store',
    description: 'Browse and search the full Vercel Swag Store collection.',
  },
}

interface SearchPageProps {
  searchParams: Promise<{ q?: string; category?: string; page?: string; featured?: string }>
}

// Categories cached at 'days' - resolves near-instantly for the static shell
async function getCategories() {
  'use cache'
  cacheLife('days')
  cacheTag('categories')

  try {
    const categories = await fetchCategories()
    return Array.isArray(categories) ? categories : []
  } catch {
    return []
  }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q, category, page, featured } = await searchParams
  const isFeatured = featured === 'true'

  // Categories are cached for days - fetch immediately for the static shell
  const categories = await getCategories()

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Static Shell - renders instantly */}
      <h1 className="mb-2 text-3xl font-bold tracking-tight text-white">
        {isFeatured ? 'Featured Products' : 'Shop All Products'}
      </h1>
      <p className="mb-8 text-zinc-400">
        {isFeatured
          ? 'Hand-picked favorites from our collection'
          : 'Browse and search our collection of Vercel merchandise'}
      </p>

      {/* Search Controls - part of static shell */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex-1">
          <SearchBar defaultValue={q} />
        </div>
        <div className="flex items-center gap-3">
          <CategoryFilter categories={categories} defaultValue={category} />
          {isFeatured && (
            <Link
              href="/search"
              className="shrink-0 rounded-lg border border-zinc-700 px-3 py-2 text-sm text-zinc-400 transition-colors hover:border-zinc-500 hover:text-white"
            >
              Clear featured filter
            </Link>
          )}
        </div>
      </div>

      {/* Product Grid - streams in via Suspense */}
      <Suspense fallback={<SearchResultsSkeleton />}>
        <SearchResults
          q={q}
          category={category}
          page={page}
          featured={featured}
          categories={categories}
        />
      </Suspense>
    </div>
  )
}

function SearchResultsSkeleton() {
  return (
    <>
      {/* Results info skeleton */}
      <div className="mb-4 h-5 w-48 animate-pulse rounded bg-zinc-800" />
      
      {/* Product grid skeleton */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50"
          >
            <div className="aspect-square animate-pulse bg-zinc-800" />
            <div className="p-4">
              <div className="mb-2 h-4 w-16 animate-pulse rounded-full bg-zinc-800" />
              <div className="mb-2 h-5 w-full animate-pulse rounded bg-zinc-800" />
              <div className="h-6 w-20 animate-pulse rounded bg-zinc-800" />
            </div>
            <div className="px-4 pb-4">
              <div className="h-9 w-full animate-pulse rounded-md bg-zinc-800" />
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
