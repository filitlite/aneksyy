import { createClient } from '@/lib/supabase/server'
import type { Product } from '@/lib/types'
import { ProductCard } from '@/components/product-card'
import { ProductFilters } from '@/components/product-filters'

type SearchParams = { [key: string]: string | string[] | undefined }

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const category = typeof params.category === 'string' ? params.category : undefined
  const sort = typeof params.sort === 'string' ? params.sort : 'newest'
  const search = typeof params.search === 'string' ? params.search : undefined

  const supabase = await createClient()
  let query = supabase.from('products').select('*')

  if (category) query = query.eq('category', category)
  if (search) query = query.ilike('name', `%${search}%`)

  if (sort === 'price-asc') query = query.order('price', { ascending: true })
  else if (sort === 'price-desc') query = query.order('price', { ascending: false })
  else if (sort === 'rating') query = query.order('rating', { ascending: false })
  else query = query.order('created_at', { ascending: false })

  const { data } = await query
  const products = (data ?? []) as Product[]

  const { data: allCats } = await supabase.from('products').select('category')
  const categories = Array.from(new Set((allCats ?? []).map((c: any) => c.category)))

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">— Каталог</span>
        <h1 className="mt-2 text-4xl lg:text-6xl font-semibold tracking-tighter text-balance">
          {category ? <>Категория: <span className="text-accent">{category}</span></> : <>Вся <span className="text-accent">обувь</span></>}
        </h1>
        <p className="mt-3 text-muted-foreground">
          Найдено товаров: <span className="font-mono tabular-nums">{products.length}</span>
        </p>
      </div>

      <ProductFilters categories={categories} currentCategory={category} currentSort={sort} />

      {products.length === 0 ? (
        <div className="text-center py-24 text-muted-foreground">
          Ничего не найдено. Попробуйте изменить фильтры.
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mt-8">
          {products.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      )}
    </div>
  )
}
