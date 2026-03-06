import { cacheLife, cacheTag } from 'next/cache'
import { fetchProducts } from '@/lib/api'
import type { Product } from '@/types'
import ProductCard from '@/components/product-card'

export default async function FeaturedProducts() {
  'use cache'
  cacheLife('hours')
  cacheTag('products', 'featured-products')

  let products: Product[] = []
  
  try {
    const data = await fetchProducts({ featured: true, limit: 12 })
    products = data?.products ?? []
    // If featured filter returned no results, fall back to all products
    if (products.length === 0) {
      const fallback = await fetchProducts({ limit: 8 })
      products = fallback?.products ?? []
    }
  } catch {
    // Return empty state on error
  }

  if (!products || products.length === 0) {
    return (
      <div className="py-12 text-center text-neutral-400">
        No featured products available at the moment.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
      {products.slice(0, 12).map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
