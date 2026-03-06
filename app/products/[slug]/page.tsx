import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { cacheLife, cacheTag } from 'next/cache'
import { fetchProduct, fetchProducts } from '@/lib/api'
import { formatPrice, getFirstImage } from '@/lib/utils'
import { StockIndicator } from '@/components/stock-indicator'
import { StockIndicatorSkeleton } from '@/components/stock-indicator-skeleton'
import { ProductActions } from '@/components/product-actions'
import type { Metadata } from 'next'

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

// Static product data is cached with 'use cache'
async function getProduct(slug: string) {
  'use cache'
  cacheLife('hours')
  cacheTag('products', `product-${slug}`)
  return fetchProduct(slug)
}

export async function generateStaticParams() {
  try {
    const data = await fetchProducts({ limit: 100 })
    const products = Array.isArray(data) ? data : (data?.products ?? [])
    if (products.length === 0) {
      // Return a placeholder that won't match real routes
      // This prevents EmptyGenerateStaticParamsError with cacheComponents
      return [{ slug: '__placeholder__' }]
    }
    return products.map((product) => ({
      slug: product.slug,
    }))
  } catch {
    // Return a placeholder to prevent EmptyGenerateStaticParamsError
    return [{ slug: '__placeholder__' }]
  }
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params
  
  try {
    const product = await getProduct(slug)
    return {
      title: product.name,
      description: product.description,
      openGraph: {
        title: product.name,
        description: product.description,
        images: product.images[0] ? [{ url: product.images[0], width: 800, height: 800 }] : undefined,
      },
    }
  } catch {
    return {
      title: 'Product Not Found',
    }
  }
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params
  
  let product
  try {
    product = await getProduct(slug)
  } catch {
    notFound()
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-8" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2 text-sm text-zinc-400">
          <li>
            <Link href="/" className="transition-colors hover:text-white">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/search" className="transition-colors hover:text-white">
              Shop
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-white" aria-current="page">
            {product.name}
          </li>
        </ol>
      </nav>

      <div className="grid gap-12 lg:grid-cols-2">
        {/* Product Image - static/cached */}
        <div className="relative aspect-square overflow-hidden rounded-xl bg-zinc-900">
          <Image
            src={getFirstImage(product.images)}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
        </div>

        {/* Product Info */}
        <div className="flex flex-col gap-6">
          {/* Category & Name - static/cached */}
          <div>
            <span className="text-sm uppercase tracking-wide text-zinc-400">
              {product.category}
            </span>
            <h1 className="mt-1 text-3xl font-bold tracking-tight">
              {product.name}
            </h1>
            <p className="mt-2 text-2xl font-semibold">
              {formatPrice(product.price, product.currency)}
            </p>
          </div>

          {/* Description - static/cached */}
          <p className="leading-relaxed text-zinc-400">
            {product.description}
          </p>

          {/* Stock Indicator - DYNAMIC, wrapped in Suspense */}
          <Suspense fallback={<StockIndicatorSkeleton />}>
            <StockIndicator productId={product.id} />
          </Suspense>

          {/* Product Actions - client component with stock-aware logic */}
          <ProductActions productId={product.id} productName={product.name} />

          {/* Tags - static/cached */}
          {product.tags && product.tags.length > 0 && (
            <div className="mt-4">
              <h2 className="mb-3 text-sm font-medium text-zinc-400">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-zinc-800 px-3 py-1 text-sm text-zinc-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Category Link - static/cached */}
          <div className="mt-auto border-t border-zinc-800 pt-6">
            <p className="text-sm text-zinc-500">
              Category:{' '}
              <Link
                href={`/search?category=${product.category}`}
                className="text-zinc-400 transition-colors hover:text-white"
              >
                {product.category}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
