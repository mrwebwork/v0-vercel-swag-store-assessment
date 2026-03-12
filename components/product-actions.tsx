'use client'

import { useState, useEffect } from 'react'
import { useCart } from '@/context/cart-context'
import { getStockAction } from '@/lib/cart-actions'
import { QuantitySelector } from '@/components/quantity-selector'
import { AddToCartButton } from '@/components/add-to-cart-button'
import { Skeleton } from '@/components/ui/skeleton'
import type { Stock } from '@/types'

interface ProductActionsProps {
  productId: string
  productName: string
}

export function ProductActions({ productId, productName }: ProductActionsProps) {
  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [stock, setStock] = useState<Stock | null>(null)
  const [loadingStock, setLoadingStock] = useState(true)

  useEffect(() => {
    async function loadStock() {
      try {
        const stockData = await getStockAction(productId)
        setStock(stockData)
      } catch (error) {
        console.error('Failed to load stock:', error)
        // Default to out of stock on error for safety
        setStock({ productId, stock: 0, inStock: false, lowStock: false })
      } finally {
        setLoadingStock(false)
      }
    }
    loadStock()
  }, [productId])

  async function handleAddToCart() {
    await addItem(productId, quantity)
  }

  const isOutOfStock = stock !== null && !stock.inStock
  const maxQuantity = stock?.stock ?? 99

  return (
    <div className="space-y-4">
      {/* Quantity Selector */}
      {loadingStock ? (
        <Skeleton className="h-10 w-32 rounded-md" />
      ) : (
        !isOutOfStock && (
          <QuantitySelector
            value={quantity}
            max={maxQuantity}
            onChange={setQuantity}
          />
        )
      )}

      {/* Add to Cart Button */}
      {loadingStock ? (
        <Skeleton className="h-10 w-full rounded-md" />
      ) : (
        <AddToCartButton
          stockQuantity={stock?.stock ?? 0}
          onAddToCart={handleAddToCart}
          size="lg"
          showLowStockWarning={true}
          productName={productName}
        />
      )}
    </div>
  )
}
