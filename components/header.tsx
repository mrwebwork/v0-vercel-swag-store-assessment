'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ShoppingCart, Menu, X } from 'lucide-react'
import { useCart } from '@/context/cart-context'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'

function VercelLogo({ className }: { className?: string }) {
  return (
    <svg
      aria-label="Vercel Logo"
      className={className}
      fill="currentColor"
      viewBox="0 0 75 65"
    >
      <path d="M37.59.25l36.95 64H.64l36.95-64z" />
    </svg>
  )
}

function CartBadge() {
  const { itemCount } = useCart()

  return (
    <Link
      href="/cart"
      className="relative flex items-center justify-center rounded-md p-2 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
      aria-label={`Shopping cart with ${itemCount} items`}
    >
      <ShoppingCart className="h-5 w-5" />
      {itemCount > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-medium text-black">
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </Link>
  )
}

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/search', label: 'Shop' },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black">
      <div className="mx-auto grid h-14 max-w-7xl grid-cols-[1fr_auto] items-center px-4 sm:px-6 lg:grid-cols-[1fr_auto_1fr] lg:px-8">
        {/* Left: Logo + Store Name */}
        <Link
          href="/"
          className="flex items-center gap-2 justify-self-start text-white transition-opacity hover:opacity-80"
        >
          <VercelLogo className="h-5 w-5" />
          <span className="text-lg font-semibold tracking-tight">
            Vercel Swag Store
          </span>
        </Link>

        {/* Center: Desktop Navigation - only visible on lg+ */}
        <nav className="hidden items-center justify-self-center gap-1 lg:flex" aria-label="Main navigation">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-1.5 text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right: Cart + Mobile Menu */}
        <div className="flex items-center justify-self-end gap-3">
          <CartBadge />

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-zinc-400 hover:bg-zinc-800 hover:text-white lg:hidden"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-full max-w-xs border-zinc-800 bg-zinc-950 px-6"
              aria-describedby={undefined}
            >
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <div className="flex h-full flex-col">
                {/* Header with logo */}
                <div className="flex items-center border-b border-zinc-800 py-4">
                  <Link
                    href="/"
                    className="flex min-h-[44px] items-center gap-3 text-white"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <VercelLogo className="h-5 w-5 shrink-0" />
                    <span className="text-lg font-semibold">Vercel Swag</span>
                  </Link>
                </div>
                
                {/* Primary navigation links */}
                <nav className="flex flex-col gap-2 py-6" aria-label="Mobile navigation">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="flex min-h-[44px] items-center rounded-md px-3 text-lg font-medium text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
                
                {/* Secondary actions separator */}
                <div className="mt-auto border-t border-zinc-800 py-6">
                  <Link
                    href="/cart"
                    className="flex min-h-[44px] items-center gap-3 rounded-md px-3 text-lg font-medium text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <ShoppingCart className="h-5 w-5 shrink-0" />
                    <span>Cart</span>
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
