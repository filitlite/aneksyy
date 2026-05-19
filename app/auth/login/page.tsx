'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get('next') ?? '/'

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }
    router.push(next)
    router.refresh()
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-8 rounded-3xl bg-card border border-border"
      >
        <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">— Вход</span>
        <h1 className="mt-2 text-3xl font-semibold tracking-tighter">
          С возвращением, <span className="text-accent">друг</span>
        </h1>
        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <label className="block">
            <span className="text-sm font-medium mb-1.5 block">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 outline-none focus:border-accent transition"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium mb-1.5 block">Пароль</span>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 outline-none focus:border-accent transition"
            />
          </label>
          {error && <div className="p-3 rounded-xl bg-destructive/10 text-destructive text-sm">{error}</div>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-foreground text-background py-3.5 font-medium hover:bg-accent transition-colors disabled:opacity-60"
          >
            {loading ? 'Входим...' : 'Войти'}
          </button>
        </form>
        <p className="mt-6 text-sm text-center text-muted-foreground">
          Нет аккаунта?{' '}
          <Link href="/auth/sign-up" className="text-foreground underline underline-offset-4 hover:text-accent">
            Зарегистрироваться
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
