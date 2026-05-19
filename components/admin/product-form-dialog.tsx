'use client'

import { useState, useTransition } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Pencil, X } from 'lucide-react'
import { toast } from 'sonner'
import { adminUpsertProduct } from '@/app/actions'
import type { Product } from '@/lib/types'

export function ProductFormDialog({ mode, product }: { mode: 'create' | 'edit'; product?: Product }) {
  const [open, setOpen] = useState(false)
  const [pending, startTransition] = useTransition()

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    if (product?.id) fd.set('id', product.id)
    startTransition(async () => {
      const res = await adminUpsertProduct(fd)
      if ('error' in res && res.error) {
        toast.error(typeof res.error === 'string' ? res.error : 'Ошибка')
      } else {
        toast.success(mode === 'create' ? 'Товар добавлен' : 'Товар обновлён')
        setOpen(false)
      }
    })
  }

  return (
    <>
      {mode === 'create' ? (
        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-full bg-foreground text-background px-4 py-2 text-sm font-medium hover:bg-accent transition-colors"
        >
          <Plus className="size-4" />
          Новый товар
        </button>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="size-8 rounded-full border border-border flex items-center justify-center hover:bg-foreground hover:text-background hover:border-foreground transition-colors"
          aria-label="Редактировать"
        >
          <Pencil className="size-3.5" />
        </button>
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
            <motion.form
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onSubmit={onSubmit}
              className="relative bg-background border border-border rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">
                  {mode === 'create' ? 'Новый товар' : 'Редактировать товар'}
                </h3>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="size-8 rounded-full hover:bg-card flex items-center justify-center"
                >
                  <X className="size-4" />
                </button>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Название" name="name" defaultValue={product?.name} required />
                <Field label="Бренд" name="brand" defaultValue={product?.brand} required />
                <Field label="Slug (URL)" name="slug" defaultValue={product?.slug} required />
                <Field label="Категория" name="category" defaultValue={product?.category} required />
                <Field label="Цена (₽)" name="price" type="number" step="1" defaultValue={product?.price} required />
                <Field
                  label="Старая цена (₽)"
                  name="original_price"
                  type="number"
                  step="1"
                  defaultValue={product?.original_price ?? ''}
                />
                <Field
                  label="Картинка (URL)"
                  name="image_url"
                  defaultValue={product?.image_url ?? '/shoes/classic-white.jpg'}
                  required
                  className="sm:col-span-2"
                />
                <Field
                  label="Остаток"
                  name="stock"
                  type="number"
                  defaultValue={product?.stock ?? 100}
                  required
                />
                <div className="sm:col-span-2">
                  <label className="text-xs text-muted-foreground mb-1.5 block">Описание</label>
                  <textarea
                    name="description"
                    defaultValue={product?.description}
                    required
                    rows={3}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent resize-none"
                  />
                </div>
                <Checkbox label="Хит сезона" name="is_featured" defaultChecked={product?.is_featured} />
                <Checkbox label="Новинка" name="is_new" defaultChecked={product?.is_new} />
              </div>

              <div className="flex items-center justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
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
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function Field({
  label,
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <div className={className}>
      <label className="text-xs text-muted-foreground mb-1.5 block">{label}</label>
      <input
        {...props}
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
      />
    </div>
  )
}

function Checkbox({
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="flex items-center gap-2 p-3 rounded-lg bg-card border border-border cursor-pointer">
      <input type="checkbox" {...props} className="size-4 accent-[oklch(0.62_0.22_35)]" />
      <span className="text-sm">{label}</span>
    </label>
  )
}
