import { createClient } from '@/lib/supabase/server'
import { formatPrice } from '@/lib/format'
import Link from 'next/link'

export default async function AdminOrdersPage() {
  const supabase = await createClient()
  const { data: orders } = await supabase
    .from('orders')
    .select('id, total, status, customer_name, customer_phone, shipping_city, created_at')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Заказы ({orders?.length ?? 0})</h2>

      <div className="rounded-2xl bg-card border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-background border-b border-border">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Заказ</th>
              <th className="text-left px-4 py-3 font-medium">Клиент</th>
              <th className="text-left px-4 py-3 font-medium">Город</th>
              <th className="text-left px-4 py-3 font-medium">Дата</th>
              <th className="text-left px-4 py-3 font-medium">Статус</th>
              <th className="text-right px-4 py-3 font-medium">Сумма</th>
            </tr>
          </thead>
          <tbody>
            {(!orders || orders.length === 0) && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">
                  Заказов пока нет
                </td>
              </tr>
            )}
            {orders?.map((o) => (
              <tr key={o.id} className="border-b border-border last:border-0 hover:bg-background transition-colors">
                <td className="px-4 py-3">
                  <Link href={`/admin/orders/${o.id}`} className="font-mono hover:text-accent">
                    #{o.id.slice(0, 8).toUpperCase()}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <div>{o.customer_name}</div>
                  <div className="text-xs text-muted-foreground">{o.customer_phone}</div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{o.shipping_city}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {new Date(o.created_at).toLocaleDateString('ru-RU')}
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs px-2 py-1 rounded-full bg-accent/10 text-accent capitalize">{o.status}</span>
                </td>
                <td className="px-4 py-3 text-right font-mono font-semibold tabular-nums">
                  {formatPrice(Number(o.total))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
