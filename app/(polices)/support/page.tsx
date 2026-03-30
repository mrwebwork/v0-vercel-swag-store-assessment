import type { Metadata } from 'next'
import Link from 'next/link'
import { Mail, MessageCircle, FileText } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Support',
  description: 'Get help with your Vercel Swag Store orders, returns, and general inquiries.',
}

export default function SupportPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-4 text-3xl font-bold tracking-tight text-white">
        Support
      </h1>
      <p className="mb-8 text-zinc-400">
        We&apos;re here to help! Find answers to common questions or get in touch with our team.
      </p>

      {/* Support Options */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-800">
            <Mail className="h-6 w-6 text-white" aria-hidden="true" />
          </div>
          <h2 className="mb-2 text-lg font-semibold text-white">Email Support</h2>
          <p className="mb-4 text-sm text-zinc-400">
            Send us an email and we&apos;ll get back to you within 24-48 hours.
          </p>
          <a 
            href="mailto:support@vercel.com" 
            className="text-sm text-white underline hover:text-zinc-300"
          >
            support@vercel.com
          </a>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-800">
            <MessageCircle className="h-6 w-6 text-white" aria-hidden="true" />
          </div>
          <h2 className="mb-2 text-lg font-semibold text-white">FAQ</h2>
          <p className="mb-4 text-sm text-zinc-400">
            Check our frequently asked questions for quick answers.
          </p>
          <span className="text-sm text-zinc-500">Coming soon</span>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-800">
            <FileText className="h-6 w-6 text-white" aria-hidden="true" />
          </div>
          <h2 className="mb-2 text-lg font-semibold text-white">Policies</h2>
          <p className="mb-4 text-sm text-zinc-400">
            Review our privacy policy and terms of service.
          </p>
          <div className="flex flex-col gap-1">
            <Link 
              href="/privacy" 
              className="text-sm text-white underline hover:text-zinc-300"
            >
              Privacy Policy
            </Link>
            <Link 
              href="/terms" 
              className="text-sm text-white underline hover:text-zinc-300"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>

      {/* Common Topics */}
      <section className="mt-12">
        <h2 className="mb-6 text-xl font-semibold text-white">Common Topics</h2>
        <div className="space-y-4">
          <details className="group rounded-lg border border-zinc-800 bg-zinc-900/50">
            <summary className="flex cursor-pointer items-center justify-between p-4 text-white">
              <span>Order Status & Tracking</span>
              <span className="text-zinc-500 group-open:rotate-180 transition-transform">
                &#9662;
              </span>
            </summary>
            <div className="border-t border-zinc-800 p-4 text-sm text-zinc-400">
              Once your order ships, you&apos;ll receive an email with tracking information. 
              Delivery times vary based on your location and shipping method selected.
            </div>
          </details>

          <details className="group rounded-lg border border-zinc-800 bg-zinc-900/50">
            <summary className="flex cursor-pointer items-center justify-between p-4 text-white">
              <span>Returns & Exchanges</span>
              <span className="text-zinc-500 group-open:rotate-180 transition-transform">
                &#9662;
              </span>
            </summary>
            <div className="border-t border-zinc-800 p-4 text-sm text-zinc-400">
              We accept returns within 30 days of delivery for unworn, unwashed items with 
              original tags attached. Contact us to initiate a return.
            </div>
          </details>

          <details className="group rounded-lg border border-zinc-800 bg-zinc-900/50">
            <summary className="flex cursor-pointer items-center justify-between p-4 text-white">
              <span>Shipping Information</span>
              <span className="text-zinc-500 group-open:rotate-180 transition-transform">
                &#9662;
              </span>
            </summary>
            <div className="border-t border-zinc-800 p-4 text-sm text-zinc-400">
              We ship worldwide! Standard shipping typically takes 5-10 business days. 
              Expedited options are available at checkout.
            </div>
          </details>

          <details className="group rounded-lg border border-zinc-800 bg-zinc-900/50">
            <summary className="flex cursor-pointer items-center justify-between p-4 text-white">
              <span>Payment Methods</span>
              <span className="text-zinc-500 group-open:rotate-180 transition-transform">
                &#9662;
              </span>
            </summary>
            <div className="border-t border-zinc-800 p-4 text-sm text-zinc-400">
              We accept all major credit cards, PayPal, and Apple Pay. All transactions 
              are secured and encrypted.
            </div>
          </details>
        </div>
      </section>

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
