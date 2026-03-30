'use client'

import { useCallback } from 'react'
import { useCart } from '@/context/cart-context'

interface UseAddToCartOptions {
  /** Product ID to add to cart */
  productId: string
  /** Quantity to add (default: 1) */
  quantity?: number
}

interface UseAddToCartResult {
  /** Function to add the product to cart */
  addToCart: () => Promise<void>
  /** Whether the cart is currently pending an update */
  isPending: boolean
}

/**
 * Hook to handle adding a product to the cart.
 * Provides a clean interface for triggering add-to-cart actions.
 * 
 * @example
 * ```tsx
 * const { addToCart, isPending } = useAddToCart({ productId: 'abc123' })
 * 
 * <AddToCartButton
 *   onAddToCart={addToCart}
 *   isLoading={isPending}
 *   stockQuantity={stock}
 * />
 * ```
 */
export function useAddToCart({
  productId,
  quantity = 1,
}: UseAddToCartOptions): UseAddToCartResult {
  const { addItem, isPending } = useCart()

  const addToCart = useCallback(async () => {
    await addItem(productId, quantity)
  }, [addItem, productId, quantity])

  return {
    addToCart,
    isPending,
  }
}
