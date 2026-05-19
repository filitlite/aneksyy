'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight, Flame, Timer } from 'lucide-react'
import type { Product } from '@/lib/types'
import { formatPrice } from '@/lib/format'
import { useEffect, useState } from 'react'

function useCountdown(target?: string | null) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    if (!target) return
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [target])

  if (!target) return null
  const diff = Math.max(0, new Date(target).getTime() - now)
  const d = Math.floor(diff / 86400000)
  const h = Math.floor((diff % 86400000) / 3600000)
  const m = Math.floor((diff % 3600000) / 60000)
  const s = Math.floor((diff % 60000) / 1000)
  return { d, h, m, s }
}

export function LimitedDrop({ products }: { products: Product[] }) {
  if (!products.length) return null

  const hero = products[0]
  const sidekicks = products.slice(1, 3)

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
      <div className="relative overflow-hidden rounded-3xl bg-foreground text-background">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center p-6 sm:p-10 lg:p-16 min-h-[560px]">
          {/* LEFT — copy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 relative z-10"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-background/20 bg-background/5 px-3 py-1.5 mb-6 backdrop-blur-sm">
              <span className="size-1.5 rounded-full bg-accent animate-pulse" />
              <span className="text-xs font-medium uppercase tracking-wider">— Эксклюзив</span>
            </div>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-semibold tracking-tighter leading-[0.95] text-balance">
              Лимитированная
              <br />
              <span className="text-accent">дроп-серия</span>
            </h2>

            <p className="mt-5 text-base lg:text-lg opacity-70 max-w-md leading-relaxed text-pretty">
              Эксклюзивные модели в количестве, которое не найти в обычных магазинах. Только для зарегистрированных клиентов.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href={`/products/${hero.slug}`}
                className="group inline-flex items-center gap-2 rounded-full bg-accent text-accent-foreground px-7 py-3.5 font-medium hover:bg-background hover:text-foreground transition-colors"
              >
                Узнать первым
                <ArrowUpRight className="size-4 transition-transform group-hover:rotate-45" />
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-full border border-background/20 px-7 py-3.5 font-medium hover:bg-background/10 transition-colors"
              >
                Весь дроп
              </Link>
            </div>

            <DropStats products={products} />
          </motion.div>

          {/* RIGHT — animated showcase */}
          <div className="lg:col-span-7 relative">
            <div className="relative aspect-square max-w-xl mx-auto">
              {/* spinning circular text */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="absolute size-[80%] rounded-full bg-accent/30 blur-3xl" />
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 36, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-0"
                >
                  <svg viewBox="0 0 400 400" className="w-full h-full opacity-40">
                    <defs>
                      <path
                        id="drop-circle"
                        d="M 200, 200 m -180, 0 a 180,180 0 1,1 360,0 a 180,180 0 1,1 -360,0"
                      />
                    </defs>
                    <text className="font-mono text-[14px] uppercase tracking-[0.3em] fill-background">
                      <textPath href="#drop-circle">
                        Limited Drop · Authentic · Numbered Pairs · Capsule Series ·
                      </textPath>
                    </text>
                  </svg>
                </motion.div>
              </motion.div>

              {/* floating shoe image */}
              <motion.div
                initial={{ opacity: 0, y: 40, rotate: 20 }}
                whileInView={{ opacity: 1, y: 0, rotate: -8 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, ease: 'easeOut' }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="relative w-[88%] h-[70%] animate-float">
                  <Image
                    src={hero.image_url}
                    alt={hero.name}
                    fill
                    className="object-contain drop-shadow-2xl"
                    sizes="(max-width: 1024px) 80vw, 40vw"
                  />
                </div>
              </motion.div>

              {/* TOP-LEFT floating card — styled like the hero "Бестселлер" card */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
                className="absolute top-4 left-0 lg:left-2 bg-card text-foreground border border-border rounded-2xl p-4 shadow-2xl max-w-[200px]"
              >
                <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-muted-foreground mb-1">
                  <Flame className="size-3 fill-accent text-accent" />
                  Дроп · {hero.brand}
                </div>
                <div className="font-semibold text-sm leading-snug">{hero.name}</div>
                <div className="text-accent text-sm mt-1 font-semibold tabular-nums">
                  {formatPrice(hero.price)}
                </div>
                {hero.original_price ? (
                  <div className="text-[10px] text-muted-foreground line-through tabular-nums">
                    {formatPrice(hero.original_price)}
                  </div>
                ) : null}
              </motion.div>

              {/* BOTTOM-RIGHT — countdown / sold pairs card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.85 }}
                className="absolute bottom-4 right-0 lg:right-2 bg-background text-foreground border border-border rounded-2xl p-4 shadow-2xl"
              >
                <CountdownCard product={hero} />
              </motion.div>

              {/* SIDEKICK chips on the side */}
              {sidekicks.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1 + i * 0.15 }}
                  className={
                    i === 0
                      ? 'hidden md:flex absolute top-1/2 -translate-y-12 right-0 lg:right-2 items-center gap-2 bg-background/95 text-foreground border border-border rounded-full pl-1 pr-3 py-1 shadow-xl'
                      : 'hidden md:flex absolute top-1/2 translate-y-16 left-0 lg:left-2 items-center gap-2 bg-background/95 text-foreground border border-border rounded-full pl-1 pr-3 py-1 shadow-xl'
                  }
                >
                  <span className="relative size-8 rounded-full overflow-hidden bg-card">
                    <Image src={p.image_url} alt={p.name} fill className="object-contain p-1" sizes="32px" />
                  </span>
                  <span className="text-xs font-semibold tracking-tight max-w-[110px] truncate">
                    {p.name}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Big watermark */}
        <div
          aria-hidden
          className="absolute -bottom-24 -right-8 text-[260px] sm:text-[320px] font-semibold leading-none pointer-events-none text-accent/15 select-none"
        >
          drop
        </div>
      </div>
    </section>
  )
}

function CountdownCard({ product }: { product: Product }) {
  const c = useCountdown(product.drop_ends_at ?? null)
  const sold = product.drop_sold ?? 0
  const total = product.drop_total ?? 0
  const pct = total > 0 ? Math.min(100, Math.round((sold / total) * 100)) : 0

  return (
    <div className="min-w-[200px]">
      <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-muted-foreground mb-1.5">
        <Timer className="size-3 text-accent" />
        До конца дропа
      </div>
      {c ? (
        <div className="flex items-baseline gap-1 font-semibold tabular-nums">
          <TimeBlock value={c.d} label="д" />
          <span className="text-muted-foreground/60">:</span>
          <TimeBlock value={c.h} label="ч" />
          <span className="text-muted-foreground/60">:</span>
          <TimeBlock value={c.m} label="м" />
          <span className="text-muted-foreground/60">:</span>
          <TimeBlock value={c.s} label="с" />
        </div>
      ) : (
        <div className="text-sm font-semibold">Идёт продажа</div>
      )}
      {total > 0 && (
        <div className="mt-3">
          <div className="h-1.5 rounded-full bg-border overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${pct}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full bg-accent rounded-full"
            />
          </div>
          <div className="mt-1.5 flex items-center justify-between text-[10px] uppercase tracking-wider text-muted-foreground tabular-nums">
            <span>Продано {sold} / {total}</span>
            <span className="text-accent font-semibold">{pct}%</span>
          </div>
        </div>
      )}
    </div>
  )
}

function TimeBlock({ value, label }: { value: number; label: string }) {
  return (
    <span className="inline-flex items-baseline gap-0.5">
      <span className="text-base font-semibold">{String(value).padStart(2, '0')}</span>
      <span className="text-[10px] text-muted-foreground uppercase">{label}</span>
    </span>
  )
}

function DropStats({ products }: { products: Product[] }) {
  const totalPairs = products.reduce((s, p) => s + (p.drop_total ?? 0), 0)
  const sold = products.reduce((s, p) => s + (p.drop_sold ?? 0), 0)
  const remaining = Math.max(0, totalPairs - sold)
  return (
    <div className="mt-10 flex items-center gap-8">
      <DropStat value={products.length.toString()} label="Моделей" />
      <div className="h-10 w-px bg-background/15" />
      <DropStat value={remaining.toLocaleString('ru-RU')} label="Пар осталось" />
      <div className="h-10 w-px bg-background/15" />
      <DropStat value={`${Math.min(99, Math.round((sold / Math.max(1, totalPairs)) * 100))}%`} label="Раскуплено" />
    </div>
  )
}

function DropStat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="text-2xl lg:text-3xl font-semibold tracking-tight tabular-nums">{value}</div>
      <div className="text-xs opacity-60 uppercase tracking-wider mt-1">{label}</div>
    </div>
  )
}
