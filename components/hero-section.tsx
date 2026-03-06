import Link from 'next/link'

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-black py-24 md:py-32">
      {/* Background gradient elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-1/4 -top-1/4 h-96 w-96 rounded-full bg-gradient-to-br from-blue-600/20 to-transparent blur-3xl" />
        <div className="absolute -bottom-1/4 -right-1/4 h-96 w-96 rounded-full bg-gradient-to-tl from-purple-600/20 to-transparent blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-cyan-500/10 to-blue-500/10 blur-2xl" />
      </div>

      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '64px 64px',
        }}
      />

      <div className="container relative mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-900/50 px-4 py-2 text-sm text-neutral-400 backdrop-blur-sm">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            New arrivals available
          </div>

          {/* Headline */}
          <h1 className="mb-6 text-balance text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
            The Official{' '}
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Vercel
            </span>{' '}
            Swag Store
          </h1>

          {/* Subheadline */}
          <p className="mb-10 text-pretty text-lg text-neutral-400 md:text-xl">
            Gear up with the best developer swag on the internet. Premium quality apparel and accessories for the modern developer.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/search"
              className="inline-flex h-12 items-center justify-center rounded-full bg-white px-8 text-base font-medium text-black transition-all hover:bg-neutral-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
            >
              Shop Now
            </Link>
            <Link
              href="/search?featured=true"
              className="inline-flex h-12 items-center justify-center rounded-full border border-neutral-700 bg-transparent px-8 text-base font-medium text-white transition-all hover:bg-neutral-900 hover:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2 focus:ring-offset-black"
            >
              View Featured
            </Link>
          </div>
        </div>

        {/* Decorative geometric shapes */}
        <div className="pointer-events-none absolute -right-8 top-1/4 hidden lg:block">
          <div className="h-32 w-32 rotate-12 rounded-2xl border border-neutral-800 bg-gradient-to-br from-neutral-900 to-transparent" />
        </div>
        <div className="pointer-events-none absolute -left-8 bottom-1/4 hidden lg:block">
          <div className="h-24 w-24 -rotate-12 rounded-xl border border-neutral-800 bg-gradient-to-tl from-neutral-900 to-transparent" />
        </div>
      </div>
    </section>
  )
}
