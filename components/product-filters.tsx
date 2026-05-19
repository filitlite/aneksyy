'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

const SORTS = [
  { value: 'newest', label: 'Сначала новинки' },
  { value: 'price-asc', label: 'Сначала дешёвые' },
  { value: 'price-desc', label: 'Сначала дорогие' },
  { value: 'rating', label: 'По рейтингу' },
]

export function ProductFilters({
  categories,
  currentCategory,
  currentSort,
}: {
  categories: string[]
  currentCategory?: string
  currentSort: string
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const setParam = (key: string, value?: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex flex-col gap-4 mb-2">
      <div className="flex flex-wrap gap-2">
        <Chip
          active={!currentCategory}
          onClick={() => setParam('category')}
          label="Все"
        />
        {categories.map((c) => (
          <Chip
            key={c}
            active={currentCategory === c}
            onClick={() => setParam('category', c)}
            label={c}
          />
        ))}
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm text-muted-foreground">Сортировка:</span>
        {SORTS.map((s) => (
          <button
            key={s.value}
            onClick={() => setParam('sort', s.value)}
            className={cn(
              'text-sm px-3 py-1 rounded-full border transition-colors',
              currentSort === s.value
                ? 'bg-foreground text-background border-foreground'
                : 'border-border hover:bg-card',
            )}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  )
}

function Chip({
  active,
  onClick,
  label,
}: {
  active: boolean
  onClick: () => void
  label: string
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className={cn(
        'relative px-4 py-2 rounded-full text-sm font-medium border transition-colors',
        active
          ? 'bg-accent text-accent-foreground border-accent'
          : 'border-border hover:bg-card',
      )}
    >
      {label}
    </motion.button>
  )
}
