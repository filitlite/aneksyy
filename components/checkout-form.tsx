'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { placeOrder } from '@/app/actions'

export function CheckoutForm({ defaultEmail }: { defaultEmail: string }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      action={async (formData) => {
        setLoading(true)
        setError(null)
        const res = await placeOrder(formData)
        if (res?.error) {
          setError(res.error)
          setLoading(false)
        }
      }}
      className="space-y-6"
    >
      <fieldset className="space-y-4 p-6 rounded-2xl bg-card border border-border">
        <legend className="px-2 font-semibold">Контактные данные</legend>
        <Field label="ФИО" name="customer_name" required />
        <Field label="Email" name="email" defaultValue={defaultEmail} disabled />
        <Field label="Телефон" name="customer_phone" type="tel" placeholder="+7 999 123 45 67" />
      </fieldset>

      <fieldset className="space-y-4 p-6 rounded-2xl bg-card border border-border">
        <legend className="px-2 font-semibold">Адрес доставки</legend>
        <Field label="Город" name="shipping_city" required />
        <Field label="Адрес" name="shipping_address" required />
        <Field label="Индекс" name="shipping_zip" required />
      </fieldset>

      {error && (
        <div className="p-4 rounded-xl bg-destructive/10 text-destructive text-sm">{error}</div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-foreground text-background py-4 font-medium hover:bg-accent transition-colors disabled:opacity-60"
      >
        {loading ? 'Оформляем заказ...' : 'Подтвердить заказ'}
      </button>
      <p className="text-xs text-center text-muted-foreground">
        Нажимая кнопку, вы соглашаетесь с условиями. Это демо — оплата не списывается.
      </p>
    </motion.form>
  )
}

function Field({
  label,
  name,
  type = 'text',
  required,
  defaultValue,
  disabled,
  placeholder,
}: {
  label: string
  name: string
  type?: string
  required?: boolean
  defaultValue?: string
  disabled?: boolean
  placeholder?: string
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium block mb-1.5">
        {label} {required && <span className="text-accent">*</span>}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        disabled={disabled}
        placeholder={placeholder}
        className="w-full rounded-xl border border-border bg-background px-4 py-3 outline-none focus:border-accent transition disabled:opacity-60"
      />
    </label>
  )
}
