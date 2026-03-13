'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import type { Product, Stock } from '@/types'
import { formatPrice, getFirstImage } from '@/lib/utils'
import { useCart } from '@/context/cart-context'
import { getStockAction } from '@/lib/cart-actions'
import { AddToCartButton } from '@/components/add-to-cart-button'
import { Skeleton } from '@/components/ui/skeleton'

type ProductCardProps = {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()
  const [stock, setStock] = useState<Stock | null>(null)
  const [loadingStock, setLoadingStock] = useState(true)

  useEffect(() => {
    async function loadStock() {
      try {
        const stockData = await getStockAction(product.id)
        setStock(stockData)
      } catch (error) {
        console.error('Failed to load stock:', error)
        // Default to out of stock on error for safety
        setStock({ productId: product.id, stock: 0, inStock: false, lowStock: false })
      } finally {
        setLoadingStock(false)
      }
    }
    loadStock()
  }, [product.id])

  async function handleAddToCart() {
    await addItem(product.id, 1)
  }

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50 transition-all duration-300 hover:border-zinc-700 hover:shadow-lg hover:shadow-black/20">
      <Link
        href={`/products/${product.slug}`}
        className="block"
        aria-label={`View ${product.name}`}
      >
        <div className="relative aspect-square overflow-hidden bg-zinc-800">
          <Image
            src={getFirstImage(product.images)}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {product.featured && (
            <div className="absolute left-3 top-3 rounded-full bg-blue-500 px-2.5 py-1 text-xs font-medium text-white">
              Featured
            </div>
          )}
          {/* Out of stock overlay badge */}
          {!loadingStock && stock && !stock.inStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60">
              <span className="rounded-md bg-zinc-800 px-3 py-1.5 text-sm font-medium text-zinc-300">
                Out of Stock
              </span>
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col p-4">
          <span className="mb-1.5 inline-block self-start rounded-full bg-zinc-800 px-2.5 py-0.5 text-xs font-medium capitalize text-zinc-400">
            {product.category}
          </span>
          <h3 className="mb-2 line-clamp-2 min-h-[2.5rem] text-sm font-medium text-white transition-colors group-hover:text-blue-400 sm:min-h-[3rem] sm:text-base">
            {product.name}
          </h3>
          <p className="mt-auto text-base font-semibold text-white sm:text-lg">
            {formatPrice(product.price, product.currency)}
          </p>
        </div>
      </Link>

      {/* Add to Cart button */}
      <div className="px-4 pb-4">
        {loadingStock ? (
          <Skeleton className="h-8 w-full rounded-md" />
        ) : (
          <AddToCartButton
            stockQuantity={stock?.stock ?? 0}
            onAddToCart={handleAddToCart}
            size="sm"
            showLowStockWarning={false}
          />
        )}
      </div>
    </div>
  )
}
