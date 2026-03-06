export default function PromoBannerSkeleton() {
  return (
    <div className="bg-gradient-to-r from-blue-600/50 via-blue-500/50 to-cyan-500/50 py-3">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-4">
          <div className="h-5 w-32 animate-pulse rounded bg-white/20" />
          <div className="h-6 w-20 animate-pulse rounded-full bg-white/20" />
          <div className="h-6 w-24 animate-pulse rounded bg-white/20" />
          <div className="hidden h-4 w-28 animate-pulse rounded bg-white/20 sm:block" />
        </div>
      </div>
    </div>
  )
}
