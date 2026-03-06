import { fetchProduct, fetchProducts } from '@/lib/api'
import { formatPrice, getFirstImage } from '@/lib/utils'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { AddToCartButton } from '@/components/add-to-cart-button'

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const { products } = await fetchProducts({ limit: 100 })
  return products.map((product) => ({
    slug: product.slug,
  }))
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params
  
  try {
    const product = await fetchProduct(slug)
    return {
      title: product.name,
      description: product.description,
      openGraph: {
        title: product.name,
        description: product.description,
        images: product.images[0] ? [{ url: product.images[0] }] : undefined,
      },
    }
  } catch {
    return {
      title: 'Product Not Found',
    }
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  
  let product
  try {
    product = await fetchProduct(slug)
  } catch {
    notFound()
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
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

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden rounded-lg bg-zinc-800">
          <Image
            src={getFirstImage(product.images)}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
        </div>

        {/* Product Details */}
        <div className="flex flex-col">
          <h1 className="mb-4 text-3xl font-bold tracking-tight">
            {product.name}
          </h1>

          <p className="mb-6 text-2xl font-semibold">
            {formatPrice(product.price, product.currency)}
          </p>

          <p className="mb-8 leading-relaxed text-zinc-400">
            {product.description}
          </p>

          {/* Add to Cart */}
          <div className="mb-8">
            <AddToCartButton productId={product.id} productName={product.name} />
          </div>

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="mb-6">
              <h3 className="mb-3 text-sm font-medium text-zinc-400">Tags</h3>
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

          {/* Category */}
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
    </div>
  )
}
