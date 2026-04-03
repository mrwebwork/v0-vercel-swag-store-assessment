import { cacheLife, cacheTag } from 'next/cache'
import { connection } from 'next/server'
import Link from 'next/link'
import { fetchProducts, fetchProductsSearch, fetchProductsStock } from '@/lib/api'
import { ProductCardServer } from '@/components/product-card-server'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Product, Stock, Category } from '@/types'

const MAX_ITEMS_PER_PAGE = 100
const DEFAULT_ITEMS_PER_PAGE = 12

interface SearchResultsProps {
  q?: string
  category?: string
  page?: string
  featured?: string
  categories: Category[]
}

// Cached browse products function
async function getBrowseProducts(
  category?: string,
  page: number = 1,
  limit: number = DEFAULT_ITEMS_PER_PAGE,
  featured?: boolean
) {
  'use cache'
  cacheLife('hours')
  cacheTag('products', ...(category ? [`category-${category}`] : []), ...(featured ? ['featured'] : []))

  try {
    const result = await fetchProducts({
      category,
      page,
      limit,
      featured: featured || undefined,
    })
    return {
      products: result?.products ?? [],
      total: result?.total ?? 0,
      totalPages: result?.totalPages ?? 1,
    }
  } catch {
    return { products: [], total: 0, totalPages: 1 }
  }
}

export async function SearchResults({ q, category, page, featured, categories }: SearchResultsProps) {
  const currentPage = Math.max(1, parseInt(page ?? '1', 10) || 1)
  const limit = Math.min(DEFAULT_ITEMS_PER_PAGE, MAX_ITEMS_PER_PAGE)
  const isFeatured = featured === 'true'
  const isSearching = q && q.length >= 3

  // Fetch products (search is dynamic via fetchProductsSearch, browse is cached)
  const productResult = isSearching
    ? await fetchProductsSearch({
        search: q,
        category,
        page: currentPage,
        limit,
      })
        .then(result => ({
          products: result?.products ?? [],
          total: result?.total ?? 0,
          totalPages: result?.totalPages ?? 1,
        }))
        .catch(() => ({ products: [] as Product[], total: 0, totalPages: 1 }))
    : q
      ? { products: [] as Product[], total: 0, totalPages: 1 }
      : await getBrowseProducts(category, currentPage, limit, isFeatured || undefined)

  const products = productResult.products
  const totalProducts = productResult.total
  const totalPages = productResult.totalPages

  // Signal dynamic rendering before fetching stock (uses new Date() in logger)
  await connection()

  // Batch stock fetch server-side
  const productIds = products.map(p => p.id)
  const stockMap: Map<string, Stock> = productIds.length > 0
    ? await fetchProductsStock(productIds)
    : new Map()

  // Build pagination URL helper
  function buildPageUrl(pageNum: number) {
    const params = new URLSearchParams()
    if (q) params.set('q', q)
    if (category) params.set('category', category)
    if (isFeatured) params.set('featured', 'true')
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
    <>
      {/* Search Results Info */}
      {(!!isSearching || totalProducts > 0) && (
        <p className="mb-4 text-sm text-zinc-400">
          {isSearching ? (
            <>
              {totalProducts} result{totalProducts !== 1 ? 's' : ''} for &ldquo;{q}&rdquo;
              {isFeatured ? ' in featured products' : ''}
              {category ? ` in ${categories.find(c => c.slug === category)?.name ?? category}` : ''}
            </>
          ) : (
            <>
              Showing {products.length} of {totalProducts}
              {isFeatured ? ' featured' : ''} products
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

      {/* Product Grid */}
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
    </>
  )
}
