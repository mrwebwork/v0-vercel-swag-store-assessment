'use client'

import { Minus, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface QuantitySelectorProps {
  value: number
  max: number
  onChange: (quantity: number) => void
}

export function QuantitySelector({ value, max, onChange }: QuantitySelectorProps) {
  return (
    <div className="flex items-center gap-4">
      <span className="text-sm font-medium text-zinc-400">Quantity</span>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 border-zinc-700 bg-transparent hover:bg-zinc-800"
          onClick={() => onChange(Math.max(1, value - 1))}
          disabled={value <= 1}
          aria-label="Decrease quantity"
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="w-12 text-center font-medium tabular-nums">{value}</span>
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 border-zinc-700 bg-transparent hover:bg-zinc-800"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          aria-label="Increase quantity"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
