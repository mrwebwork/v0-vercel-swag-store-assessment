'use client'

import { useState, useEffect, useTransition } from 'react'
import { ShoppingCart, Check } from 'lucide-react'
import { useCart } from '@/context/cart-context'
import { getStockAction } from '@/lib/cart-actions'
import { QuantitySelector } from '@/components/quantity-selector'
import { Button } from '@/components/ui/button'
import type { Stock } from '@/types'

interface ProductActionsProps {
  productId: string
  productName: string
}

export function ProductActions({ productId, productName }: ProductActionsProps) {
  const { addItem } = useCart()
  const [isPending, startTransition] = useTransition()
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const [stock, setStock] = useState<Stock | null>(null)
  const [loadingStock, setLoadingStock] = useState(true)

  useEffect(() => {
    async function loadStock() {
      try {
        const stockData = await getStockAction(productId)
        setStock(stockData)
      } catch (error) {
        console.error('Failed to load stock:', error)
      } finally {
        setLoadingStock(false)
      }
    }
    loadStock()
  }, [productId])

  function handleAddToCart() {
    startTransition(async () => {
      try {
        await addItem(productId, quantity)
        setAdded(true)
        setTimeout(() => setAdded(false), 2000)
      } catch (error) {
        console.error('Failed to add to cart:', error)
      }
    })
  }

  const isOutOfStock = stock !== null && !stock.inStock
  const maxQuantity = stock?.stock ?? 99

  return (
    <div className="space-y-4">
      {/* Quantity Selector */}
      {!loadingStock && !isOutOfStock && (
        <QuantitySelector
          value={quantity}
          max={maxQuantity}
          onChange={setQuantity}
        />
      )}

      {/* Add to Cart Button */}
      <Button
        className="w-full bg-white text-black hover:bg-zinc-200 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400"
        size="lg"
        onClick={handleAddToCart}
        disabled={isPending || loadingStock || isOutOfStock}
        aria-label={isOutOfStock ? 'Out of stock' : `Add ${productName} to cart`}
      >
        {loadingStock ? (
          <>
            <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-zinc-400 border-t-black" />
            Checking availability...
          </>
        ) : isOutOfStock ? (
          'Out of Stock'
        ) : added ? (
          <>
            <Check className="mr-2 h-5 w-5" />
            Added to Cart
          </>
        ) : isPending ? (
          <>
            <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-zinc-400 border-t-black" />
            Adding...
          </>
        ) : (
          <>
            <ShoppingCart className="mr-2 h-5 w-5" />
            Add to Cart
          </>
        )}
      </Button>
    </div>
  )
}
