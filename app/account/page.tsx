import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { formatPrice } from '@/lib/format'
import { LogoutButton } from '@/components/logout-button'
import { NicknameEditor } from '@/components/nickname-editor'
import { ShieldCheck } from 'lucide-react'

export default async function AccountPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const [{ data: profile }, { data: orders }] = await Promise.all([
    supabase.from('profiles').select('display_name, is_admin').eq('id', user.id).maybeSingle(),
    supabase
      .from('orders')
      .select('id, total, status, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false }),
  ])

  const displayName = profile?.display_name ?? user.email?.split('@')[0] ?? ''

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">— Аккаунт</span>
          <h1 className="mt-2 text-4xl lg:text-5xl font-semibold tracking-tighter">
            Привет, <span className="text-accent">{displayName}</span>
          </h1>
        </div>
        <div className="flex items-center gap-2">
          {profile?.is_admin && (
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 rounded-full bg-foreground text-background px-4 py-2 text-sm font-medium hover:bg-accent transition-colors"
            >
              <ShieldCheck className="size-4" />
              Админ-панель
            </Link>
          )}
          <LogoutButton />
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-card border border-border mb-8">
        <h2 className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-3">Профиль</h2>
        <div className="space-y-4">
          <div>
            <div className="text-xs text-muted-foreground mb-1.5">Никнейм</div>
            <NicknameEditor initial={displayName} />
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1.5">Email</div>
            <div className="text-sm">{user.email}</div>
          </div>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-card border border-border">
        <h2 className="font-semibold mb-4">История заказов</h2>
        {!orders || orders.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>У вас ещё нет заказов</p>
            <Link href="/products" className="mt-4 inline-flex underline underline-offset-4 hover:text-accent">
              Сделать первый заказ
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((o) => (
              <Link
                key={o.id}
                href={`/account/orders/${o.id}`}
                className="flex items-center justify-between p-4 rounded-xl bg-background border border-border hover:border-accent transition-colors"
              >
                <div>
                  <div className="font-mono text-sm">#{o.id.slice(0, 8).toUpperCase()}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {new Date(o.created_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs px-2 py-1 rounded-full bg-accent/10 text-accent capitalize">
                    {o.status}
                  </span>
                  <span className="font-mono font-semibold tabular-nums">{formatPrice(Number(o.total))}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
