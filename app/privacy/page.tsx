import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Learn how Vercel Swag Store collects, uses, and protects your personal information.',
}

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold tracking-tight text-white">
        Privacy Policy
      </h1>
      
      <div className="prose prose-invert prose-zinc max-w-none">
        <p className="text-zinc-400 leading-relaxed">
          Last updated: March 13, 2026
        </p>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-white mb-4">Information We Collect</h2>
          <p className="text-zinc-400 leading-relaxed">
            When you visit the Vercel Swag Store, we may collect certain information about your device, 
            your interaction with the Store, and information necessary to process your purchases. We may 
            also collect additional information if you contact us for customer support.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-white mb-4">How We Use Your Information</h2>
          <p className="text-zinc-400 leading-relaxed">
            We use the information we collect to fulfill orders, process payments, communicate with you, 
            screen for potential risk or fraud, and provide you with information or advertising relating 
            to our products or services.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-white mb-4">Sharing Your Information</h2>
          <p className="text-zinc-400 leading-relaxed">
            We share your personal information with service providers to help us provide our services and 
            fulfill our contracts with you. We may also share your information to comply with applicable 
            laws and regulations, respond to legal process, or protect our rights.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-white mb-4">Your Rights</h2>
          <p className="text-zinc-400 leading-relaxed">
            Depending on your location, you may have certain rights regarding your personal information, 
            including the right to access, correct, or delete your data. Contact us if you wish to exercise 
            these rights.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-white mb-4">Contact Us</h2>
          <p className="text-zinc-400 leading-relaxed">
            For more information about our privacy practices, or if you have questions, please contact us 
            through our{' '}
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
