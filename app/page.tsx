import { Suspense } from 'react'
import HeroSection from '@/components/hero-section'
import PromoBanner from '@/components/promo-banner'
import PromoBannerSkeleton from '@/components/promo-banner-skeleton'
import FeaturedProducts from '@/components/featured-products'
import FeaturedProductsSkeleton from '@/components/featured-products-skeleton'
export const metadata = {
  description: 'Shop the official Vercel Swag Store for premium developer apparel and accessories.',
  openGraph: {
    title: 'Vercel Swag Store',
    description: 'Official Vercel merchandise - premium developer swag',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Vercel Swag Store - Premium developer merchandise',
      },
    ],
  },
}

export default function HomePage() {
  return (
    <>
      <Suspense fallback={<PromoBannerSkeleton />}>
        <PromoBanner />
      </Suspense>
      <HeroSection />
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
        <h2 className="mb-8 text-2xl font-bold text-white md:text-3xl">
          Featured Products
        </h2>
        <Suspense fallback={<FeaturedProductsSkeleton />}>
          <FeaturedProducts />
        </Suspense>
      </section>
    </>
  )
}
