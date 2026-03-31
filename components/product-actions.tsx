'use client'

import { useState, useCallback, useRef } from 'react'
import { useCart } from '@/context/cart-context'
import { useProductStock } from '@/hooks/use-product-stock'
import { QuantitySelector } from '@/components/quantity-selector'
import { AddToCartButton } from '@/components/add-to-cart-button'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import type { Stock } from '@/types'

interface ProductActionsProps {
  productId: string
  productName: string
  /** Pre-fetched stock data from server to eliminate duplicate API calls */
  initialStock?: Stock | null
}

export function ProductActions({ productId, productName, initialStock }: ProductActionsProps) {
  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(1)
  // Skip client-side fetch if initialStock is provided (server-side optimization)
  const { stock: fetchedStock, isLoading: loadingStock, isOutOfStock: fetchedOutOfStock } = useProductStock({ 
    productId, 
    fetchOnMount: !initialStock // Only fetch if no initial data
  })
  const isAddingRef = useRef(false)
  
  // Use server-provided stock if available, fall back to client-fetched
  const stock = initialStock ?? fetchedStock
  const isOutOfStock = initialStock ? !initialStock.inStock : fetchedOutOfStock
  const isLoading = !initialStock && loadingStock

  // Handle add to cart with quantity reset and toast notification
  const handleAddToCart = useCallback(async () => {
    // Prevent duplicate rapid clicks
    if (isAddingRef.current) return
    isAddingRef.current = true
    
    try {
      const result = await addItem(productId, quantity)
      
      if (result.success) {
        toast.success('Added to cart', {
          description: `${quantity} x ${productName} ${quantity === 1 ? 'has' : 'have'} been added to your cart`,
          duration: 2500,
        })
        setQuantity(1)
      } else if (result.error && !result.error.includes('already in progress')) {
        toast.error('Failed to add to cart', {
          description: result.error,
          duration: 3000,
        })
      }
    } finally {
      setTimeout(() => {
        isAddingRef.current = false
      }, 300)
    }
  }, [addItem, productId, productName, quantity])

  const maxQuantity = stock?.stock ?? 99

  return (
    <div className="space-y-4">
      {/* Quantity Selector */}
      {isLoading ? (
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
      {isLoading ? (
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
