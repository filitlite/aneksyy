import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ProductCard } from '@/components/product-card'
import type { Product } from '@/lib/types'

export default async function WishlistPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login?next=/wishlist')

  const { data } = await supabase
    .from('wishlist_items')
    .select('id, products(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const products = ((data ?? []) as any[]).map((d) => d.products as Product)

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">— Избранное</span>
        <h1 className="mt-2 text-4xl lg:text-5xl font-semibold tracking-tighter">
          Твои <span className="text-accent">фавориты</span>
        </h1>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-muted-foreground">Пока ничего не добавлено</p>
          <Link
            href="/products"
            className="mt-6 inline-flex rounded-full bg-foreground text-background px-7 py-3.5 font-medium hover:bg-accent transition-colors"
          >
            В каталог
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {products.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      )}
    </div>
  )
}
