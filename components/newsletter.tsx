'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { toast } from 'sonner'

export function Newsletter() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    await new Promise((r) => setTimeout(r, 700))
    toast.success('Подписка оформлена! Скоро вы получите письмо.')
    setEmail('')
    setLoading(false)
  }

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
      <div className="rounded-3xl bg-card border border-border p-8 lg:p-16 text-center max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">— Будь первым</span>
          <h2 className="mt-3 text-4xl lg:text-5xl font-semibold tracking-tighter text-balance">
            Подпишись на <span className="text-accent">новые дропы</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-md mx-auto">
            Узнавай о релизах раньше всех. Эксклюзивные скидки для подписчиков и&nbsp;ранний доступ.
          </p>
          <form onSubmit={onSubmit} className="mt-8 flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              className="flex-1 rounded-full border border-border bg-background px-5 py-3 outline-none focus:border-accent transition"
            />
            <button
              type="submit"
              disabled={loading}
              className="rounded-full bg-foreground text-background px-7 py-3 font-medium hover:bg-accent transition-colors disabled:opacity-50"
            >
              {loading ? 'Отправляем...' : 'Подписаться'}
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  )
}
