export default function SearchLoading() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header Skeleton */}
      <div className="mb-2 h-9 w-64 animate-pulse rounded-lg bg-zinc-800" />
      <div className="mb-8 h-5 w-80 animate-pulse rounded-lg bg-zinc-800" />

      {/* Search Controls Skeleton */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row">
        <div className="flex flex-1 items-center gap-2">
          <div className="h-11 flex-1 animate-pulse rounded-lg bg-zinc-800" />
          <div className="h-11 w-24 animate-pulse rounded-lg bg-zinc-800" />
        </div>
        <div className="h-11 w-full animate-pulse rounded-lg bg-zinc-800 sm:w-[200px]" />
      </div>

      {/* Product Grid Skeleton */}
      <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50"
          >
            <div className="aspect-square animate-pulse bg-zinc-800" />
            <div className="p-4">
              <div className="mb-2 h-4 w-16 animate-pulse rounded-full bg-zinc-800" />
              <div className="mb-2 h-5 w-full animate-pulse rounded bg-zinc-800" />
              <div className="h-6 w-20 animate-pulse rounded bg-zinc-800" />
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
