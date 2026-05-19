'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-12 lg:pt-20 pb-20 lg:pb-32">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 mb-6"
            >
              <span className="size-1.5 rounded-full bg-accent animate-pulse" />
              <span className="text-xs font-medium uppercase tracking-wider">Новая коллекция 2026</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-semibold tracking-tighter leading-[0.9] text-balance"
            >
              Шаг в будущее
              <br />
              <span className="text-accent">стиля.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-6 text-lg text-muted-foreground max-w-md leading-relaxed text-pretty"
            >
              Откройте коллекцию культовой обуви от ведущих мировых брендов. Технологии, дизайн и комфорт в каждой паре.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <Link
                href="/products"
                className="group inline-flex items-center gap-2 rounded-full bg-foreground text-background px-7 py-3.5 font-medium hover:bg-accent transition-colors"
              >
                Смотреть каталог
                <ArrowUpRight className="size-4 transition-transform group-hover:rotate-45" />
              </Link>
              <Link
                href="/products?category=Бег"
                className="inline-flex items-center gap-2 rounded-full border border-border px-7 py-3.5 font-medium hover:bg-card transition-colors"
              >
                Беговые модели
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-14 flex items-center gap-8"
            >
              <Stat value="2.4M+" label="Клиентов" />
              <div className="h-10 w-px bg-border" />
              <Stat value="15K+" label="Моделей" />
              <div className="h-10 w-px bg-border" />
              <Stat value="4.9" label="Рейтинг" />
            </motion.div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="relative aspect-square">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="absolute size-[80%] rounded-full bg-accent/20 blur-3xl" />
                <motion.div
                  animate={{
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 40,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                  className="absolute inset-0"
                >
                  <svg viewBox="0 0 400 400" className="w-full h-full opacity-30">
                    <defs>
                      <path
                        id="circle"
                        d="M 200, 200 m -180, 0 a 180,180 0 1,1 360,0 a 180,180 0 1,1 -360,0"
                      />
                    </defs>
                    <text className="font-mono text-[14px] uppercase tracking-[0.3em] fill-foreground">
                      <textPath href="#circle">
                        ShoeStore · Premium Quality · Authentic Footwear · Since 2020 ·
                      </textPath>
                    </text>
                  </svg>
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="relative w-[90%] h-[70%] animate-float">
                  <Image
                    src="/hero-shoe.jpg"
                    alt="Premium running shoe"
                    fill
                    priority
                    className="object-contain drop-shadow-2xl"
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
                className="absolute top-8 left-0 lg:left-4 bg-card border border-border rounded-2xl p-4 shadow-lg max-w-[180px]"
              >
                <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Бестселлер</div>
                <div className="font-semibold text-sm">Velocity Runner</div>
                <div className="text-accent text-sm mt-1 font-semibold tabular-nums">17 010 ₽</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 }}
                className="absolute bottom-8 right-0 lg:right-4 bg-foreground text-background rounded-2xl p-4 shadow-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {['/avatars/user1.jpg', '/avatars/user2.jpg', '/avatars/user3.jpg'].map((src, i) => (
                      <div key={i} className="size-8 rounded-full overflow-hidden border-2 border-foreground relative">
                        <Image src={src} alt="" fill className="object-cover" sizes="32px" />
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="text-xs opacity-70">Купили сегодня</div>
                    <div className="font-semibold text-sm tabular-nums">+ 248 пар</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="text-2xl lg:text-3xl font-semibold tracking-tight tabular-nums">{value}</div>
      <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">{label}</div>
    </div>
  )
}
