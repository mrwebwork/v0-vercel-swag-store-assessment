export default function FeaturedProductsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900/50"
        >
          <div className="aspect-square animate-pulse bg-neutral-800" />
          <div className="p-4">
            <div className="mb-2 h-4 w-16 animate-pulse rounded-full bg-neutral-800" />
            <div className="mb-2 h-5 w-3/4 animate-pulse rounded bg-neutral-800" />
            <div className="h-6 w-20 animate-pulse rounded bg-neutral-800" />
          </div>
        </div>
      ))}
    </div>
  )
}
