import Link from 'next/link'
import { CurrentYear } from '@/components/current-year'

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

const footerLinks = [
  { href: '/privacy', label: 'Privacy' },
  { href: '/terms', label: 'Terms' },
  { href: '/support', label: 'Support' },
]

export function Footer() {

  return (
    <footer className="border-t border-zinc-800 bg-black">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          {/* Logo + Copyright */}
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
            <VercelLogo className="h-4 w-4 text-white" />
            <p className="text-sm text-zinc-400">
              {/* year client component */}
              &copy; <CurrentYear /> Vercel Swag Store. All rights reserved.
            </p>
          </div>

          {/* Links */}
          <nav className="flex items-center gap-6" aria-label="Footer navigation">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-zinc-400 transition-colors hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-sm"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  )
}
