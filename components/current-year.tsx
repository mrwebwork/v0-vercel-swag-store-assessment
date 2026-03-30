'use client'

import { useEffect, useState } from 'react'

export function CurrentYear() {
  //* Prevents SSR hydration mismatches
  const [year, setYear] = useState<number | null>(null)

  useEffect(() => {
    setYear(new Date().getFullYear())
  }, [])

  //? empty/fallback during server render, update on client mount
  // if (!year) return <span>2026</span>

  return <span>{year}</span>
}