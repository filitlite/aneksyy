'use client'

import { useState, useTransition } from 'react'
import { motion } from 'framer-motion'
import { Pencil, Check, X } from 'lucide-react'
import { toast } from 'sonner'
import { updateDisplayName } from '@/app/actions'

export function NicknameEditor({ initial }: { initial: string }) {
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(initial)
  const [pending, startTransition] = useTransition()

  const onSave = () => {
    const fd = new FormData()
    fd.set('display_name', value)
    startTransition(async () => {
      const res = await updateDisplayName(fd)
      if ('error' in res && res.error) {
        toast.error(typeof res.error === 'string' ? res.error : 'Ошибка')
      } else {
        toast.success('Ник обновлён')
        setEditing(false)
      }
    })
  }

  if (!editing) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-2xl font-semibold tracking-tight">{value || 'без ника'}</span>
        <button
          onClick={() => setEditing(true)}
          className="size-8 rounded-full border border-border flex items-center justify-center hover:bg-foreground hover:text-background hover:border-foreground transition-colors"
          aria-label="Изменить ник"
        >
          <Pencil className="size-3.5" />
        </button>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-2"
    >
      <input
        autoFocus
        value={value}
        onChange={(e) => setValue(e.target.value)}
        maxLength={30}
        onKeyDown={(e) => {
          if (e.key === 'Enter') onSave()
          if (e.key === 'Escape') {
            setValue(initial)
            setEditing(false)
          }
        }}
        className="text-2xl font-semibold tracking-tight bg-background border border-border rounded-lg px-3 py-1 outline-none focus:border-accent"
      />
      <button
        onClick={onSave}
        disabled={pending}
        className="size-9 rounded-full bg-accent text-accent-foreground flex items-center justify-center hover:opacity-90 disabled:opacity-50"
        aria-label="Сохранить"
      >
        <Check className="size-4" />
      </button>
      <button
        onClick={() => {
          setValue(initial)
          setEditing(false)
        }}
        className="size-9 rounded-full border border-border flex items-center justify-center hover:bg-card"
        aria-label="Отмена"
      >
        <X className="size-4" />
      </button>
    </motion.div>
  )
}
