import { cacheLife, cacheTag } from 'next/cache'
import { connection } from 'next/server'
import { fetchProducts, fetchProductsStock } from '@/lib/api'
import type { Product } from '@/types'
import { ProductCardServer } from '@/components/product-card-server'

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

  // Signal dynamic rendering before accessing request-time APIs (new Date() in logger)
  await connection()
  
  // Batch fetch stock for all products (dynamic, not cached)
  const productIds = products.map(p => p.id)
  const stockMap = productIds.length > 0 ? await fetchProductsStock(productIds) : new Map()

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 lg:gap-8">
      {products.slice(0, 12).map((product, index) => {
        const stock = stockMap.get(product.id) ?? { productId: product.id, stock: 0, inStock: false, lowStock: false }
        return (
          <ProductCardServer
            key={product.id}
            product={product}
            stock={stock}
            isPriority={index < 3}
          />
        )
      })}
    </div>
  )
}
