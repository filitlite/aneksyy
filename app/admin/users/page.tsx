import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { listUsers } from './actions'
import { UsersTable } from '@/components/admin/users-table'

export const metadata = { title: 'Пользователи — Админ' }

export default async function AdminUsersPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login?next=/admin/users')

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_owner')
    .eq('id', user.id)
    .maybeSingle()

  if (!profile?.is_owner) redirect('/admin')

  const { users, error } = await listUsers()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Пользователи ({users.length})</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Управление учётными записями: имя, email и роль доступа.
          </p>
        </div>
      </div>

      {error ? (
        <div className="p-6 rounded-2xl border border-destructive/40 bg-destructive/5 text-sm text-destructive">
          Ошибка загрузки: {error}
        </div>
      ) : (
        <UsersTable users={users} currentUserId={user.id} />
      )}
    </div>
  )
}
