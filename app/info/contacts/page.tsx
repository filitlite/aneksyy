import Link from 'next/link'
import { MessageCircle, Mail, MapPin, Clock } from 'lucide-react'

export const metadata = { title: 'Контакты — ShoeStore' }

export default function ContactsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
      <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">— Информация</span>
      <h1 className="mt-2 text-5xl font-semibold tracking-tighter">Контакты</h1>
      <p className="mt-4 text-muted-foreground leading-relaxed text-lg">
        Мы на связи 7 дней в неделю. Пишите в Telegram или ВКонтакте — отвечаем быстрее всего там.
      </p>

      <div className="mt-12 grid sm:grid-cols-2 gap-4">
        <a
          href="https://t.me/aneksyy"
          target="_blank"
          rel="noopener noreferrer"
          className="group p-6 rounded-2xl bg-card border border-border hover:border-accent transition-colors"
        >
          <div className="size-10 rounded-full bg-foreground text-background flex items-center justify-center mb-4 group-hover:bg-accent transition-colors">
            <MessageCircle className="size-5" />
          </div>
          <h3 className="font-semibold mb-1">Telegram</h3>
          <p className="text-sm text-muted-foreground">@aneksyy</p>
        </a>

        <a
          href="https://vk.com/aneksyyy"
          target="_blank"
          rel="noopener noreferrer"
          className="group p-6 rounded-2xl bg-card border border-border hover:border-accent transition-colors"
        >
          <div className="size-10 rounded-full bg-foreground text-background flex items-center justify-center mb-4 group-hover:bg-accent transition-colors">
            <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden>
              <path d="M13.16 17.07c-5.04 0-7.91-3.46-8.03-9.21h2.52c.08 4.22 1.94 6.01 3.42 6.38V7.86h2.38v3.64c1.46-.16 3-1.82 3.52-3.64h2.38c-.4 2.24-2.06 3.9-3.24 4.58 1.18.55 3.07 2 3.79 4.63h-2.62c-.56-1.74-1.98-3.08-3.83-3.27v3.27h-.29z"/>
            </svg>
          </div>
          <h3 className="font-semibold mb-1">VKontakte</h3>
          <p className="text-sm text-muted-foreground">@aneksyyy</p>
        </a>

        <div className="p-6 rounded-2xl bg-card border border-border">
          <div className="size-10 rounded-full bg-foreground text-background flex items-center justify-center mb-4">
            <Mail className="size-5" />
          </div>
          <h3 className="font-semibold mb-1">Email</h3>
          <p className="text-sm text-muted-foreground">support@shoestore.app</p>
        </div>

        <div className="p-6 rounded-2xl bg-card border border-border">
          <div className="size-10 rounded-full bg-foreground text-background flex items-center justify-center mb-4">
            <Clock className="size-5" />
          </div>
          <h3 className="font-semibold mb-1">График</h3>
          <p className="text-sm text-muted-foreground">Пн-Вс с 10:00 до 22:00 МСК</p>
        </div>
      </div>

      <div className="mt-10 p-8 rounded-2xl bg-foreground text-background flex items-start gap-4">
        <MapPin className="size-6 text-accent flex-none mt-1" />
        <div>
          <h3 className="font-semibold mb-1">Шоурум</h3>
          <p className="text-sm opacity-80 leading-relaxed">
            Москва, ул. Большая Никитская 24, 2 этаж<br />
            По предварительной записи в Telegram
          </p>
        </div>
      </div>
    </div>
  )
}
