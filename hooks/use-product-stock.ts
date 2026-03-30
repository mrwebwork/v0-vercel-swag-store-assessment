'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Stock } from '@/types'
import { getStockAction } from '@/lib/cart-actions'

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
      console.error('Failed to load stock:', error)
      // Default to out of stock on error for safety
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
