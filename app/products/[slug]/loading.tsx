export default function ProductLoading() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Breadcrumb Skeleton */}
      <nav className="mb-8" aria-label="Loading breadcrumb">
        <div className="flex items-center gap-2">
          <div className="h-4 w-12 animate-pulse rounded bg-zinc-800" />
          <span className="text-zinc-600">/</span>
          <div className="h-4 w-10 animate-pulse rounded bg-zinc-800" />
          <span className="text-zinc-600">/</span>
          <div className="h-4 w-24 animate-pulse rounded bg-zinc-800" />
        </div>
      </nav>

      <div className="grid gap-12 lg:grid-cols-2">
        {/* Image Skeleton */}
        <div className="aspect-square animate-pulse overflow-hidden rounded-xl bg-zinc-800" />

        {/* Content Skeleton */}
        <div className="flex flex-col gap-6">
          {/* Category */}
          <div>
            <div className="h-4 w-20 animate-pulse rounded bg-zinc-800" />
            <div className="mt-2 h-9 w-3/4 animate-pulse rounded bg-zinc-800" />
            <div className="mt-2 h-8 w-24 animate-pulse rounded bg-zinc-800" />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <div className="h-4 w-full animate-pulse rounded bg-zinc-800" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-zinc-800" />
            <div className="h-4 w-4/6 animate-pulse rounded bg-zinc-800" />
          </div>

          {/* Stock Indicator */}
          <div className="h-8 w-28 animate-pulse rounded-full bg-zinc-800" />

          {/* Actions */}
          <div className="space-y-4">
            <div className="h-10 w-32 animate-pulse rounded-lg bg-zinc-800" />
            <div className="h-12 w-full animate-pulse rounded-lg bg-zinc-800" />
          </div>

          {/* Tags */}
          <div className="mt-4">
            <div className="mb-3 h-4 w-10 animate-pulse rounded bg-zinc-800" />
            <div className="flex gap-2">
              <div className="h-7 w-16 animate-pulse rounded-full bg-zinc-800" />
              <div className="h-7 w-20 animate-pulse rounded-full bg-zinc-800" />
              <div className="h-7 w-14 animate-pulse rounded-full bg-zinc-800" />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
