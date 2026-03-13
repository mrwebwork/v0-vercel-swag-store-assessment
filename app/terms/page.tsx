import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Read the terms and conditions for using the Vercel Swag Store.',
}

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold tracking-tight text-white">
        Terms of Service
      </h1>
      
      <div className="prose prose-invert prose-zinc max-w-none">
        <p className="text-zinc-400 leading-relaxed">
          Last updated: March 13, 2026
        </p>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-white mb-4">Overview</h2>
          <p className="text-zinc-400 leading-relaxed">
            This website is operated by Vercel Swag Store. Throughout the site, the terms &ldquo;we&rdquo;, 
            &ldquo;us&rdquo; and &ldquo;our&rdquo; refer to Vercel Swag Store. By visiting our site and/or 
            purchasing something from us, you engage in our &ldquo;Service&rdquo; and agree to be bound by 
            these terms and conditions.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-white mb-4">Online Store Terms</h2>
          <p className="text-zinc-400 leading-relaxed">
            By agreeing to these Terms of Service, you represent that you are at least the age of majority 
            in your state or province of residence, and you have given us your consent to allow any of your 
            minor dependents to use this site.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-white mb-4">Products and Services</h2>
          <p className="text-zinc-400 leading-relaxed">
            Certain products or services may be available exclusively online through the website. These 
            products or services may have limited quantities and are subject to return or exchange only 
            according to our Return Policy.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-white mb-4">Accuracy of Information</h2>
          <p className="text-zinc-400 leading-relaxed">
            We are not responsible if information made available on this site is not accurate, complete, 
            or current. The material on this site is provided for general information only and should not 
            be relied upon without first confirming with primary, more accurate sources.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-white mb-4">Modifications</h2>
          <p className="text-zinc-400 leading-relaxed">
            We reserve the right to modify the contents of this site at any time, but we have no obligation 
            to update any information on our site. You agree that it is your responsibility to monitor 
            changes to our site.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-white mb-4">Contact Information</h2>
          <p className="text-zinc-400 leading-relaxed">
            Questions about the Terms of Service should be sent to us via our{' '}
            <Link href="/support" className="text-white underline hover:text-zinc-300">
              Support page
            </Link>
            .
          </p>
        </section>
      </div>

      <div className="mt-12 border-t border-zinc-800 pt-8">
        <Link 
          href="/" 
          className="text-sm text-zinc-400 hover:text-white transition-colors"
        >
          &larr; Back to Store
        </Link>
      </div>
    </div>
  )
}
