'use client'

import { useState, useCallback } from 'react'
import { useCart } from '@/context/cart-context'
import { useProductStock } from '@/hooks/use-product-stock'
import { QuantitySelector } from '@/components/quantity-selector'
import { AddToCartButton } from '@/components/add-to-cart-button'
import { Skeleton } from '@/components/ui/skeleton'

interface ProductActionsProps {
  productId: string
  productName: string
}

export function ProductActions({ productId, productName }: ProductActionsProps) {
  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(1)
  const { stock, isLoading: loadingStock, isOutOfStock } = useProductStock({ productId })

  // Reset quantity to 1 after successful add
  const handleAddToCart = useCallback(async () => {
    await addItem(productId, quantity)
    setQuantity(1)
  }, [addItem, productId, quantity])

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
