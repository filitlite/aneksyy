'use client'

import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export function LogoutButton() {
  const router = useRouter()
  const onLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }
  return (
    <button
      onClick={onLogout}
      className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm hover:bg-card transition-colors"
    >
      <LogOut className="size-4" />
      Выйти
    </button>
  )
}
