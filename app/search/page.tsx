import { Suspense } from 'react'
import { fetchProducts, fetchCategories } from '@/lib/api'
import SearchBar from '@/components/search-bar'
import CategoryFilter from '@/components/category-filter'
import ProductCard from '@/components/product-card'
import type { Product } from '@/types'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Search',
  description: 'Search the Vercel Swag Store',
  openGraph: { title: 'Search | Vercel Swag Store' },
}

interface SearchPageProps {
  searchParams: Promise<{ q?: string; category?: string }>
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q, category } = await searchParams

  // Fetch categories (cached - static data)
  const categories = await fetchCategories()

  // Fetch products based on search state
  let products: Product[] = []
  let isSearching = false

  if (q && q.length >= 3) {
    // Server-side search with URL-persistent state - max 5 results
    isSearching = true
    const result = await fetchProducts({ search: q, category, limit: 5 })
    products = result.products ?? []
  } else if (!q) {
    // Default state: show all products (first page)
    const result = await fetchProducts({ category, limit: 20 })
    products = result.products ?? []
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-2 text-3xl font-bold tracking-tight text-white">
        Shop All Products
      </h1>
      <p className="mb-8 text-zinc-400">
        Browse and search our collection of Vercel merchandise
      </p>

      {/* Search Controls */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row">
        <div className="flex-1">
          <Suspense fallback={<SearchBarSkeleton />}>
            <SearchBar defaultValue={q} />
          </Suspense>
        </div>
        <Suspense fallback={<CategoryFilterSkeleton />}>
          <CategoryFilter categories={categories} defaultValue={category} />
        </Suspense>
      </div>

      {/* Search Results Info */}
      {isSearching && (
        <p className="mb-4 text-sm text-zinc-400">
          {products.length} result{products.length !== 1 ? 's' : ''} for "{q}"
          {category ? ` in ${categories.find(c => c.slug === category)?.name ?? category}` : ''}
        </p>
      )}

      {/* Empty State */}
      {products.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/50 py-20">
          <p className="text-2xl font-semibold text-zinc-300">No products found</p>
          <p className="mt-2 text-zinc-500">
            {isSearching
              ? 'Try a different search term or category'
              : 'No products available in this category'}
          </p>
        </div>
      )}

      {/* Product Grid */}
      {products.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  )
}

function SearchBarSkeleton() {
  return (
    <div className="flex items-center gap-2">
      <div className="h-11 flex-1 animate-pulse rounded-lg bg-zinc-800" />
      <div className="h-11 w-24 animate-pulse rounded-lg bg-zinc-800" />
    </div>
  )
}

function CategoryFilterSkeleton() {
  return (
    <div className="h-11 w-full animate-pulse rounded-lg bg-zinc-800 sm:w-[200px]" />
  )
}
