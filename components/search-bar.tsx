'use client'

import { useState, useEffect, useTransition, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, X, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

type SearchBarProps = {
  defaultValue?: string
}

export default function SearchBar({ defaultValue = '' }: SearchBarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [value, setValue] = useState(defaultValue)
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null)

  const updateSearch = useCallback((query: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (query && query.length >= 3) {
      params.set('q', query)
    } else {
      params.delete('q')
    }
    startTransition(() => {
      router.push(`/search?${params.toString()}`)
    })
  }, [router, searchParams])

  const handleChange = (newValue: string) => {
    setValue(newValue)
    
    // Clear existing timer
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }

    // If query is >= 3 chars, debounce search
    if (newValue.length >= 3) {
      const timer = setTimeout(() => {
        updateSearch(newValue)
      }, 400)
      setDebounceTimer(timer)
    } else if (newValue.length < 3 && defaultValue && defaultValue.length >= 3) {
      // Was searching, now cleared below threshold
      updateSearch('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (debounceTimer) {
        clearTimeout(debounceTimer)
        setDebounceTimer(null)
      }
      if (value.length >= 3) {
        updateSearch(value)
      }
    }
  }

  const handleSearchClick = () => {
    if (debounceTimer) {
      clearTimeout(debounceTimer)
      setDebounceTimer(null)
    }
    if (value.length >= 3) {
      updateSearch(value)
    }
  }

  const handleClear = () => {
    setValue('')
    if (debounceTimer) {
      clearTimeout(debounceTimer)
      setDebounceTimer(null)
    }
    updateSearch('')
  }

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer)
      }
    }
  }, [debounceTimer])

  // Sync value with URL on navigation
  useEffect(() => {
    setValue(defaultValue)
  }, [defaultValue])

  return (
    <div className="relative flex items-center gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
        <Input
          type="text"
          placeholder="Search products (min 3 characters)..."
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className="h-11 w-full rounded-lg border-zinc-800 bg-zinc-900 pl-10 pr-10 text-white placeholder:text-zinc-500 focus:border-zinc-700 focus:ring-zinc-700"
        />
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-300"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      <Button
        type="button"
        onClick={handleSearchClick}
        disabled={isPending || value.length < 3}
        className="h-11 shrink-0 bg-white px-4 text-black hover:bg-zinc-200 disabled:opacity-50"
      >
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            <Search className="mr-2 h-4 w-4" />
            Search
          </>
        )}
      </Button>
    </div>
  )
}
