import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { CheckCircle2 } from 'lucide-react'
import { formatPrice } from '@/lib/format'

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: order } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .maybeSingle()

  if (!order) notFound()

  const { data: items } = await supabase.from('order_items').select('*').eq('order_id', id)

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <div className="size-16 mx-auto rounded-full bg-accent/10 text-accent flex items-center justify-center mb-4">
          <CheckCircle2 className="size-8" />
        </div>
        <h1 className="text-3xl lg:text-4xl font-semibold tracking-tighter">
          Заказ <span className="text-accent">оформлен!</span>
        </h1>
        <p className="mt-2 text-muted-foreground">
          Номер: <span className="font-mono">#{order.id.slice(0, 8).toUpperCase()}</span>
        </p>
      </div>

      <div className="p-6 rounded-2xl bg-card border border-border mb-4">
        <h2 className="font-semibold mb-4">Товары</h2>
        <div className="space-y-3">
          {items?.map((it) => (
            <div key={it.id} className="flex gap-3 items-center">
              <div className="relative size-16 rounded-xl bg-background border border-border overflow-hidden shrink-0">
                <Image src={it.product_image} alt={it.product_name} fill className="object-contain p-1" sizes="80px" />
              </div>
              <div className="flex-1">
                <div className="font-medium">{it.product_name}</div>
                <div className="text-xs text-muted-foreground">Размер {it.size} × {it.quantity}</div>
              </div>
              <span className="font-mono tabular-nums">{formatPrice(Number(it.price) * it.quantity)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-card border border-border mb-4">
        <h2 className="font-semibold mb-3">Доставка</h2>
        <div className="text-sm text-muted-foreground space-y-1">
          <div>{order.customer_name}</div>
          <div>{order.shipping_address}, {order.shipping_city}, {order.shipping_zip}</div>
          {order.customer_phone && <div>{order.customer_phone}</div>}
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-foreground text-background flex items-baseline justify-between">
        <span>Итого</span>
        <span className="font-mono text-2xl font-semibold tabular-nums">{formatPrice(Number(order.total))}</span>
      </div>

      <div className="mt-8 flex gap-3 justify-center">
        <Link href="/account" className="rounded-full border border-border px-6 py-3 hover:bg-card transition-colors">
          Все заказы
        </Link>
        <Link href="/products" className="rounded-full bg-foreground text-background px-6 py-3 hover:bg-accent transition-colors">
          Продолжить покупки
        </Link>
      </div>
    </div>
  )
}
