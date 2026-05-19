import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ShieldCheck } from 'lucide-react'

export const metadata = { title: 'Получить права админа' }

export default async function ClaimAdminPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login?next=/admin-claim')

  // Check if any admin exists already
  const { count: adminCount } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('is_admin', true)

  // Check current user
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin, display_name')
    .eq('id', user.id)
    .maybeSingle()

  if (profile?.is_admin) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <div className="size-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
          <ShieldCheck className="size-8 text-accent" />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">Вы уже админ</h1>
        <Link
          href="/admin"
          className="mt-6 inline-flex rounded-full bg-foreground text-background px-6 py-2.5 text-sm font-medium hover:bg-accent transition-colors"
        >
          Перейти в админ-панель
        </Link>
      </div>
    )
  }

  if ((adminCount ?? 0) > 0) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Админ уже назначен</h1>
        <p className="mt-3 text-muted-foreground text-sm">
          В системе уже есть администратор. Получить права может только он.
        </p>
        <Link
          href="/account"
          className="mt-6 inline-flex rounded-full border border-border px-6 py-2.5 text-sm font-medium hover:bg-card transition-colors"
        >
          В аккаунт
        </Link>
      </div>
    )
  }

  // Self-promote first user (no admins yet) to Owner (full control)
  await supabase
    .from('profiles')
    .upsert({ id: user.id, is_admin: true, is_owner: true }, { onConflict: 'id' })

  redirect('/admin')
}
