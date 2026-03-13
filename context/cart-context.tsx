'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useTransition,
  useOptimistic,
  useCallback,
  type ReactNode,
} from 'react'
import type { Cart } from '@/types'
import {
  getCartAction,
  addToCartAction,
  updateCartItemAction,
  removeCartItemAction,
} from '@/lib/cart-actions'

// Helper to detect stale server action errors (deployment mismatch)
function isStaleServerActionError(error: unknown): boolean {
  if (error instanceof Error) {
    return error.message.includes('Failed to find Server Action')
  }
  return false
}

// Handle stale deployment by reloading the page
function handleStaleDeployment() {
  if (typeof window !== 'undefined') {
    window.location.reload()
  }
}

type OptimisticAction =
  | { type: 'add'; productId: string; quantity: number }
  | { type: 'update'; itemId: string; quantity: number }
  | { type: 'remove'; itemId: string }

type CartContextValue = {
  cart: Cart | null
  itemCount: number
  isLoading: boolean
  isPending: boolean
  addItem: (productId: string, quantity: number) => Promise<void>
  updateItem: (itemId: string, quantity: number) => Promise<void>
  removeItem: (itemId: string) => Promise<void>
}

const CartContext = createContext<CartContextValue | null>(null)

function cartReducer(state: Cart | null, action: OptimisticAction): Cart | null {
  if (!state) return state

  switch (action.type) {
    case 'add': {
      // Optimistically add item (we don't have full product info, so just update count)
      return {
        ...state,
        totalItems: state.totalItems + action.quantity,
      }
    }
    case 'update': {
      const item = state.items.find((i) => i.id === action.itemId)
      if (!item) return state

      const quantityDiff = action.quantity - item.quantity
      const priceDiff = item.price * quantityDiff

      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.itemId ? { ...i, quantity: action.quantity } : i
        ),
        totalItems: state.totalItems + quantityDiff,
        subtotal: state.subtotal + priceDiff,
      }
    }
    case 'remove': {
      const item = state.items.find((i) => i.id === action.itemId)
      if (!item) return state

      return {
        ...state,
        items: state.items.filter((i) => i.id !== action.itemId),
        totalItems: state.totalItems - item.quantity,
        subtotal: state.subtotal - item.price * item.quantity,
      }
    }
    default:
      return state
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isPending, startTransition] = useTransition()
  const [optimisticCart, addOptimisticAction] = useOptimistic(cart, cartReducer)

  // Hydrate cart on mount
  useEffect(() => {
    async function loadCart() {
      try {
        const serverCart = await getCartAction()
        setCart(serverCart)
      } catch (error) {
        if (isStaleServerActionError(error)) {
          handleStaleDeployment()
          return
        }
        setCart(null)
      } finally {
        setIsLoading(false)
      }
    }
    loadCart()
  }, [])

  const addItem = useCallback(
    async (productId: string, quantity: number) => {
      startTransition(async () => {
        addOptimisticAction({ type: 'add', productId, quantity })
        try {
          const updatedCart = await addToCartAction(productId, quantity)
          setCart(updatedCart)
        } catch (error) {
          if (isStaleServerActionError(error)) {
            handleStaleDeployment()
            return
          }
          // Revert optimistic update by refetching
          try {
            const serverCart = await getCartAction()
            setCart(serverCart)
          } catch {
            // If refetch also fails, keep current state
          }
        }
      })
    },
    [addOptimisticAction]
  )

  const updateItem = useCallback(
    async (itemId: string, quantity: number) => {
      startTransition(async () => {
        addOptimisticAction({ type: 'update', itemId, quantity })
        try {
          const updatedCart = await updateCartItemAction(itemId, quantity)
          setCart(updatedCart)
        } catch (error) {
          if (isStaleServerActionError(error)) {
            handleStaleDeployment()
            return
          }
          // Revert optimistic update by refetching
          try {
            const serverCart = await getCartAction()
            setCart(serverCart)
          } catch {
            // If refetch also fails, keep current state
          }
        }
      })
    },
    [addOptimisticAction]
  )

  const removeItem = useCallback(
    async (itemId: string) => {
      startTransition(async () => {
        addOptimisticAction({ type: 'remove', itemId })
        try {
          const updatedCart = await removeCartItemAction(itemId)
          setCart(updatedCart)
        } catch (error) {
          if (isStaleServerActionError(error)) {
            handleStaleDeployment()
            return
          }
          // Revert optimistic update by refetching
          try {
            const serverCart = await getCartAction()
            setCart(serverCart)
          } catch {
            // If refetch also fails, reset to null
            setCart(null)
          }
        }
      })
    },
    [addOptimisticAction]
  )

  const itemCount = optimisticCart?.totalItems ?? 0

  return (
    <CartContext.Provider
      value={{
        cart: optimisticCart,
        itemCount,
        isLoading,
        isPending,
        addItem,
        updateItem,
        removeItem,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
