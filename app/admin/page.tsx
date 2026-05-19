import { createClient } from '@/lib/supabase/server'
import { formatPrice } from '@/lib/format'
import Link from 'next/link'

export default async function AdminOverviewPage() {
  const supabase = await createClient()

  const [{ count: productsCount }, { count: ordersCount }, { data: revenueRows }, { data: recent }] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('total'),
    supabase
      .from('orders')
      .select('id, total, status, customer_name, created_at')
      .order('created_at', { ascending: false })
      .limit(5),
  ])

  const revenue = (revenueRows ?? []).reduce((s: number, r: any) => s + Number(r.total), 0)

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-3 gap-4">
        <Stat label="Товаров" value={String(productsCount ?? 0)} href="/admin/products" />
        <Stat label="Заказов" value={String(ordersCount ?? 0)} href="/admin/orders" />
        <Stat label="Оборот" value={formatPrice(revenue)} />
      </div>

      <div className="p-6 rounded-2xl bg-card border border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Последние заказы</h2>
          <Link href="/admin/orders" className="text-xs text-accent hover:underline">
            Все заказы →
          </Link>
        </div>
        {!recent || recent.length === 0 ? (
          <div className="text-sm text-muted-foreground py-6 text-center">Заказов пока нет</div>
        ) : (
          <div className="space-y-2">
            {recent.map((o) => (
              <Link
                key={o.id}
                href={`/admin/orders/${o.id}`}
                className="flex items-center justify-between p-3 rounded-xl bg-background border border-border hover:border-accent transition-colors text-sm"
              >
                <div>
                  <div className="font-mono">#{o.id.slice(0, 8).toUpperCase()}</div>
                  <div className="text-xs text-muted-foreground">{o.customer_name}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent capitalize">{o.status}</span>
                  <span className="font-mono font-semibold tabular-nums">{formatPrice(Number(o.total))}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function Stat({ label, value, href }: { label: string; value: string; href?: string }) {
  const inner = (
    <div className="p-6 rounded-2xl bg-card border border-border h-full">
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="text-3xl font-semibold tracking-tight tabular-nums mt-2">{value}</div>
    </div>
  )
  return href ? (
    <Link href={href} className="block hover:[&>*]:border-accent transition-colors">
      {inner}
    </Link>
  ) : (
    inner
  )
}
