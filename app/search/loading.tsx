export default function SearchLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* REAL static text — identical to page.tsx, zero visual shift */}
      <h1 className="mb-2 text-3xl font-bold tracking-tight text-white">
        Shop All Products
      </h1>
      <p className="mb-8 text-zinc-400">
        Browse and search our collection of Vercel merchandise
      </p>

      {/* Search controls — skeleton for the interactive parts only */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex-1">
          <div className="relative flex items-center gap-2">
            <div className="relative flex-1">
              <div className="h-11 w-full rounded-lg border border-zinc-800 bg-zinc-900" />
            </div>
            <div className="h-11 w-[88px] rounded-md bg-zinc-800" />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-11 w-full rounded-md border border-zinc-800 bg-zinc-900 sm:w-[200px]" />
        </div>
      </div>

      {/* Product grid skeleton — this is the ONLY part that should pulse */}
      <div className="mb-4 h-5 w-48 animate-pulse rounded bg-zinc-800" />
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
