import { cacheLife, cacheTag } from 'next/cache'
import { fetchProducts } from '@/lib/api'
import type { Product } from '@/types'
import ProductGrid from '@/components/product-grid'

// Cached data fetching function
// Log metadata is passed through fetchProducts to the instrumented fetch
async function getFeaturedProducts(): Promise<Product[]> {
  'use cache'
  cacheLife('hours')
  cacheTag('products', 'featured-products')

  try {
    const data = await fetchProducts({ featured: true, limit: 12 })
    let products = data?.products ?? []

    //* Guardrail ensuring API returns only featured products
    products = products.filter(p => p.featured === true)

    // If featured filter returned no results, fall back to all products
    if (products.length === 0) {
      const fallback = await fetchProducts({ limit: 6 })
      products = fallback?.products ?? []
    }
    return products
  } catch {
    return []
  }
}

// Server component that renders the grid (not cached itself)
export default async function FeaturedProducts() {
  const products = await getFeaturedProducts()

  if (!products || products.length === 0) {
    return (
        <div className="py-12 text-center text-neutral-400">
        No featured products available at the moment.
        </div>
    )
  }

  return <ProductGrid products={products.slice(0, 12)} />
}
