export default function SearchLoading() {
  // Simplified skeleton - only shows product grid since the static shell
  // (heading, search bar, category filter) renders instantly
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header - static shell renders this instantly, but we include placeholders
          for route transitions where loading.tsx is shown */}
      <div className="mb-2 h-9 w-64 animate-pulse rounded-lg bg-zinc-800" />
      <div className="mb-8 h-5 w-80 animate-pulse rounded-lg bg-zinc-800" />

      {/* Search Controls - minimal skeleton */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row">
        <div className="flex flex-1 items-center gap-2">
          <div className="h-11 flex-1 animate-pulse rounded-lg bg-zinc-800" />
          <div className="h-11 w-24 animate-pulse rounded-lg bg-zinc-800" />
        </div>
        <div className="h-11 w-full animate-pulse rounded-lg bg-zinc-800 sm:w-[200px]" />
      </div>

      {/* Results info skeleton */}
      <div className="mb-4 h-5 w-48 animate-pulse rounded bg-zinc-800" />

      {/* Product Grid Skeleton - matches SearchResults grid exactly */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 12 }).map((_, i) => (
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
            <div className="px-4 pb-4">
              <div className="h-9 w-full animate-pulse rounded-md bg-zinc-800" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
