import { fetchProducts, fetchCategories } from '@/lib/api'
import { formatPrice, getFirstImage } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Shop',
  description: 'Browse all Vercel merchandise',
}

type SearchParams = Promise<{
  category?: string
  search?: string
  page?: string
}>

export default async function SearchPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const params = await searchParams
  const [{ products }, categories] = await Promise.all([
    fetchProducts({
      category: params.category,
      search: params.search,
      page: params.page ? parseInt(params.page) : 1,
      limit: 12,
    }),
    fetchCategories(),
  ])

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold tracking-tight">Shop</h1>
        <p className="text-zinc-400">Browse all Vercel merchandise</p>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Filters Sidebar */}
        <aside className="w-full shrink-0 lg:w-64">
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
            <h2 className="mb-4 font-semibold">Categories</h2>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/search"
                  className={`block text-sm transition-colors hover:text-white ${
                    !params.category ? 'text-white' : 'text-zinc-400'
                  }`}
                >
                  All Products
                </Link>
              </li>
              {categories.map((category) => (
                <li key={category.slug}>
                  <Link
                    href={`/search?category=${category.slug}`}
                    className={`block text-sm transition-colors hover:text-white ${
                      params.category === category.slug
                        ? 'text-white'
                        : 'text-zinc-400'
                    }`}
                  >
                    {category.name}{' '}
                    <span className="text-zinc-600">({category.productCount})</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 py-16">
              <p className="text-lg text-zinc-400">No products found</p>
              <Link
                href="/search"
                className="mt-4 text-sm text-zinc-400 underline transition-colors hover:text-white"
              >
                Clear filters
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
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
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
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
          )}
        </div>
      </div>
    </div>
  )
}
