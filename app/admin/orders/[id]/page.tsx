import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { formatPrice } from '@/lib/format'
import Image from 'next/image'
import { OrderStatusSelect } from '@/components/admin/order-status-select'

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: order } = await supabase.from('orders').select('*').eq('id', id).maybeSingle()
  if (!order) notFound()

  const { data: items } = await supabase.from('order_items').select('*').eq('order_id', id)

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-muted-foreground font-mono">#{order.id.slice(0, 8).toUpperCase()}</div>
          <h2 className="text-2xl font-semibold tracking-tight mt-1">{order.customer_name}</h2>
        </div>
        <OrderStatusSelect orderId={order.id} initial={order.status} />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Info label="Телефон" value={order.customer_phone || '—'} />
        <Info label="Город" value={order.shipping_city} />
        <Info label="Адрес" value={order.shipping_address} />
        <Info label="Индекс" value={order.shipping_zip} />
        <Info
          label="Дата"
          value={new Date(order.created_at).toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        />
        <Info label="Сумма" value={formatPrice(Number(order.total))} highlight />
      </div>

      <div className="p-6 rounded-2xl bg-card border border-border">
        <h3 className="font-semibold mb-4">Состав заказа</h3>
        <div className="space-y-3">
          {items?.map((it) => (
            <div key={it.id} className="flex items-center gap-4">
              <div className="size-14 relative bg-background rounded-lg overflow-hidden border border-border">
                <Image src={it.product_image} alt={it.product_name} fill className="object-contain p-1.5" sizes="56px" />
              </div>
              <div className="flex-1">
                <div className="font-medium">{it.product_name}</div>
                <div className="text-xs text-muted-foreground">
                  Размер {it.size} · {it.quantity} шт.
                </div>
              </div>
              <div className="font-mono font-semibold tabular-nums">
                {formatPrice(Number(it.price) * it.quantity)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function Info({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="p-4 rounded-xl bg-card border border-border">
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`mt-1 font-medium ${highlight ? 'text-accent text-lg font-mono tabular-nums' : ''}`}>
        {value}
      </div>
    </div>
  )
}
