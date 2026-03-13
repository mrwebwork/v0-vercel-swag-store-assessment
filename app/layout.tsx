import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { AxiomWebVitals } from 'next-axiom'
import { CartProvider } from '@/context/cart-context'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import './globals.css'

const _geist = Geist({ subsets: ['latin'] })
const _geistMono = Geist_Mono({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://vercel-merch.auradev.ai'),
  title: {
    default: 'Vercel Swag Store',
    template: '%s | Vercel Swag Store',
  },
  description:
    'Official Vercel merchandise — hoodies, t-shirts, mugs, and more.',
  generator: 'vswag-cert-v3',
  openGraph: {
    type: 'website',
    url: '/',
    siteName: 'Vercel Swag Store',
    title: 'Vercel Swag Store',
    description: 'Gear up with the best developer swag on the internet.',
    locale: 'en_US',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Vercel Swag Store - Premium developer merchandise including hoodies, caps, stickers, and accessories',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vercel Swag Store',
    description: 'Gear up with the best developer swag on the internet.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#171719',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <link
          rel="preconnect"
          href="https://i8qy5y6gxkdgdcv9.public.blob.vercel-storage.com"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className="min-h-screen bg-black font-sans text-white antialiased"
        suppressHydrationWarning
      >
        <CartProvider>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </CartProvider>
        <Analytics />
        <AxiomWebVitals />
      </body>
    </html>
  )
}
