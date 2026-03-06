import type { Metadata } from 'next'
import { CartContent } from '@/components/cart-content'

export const metadata: Metadata = {
  title: 'Cart',
  description: 'View and manage your shopping cart at Vercel Swag Store.',
  openGraph: {
    title: 'Your Cart | Vercel Swag Store',
    description: 'Review your items and proceed to checkout.',
  },
}

export default function CartPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold tracking-tight">Your Cart</h1>
      <CartContent />
    </div>
  )
}
