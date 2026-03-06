'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import type { Product } from '@/types'
import { formatPrice, getFirstImage } from '@/lib/utils'
import { useCart } from '@/context/cart-context'
import { Button } from '@/components/ui/button'
import { useState, useTransition } from 'react'

type ProductCardProps = {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()
  const [isPending, startTransition] = useTransition()
  const [added, setAdded] = useState(false)

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    startTransition(async () => {
      try {
        await addItem(product.id, 1)
        setAdded(true)
        setTimeout(() => setAdded(false), 1500)
      } catch {
        // Silently fail - cart context handles errors
      }
    })
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
        </div>
        <div className="flex flex-1 flex-col p-4">
          <span className="mb-1.5 inline-block self-start rounded-full bg-zinc-800 px-2.5 py-0.5 text-xs font-medium capitalize text-zinc-400">
            {product.category}
          </span>
          <h3 className="mb-2 line-clamp-1 text-sm font-medium text-white transition-colors group-hover:text-blue-400 sm:text-base">
            {product.name}
          </h3>
          <p className="mt-auto text-base font-semibold text-white sm:text-lg">
            {formatPrice(product.price, product.currency)}
          </p>
        </div>
      </Link>

      {/* Add to Cart button */}
      <div className="px-4 pb-4">
        <Button
          type="button"
          size="sm"
          className="w-full bg-white text-black hover:bg-zinc-200 disabled:bg-zinc-700 disabled:text-zinc-400"
          onClick={handleAddToCart}
          disabled={isPending || added}
        >
          {added ? (
            'Added!'
          ) : isPending ? (
            <span className="flex items-center gap-2">
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-zinc-400 border-t-black" />
              Adding...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <ShoppingCart className="h-3.5 w-3.5" />
              Add to Cart
            </span>
          )}
        </Button>
      </div>
    </div>
  )
}
