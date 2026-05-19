'use client'

import { useState, useTransition } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Crown, Shield, User as UserIcon, X, Trash2, Pencil } from 'lucide-react'
import { toast } from 'sonner'
import { updateUser, deleteUser, type AdminUser } from '@/app/admin/users/actions'

type Role = 'user' | 'admin' | 'owner'

function roleOf(u: AdminUser): Role {
  if (u.is_owner) return 'owner'
  if (u.is_admin) return 'admin'
  return 'user'
}

function RoleBadge({ role }: { role: Role }) {
  if (role === 'owner') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent/10 text-accent text-[11px] font-semibold uppercase tracking-wider">
        <Crown className="size-3" />
        Owner
      </span>
    )
  }
  if (role === 'admin') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-foreground/10 text-foreground text-[11px] font-semibold uppercase tracking-wider">
        <Shield className="size-3" />
        Admin
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-[11px] font-medium uppercase tracking-wider">
      <UserIcon className="size-3" />
      User
    </span>
  )
}

export function UsersTable({
  users,
  currentUserId,
}: {
  users: AdminUser[]
  currentUserId: string
}) {
  const [editing, setEditing] = useState<AdminUser | null>(null)

  return (
    <>
      <div className="rounded-2xl bg-card border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-background border-b border-border">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Пользователь</th>
              <th className="text-left px-4 py-3 font-medium">Email</th>
              <th className="text-left px-4 py-3 font-medium">Роль</th>
              <th className="text-left px-4 py-3 font-medium">Зарегистрирован</th>
              <th className="text-right px-4 py-3 font-medium">Действия</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => {
              const role = roleOf(u)
              const isSelf = u.id === currentUserId
              return (
                <tr key={u.id} className="border-b border-border last:border-0 hover:bg-background/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="size-9 rounded-full bg-background border border-border flex items-center justify-center text-xs font-semibold uppercase">
                        {(u.display_name || u.email || '?').slice(0, 1)}
                      </div>
                      <div>
                        <div className="font-medium">
                          {u.display_name || <span className="text-muted-foreground italic">без имени</span>}
                          {isSelf && (
                            <span className="ml-2 text-[10px] text-muted-foreground uppercase tracking-wider">
                              (вы)
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground font-mono">
                          {u.id.slice(0, 8)}…
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                  <td className="px-4 py-3">
                    <RoleBadge role={role} />
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs tabular-nums">
                    {new Date(u.created_at).toLocaleDateString('ru-RU')}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 justify-end">
                      <button
                        onClick={() => setEditing(u)}
                        className="size-8 rounded-full border border-border flex items-center justify-center hover:bg-foreground hover:text-background hover:border-foreground transition-colors"
                        aria-label="Редактировать"
                      >
                        <Pencil className="size-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
            {users.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-muted-foreground text-sm">
                  Пользователей пока нет
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {editing && (
          <EditUserDialog
            user={editing}
            currentUserId={currentUserId}
            onClose={() => setEditing(null)}
          />
        )}
      </AnimatePresence>
    </>
  )
}

function EditUserDialog({
  user,
  currentUserId,
  onClose,
}: {
  user: AdminUser
  currentUserId: string
  onClose: () => void
}) {
  const [pending, startTransition] = useTransition()
  const [deletePending, startDelete] = useTransition()
  const [role, setRole] = useState<Role>(roleOf(user))

  const isSelf = user.id === currentUserId

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const display_name = String(fd.get('display_name') ?? '')
    const email = String(fd.get('email') ?? '')

    startTransition(async () => {
      const res = await updateUser({
        userId: user.id,
        display_name,
        email,
        role,
      })
      if (res.error) {
        toast.error(res.error)
      } else {
        toast.success('Пользователь обновлён')
        onClose()
      }
    })
  }

  const onDelete = () => {
    if (!confirm(`Удалить пользователя ${user.email}? Это действие нельзя отменить.`)) return
    startDelete(async () => {
      const res = await deleteUser(user.id)
      if (res.error) {
        toast.error(res.error)
      } else {
        toast.success('Пользователь удалён')
        onClose()
      }
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[80] flex items-center justify-center p-4"
    >
      <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={onClose} />
      <motion.form
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onSubmit={onSubmit}
        className="relative bg-background border border-border rounded-2xl w-full max-w-md p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold">Пользователь</h3>
          <button
            type="button"
            onClick={onClose}
            className="size-8 rounded-full hover:bg-card flex items-center justify-center"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Имя</label>
            <input
              name="display_name"
              defaultValue={user.display_name ?? ''}
              placeholder="Без имени"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Email</label>
            <input
              name="email"
              type="email"
              defaultValue={user.email}
              required
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Роль</label>
            <div className="grid grid-cols-3 gap-2">
              {(['user', 'admin', 'owner'] as Role[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium uppercase tracking-wider transition-colors ${
                    role === r
                      ? 'border-foreground bg-foreground text-background'
                      : 'border-border hover:border-foreground/40'
                  }`}
                >
                  {r === 'owner' && <Crown className="size-3" />}
                  {r === 'admin' && <Shield className="size-3" />}
                  {r === 'user' && <UserIcon className="size-3" />}
                  {r}
                </button>
              ))}
            </div>
            {role === 'owner' && (
              <p className="text-[11px] text-muted-foreground mt-2">
                Owner — полный контроль над сайтом, включая управление администраторами.
              </p>
            )}
            {role === 'admin' && (
              <p className="text-[11px] text-muted-foreground mt-2">
                Admin — управление товарами и заказами.
              </p>
            )}
            {role === 'user' && (
              <p className="text-[11px] text-muted-foreground mt-2">
                User — обычный покупатель без доступа к админ-панели.
              </p>
            )}
          </div>

          <div className="text-xs text-muted-foreground p-3 rounded-lg bg-card border border-border space-y-1">
            <div className="flex justify-between">
              <span>ID:</span>
              <span className="font-mono">{user.id.slice(0, 13)}…</span>
            </div>
            <div className="flex justify-between">
              <span>Создан:</span>
              <span>{new Date(user.created_at).toLocaleString('ru-RU')}</span>
            </div>
            {user.last_sign_in_at && (
              <div className="flex justify-between">
                <span>Последний вход:</span>
                <span>{new Date(user.last_sign_in_at).toLocaleString('ru-RU')}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 mt-6">
          <button
            type="button"
            onClick={onDelete}
            disabled={isSelf || deletePending || user.is_owner}
            className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            title={
              isSelf
                ? 'Нельзя удалить себя'
                : user.is_owner
                  ? 'Нельзя удалить другого Owner'
                  : 'Удалить пользователя'
            }
          >
            <Trash2 className="size-3.5" />
            Удалить
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full px-5 py-2 text-sm font-medium hover:bg-card transition-colors"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={pending}
              className="rounded-full bg-foreground text-background px-6 py-2 text-sm font-medium hover:bg-accent transition-colors disabled:opacity-50"
            >
              {pending ? 'Сохранение...' : 'Сохранить'}
            </button>
          </div>
        </div>
      </motion.form>
    </motion.div>
  )
}
