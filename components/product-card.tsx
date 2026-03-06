import Image from 'next/image'
import Link from 'next/link'
import type { Product } from '@/types'
import { formatPrice, getFirstImage } from '@/lib/utils'

type ProductCardProps = {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900/50 transition-all duration-300 hover:border-neutral-700 hover:shadow-lg hover:shadow-black/20 hover:-translate-y-1"
    >
      <div className="relative aspect-square overflow-hidden bg-neutral-800">
        <Image
          src={getFirstImage(product.images)}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {product.featured && (
          <div className="absolute left-3 top-3 rounded-full bg-blue-500 px-2.5 py-1 text-xs font-medium text-white">
            Featured
          </div>
        )}
      </div>
      <div className="p-4">
        <span className="mb-1.5 inline-block rounded-full bg-neutral-800 px-2.5 py-0.5 text-xs font-medium capitalize text-neutral-400">
          {product.category}
        </span>
        <h3 className="mb-2 line-clamp-1 text-base font-medium text-white transition-colors group-hover:text-blue-400">
          {product.name}
        </h3>
        <p className="text-lg font-semibold text-white">
          {formatPrice(product.price, product.currency)}
        </p>
      </div>
    </Link>
  )
}
