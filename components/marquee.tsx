'use client'

export function Marquee() {
  const items = ['Новые дропы', 'Бесплатная доставка', 'Оригинал', 'Возврат 30 дней', 'Премиум-бренды', 'По всему миру']
  const repeated = [...items, ...items, ...items]
  return (
    <div className="border-y border-border bg-foreground text-background py-4 overflow-hidden">
      <div className="flex animate-marquee whitespace-nowrap">
        {repeated.map((item, i) => (
          <div key={i} className="flex items-center mx-8 gap-8">
            <span className="text-2xl font-semibold tracking-tight uppercase">{item}</span>
            <span className="size-2 rounded-full bg-accent shrink-0" />
          </div>
        ))}
      </div>
    </div>
  )
}
