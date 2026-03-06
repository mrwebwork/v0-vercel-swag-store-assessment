import { unstable_noStore as noStore } from 'next/cache'
import { fetchPromotion } from '@/lib/api'

export default async function PromoBanner() {
  // This must never be cached - the API returns a random promo each time
  noStore()

  const promotion = await fetchPromotion()

  if (!promotion) {
    return null
  }

  const validFrom = new Date(promotion.validFrom).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
  const validUntil = new Date(promotion.validUntil).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })

  return (
    <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 py-3">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center gap-2 text-center sm:flex-row sm:gap-4">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-white sm:text-base">
              {promotion.title}
            </span>
            <span className="rounded-full bg-white/20 px-3 py-1 text-sm font-bold text-white backdrop-blur-sm">
              {promotion.discountPercent}% OFF
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-md bg-black/20 px-3 py-1 font-mono text-sm font-semibold text-white">
              {promotion.code}
            </span>
            <span className="text-xs text-white/80 sm:text-sm">
              Valid {validFrom} - {validUntil}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
