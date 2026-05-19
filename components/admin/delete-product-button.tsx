'use client'

import { useTransition } from 'react'
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { adminDeleteProduct } from '@/app/actions'

export function DeleteProductButton({ productId, productName }: { productId: string; productName: string }) {
  const [pending, startTransition] = useTransition()

  const onClick = () => {
    if (!confirm(`Удалить «${productName}»?`)) return
    startTransition(async () => {
      const res = await adminDeleteProduct(productId)
      if ('error' in res && res.error) {
        toast.error(typeof res.error === 'string' ? res.error : 'Ошибка')
      } else {
        toast.success('Удалено')
      }
    })
  }

  return (
    <button
      onClick={onClick}
      disabled={pending}
      className="size-8 rounded-full border border-border flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-colors disabled:opacity-50"
      aria-label="Удалить"
    >
      <Trash2 className="size-3.5" />
    </button>
  )
}
