import { RotateCcw } from 'lucide-react'

export const metadata = { title: 'Возврат — ShoeStore' }

const STEPS = [
  { n: '01', title: 'Подайте заявку', desc: 'Напишите нам в Telegram или на почту в течение 30 дней с момента получения заказа.' },
  { n: '02', title: 'Упакуйте товар', desc: 'Верните обувь в оригинальной коробке с биркой и голограммой. Без следов носки.' },
  { n: '03', title: 'Отправьте обратно', desc: 'Мы пришлём курьера или выдадим бесплатный код для отправки через любую службу доставки.' },
  { n: '04', title: 'Получите деньги', desc: 'Возврат средств на карту в течение 3-7 рабочих дней после получения посылки.' },
]

export default function ReturnsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
      <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">— Информация</span>
      <h1 className="mt-2 text-5xl font-semibold tracking-tighter">Возврат</h1>
      <p className="mt-4 text-muted-foreground leading-relaxed text-lg">
        У вас есть 30 дней, чтобы передумать. Если что-то не подошло — мы вернём деньги без вопросов.
      </p>

      <div className="mt-12 space-y-3">
        {STEPS.map((s) => (
          <div key={s.n} className="flex gap-5 p-6 rounded-2xl bg-card border border-border">
            <div className="font-mono text-sm text-accent">{s.n}</div>
            <div>
              <h3 className="font-semibold mb-1">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 p-6 rounded-2xl bg-foreground text-background">
        <div className="flex items-start gap-4">
          <RotateCcw className="size-5 text-accent flex-none mt-0.5" />
          <div>
            <h3 className="font-semibold mb-1">Условия возврата</h3>
            <ul className="text-sm opacity-80 space-y-1 list-disc list-inside">
              <li>Товар не носили на улице</li>
              <li>Сохранены коробка, бирки и пломба подлинности</li>
              <li>Прошло не более 30 дней с момента получения</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
