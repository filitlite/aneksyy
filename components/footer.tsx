import Link from 'next/link'

const TG_URL = 'https://t.me/aneksyy'
const VK_URL = 'https://vk.com/aneksyyy'

export function Footer() {
  return (
    <footer className="border-t border-border bg-background mt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="size-9 rounded-full bg-foreground flex items-center justify-center">
                <span className="text-background font-bold text-lg leading-none">S</span>
              </div>
              <span className="font-bold text-lg">
                Shoe<span className="text-accent">Store</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-sm leading-relaxed">
              Премиальная обувь от ведущих мировых брендов. Бесплатная доставка, гарантия подлинности и&nbsp;30 дней на возврат.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">Магазин</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/products" className="hover:text-foreground transition">Все товары</Link></li>
              <li><Link href="/products?category=Бег" className="hover:text-foreground transition">Бег</Link></li>
              <li><Link href="/products?category=Повседневные" className="hover:text-foreground transition">Повседневные</Link></li>
              <li><Link href="/products?category=Ботинки" className="hover:text-foreground transition">Ботинки</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">Помощь</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/info/shipping" className="hover:text-foreground transition">Доставка</Link></li>
              <li><Link href="/info/returns" className="hover:text-foreground transition">Возврат</Link></li>
              <li><Link href="/info/sizing" className="hover:text-foreground transition">Размерная сетка</Link></li>
              <li><Link href="/info/contacts" className="hover:text-foreground transition">Контакты</Link></li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-8 border-t border-border">
          <p className="text-xs text-muted-foreground">
            © 2026 ShoeStore. Все права защищены.
          </p>
          <div className="flex items-center gap-3">
            <a
              href={TG_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Telegram"
              className="size-9 rounded-full border border-border flex items-center justify-center hover:bg-foreground hover:text-background hover:border-foreground transition-colors"
            >
              <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden>
                <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z"/>
              </svg>
            </a>
            <a
              href={VK_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="VK"
              className="size-9 rounded-full border border-border flex items-center justify-center hover:bg-foreground hover:text-background hover:border-foreground transition-colors"
            >
              <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden>
                <path d="M13.16 17.07c-5.04 0-7.91-3.46-8.03-9.21h2.52c.08 4.22 1.94 6.01 3.42 6.38V7.86h2.38v3.64c1.46-.16 3-1.82 3.52-3.64h2.38c-.4 2.24-2.06 3.9-3.24 4.58 1.18.55 3.07 2 3.79 4.63h-2.62c-.56-1.74-1.98-3.08-3.83-3.27v3.27h-.29z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
