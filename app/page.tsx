import { fetchProducts } from '@/lib/api'
import { formatPrice, getFirstImage } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'

export default async function Home() {
  const { products } = await fetchProducts({ featured: true, limit: 8 })

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <section className="mb-12">
        <h1 className="mb-2 text-3xl font-bold tracking-tight sm:text-4xl">
          Welcome to the Vercel Swag Store
        </h1>
        <p className="max-w-2xl text-lg text-zinc-400">
          Official Vercel merchandise. Quality apparel and accessories for
          developers.
        </p>
      </section>

      <section>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Featured Products</h2>
          <Link
            href="/search"
            className="text-sm font-medium text-zinc-400 transition-colors hover:text-white"
          >
            View all
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              className="group rounded-lg border border-zinc-800 bg-zinc-900 p-4 transition-colors hover:border-zinc-700 hover:bg-zinc-800/50"
            >
              <div className="relative mb-4 aspect-square overflow-hidden rounded-md bg-zinc-800">
                <Image
                  src={getFirstImage(product.images)}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              </div>
              <h3 className="mb-1 font-medium leading-tight text-white group-hover:text-zinc-200">
                {product.name}
              </h3>
              <p className="text-sm text-zinc-400">
                {formatPrice(product.price, product.currency)}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
