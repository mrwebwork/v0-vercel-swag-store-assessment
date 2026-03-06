import { getProductBySlug, getProducts } from '@/lib/api'
import { formatPrice, getFirstImage } from '@/lib/utils'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const products = await getProducts()
  return products.map((product) => ({
    slug: product.slug,
  }))
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) {
    return {
      title: 'Product Not Found | Vercel Swag Store',
    }
  }

  return {
    title: `${product.name} | Vercel Swag Store`,
    description: product.description,
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background font-sans">
      <header className="border-b border-border/40">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="text-xl font-bold tracking-tight">
            Vercel Swag Store
          </Link>
          <nav className="flex items-center gap-6">
            <Link
              href="/products"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              All Products
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <nav className="mb-8">
          <ol className="flex items-center gap-2 text-sm text-muted-foreground">
            <li>
              <Link href="/" className="hover:text-foreground">
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/products" className="hover:text-foreground">
                Products
              </Link>
            </li>
            <li>/</li>
            <li className="text-foreground">{product.name}</li>
          </ol>
        </nav>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
            <Image
              src={getFirstImage(product.images)}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>

          <div className="flex flex-col">
            <h1 className="mb-4 text-3xl font-bold tracking-tight">
              {product.name}
            </h1>

            <p className="mb-6 text-2xl font-semibold">
              {formatPrice(product.price, product.currency)}
            </p>

            <p className="mb-8 leading-relaxed text-muted-foreground">
              {product.description}
            </p>

            {product.variants && product.variants.length > 0 && (
              <div className="mb-8">
                <h3 className="mb-3 text-sm font-medium">Available Options</h3>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant) => (
                    <span
                      key={variant.id}
                      className="rounded-md border border-border bg-muted px-3 py-1.5 text-sm"
                    >
                      {variant.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-auto">
              <p className="text-sm text-muted-foreground">
                Category: {product.category}
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-auto border-t border-border/40">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-muted-foreground">
            Vercel Swag Store Assessment
          </p>
        </div>
      </footer>
    </div>
  )
}
