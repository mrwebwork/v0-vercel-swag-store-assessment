'use client'

import Image from 'next/image'
import Link from 'next/link'
import type { Product, Stock } from '@/types'
import { formatPrice, getFirstImage } from '@/lib/utils'
import { useProductStock } from '@/hooks/use-product-stock'
import { useAddToCart } from '@/hooks/use-add-to-cart'
import { AddToCartButton } from '@/components/add-to-cart-button'
import { Skeleton } from '@/components/ui/skeleton'

type ProductCardServerProps = {
  product: Product
  /** 
   * Pre-fetched stock data from server - eliminates N+1 client requests.
   * When undefined or stock === -1, falls back to client-side stock fetching.
   */
  stock?: Stock
  /** Mark as high-priority for LCP — first 3 above-fold cards should be true */
  isPriority?: boolean
}

/**
 * Hybrid ProductCard that can use pre-fetched stock OR fetch client-side.
 * - When stock prop is provided with valid data (stock >= 0): uses it directly
 * - When stock is undefined or stock === -1: fetches via useProductStock hook
 * This enables instant product rendering with progressive stock loading.
 */
export function ProductCardServer({ product, stock: serverStock, isPriority = false }: ProductCardServerProps) {
  // Determine if we need to fetch stock client-side
  const needsClientFetch = !serverStock || serverStock.stock === -1
  
  // Only call the hook when we need client-side fetching
  const { stock: clientStock, isLoading: loadingStock } = useProductStock({
    productId: product.id,
    fetchOnMount: needsClientFetch,
  })
  
  // Use server stock if available and valid, otherwise use client stock
  const stock = needsClientFetch ? clientStock : serverStock
  const isLoading = needsClientFetch && loadingStock
  
  const { addToCart } = useAddToCart({ 
    productId: product.id, 
    productName: product.name,
    quantity: 1,
  })

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
            priority={isPriority}
          />
          {product.featured && (
            <div className="absolute left-3 top-3 rounded-full bg-blue-500 px-2.5 py-1 text-xs font-medium text-white">
              Featured
            </div>
          )}
          {/* Out of stock overlay badge - only show when stock is loaded */}
          {!isLoading && stock && !stock.inStock && (
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
          <h3 className="mb-2 line-clamp-2 min-h-10 text-sm font-medium text-white transition-colors group-hover:text-blue-400 sm:min-h-12 sm:text-base">
            {product.name}
          </h3>
          <p className="mt-auto text-base font-semibold text-white sm:text-lg">
            {formatPrice(product.price, product.currency)}
          </p>
        </div>
      </Link>

      {/* Add to Cart button - show skeleton while loading stock */}
      <div className="px-4 pb-4">
        {isLoading ? (
          <Skeleton className="h-8 w-full rounded-md" />
        ) : (
          <AddToCartButton
            className="cursor-pointer"
            stockQuantity={stock?.stock ?? 0}
            onAddToCart={addToCart}
            size="sm"
            showLowStockWarning={false}
            productName={product.name}
          />
        )}
      </div>
    </div>
  )
}
