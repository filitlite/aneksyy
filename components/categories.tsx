'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'

const CATEGORIES = [
  { name: 'Бег', image: '/shoes/runner-orange.jpg', accent: 'bg-accent/10' },
  { name: 'Повседневные', image: '/shoes/classic-white.jpg', accent: 'bg-foreground/5' },
  { name: 'Баскетбол', image: '/shoes/black-hightop.jpg', accent: 'bg-foreground/10' },
  { name: 'Ботинки', image: '/shoes/leather-boot.jpg', accent: 'bg-accent/15' },
]

export function Categories() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
      <div className="flex items-end justify-between mb-12 gap-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">— 01 / Категории</span>
          <h2 className="text-4xl lg:text-5xl font-semibold tracking-tighter mt-2 text-balance">
            Найди свой <span className="text-accent">ритм</span>
          </h2>
        </div>
        <Link href="/products" className="hidden md:inline-flex text-sm font-medium underline underline-offset-4 hover:text-accent transition">
          Все категории
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {CATEGORIES.map((cat, i) => (
          <motion.div
            key={cat.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <Link
              href={`/products?category=${encodeURIComponent(cat.name)}`}
              className={`group relative block aspect-[4/5] rounded-2xl overflow-hidden ${cat.accent} border border-border transition-shadow hover:shadow-lg`}
            >
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                className="object-contain p-6 transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              <div className="absolute inset-x-0 bottom-0 p-5 flex items-end justify-between">
                <h3 className="text-xl font-semibold tracking-tight">{cat.name}</h3>
                <span className="size-10 rounded-full bg-foreground text-background flex items-center justify-center text-lg group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                  →
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
