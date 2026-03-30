'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import type { Stock } from '@/types'
import { getStockAction } from '@/lib/cart-actions'

// Helper to detect stale server action errors (deployment mismatch)
function isStaleServerActionError(error: unknown): boolean {
  if (error instanceof Error) {
    return error.message.includes('Failed to find Server Action') || 
           error.message.includes('was not found on the server')
  }
  return false
}

interface UseProductStockOptions {
  /** Product ID to fetch stock for */
  productId: string
  /** Whether to fetch stock immediately on mount (default: true) */
  fetchOnMount?: boolean
}

interface UseProductStockResult {
  /** Current stock data */
  stock: Stock | null
  /** Whether stock is being loaded */
  isLoading: boolean
  /** Whether product is out of stock */
  isOutOfStock: boolean
  /** Whether product has low stock */
  isLowStock: boolean
  /** Manually refetch stock data */
  refetch: () => Promise<void>
}

/**
 * Hook to fetch and manage product stock state.
 * Encapsulates stock fetching logic for reuse across components.
 */
export function useProductStock({
  productId,
  fetchOnMount = true,
}: UseProductStockOptions): UseProductStockResult {
  const [stock, setStock] = useState<Stock | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchStock = useCallback(async () => {
    setIsLoading(true)
    try {
      const stockData = await getStockAction(productId)
      setStock(stockData)
    } catch (error) {
      // Handle stale server action errors by reloading the page
      if (isStaleServerActionError(error)) {
        // Only reload if we haven't tried recently (prevent infinite reload loops)
        if (typeof window !== 'undefined') {
          const lastReload = sessionStorage.getItem('stock-reload-timestamp')
          const now = Date.now()
          if (!lastReload || now - parseInt(lastReload, 10) > 5000) {
            sessionStorage.setItem('stock-reload-timestamp', now.toString())
            window.location.reload()
            return
          }
        }
      }
      
      // Default to out of stock on error for safety (silent fail for non-critical data)
      setStock({ productId, stock: 0, inStock: false, lowStock: false })
    } finally {
      setIsLoading(false)
    }
  }, [productId])

  useEffect(() => {
    if (fetchOnMount) {
      fetchStock()
    }
  }, [fetchOnMount, fetchStock])

  const isOutOfStock = stock !== null && !stock.inStock
  const isLowStock = stock !== null && stock.lowStock

  return {
    stock,
    isLoading,
    isOutOfStock,
    isLowStock,
    refetch: fetchStock,
  }
}
