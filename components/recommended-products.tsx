import { cacheLife, cacheTag } from 'next/cache'
import { connection } from 'next/server'
import { fetchProducts, fetchProductsStock } from '@/lib/api'
import { ProductCardServer } from '@/components/product-card-server'
import type { Product } from '@/types'

interface RecommendedProductsProps {
  category: string
  currentProductId: string
}

// Cached fetch for recommended products by category with featured fallback
async function getRecommendedProducts(
  category: string,
  excludeId: string
): Promise<{ products: Product[]; isFallback: boolean }> {
  'use cache'
  cacheLife('hours')
  cacheTag('products', `category-${category}`)

  try {
    // Try same-category first
    const data = await fetchProducts({ category, limit: 5 })
    let products = (data?.products ?? []).filter(p => p.id !== excludeId).slice(0, 4)

    // Fallback: if same-category is empty, show featured products
    if (products.length === 0) {
      const fallback = await fetchProducts({ featured: true, limit: 5 })
      products = (fallback?.products ?? []).filter(p => p.id !== excludeId).slice(0, 4)
      return { products, isFallback: true }
    }

    return { products, isFallback: false }
  } catch {
    return { products: [], isFallback: false }
  }
}

export async function RecommendedProducts({ category, currentProductId }: RecommendedProductsProps) {
  const { products, isFallback } = await getRecommendedProducts(category, currentProductId)

  if (products.length === 0) {
    return null
  }

  const headingText = isFallback ? 'You might also like' : `More from ${category}`

  // Signal dynamic rendering before stock fetch
  await connection()

  // Batch fetch stock for all recommended products
  const productIds = products.map(p => p.id)
  const stockMap = await fetchProductsStock(productIds)

  return (
    <div>
      <h2 className="mb-8 text-2xl font-bold tracking-tight">{headingText}</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-4">
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
              isPriority={index < 2}
            />
          )
        })}
      </div>
    </div>
  )
}
