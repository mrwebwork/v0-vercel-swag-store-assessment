import { connection } from 'next/server'
import { fetchProductStock } from '@/lib/api'

interface StockIndicatorProps {
  productId: string
}

export async function StockIndicator({ productId }: StockIndicatorProps) {
  await connection()
  
  const stock = await fetchProductStock(productId)

  if (!stock.inStock) {
    return (
      <div className="inline-flex items-center gap-2 rounded-full bg-red-500/10 px-3 py-1.5 text-sm font-medium text-red-400">
        <span className="h-2 w-2 rounded-full bg-red-500" aria-hidden="true" />
        Out of Stock
      </div>
    )
  }

  if (stock.lowStock) {
    return (
      <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-3 py-1.5 text-sm font-medium text-amber-400">
        <span className="h-2 w-2 rounded-full bg-amber-500" aria-hidden="true" />
        Only {stock.stock} left!
      </div>
    )
  }

  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1.5 text-sm font-medium text-emerald-400">
      <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
      In Stock
    </div>
  )
}
