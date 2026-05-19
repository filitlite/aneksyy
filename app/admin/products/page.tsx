import { createClient } from '@/lib/supabase/server'
import { formatPrice } from '@/lib/format'
import Link from 'next/link'
import Image from 'next/image'
import type { Product } from '@/lib/types'
import { ProductFormDialog } from '@/components/admin/product-form-dialog'
import { DeleteProductButton } from '@/components/admin/delete-product-button'

export default async function AdminProductsPage() {
  const supabase = await createClient()
  const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false })
  const products = (data ?? []) as Product[]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Товары ({products.length})</h2>
        <ProductFormDialog mode="create" />
      </div>

      <div className="rounded-2xl bg-card border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-background border-b border-border">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Товар</th>
              <th className="text-left px-4 py-3 font-medium">Бренд</th>
              <th className="text-left px-4 py-3 font-medium">Категория</th>
              <th className="text-left px-4 py-3 font-medium">Цена</th>
              <th className="text-left px-4 py-3 font-medium">Остаток</th>
              <th className="text-right px-4 py-3 font-medium">Действия</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="size-12 relative bg-background rounded-lg overflow-hidden flex-none border border-border">
                      <Image src={p.image_url} alt={p.name} fill className="object-contain p-1.5" sizes="48px" />
                    </div>
                    <div>
                      <Link href={`/products/${p.slug}`} className="font-medium hover:text-accent">
                        {p.name}
                      </Link>
                      <div className="text-xs text-muted-foreground font-mono">{p.slug}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{p.brand}</td>
                <td className="px-4 py-3 text-muted-foreground">{p.category}</td>
                <td className="px-4 py-3 font-mono tabular-nums">{formatPrice(Number(p.price))}</td>
                <td className="px-4 py-3 tabular-nums">{p.stock}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 justify-end">
                    <ProductFormDialog mode="edit" product={p} />
                    <DeleteProductButton productId={p.id} productName={p.name} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
