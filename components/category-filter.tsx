'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useTransition } from 'react'
import type { Category } from '@/types'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type CategoryFilterProps = {
  categories: Category[]
  defaultValue?: string
}

export default function CategoryFilter({ categories, defaultValue }: CategoryFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value && value !== 'all') {
      params.set('category', value)
    } else {
      params.delete('category')
    }
    startTransition(() => {
      router.push(`/search?${params.toString()}`)
    })
  }

  return (
    <Select
      value={defaultValue || 'all'}
      onValueChange={handleChange}
      disabled={isPending}
    >
      <SelectTrigger className="data-[size=default]:h-11 w-full border-zinc-800 bg-zinc-900 text-white sm:w-[200px] [&>span]:text-left">
        <SelectValue placeholder="All Categories" />
      </SelectTrigger>
      <SelectContent className="border-zinc-800 bg-zinc-900">
        <SelectItem value="all" className="text-white focus:bg-zinc-800 focus:text-white">
          All Categories
        </SelectItem>
        {categories.map((category) => (
          <SelectItem
            key={category.slug}
            value={category.slug}
            className="text-white focus:bg-zinc-800 focus:text-white"
          >
            {category.name} ({category.productCount})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
