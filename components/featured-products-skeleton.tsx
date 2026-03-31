export default function FeaturedProductsSkeleton() {
  // Grid classes must match ProductGrid exactly to prevent CLS
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 lg:grid-cols-3 lg:gap-8">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50"
        >
          <div className="aspect-square animate-pulse bg-zinc-800" />
          <div className="p-4">
            <div className="mb-2 h-4 w-16 animate-pulse rounded-full bg-zinc-800" />
            <div className="mb-2 h-5 w-3/4 animate-pulse rounded bg-zinc-800" />
            <div className="h-6 w-20 animate-pulse rounded bg-zinc-800" />
          </div>
          <div className="px-4 pb-4">
            <div className="h-9 w-full animate-pulse rounded-md bg-zinc-800" />
          </div>
        </div>
      ))}
    </div>
  )
}
