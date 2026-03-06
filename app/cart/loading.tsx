export default function CartLoading() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 h-9 w-40 animate-pulse rounded bg-zinc-800" />
      
      {/* Cart Items Skeleton */}
      <div className="divide-y divide-zinc-800 rounded-lg border border-zinc-800 bg-zinc-900">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex gap-4 p-4">
            {/* Image */}
            <div className="h-24 w-24 shrink-0 animate-pulse rounded-md bg-zinc-800" />
            
            {/* Details */}
            <div className="flex flex-1 flex-col justify-between">
              <div>
                <div className="h-5 w-32 animate-pulse rounded bg-zinc-800" />
                <div className="mt-2 h-4 w-16 animate-pulse rounded bg-zinc-800" />
              </div>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 animate-pulse rounded bg-zinc-800" />
                <div className="h-5 w-8 animate-pulse rounded bg-zinc-800" />
                <div className="h-8 w-8 animate-pulse rounded bg-zinc-800" />
              </div>
            </div>
            
            {/* Price */}
            <div className="h-5 w-16 animate-pulse rounded bg-zinc-800" />
          </div>
        ))}
      </div>

      {/* Summary Skeleton */}
      <div className="mt-6 rounded-lg border border-zinc-800 bg-zinc-900 p-6">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div className="h-5 w-16 animate-pulse rounded bg-zinc-800" />
          <div className="h-6 w-20 animate-pulse rounded bg-zinc-800" />
        </div>
        <div className="mt-4 h-4 w-48 animate-pulse rounded bg-zinc-800" />
        <div className="mt-6 h-12 w-full animate-pulse rounded-lg bg-zinc-800" />
      </div>
    </div>
  )
}
