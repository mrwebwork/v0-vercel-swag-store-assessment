import { getProducts } from '@/lib/api'
import { formatPrice, getFirstImage } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'

export const metadata = {
  title: 'All Products | Vercel Swag Store',
  description: 'Browse all official Vercel merchandise',
}

export default async function ProductsPage() {
  const products = await getProducts()

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
              className="text-sm font-medium text-foreground"
            >
              All Products
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <section className="mb-8">
          <h1 className="mb-2 text-3xl font-bold tracking-tight">
            All Products
          </h1>
          <p className="text-muted-foreground">
            {products.length} products available
          </p>
        </section>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              className="group rounded-lg border border-border/40 bg-card p-4 transition-colors hover:border-border hover:bg-accent/50"
            >
              <div className="relative mb-4 aspect-square overflow-hidden rounded-md bg-muted">
                <Image
                  src={getFirstImage(product.images)}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              </div>
              <h3 className="mb-1 font-medium leading-tight group-hover:text-primary">
                {product.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {formatPrice(product.price, product.currency)}
              </p>
            </Link>
          ))}
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
