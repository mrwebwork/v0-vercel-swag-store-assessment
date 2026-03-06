'use client'

import { useState } from 'react'
import { ShoppingCart, Check, Minus, Plus } from 'lucide-react'
import { useCart } from '@/context/cart-context'
import { Button } from '@/components/ui/button'

interface AddToCartButtonProps {
  productId: string
  productName: string
}

export function AddToCartButton({ productId, productName }: AddToCartButtonProps) {
  const { addItem, isPending } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  async function handleAddToCart() {
    try {
      await addItem(productId, quantity)
      setAdded(true)
      setTimeout(() => setAdded(false), 2000)
    } catch (error) {
      console.error('Failed to add to cart:', error)
    }
  }

  return (
    <div className="space-y-4">
      {/* Quantity Selector */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-zinc-400">Quantity</span>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 border-zinc-700 bg-transparent hover:bg-zinc-800"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-12 text-center font-medium">{quantity}</span>
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 border-zinc-700 bg-transparent hover:bg-zinc-800"
            onClick={() => setQuantity(quantity + 1)}
            aria-label="Increase quantity"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Add to Cart Button */}
      <Button
        className="w-full bg-white text-black hover:bg-zinc-200"
        size="lg"
        onClick={handleAddToCart}
        disabled={isPending}
        aria-label={`Add ${productName} to cart`}
      >
        {added ? (
          <>
            <Check className="mr-2 h-5 w-5" />
            Added to Cart
          </>
        ) : isPending ? (
          <>
            <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-zinc-400 border-t-black" />
            Adding...
          </>
        ) : (
          <>
            <ShoppingCart className="mr-2 h-5 w-5" />
            Add to Cart
          </>
        )}
      </Button>
    </div>
  )
}
