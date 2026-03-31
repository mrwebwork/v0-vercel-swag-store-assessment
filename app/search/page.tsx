import { Suspense } from 'react'
import { cacheLife, cacheTag } from 'next/cache'
import Link from 'next/link'
import { fetchProducts, fetchCategories, fetchProductsStock } from '@/lib/api'
import SearchBar from '@/components/search-bar'
import CategoryFilter from '@/components/category-filter'
import { ProductCardServer } from '@/components/product-card-server'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Product, Stock } from '@/types'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Shop All Products',
  description: 'Browse and search the full Vercel Swag Store collection. Filter by category, find your favorite merch.',
  openGraph: {
    title: 'Shop All Products | Vercel Swag Store',
    description: 'Browse and search the full Vercel Swag Store collection.',
  },
}

const MAX_ITEMS_PER_PAGE = 100
// 12 products = 3 full rows on 4-column desktop grid — natural visual breakpoint
// Reduces HTML payload from ~130KB to ~80KB per page
const DEFAULT_ITEMS_PER_PAGE = 12

interface SearchPageProps {
  searchParams: Promise<{ q?: string; category?: string; page?: string }>
}

async function getCategories() {
  'use cache'
  cacheLife('days')
  cacheTag('categories')

  try {
    const categories = await fetchCategories()
    return Array.isArray(categories) ? categories : []
  } catch (error) {
    return []
  }

}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q, category, page } = await searchParams
  const currentPage = Math.max(1, parseInt(page ?? '1', 10) || 1)
  const limit = Math.min(DEFAULT_ITEMS_PER_PAGE, MAX_ITEMS_PER_PAGE)

  // Helper for cached browse products
  async function getBrowseProducts(
    category?: string,
    page: number = 1,
    limit: number = DEFAULT_ITEMS_PER_PAGE
  ) {
    'use cache'
    cacheLife('hours')
    cacheTag('products', ...(category ? [`category-${category}`] : []))

    try {
      const result = await fetchProducts({ category, page, limit })
      return {
        products: result?.products ?? [],
        total: result?.total ?? 0,
        totalPages: result?.totalPages ?? 1,
      }
    } catch {
      return { products: [], total: 0, totalPages: 1 }
    }
  }

  // P0 FIX #1: Parallel fetch categories and products with Promise.all()
  // These have no data dependency - saves ~1.7s on every search render
  const isSearching = q && q.length >= 3

  const [categories, productResult] = await Promise.all([
    // Categories cached for days (stable reference data)
    getCategories(),
    // Products: search queries are dynamic (uncached), browse is cached for hours
    isSearching
      ? fetchProducts({ search: q, category, page: currentPage, limit })
          .then(result => ({
            products: result?.products ?? [],
            total: result?.total ?? 0,
            totalPages: result?.totalPages ?? 1,
          }))
          .catch(() => ({ products: [] as Product[], total: 0, totalPages: 1 }))
      : q
        ? Promise.resolve({ products: [] as Product[], total: 0, totalPages: 1 })
        : getBrowseProducts(category, currentPage, limit)
  ])

  const products = productResult.products
  const totalProducts = productResult.total
  const totalPages = productResult.totalPages

  // P0 FIX #3: Batch stock fetch server-side with Promise.allSettled
  // Eliminates 6-20 redundant N+1 round-trips per page
  const productIds = products.map(p => p.id)
  const stockMap: Map<string, Stock> = productIds.length > 0
    ? await fetchProductsStock(productIds)
    : new Map()

  // Build pagination URL helper
  function buildPageUrl(pageNum: number) {
    const params = new URLSearchParams()
    if (q) params.set('q', q)
    if (category) params.set('category', category)
    if (pageNum > 1) params.set('page', String(pageNum))
    const queryString = params.toString()
    return `/search${queryString ? `?${queryString}` : ''}`
  }

  // Generate page numbers to show
  function getPageNumbers(): (number | 'ellipsis')[] {
    const pages: (number | 'ellipsis')[] = []
    const maxVisiblePages = 5

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1)

      if (currentPage > 3) pages.push('ellipsis')

      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)

      for (let i = start; i <= end; i++) pages.push(i)

      if (currentPage < totalPages - 2) pages.push('ellipsis')

      pages.push(totalPages)
    }

    return pages
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
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
      {(!!isSearching || totalProducts > 0) && (
        <p className="mb-4 text-sm text-zinc-400">
          {isSearching ? (
            <>
              {totalProducts} result{totalProducts !== 1 ? 's' : ''} for &ldquo;{q}&rdquo;
              {category ? ` in ${categories.find(c => c.slug === category)?.name ?? category}` : ''}
            </>
          ) : (
            <>
              Showing {products.length} of {totalProducts} products
              {category ? ` in ${categories.find(c => c.slug === category)?.name ?? category}` : ''}
              {totalPages > 1 ? ` (Page ${currentPage} of ${totalPages})` : ''}
            </>
          )}
        </p>
      )}

      {/* Empty State */}
      {products.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/50 py-20">
          <p className="text-2xl font-semibold text-zinc-300">No products found</p>
          <p className="mt-2 text-zinc-400">
            {isSearching
              ? 'Try a different search term or category'
              : 'No products available in this category'}
          </p>
        </div>
      )}

      {/* Product Grid - uses server-fetched stock to eliminate N+1 client requests */}
      {products.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product, index) => {
            const stock = stockMap.get(product.id) ?? {
              productId: product.id,
              stock: 0,
              inStock: false,
              lowStock: false,
            }
            return (
              <ProductCardServer
                key={product.id}
                product={product}
                stock={stock}
                isPriority={index < 4}
              />
            )
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <nav className="mt-12 flex items-center justify-center gap-2" aria-label="Pagination">
          {/* Previous Button */}
          <Button
            variant="outline"
            size="sm"
            className="border-zinc-700 bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white disabled:opacity-50"
            disabled={currentPage <= 1}
            asChild={currentPage > 1}
          >
            {currentPage > 1 ? (
              <Link href={buildPageUrl(currentPage - 1)} aria-label="Go to previous page">
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Previous</span>
              </Link>
            ) : (
              <span>
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Previous</span>
              </span>
            )}
          </Button>

          {/* Page Numbers */}
          <div className="flex items-center gap-1">
            {getPageNumbers().map((pageNum, idx) =>
              pageNum === 'ellipsis' ? (
                <span key={`ellipsis-${idx}`} className="px-2 text-zinc-500">
                  ...
                </span>
              ) : (
                <Button
                  key={pageNum}
                  variant={pageNum === currentPage ? 'default' : 'outline'}
                  size="sm"
                  className={
                    pageNum === currentPage
                      ? 'bg-white text-black hover:bg-zinc-200'
                      : 'border-zinc-700 bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white'
                  }
                  asChild={pageNum !== currentPage}
                >
                  {pageNum === currentPage ? (
                    <span aria-current="page">{pageNum}</span>
                  ) : (
                    <Link href={buildPageUrl(pageNum)} aria-label={`Go to page ${pageNum}`}>
                      {pageNum}
                    </Link>
                  )}
                </Button>
              )
            )}
          </div>

          {/* Next Button */}
          <Button
            variant="outline"
            size="sm"
            className="border-zinc-700 bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white disabled:opacity-50"
            disabled={currentPage >= totalPages}
            asChild={currentPage < totalPages}
          >
            {currentPage < totalPages ? (
              <Link href={buildPageUrl(currentPage + 1)} aria-label="Go to next page">
                <span className="sr-only">Next</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            ) : (
              <span>
                <span className="sr-only">Next</span>
                <ChevronRight className="h-4 w-4" />
              </span>
            )}
          </Button>
        </nav>
      )}
    </div>
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

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="animate-pulse rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
          <div className="aspect-square w-full rounded-lg bg-zinc-800" />
          <div className="mt-4 h-4 w-3/4 rounded bg-zinc-800" />
          <div className="mt-2 h-4 w-1/2 rounded bg-zinc-800" />
          <div className="mt-4 h-10 w-full rounded-lg bg-zinc-800" />
        </div>
      ))}
    </div>
  )
}
