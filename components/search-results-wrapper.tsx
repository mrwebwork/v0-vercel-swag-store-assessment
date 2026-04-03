'use client'

import { Suspense, useEffect, useState, useTransition } from 'react'
import { useSearchParams } from 'next/navigation'

interface SearchResultsWrapperProps {
  children: React.ReactNode
  fallback: React.ReactNode
}

/**
 * Client wrapper that dims the product grid during search param changes.
 * Uses a key based on searchParams to trigger Suspense re-suspension,
 * and shows a dimmed state on the current content while new data loads.
 */
export function SearchResultsWrapper({ children, fallback }: SearchResultsWrapperProps) {
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [currentKey, setCurrentKey] = useState(searchParams.toString())

  // Track param changes and trigger transition
  useEffect(() => {
    const newKey = searchParams.toString()
    if (newKey !== currentKey) {
      startTransition(() => {
        setCurrentKey(newKey)
      })
    }
  }, [searchParams, currentKey])

  return (
    <div
      className={`transition-opacity duration-200 ${
        isPending ? 'pointer-events-none opacity-50' : 'opacity-100'
      }`}
    >
      <Suspense key={currentKey} fallback={fallback}>
        {children}
      </Suspense>
    </div>
  )
}
