import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import type { Product } from '@/lib/types'
import { ProductDetail } from '@/components/product-detail'
import { ProductCard } from '@/components/product-card'

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .maybeSingle()

  if (!product) notFound()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  let inWishlist = false
  if (user) {
    const { data } = await supabase
      .from('wishlist_items')
      .select('id')
      .eq('user_id', user.id)
      .eq('product_id', product.id)
      .maybeSingle()
    inWishlist = !!data
  }

  const { data: related } = await supabase
    .from('products')
    .select('*')
    .eq('category', product.category)
    .neq('id', product.id)
    .limit(4)

  return (
    <>
      <ProductDetail
        product={product as Product}
        inWishlist={inWishlist}
        isAuthed={!!user}
      />
      {related && related.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl lg:text-4xl font-semibold tracking-tighter mb-8">
            Похожие <span className="text-accent">модели</span>
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {(related as Product[]).map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}
    </>
  )
}
