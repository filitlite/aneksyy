import { Truck, Package, Globe, Clock } from 'lucide-react'

export const metadata = { title: 'Доставка — ShoeStore' }

const POINTS = [
  { icon: Truck, title: 'Бесплатная доставка', desc: 'При заказе от 10 000 ₽ курьер доставит бесплатно по всей России.' },
  { icon: Clock, title: 'Сроки', desc: 'Москва и Санкт-Петербург — 1-2 дня. Регионы РФ — 3-5 дней. СНГ — 5-10 дней.' },
  { icon: Package, title: 'Упаковка', desc: 'Каждая пара упакована в фирменную коробку и опломбирована голограммой подлинности.' },
  { icon: Globe, title: 'Международная', desc: 'Доставка DHL Express в любую точку мира за 5-7 рабочих дней.' },
]

export default function ShippingPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
      <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">— Информация</span>
      <h1 className="mt-2 text-5xl font-semibold tracking-tighter">Доставка</h1>
      <p className="mt-4 text-muted-foreground leading-relaxed text-lg">
        Мы отправляем заказы каждый день кроме воскресенья. После оплаты заказ собирается на складе в течение 24 часов и передаётся в курьерскую службу.
      </p>
      <div className="mt-12 grid sm:grid-cols-2 gap-4">
        {POINTS.map((p) => (
          <div key={p.title} className="p-6 rounded-2xl bg-card border border-border">
            <div className="size-10 rounded-full bg-foreground text-background flex items-center justify-center mb-4">
              <p.icon className="size-5" />
            </div>
            <h3 className="font-semibold mb-2">{p.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
