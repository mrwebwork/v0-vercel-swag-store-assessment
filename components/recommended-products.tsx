import { cacheLife, cacheTag } from 'next/cache'
import { connection } from 'next/server'
import { fetchProducts, fetchProductsStock } from '@/lib/api'
import { ProductCardServer } from '@/components/product-card-server'
import type { Product } from '@/types'

interface RecommendedProductsProps {
  category: string
  currentProductId: string
}

// Cached fetch for recommended products by category
async function getRecommendedProducts(category: string, excludeId: string): Promise<Product[]> {
  'use cache'
  cacheLife('hours')
  cacheTag('products', `category-${category}`)

  try {
    const data = await fetchProducts({ category, limit: 5 })
    const products = data?.products ?? []
    // Filter out the current product
    return products.filter(p => p.id !== excludeId).slice(0, 4)
  } catch {
    return []
  }
}

export async function RecommendedProducts({ category, currentProductId }: RecommendedProductsProps) {
  const products = await getRecommendedProducts(category, currentProductId)

  if (products.length === 0) {
    return null
  }

  // Signal dynamic rendering before stock fetch
  await connection()

  // Batch fetch stock for all recommended products
  const productIds = products.map(p => p.id)
  const stockMap = await fetchProductsStock(productIds)

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-4">
      {products.map((product, index) => {
        const stock = stockMap.get(product.id) ?? { 
          productId: product.id, 
          stock: 0, 
          inStock: false, 
          lowStock: false 
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
  )
}
