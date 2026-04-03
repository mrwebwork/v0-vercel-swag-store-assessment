import { connection } from 'next/server'
import { fetchPromotion } from '@/lib/api'

export default async function PromoBanner() {
  // never be cached, API returns a random promo each request
  await connection()

  const promotion = await fetchPromotion()

  if (!promotion) {
    return null
  }

  // Valid Date Hanlding
  function formatDate(dateStr: string | undefined | null): string | null {
    if (!dateStr) return null
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return null
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const startDate = formatDate(promotion.validFrom)
  const endDate = formatDate(promotion.validUntil)
  const hasDateRange = startDate && endDate

  return (
    <div className="animate-in fade-in slide-in-from-top-2 duration-300 bg-linear-to-r from-blue-600 via-blue-500 to-cyan-500 py-3">
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
            {hasDateRange && (
              <span className="text-xs text-white/80 sm:text-sm">
                Valid {startDate} - {endDate}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
