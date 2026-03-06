export default function HomeLoading() {
  return (
    <main>
      {/* Hero Skeleton */}
      <div className="relative overflow-hidden bg-zinc-950 py-24 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <div className="mx-auto h-6 w-48 animate-pulse rounded bg-zinc-800" />
          <div className="mx-auto mt-6 h-12 w-96 max-w-full animate-pulse rounded bg-zinc-800" />
          <div className="mx-auto mt-4 h-6 w-72 max-w-full animate-pulse rounded bg-zinc-800" />
          <div className="mt-8 flex justify-center gap-4">
            <div className="h-12 w-32 animate-pulse rounded-lg bg-zinc-800" />
            <div className="h-12 w-32 animate-pulse rounded-lg bg-zinc-800" />
          </div>
        </div>
      </div>

      {/* Promo Banner Skeleton */}
      <div className="animate-pulse bg-zinc-900 py-3 text-center">
        <div className="mx-auto h-5 w-64 rounded bg-zinc-800" />
      </div>

      {/* Featured Products Section Skeleton */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="mb-8 h-8 w-48 animate-pulse rounded bg-zinc-800" />
        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-xl bg-zinc-900">
              <div className="aspect-square animate-pulse bg-zinc-800" />
              <div className="p-4">
                <div className="h-5 w-3/4 animate-pulse rounded bg-zinc-800" />
                <div className="mt-2 h-4 w-1/2 animate-pulse rounded bg-zinc-800" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
