import { createClient } from '@/lib/supabase/server'
import type { Product } from '@/lib/types'
import { Hero } from '@/components/hero'
import { Marquee } from '@/components/marquee'
import { Categories } from '@/components/categories'
import { ProductCard } from '@/components/product-card'
import { Features } from '@/components/features'
import { LimitedDrop } from '@/components/limited-drop'
import { Newsletter } from '@/components/newsletter'
import Link from 'next/link'

export default async function HomePage() {
  const supabase = await createClient()

  const [{ data: featured }, { data: drops }] = await Promise.all([
    supabase
      .from('products')
      .select('*')
      .eq('is_featured', true)
      .eq('is_drop', false)
      .order('created_at', { ascending: false })
      .limit(8),
    supabase
      .from('products')
      .select('*')
      .eq('is_drop', true)
      .order('drop_ends_at', { ascending: true })
      .limit(6),
  ])

  const products = (featured ?? []) as Product[]
  const dropProducts = (drops ?? []) as Product[]

  return (
    <>
      <Hero />
      <Marquee />
      <Categories />

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-end justify-between mb-10 gap-6">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">— 02 / Бестселлеры</span>
            <h2 className="text-4xl lg:text-5xl font-semibold tracking-tighter mt-2 text-balance">
              Хиты <span className="text-accent">сезона</span>
            </h2>
          </div>
          <Link
            href="/products"
            className="hidden md:inline-flex text-sm font-medium underline underline-offset-4 hover:text-accent transition"
          >
            Весь каталог →
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {products.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>

      <LimitedDrop products={dropProducts} />
      <Features />
      <Newsletter />
    </>
  )
}
