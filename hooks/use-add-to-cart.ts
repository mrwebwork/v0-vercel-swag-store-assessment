'use client'

import { useCallback, useRef } from 'react'
import { useCart } from '@/context/cart-context'
import { toast } from 'sonner'

interface UseAddToCartOptions {
  /** Product ID to add to cart */
  productId: string
  /** Product name for toast notification */
  productName?: string
  /** Quantity to add (default: 1) */
  quantity?: number
  /** Show toast notification on success (default: true) */
  showToast?: boolean
}

interface UseAddToCartResult {
  /** Function to add the product to cart - returns success status */
  addToCart: () => Promise<boolean>
  /** Whether the cart is currently pending an update */
  isPending: boolean
}

/**
 * Hook to handle adding a product to the cart.
 * Provides request deduplication and optional toast notifications.
 * 
 * @example
 * ```tsx
 * const { addToCart, isPending } = useAddToCart({ 
 *   productId: 'abc123',
 *   productName: 'Cool Hoodie'
 * })
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
  productName,
  quantity = 1,
  showToast = true,
}: UseAddToCartOptions): UseAddToCartResult {
  const { addItem, isPending } = useCart()
  const isAddingRef = useRef(false)

  const addToCart = useCallback(async (): Promise<boolean> => {
    // Prevent duplicate rapid clicks at the hook level
    if (isAddingRef.current) {
      return false
    }
    
    isAddingRef.current = true
    
    try {
      const result = await addItem(productId, quantity)
      
      if (result.success && showToast) {
        toast.success('Added to cart', {
          description: productName 
            ? `${productName} has been added to your cart`
            : 'Item has been added to your cart',
          duration: 2500,
        })
      } else if (!result.success && result.error && showToast) {
        // Only show error toast if it's not a "request in progress" error
        if (!result.error.includes('already in progress')) {
          toast.error('Failed to add to cart', {
            description: result.error,
            duration: 3000,
          })
        }
      }
      
      return result.success
    } finally {
      // Small delay before allowing next request
      setTimeout(() => {
        isAddingRef.current = false
      }, 300)
    }
  }, [addItem, productId, productName, quantity, showToast])

  return {
    addToCart,
    isPending,
  }
}
