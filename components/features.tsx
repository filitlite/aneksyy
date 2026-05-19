'use client'

import { motion } from 'framer-motion'
import { Truck, ShieldCheck, RotateCcw, Sparkles } from 'lucide-react'

const FEATURES = [
  {
    icon: Truck,
    title: 'Бесплатная доставка',
    desc: 'По всему миру при заказе от 10 000 ₽',
  },
  {
    icon: ShieldCheck,
    title: 'Гарантия подлинности',
    desc: 'Только оригинальные модели',
  },
  {
    icon: RotateCcw,
    title: '30 дней на возврат',
    desc: 'Не подошло — вернём деньги',
  },
  {
    icon: Sparkles,
    title: 'Эксклюзивные релизы',
    desc: 'Лимитированные коллекции',
  },
]

export function Features() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {FEATURES.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="group p-6 rounded-2xl bg-card border border-border hover:border-accent/50 transition-colors"
          >
            <div className="size-12 rounded-full bg-foreground text-background flex items-center justify-center mb-4 group-hover:bg-accent transition-colors">
              <f.icon className="size-5" />
            </div>
            <h3 className="font-semibold tracking-tight mb-1">{f.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
