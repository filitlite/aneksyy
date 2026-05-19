'use client'

import { useState, useTransition } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, ShoppingBag, Truck, RotateCcw, ShieldCheck, Star, Minus, Plus } from 'lucide-react'
import { toast } from 'sonner'
import type { Product } from '@/lib/types'
import { formatPrice } from '@/lib/format'
import { addToCart, toggleWishlist } from '@/app/actions'
import { cn } from '@/lib/utils'

export function ProductDetail({
  product,
  inWishlist: initialInWishlist,
  isAuthed,
}: {
  product: Product
  inWishlist: boolean
  isAuthed: boolean
}) {
  const router = useRouter()
  const [size, setSize] = useState<number | null>(product.sizes[0] ?? null)
  const [qty, setQty] = useState(1)
  const [inWishlist, setInWishlist] = useState(initialInWishlist)
  const [isPending, startTransition] = useTransition()

  const onAddToCart = () => {
    if (!isAuthed) {
      toast.error('Войдите, чтобы добавить в корзину')
      router.push('/auth/login')
      return
    }
    if (!size) {
      toast.error('Выберите размер')
      return
    }
    startTransition(async () => {
      const res = await addToCart(product.id, size, qty)
      if (res.error) toast.error('Не удалось добавить')
      else toast.success(`${product.name} добавлен в корзину`)
    })
  }

  const onWishlist = () => {
    if (!isAuthed) {
      toast.error('Войдите, чтобы добавить в избранное')
      router.push('/auth/login')
      return
    }
    setInWishlist((v) => !v)
    startTransition(async () => {
      await toggleWishlist(product.id)
    })
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative aspect-square rounded-3xl bg-card border border-border overflow-hidden"
        >
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-8 opacity-10"
          >
            <svg viewBox="0 0 400 400" className="w-full h-full">
              <defs>
                <path id="pcircle" d="M 200, 200 m -180, 0 a 180,180 0 1,1 360,0 a 180,180 0 1,1 -360,0" />
              </defs>
              <text className="font-mono text-[14px] uppercase tracking-[0.4em] fill-foreground">
                <textPath href="#pcircle">{product.brand} · {product.name} · {product.category} ·</textPath>
              </text>
            </svg>
          </motion.div>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 flex items-center justify-center p-12"
          >
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              priority
              className="object-contain p-12"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </motion.div>
          {product.is_new && (
            <span className="absolute top-5 left-5 bg-accent text-accent-foreground text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full">
              Новинка
            </span>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
            {product.brand} / {product.category}
          </span>
          <h1 className="mt-2 text-4xl lg:text-5xl font-semibold tracking-tighter text-balance">
            {product.name}
          </h1>

          <div className="mt-4 flex items-center gap-3">
            <div className="flex">
              {[1,2,3,4,5].map(i => (
                <Star
                  key={i}
                  className={cn(
                    'size-4',
                    i <= Math.round(product.rating) ? 'fill-accent text-accent' : 'text-border',
                  )}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground tabular-nums">
              {product.rating.toFixed(1)} ({product.reviews_count} отзывов)
            </span>
          </div>

          <div className="mt-6 flex items-baseline gap-3">
            <span className="font-mono text-3xl font-semibold tabular-nums">{formatPrice(product.price)}</span>
            {product.original_price && (
              <span className="font-mono text-xl text-muted-foreground line-through tabular-nums">
                {formatPrice(product.original_price)}
              </span>
            )}
          </div>

          <p className="mt-6 text-muted-foreground leading-relaxed">{product.description}</p>

          {product.colors.length > 0 && (
            <div className="mt-8">
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-3">Цвета</h3>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((c) => (
                  <span key={c} className="px-3 py-1.5 text-sm border border-border rounded-full">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8">
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-3">Размер</h3>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={cn(
                    'aspect-square rounded-xl border font-mono text-sm font-medium transition-all',
                    size === s
                      ? 'bg-foreground text-background border-foreground scale-105'
                      : 'border-border hover:border-foreground',
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 flex items-center gap-4">
            <div className="flex items-center border border-border rounded-full">
              <button
                onClick={() => setQty(q => Math.max(1, q - 1))}
                className="size-12 flex items-center justify-center hover:bg-card rounded-l-full"
                aria-label="Уменьшить"
              >
                <Minus className="size-4" />
              </button>
              <span className="w-10 text-center font-mono tabular-nums">{qty}</span>
              <button
                onClick={() => setQty(q => q + 1)}
                className="size-12 flex items-center justify-center hover:bg-card rounded-r-full"
                aria-label="Увеличить"
              >
                <Plus className="size-4" />
              </button>
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={onAddToCart}
              disabled={isPending}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-foreground text-background px-7 h-12 font-medium hover:bg-accent transition-colors disabled:opacity-60"
            >
              <ShoppingBag className="size-4" />
              {isPending ? 'Добавляем...' : 'В корзину'}
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={onWishlist}
              className={cn(
                'size-12 rounded-full border flex items-center justify-center transition-colors',
                inWishlist
                  ? 'bg-accent text-accent-foreground border-accent'
                  : 'border-border hover:bg-card',
              )}
              aria-label="В избранное"
            >
              <Heart className={cn('size-5', inWishlist && 'fill-current')} />
            </motion.button>
          </div>

          <div className="mt-10 grid grid-cols-3 gap-3">
            <Perk icon={Truck} label="Бесплатная доставка" />
            <Perk icon={RotateCcw} label="30 дней возврат" />
            <Perk icon={ShieldCheck} label="Оригинал" />
          </div>
        </motion.div>
      </div>
    </div>
  )
}

function Perk({ icon: Icon, label }: { icon: any; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-card border border-border text-center">
      <Icon className="size-5" />
      <span className="text-xs leading-tight">{label}</span>
    </div>
  )
}
