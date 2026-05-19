'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

/**
 * Returns the current user's profile, or null if not signed in.
 */
async function requireOwner() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'auth' as const, user: null }

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_owner, is_admin')
    .eq('id', user.id)
    .maybeSingle()

  if (!profile?.is_owner) return { error: 'forbidden' as const, user: null }
  return { error: null, user }
}

export type AdminUser = {
  id: string
  email: string
  display_name: string | null
  is_admin: boolean
  is_owner: boolean
  created_at: string
  last_sign_in_at: string | null
}

export async function listUsers(): Promise<{ users: AdminUser[]; error?: string }> {
  const auth = await requireOwner()
  if (auth.error) return { users: [], error: auth.error }

  const admin = createAdminClient()

  // Pull auth users (paged) — we cap at 1000 for now
  const { data: authData, error: authErr } = await admin.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  })
  if (authErr) return { users: [], error: authErr.message }

  const ids = authData.users.map((u) => u.id)
  const { data: profiles } = await admin
    .from('profiles')
    .select('id, display_name, is_admin, is_owner')
    .in('id', ids.length ? ids : ['00000000-0000-0000-0000-000000000000'])

  const map = new Map(
    (profiles ?? []).map((p) => [
      p.id,
      {
        display_name: p.display_name as string | null,
        is_admin: p.is_admin as boolean,
        is_owner: p.is_owner as boolean,
      },
    ]),
  )

  const users: AdminUser[] = authData.users.map((u) => {
    const p = map.get(u.id)
    return {
      id: u.id,
      email: u.email ?? '',
      display_name: p?.display_name ?? null,
      is_admin: p?.is_admin ?? false,
      is_owner: p?.is_owner ?? false,
      created_at: u.created_at,
      last_sign_in_at: u.last_sign_in_at ?? null,
    }
  })

  // Sort: owners first, then admins, then by created_at desc
  users.sort((a, b) => {
    if (a.is_owner !== b.is_owner) return a.is_owner ? -1 : 1
    if (a.is_admin !== b.is_admin) return a.is_admin ? -1 : 1
    return b.created_at.localeCompare(a.created_at)
  })

  return { users }
}

export type UpdateUserInput = {
  userId: string
  email?: string
  display_name?: string
  role?: 'user' | 'admin' | 'owner'
}

export async function updateUser(input: UpdateUserInput): Promise<{ success?: true; error?: string }> {
  const auth = await requireOwner()
  if (auth.error) return { error: auth.error }
  if (!auth.user) return { error: 'auth' }

  const { userId, email, display_name, role } = input

  if (!userId) return { error: 'Не указан пользователь' }

  const admin = createAdminClient()

  // Load target user current state
  const { data: targetProfile } = await admin
    .from('profiles')
    .select('is_owner, is_admin')
    .eq('id', userId)
    .maybeSingle()

  // Safety: cannot demote yourself if you're the only owner
  if (userId === auth.user.id && role && role !== 'owner') {
    const { count } = await admin
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .eq('is_owner', true)
    if ((count ?? 0) <= 1) {
      return { error: 'Нельзя снять с себя роль Owner — вы единственный владелец' }
    }
  }

  // Update email via auth admin API
  if (email && email.trim()) {
    const trimmed = email.trim().toLowerCase()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      return { error: 'Неверный формат email' }
    }
    const { error: emailErr } = await admin.auth.admin.updateUserById(userId, {
      email: trimmed,
      email_confirm: true,
    })
    if (emailErr) return { error: emailErr.message }
  }

  // Update profile fields
  const profilePatch: Record<string, unknown> = {}
  if (display_name !== undefined) {
    const trimmed = display_name.trim()
    if (trimmed.length > 0 && (trimmed.length < 2 || trimmed.length > 30)) {
      return { error: 'Имя должно быть от 2 до 30 символов' }
    }
    profilePatch.display_name = trimmed.length === 0 ? null : trimmed
  }
  if (role) {
    profilePatch.is_owner = role === 'owner'
    profilePatch.is_admin = role === 'admin' || role === 'owner'
  }

  if (Object.keys(profilePatch).length > 0) {
    // Ensure a profile row exists
    const { error: upsertErr } = await admin
      .from('profiles')
      .upsert({ id: userId, ...profilePatch }, { onConflict: 'id' })
    if (upsertErr) return { error: upsertErr.message }
  }

  revalidatePath('/admin/users')
  return { success: true }
}

export async function deleteUser(userId: string): Promise<{ success?: true; error?: string }> {
  const auth = await requireOwner()
  if (auth.error) return { error: auth.error }
  if (!auth.user) return { error: 'auth' }

  if (userId === auth.user.id) {
    return { error: 'Нельзя удалить самого себя' }
  }

  const admin = createAdminClient()

  // Don't allow deleting another owner unless we're not the last one (defense-in-depth)
  const { data: target } = await admin
    .from('profiles')
    .select('is_owner')
    .eq('id', userId)
    .maybeSingle()
  if (target?.is_owner) {
    return { error: 'Нельзя удалить другого Owner. Сначала снимите роль Owner.' }
  }

  const { error } = await admin.auth.admin.deleteUser(userId)
  if (error) return { error: error.message }

  revalidatePath('/admin/users')
  return { success: true }
}
