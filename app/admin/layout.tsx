import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Package, ShoppingBag, ArrowLeft, Users, Crown } from 'lucide-react'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login?next=/admin')

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin, is_owner, display_name')
    .eq('id', user.id)
    .maybeSingle()

  if (!profile?.is_admin) redirect('/account')

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <Link
            href="/account"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-3"
          >
            <ArrowLeft className="size-3" />
            Назад в аккаунт
          </Link>
          <h1 className="text-4xl font-semibold tracking-tighter">Админ-панель</h1>
          <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1.5">
            {profile.is_owner && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-accent/10 text-accent text-[10px] font-semibold uppercase tracking-wider">
                <Crown className="size-3" />
                Owner
              </span>
            )}
            {profile.display_name ?? user.email}
          </p>
        </div>
        <nav className="flex items-center gap-1 p-1 rounded-full bg-card border border-border">
          <AdminLink href="/admin">Обзор</AdminLink>
          <AdminLink href="/admin/products">
            <Package className="size-3.5" />
            Товары
          </AdminLink>
          <AdminLink href="/admin/orders">
            <ShoppingBag className="size-3.5" />
            Заказы
          </AdminLink>
          {profile.is_owner && (
            <AdminLink href="/admin/users">
              <Users className="size-3.5" />
              Пользователи
            </AdminLink>
          )}
        </nav>
      </div>
      {children}
    </div>
  )
}

function AdminLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium hover:bg-foreground hover:text-background transition-colors"
    >
      {children}
    </Link>
  )
}
