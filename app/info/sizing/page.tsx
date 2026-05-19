export const metadata = { title: 'Размерная сетка — ShoeStore' }

const SIZES = [
  { eu: 38, us: 6, uk: 5, cm: 24.0 },
  { eu: 39, us: 6.5, uk: 5.5, cm: 24.5 },
  { eu: 40, us: 7, uk: 6, cm: 25.0 },
  { eu: 41, us: 8, uk: 7, cm: 25.5 },
  { eu: 42, us: 8.5, uk: 7.5, cm: 26.5 },
  { eu: 43, us: 9.5, uk: 8.5, cm: 27.0 },
  { eu: 44, us: 10, uk: 9, cm: 27.5 },
  { eu: 45, us: 11, uk: 10, cm: 28.5 },
  { eu: 46, us: 12, uk: 11, cm: 29.5 },
]

export default function SizingPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
      <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">— Информация</span>
      <h1 className="mt-2 text-5xl font-semibold tracking-tighter">Размерная сетка</h1>
      <p className="mt-4 text-muted-foreground leading-relaxed text-lg">
        Чтобы определить ваш размер, измерьте длину стопы от пятки до большого пальца, и сравните с таблицей ниже.
      </p>

      <div className="mt-10 rounded-2xl border border-border overflow-hidden bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-foreground text-background">
              <th className="text-left px-5 py-3 font-semibold">EU</th>
              <th className="text-left px-5 py-3 font-semibold">US</th>
              <th className="text-left px-5 py-3 font-semibold">UK</th>
              <th className="text-left px-5 py-3 font-semibold">Длина стопы (см)</th>
            </tr>
          </thead>
          <tbody>
            {SIZES.map((s, i) => (
              <tr key={s.eu} className={i % 2 === 0 ? 'bg-background' : ''}>
                <td className="px-5 py-3 font-mono tabular-nums font-semibold">{s.eu}</td>
                <td className="px-5 py-3 font-mono tabular-nums">{s.us}</td>
                <td className="px-5 py-3 font-mono tabular-nums">{s.uk}</td>
                <td className="px-5 py-3 font-mono tabular-nums">{s.cm.toFixed(1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 p-6 rounded-2xl bg-card border border-border">
        <h3 className="font-semibold mb-2">Как измерить</h3>
        <ol className="text-sm text-muted-foreground space-y-1.5 list-decimal list-inside leading-relaxed">
          <li>Поставьте стопу на лист бумаги, прижав пятку к стене.</li>
          <li>Отметьте самый дальний край большого пальца.</li>
          <li>Измерьте расстояние линейкой в сантиметрах.</li>
          <li>Если ваш размер между двумя — выбирайте больший.</li>
        </ol>
      </div>
    </div>
  )
}
