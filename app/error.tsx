'use client'

import { useEffect } from 'react'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Optionally log the error to an error reporting service
    console.error('App error:', error)
  }, [error])

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white">Something went wrong</h1>
        <p className="mt-2 text-zinc-400">
          We encountered an unexpected error. Please try again.
        </p>
        {error.digest && (
          <p className="mt-2 text-xs text-zinc-400">
            Error ID: {error.digest}
          </p>
        )}
        <button
          onClick={reset}
          className="mt-8 rounded-lg bg-white px-6 py-3 text-sm font-medium text-black transition-colors hover:bg-zinc-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        >
          Try again
        </button>
      </div>
    </div>
  )
}
