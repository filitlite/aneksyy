import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import { CheckoutForm } from '@/components/checkout-form'
import { formatPrice } from '@/lib/format'

export default async function CheckoutPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login?next=/checkout')

  const { data: items } = await supabase
    .from('cart_items')
    .select('id, quantity, size, products(*)')
    .eq('user_id', user.id)

  if (!items || items.length === 0) redirect('/cart')

  const subtotal = (items as any[]).reduce(
    (sum, it) => sum + Number(it.products.price) * it.quantity,
    0,
  )
  const shipping = subtotal >= 10000 ? 0 : 500
  const total = subtotal + shipping

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">— Оформление</span>
        <h1 className="mt-2 text-4xl lg:text-5xl font-semibold tracking-tighter">
          Финальный <span className="text-accent">шаг</span>
        </h1>
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3">
          <CheckoutForm defaultEmail={user.email ?? ''} />
        </div>

        <div className="lg:col-span-2 space-y-3">
          <div className="p-6 rounded-2xl bg-card border border-border">
            <h2 className="font-semibold mb-4">Ваш заказ</h2>
            <div className="space-y-3">
              {(items as any[]).map((it) => (
                <div key={it.id} className="flex gap-3 items-center">
                  <div className="relative size-14 rounded-lg bg-background border border-border overflow-hidden shrink-0">
                    <Image src={it.products.image_url} alt={it.products.name} fill className="object-contain p-1" sizes="60px" />
                  </div>
                  <div className="flex-1 min-w-0 text-sm">
                    <div className="font-medium truncate">{it.products.name}</div>
                    <div className="text-xs text-muted-foreground">Р. {it.size} × {it.quantity}</div>
                  </div>
                  <span className="font-mono text-sm tabular-nums">
                    {formatPrice(Number(it.products.price) * it.quantity)}
                  </span>
                </div>
              ))}
            </div>
            <div className="my-5 h-px bg-border" />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Подытог</span>
                <span className="font-mono tabular-nums">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Доставка</span>
                <span className="font-mono tabular-nums">{shipping === 0 ? 'Бесплатно' : formatPrice(shipping)}</span>
              </div>
            </div>
            <div className="my-5 h-px bg-border" />
            <div className="flex items-baseline justify-between">
              <span>К оплате</span>
              <span className="font-mono text-2xl font-semibold tabular-nums">{formatPrice(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
