'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowUpRight, Star } from 'lucide-react'
import type { Product } from '@/lib/types'
import { formatPrice } from '@/lib/format'

const COLOR_MAP: Record<string, string> = {
  'Оранжевый': 'oklch(0.7 0.18 45)',
  'Белый': 'oklch(0.98 0 0)',
  'Чёрный': 'oklch(0.2 0 0)',
  'Кремовый': 'oklch(0.94 0.04 80)',
  'Синий': 'oklch(0.45 0.12 250)',
  'Красный': 'oklch(0.55 0.22 25)',
  'Серый': 'oklch(0.65 0.01 60)',
  'Бежевый': 'oklch(0.82 0.04 80)',
  'Коричневый': 'oklch(0.45 0.08 60)',
  'Зелёный': 'oklch(0.7 0.18 140)',
  'Оливковый': 'oklch(0.55 0.08 110)',
}

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.06 }}
      className="group relative"
    >
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-square rounded-3xl bg-card overflow-hidden mb-4 border border-border transition-all duration-500 group-hover:shadow-2xl group-hover:border-foreground/20">
          {/* Animated gradient circle backdrop */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="size-[70%] rounded-full bg-accent/0 group-hover:bg-accent/15 transition-all duration-700 group-hover:scale-110" />
          </div>

          {/* Big brand watermark */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center pointer-events-none select-none">
            <span className="text-[64px] sm:text-[80px] font-bold tracking-tighter text-foreground/[0.04] uppercase leading-none">
              {product.brand}
            </span>
          </div>

          {/* Badges */}
          <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5">
            {product.is_new && (
              <span className="bg-accent text-accent-foreground text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                Новинка
              </span>
            )}
            {product.original_price && (
              <span className="bg-foreground text-background text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                −{Math.round((1 - product.price / product.original_price) * 100)}%
              </span>
            )}
          </div>

          {/* Rating chip */}
          <div className="absolute top-3 right-3 z-20 flex items-center gap-1 bg-background/90 backdrop-blur-sm border border-border rounded-full px-2 py-1">
            <Star className="size-3 fill-accent text-accent" />
            <span className="text-[11px] font-semibold tabular-nums">{product.rating.toFixed(1)}</span>
          </div>

          {/* Shoe image with playful hover transform */}
          <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-110 group-hover:-rotate-6">
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-contain p-8"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          </div>

          {/* Hover CTA */}
          <div className="absolute bottom-3 right-3 z-20 size-11 rounded-full bg-foreground text-background flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
            <ArrowUpRight className="size-5 transition-transform group-hover:rotate-45" />
          </div>

          {/* Hover label */}
          <div className="absolute bottom-3 left-3 z-20 bg-foreground text-background text-xs font-medium uppercase tracking-wider px-3 py-2 rounded-full opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
            Смотреть
          </div>
        </div>

        <div className="space-y-1.5 px-1">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
              {product.brand}
            </span>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
              {product.category}
            </span>
          </div>
          <h3 className="font-semibold tracking-tight text-balance group-hover:text-accent transition-colors leading-snug">
            {product.name}
          </h3>
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-baseline gap-2">
              <span className="font-semibold tabular-nums">{formatPrice(product.price)}</span>
              {product.original_price && (
                <span className="text-xs text-muted-foreground line-through tabular-nums">
                  {formatPrice(product.original_price)}
                </span>
              )}
            </div>
            {product.colors && product.colors.length > 0 && (
              <div className="flex items-center -space-x-1">
                {product.colors.slice(0, 3).map((c) => (
                  <span
                    key={c}
                    className="size-3.5 rounded-full ring-2 ring-background border border-border"
                    style={{ background: COLOR_MAP[c] ?? 'oklch(0.7 0.05 60)' }}
                    title={c}
                  />
                ))}
                {product.colors.length > 3 && (
                  <span className="ml-2 text-[10px] text-muted-foreground tabular-nums">
                    +{product.colors.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
