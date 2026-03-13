import type { Product } from '@/types'
import ProductCard from '@/components/product-card'

type ProductGridProps = {
  products: Product[]
  /** Number of cards to mark as high-priority for LCP. Default: 3 */
  priorityCount?: number
}

export default function ProductGrid({ products, priorityCount = 3 }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} isPriority={index < priorityCount} />
      ))}
    </div>
  )
}
