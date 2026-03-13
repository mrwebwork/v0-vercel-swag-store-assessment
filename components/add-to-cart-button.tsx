'use client'

import { useState, useTransition } from 'react'
import { ShoppingCart, Check, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface AddToCartButtonProps {
  /** Current stock quantity - button disabled when <= 0 */
  stockQuantity: number
  /** Callback when the button is clicked */
  onAddToCart: () => void | Promise<void>
  /** Optional loading state from parent */
  isLoading?: boolean
  /** Optional custom class names */
  className?: string
  /** Button size variant */
  size?: 'default' | 'sm' | 'lg'
  /** Show stock warning for low stock */
  showLowStockWarning?: boolean
  /** Low stock threshold (default: 5) */
  lowStockThreshold?: number
  /** Product name for accessible label */
  productName?: string
}

export function AddToCartButton({
  stockQuantity,
  onAddToCart,
  isLoading: externalLoading = false,
  className,
  size = 'default',
  showLowStockWarning = true,
  lowStockThreshold = 5,
  productName,
}: AddToCartButtonProps) {
  const [isPending, startTransition] = useTransition()
  const [added, setAdded] = useState(false)

  const isOutOfStock = stockQuantity <= 0
  const isLowStock = stockQuantity > 0 && stockQuantity <= lowStockThreshold
  const isDisabled = isOutOfStock || isPending || externalLoading

  function handleClick() {
    if (isDisabled) return

    startTransition(async () => {
      try {
        await onAddToCart()
        setAdded(true)
        setTimeout(() => setAdded(false), 2000)
      } catch (error) {
        console.error('Failed to add to cart:', error)
      }
    })
  }

  // Determine button content based on state
  const renderButtonContent = () => {
    if (isOutOfStock) {
      return (
        <>
          <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
          <span>Out of Stock</span>
        </>
      )
    }

    if (added) {
      return (
        <>
          <Check className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
          <span>Added to Cart</span>
        </>
      )
    }

    if (isPending || externalLoading) {
      return (
        <>
          <span
            className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent sm:h-5 sm:w-5"
            aria-hidden="true"
          />
          <span>Adding...</span>
        </>
      )
    }

    return (
      <>
        <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
        <span>Add to Cart</span>
      </>
    )
  }

  return (
    <div className="flex flex-col gap-1.5">
      <Button
        type="button"
        size={size}
        onClick={handleClick}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        aria-label={
          isOutOfStock
            ? `Out of stock${productName ? ` - ${productName}` : ''} - cannot add to cart`
            : added
              ? `${productName ? `${productName} a` : 'Item a'}dded to cart`
              : `Add${productName ? ` ${productName}` : ''} to Cart`
        }
        className={cn(
          'w-full gap-2 font-medium transition-all duration-200',
          // Enabled state - high contrast, inviting
          !isDisabled && [
            'bg-white text-zinc-900',
            'hover:bg-zinc-100 hover:shadow-md',
            'active:scale-[0.98] active:bg-zinc-200',
            'focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900',
          ],
          // Disabled/Out of stock state - clearly muted, non-interactive
          isDisabled && [
            'cursor-not-allowed',
            'bg-zinc-800 text-zinc-400',
            'border border-zinc-700',
            'opacity-100', // Override default disabled opacity for clearer visibility
          ],
          // Added state - success feedback
          added && [
            'bg-emerald-500 text-white',
            'hover:bg-emerald-500',
          ],
          className
        )}
      >
        {renderButtonContent()}
      </Button>

      {/* Low stock warning */}
      {showLowStockWarning && isLowStock && !isOutOfStock && (
        <p
          className="text-center text-xs font-medium text-amber-400 sm:text-sm"
          role="status"
          aria-live="polite"
        >
          Only {stockQuantity} left in stock
        </p>
      )}
    </div>
  )
}
