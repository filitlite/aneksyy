'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { updateOrderStatus } from '@/app/actions'

const STATUSES = ['pending', 'paid', 'shipped', 'delivered', 'cancelled']

export function OrderStatusSelect({ orderId, initial }: { orderId: string; initial: string }) {
  const [status, setStatus] = useState(initial)
  const [pending, startTransition] = useTransition()

  const onChange = (next: string) => {
    setStatus(next)
    startTransition(async () => {
      const res = await updateOrderStatus(orderId, next)
      if ('error' in res && res.error) {
        toast.error(typeof res.error === 'string' ? res.error : 'Ошибка')
        setStatus(initial)
      } else {
        toast.success('Статус обновлён')
      }
    })
  }

  return (
    <select
      value={status}
      onChange={(e) => onChange(e.target.value)}
      disabled={pending}
      className="rounded-full bg-foreground text-background border border-foreground px-4 py-2 text-sm font-medium outline-none capitalize"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s} className="bg-background text-foreground">
          {s}
        </option>
      ))}
    </select>
  )
}
