'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import { toast } from 'sonner'
import { useCart } from '@/context/cart-context'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export function CartContent() {
  const { cart, isLoading, isPending, updateItem, removeItem } = useCart()

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-700 border-t-white" />
        <p className="mt-4 text-zinc-400">Loading cart...</p>
      </div>
    )
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 py-16">
        <ShoppingBag className="mb-4 h-16 w-16 text-zinc-600" />
        <p className="mb-2 text-lg text-zinc-400">Your cart is empty</p>
        <Link
          href="/search"
          className="mt-4 text-sm text-zinc-400 underline transition-colors hover:text-white"
        >
          Continue shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Cart Items */}
      <ul className="divide-y divide-zinc-800 rounded-lg border border-zinc-800 bg-zinc-900">
        {cart.items.map((item) => (
          <li key={item.id} className="flex flex-col gap-4 p-4 sm:flex-row">
            {/* Product Image */}
            <div className="relative mx-auto h-32 w-32 shrink-0 overflow-hidden rounded-md bg-zinc-800 sm:mx-0 sm:h-24 sm:w-24">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 128px, 96px"
              />
            </div>

            {/* Product Details */}
            <div className="flex flex-1 flex-col justify-between">
              <div className="text-center sm:text-left">
                <h3 className="font-medium text-white">{item.name}</h3>
                <p className="mt-1 text-sm text-zinc-400">
                  {formatPrice(item.price, cart.currency)}
                </p>
                {/* Item Total - visible on mobile inline */}
                <p className="mt-1 font-medium text-white sm:hidden">
                  Total: {formatPrice(item.price * item.quantity, cart.currency)}
                </p>
              </div>

              {/* Quantity Controls - centered on mobile */}
              <div className="mt-3 flex items-center justify-center gap-3 sm:mt-0 sm:justify-start sm:gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-11 w-11 border-zinc-700 bg-transparent hover:bg-zinc-800 sm:h-8 sm:w-8"
                  onClick={() => updateItem(item.id, Math.max(1, item.quantity - 1))}
                  disabled={isPending || item.quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center text-sm">{item.quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-11 w-11 border-zinc-700 bg-transparent hover:bg-zinc-800 sm:h-8 sm:w-8"
                  onClick={() => updateItem(item.id, item.quantity + 1)}
                  disabled={isPending}
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-2 h-11 w-11 text-zinc-400 hover:bg-zinc-800 hover:text-red-400 sm:h-8 sm:w-8"
                  onClick={() => removeItem(item.id)}
                  disabled={isPending}
                  aria-label="Remove item"
                >
                  <Trash2 className="h-5 w-5 sm:h-4 sm:w-4" />
                </Button>
              </div>
            </div>

            {/* Item Total - desktop only */}
            <div className="hidden text-right sm:block">
              <p className="font-medium text-white">
                {formatPrice(item.price * item.quantity, cart.currency)}
              </p>
            </div>
          </li>
        ))}
      </ul>

      {/* Cart Summary */}
      <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <span className="text-zinc-400">Subtotal</span>
          <span className="text-lg font-semibold text-white">
            {formatPrice(cart.subtotal, cart.currency)}
          </span>
        </div>
        <p className="mt-4 text-sm text-zinc-400">
          Shipping and taxes calculated at checkout.
        </p>
        <Button
          className="mt-6 w-full bg-white text-black hover:bg-zinc-200"
          size="lg"
          disabled={isPending}
          onClick={() => toast.info('Checkout coming soon', {
            description: 'This template demonstrates the cart experience. Checkout integration is the next step.',
            duration: 3000,
          })}
        >
          Proceed to Checkout
        </Button>
        <Link
          href="/search"
          className="mt-4 block text-center text-sm text-zinc-400 transition-colors hover:text-white"
        >
          Continue shopping
        </Link>
      </div>
    </div>
  )
}
