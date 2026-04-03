'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { ShoppingCart, Check, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

/** Duration in ms for the success confirmation state before resetting */
const SUCCESS_RESET_DELAY = 2000

type ButtonState = 'idle' | 'loading' | 'success' | 'out-of-stock'

interface AddToCartButtonProps {
  /** Current stock quantity - button disabled when <= 0 */
  stockQuantity: number
  /** 
   * Callback when the button is clicked. 
   * Can return boolean to indicate success (true) or failure (false).
   * If void is returned, success is assumed.
   */
  onAddToCart: () => void | boolean | Promise<void> | Promise<boolean>
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
  const [showSuccess, setShowSuccess] = useState(false)
  const resetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const isOutOfStock = stockQuantity <= 0
  const isLowStock = stockQuantity > 0 && stockQuantity <= lowStockThreshold
  const isDisabled = isOutOfStock || externalLoading || showSuccess

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (resetTimeoutRef.current) {
        clearTimeout(resetTimeoutRef.current)
      }
    }
  }, [])

  // Determine current button state
  const getButtonState = useCallback((): ButtonState => {
    if (isOutOfStock) return 'out-of-stock'
    if (externalLoading) return 'loading'
    if (showSuccess) return 'success'
    return 'idle'
  }, [isOutOfStock, externalLoading, showSuccess])

  const handleClick = useCallback(() => {
    if (isDisabled) return

    // Clear any existing timeout before starting a new action
    if (resetTimeoutRef.current) {
      clearTimeout(resetTimeoutRef.current)
      resetTimeoutRef.current = null
    }

    // Call onAddToCart directly - cart context handles the transition
    const result = onAddToCart()
    
    // Handle both sync and async results
    if (result instanceof Promise) {
      result.then((asyncResult) => {
        const wasSuccessful = asyncResult === undefined || asyncResult === true
        if (wasSuccessful) {
          setShowSuccess(true)
          resetTimeoutRef.current = setTimeout(() => {
            setShowSuccess(false)
            resetTimeoutRef.current = null
          }, SUCCESS_RESET_DELAY)
        }
      }).catch((error) => {
        console.error('Failed to add to cart:', error)
      })
    } else {
      // Sync result - show success immediately
      const wasSuccessful = result === undefined || result === true
      if (wasSuccessful) {
        setShowSuccess(true)
        resetTimeoutRef.current = setTimeout(() => {
          setShowSuccess(false)
          resetTimeoutRef.current = null
        }, SUCCESS_RESET_DELAY)
      }
    }
  }, [isDisabled, onAddToCart])

  // Generate accessible label based on state
  const getAriaLabel = useCallback((): string => {
    const buttonState = getButtonState()
    const name = productName ? ` ${productName}` : ''
    
    switch (buttonState) {
      case 'out-of-stock':
        return `Out of stock${name ? ` - ${productName}` : ''} - cannot add to cart`
      case 'success':
        return `${productName ?? 'Item'} added to cart`
      case 'loading':
        return `Adding${name} to cart...`
      default:
        return `Add${name} to cart`
    }
  }, [getButtonState, productName])

  // Get button styles based on current state
  const getButtonStyles = useCallback((): string[] => {
    const buttonState = getButtonState()
    
    switch (buttonState) {
      case 'out-of-stock':
        return [
          'cursor-not-allowed',
          'bg-zinc-800 text-zinc-400',
          'border border-zinc-700',
        ]
      case 'success':
        return [
          'bg-emerald-500 text-white',
          'cursor-default',
        ]
      case 'loading':
        return [
          'cursor-wait',
          'bg-zinc-800 text-zinc-400',
          'border border-zinc-700',
        ]
      default:
        return [
          'bg-white text-zinc-900',
          'hover:bg-zinc-100 hover:shadow-md',
          'active:scale-[0.98] active:bg-zinc-200',
          'focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900',
        ]
    }
  }, [getButtonState])

  // Render button content based on current state
  const renderButtonContent = () => {
    const buttonState = getButtonState()
    const iconClass = "h-4 w-4 sm:h-5 sm:w-5"

    switch (buttonState) {
      case 'out-of-stock':
        return (
          <>
            <AlertCircle className={iconClass} aria-hidden="true" />
            <span>Out of Stock</span>
          </>
        )
      case 'loading':
        return (
          <>
            <span
              className={cn(iconClass, "animate-spin rounded-full border-2 border-current border-t-transparent")}
              aria-hidden="true"
            />
            <span>Adding...</span>
          </>
        )
      case 'success':
        return (
          <>
            <Check className={iconClass} aria-hidden="true" />
            <span>Added!</span>
          </>
        )
      default:
        return (
          <>
            <ShoppingCart className={iconClass} aria-hidden="true" />
            <span>Add to Cart</span>
          </>
        )
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      <Button
        type="button"
        size={size}
        onClick={handleClick}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        aria-label={getAriaLabel()}
        className={cn(
          'w-full gap-2 font-medium transition-all duration-200',
          getButtonStyles(),
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
