'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'

export function PromoBanner() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="relative overflow-hidden rounded-3xl bg-foreground text-background">
        <div className="grid lg:grid-cols-2 gap-8 items-center p-8 lg:p-16 min-h-[400px]">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-xs font-mono uppercase tracking-wider opacity-60">— Эксклюзив</span>
            <h2 className="mt-3 text-4xl lg:text-6xl font-semibold tracking-tighter leading-[0.95] text-balance">
              Лимитированная <span className="text-accent">дроп-серия</span>
            </h2>
            <p className="mt-5 text-lg opacity-70 max-w-md leading-relaxed">
              Эксклюзивные модели в количестве, которое не найти в обычных магазинах. Только для зарегистрированных клиентов.
            </p>
            <Link
              href="/products"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent text-accent-foreground px-7 py-3.5 font-medium hover:bg-background hover:text-foreground transition-colors"
            >
              Узнать первым
              <span>→</span>
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: 20 }}
            whileInView={{ opacity: 1, scale: 1, rotate: -8 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative aspect-square max-w-md mx-auto w-full"
          >
            <div className="absolute inset-0 bg-accent/30 blur-3xl rounded-full" />
            <Image
              src="/shoes/neon-runner.jpg"
              alt="Limited drop"
              fill
              className="object-contain p-6 relative drop-shadow-2xl"
            />
          </motion.div>
        </div>

        <div
          aria-hidden
          className="absolute -bottom-32 -right-12 text-[300px] font-semibold leading-none pointer-events-none text-accent/15 select-none"
        >
          drop
        </div>
      </div>
    </section>
  )
}
