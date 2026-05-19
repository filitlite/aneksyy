'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useTransition, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import { toast } from 'sonner'
import type { CartItemWithProduct } from '@/lib/types'
import { formatPrice } from '@/lib/format'
import { updateCartItem, removeCartItem } from '@/app/actions'

export function CartView({ items: initialItems }: { items: CartItemWithProduct[] }) {
  const [items, setItems] = useState(initialItems)
  const [isPending, startTransition] = useTransition()

  const subtotal = items.reduce(
    (sum, it) => sum + Number(it.products.price) * it.quantity,
    0,
  )
  const shipping = subtotal >= 10000 || subtotal === 0 ? 0 : 500
  const total = subtotal + shipping

  const onUpdate = (id: string, qty: number) => {
    setItems((prev) =>
      qty <= 0 ? prev.filter(i => i.id !== id) : prev.map((i) => (i.id === id ? { ...i, quantity: qty } : i)),
    )
    startTransition(async () => {
      await updateCartItem(id, qty)
    })
  }

  const onRemove = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id))
    startTransition(async () => {
      await removeCartItem(id)
      toast.success('Удалено из корзины')
    })
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring' }}
          className="size-20 rounded-full bg-card border border-border flex items-center justify-center mx-auto mb-6"
        >
          <ShoppingBag className="size-8 text-muted-foreground" />
        </motion.div>
        <h1 className="text-3xl lg:text-4xl font-semibold tracking-tighter">
          Корзина <span className="text-accent">пуста</span>
        </h1>
        <p className="mt-3 text-muted-foreground">Добавьте товары, чтобы оформить заказ.</p>
        <Link
          href="/products"
          className="mt-8 inline-flex rounded-full bg-foreground text-background px-7 py-3.5 font-medium hover:bg-accent transition-colors"
        >
          В каталог
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">— Корзина</span>
        <h1 className="mt-2 text-4xl lg:text-5xl font-semibold tracking-tighter">
          Твой <span className="text-accent">выбор</span>
        </h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-3">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20, height: 0 }}
                className="flex gap-4 p-4 rounded-2xl bg-card border border-border"
              >
                <Link
                  href={`/products/${item.products.slug}`}
                  className="relative size-24 sm:size-28 rounded-xl bg-background border border-border overflow-hidden shrink-0"
                >
                  <Image
                    src={item.products.image_url}
                    alt={item.products.name}
                    fill
                    className="object-contain p-2"
                    sizes="120px"
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                        {item.products.brand}
                      </span>
                      <h3 className="font-semibold tracking-tight">{item.products.name}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">Размер {item.size}</p>
                    </div>
                    <button
                      onClick={() => onRemove(item.id)}
                      className="size-9 rounded-full hover:bg-background flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors"
                      aria-label="Удалить"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center border border-border rounded-full bg-background">
                      <button
                        onClick={() => onUpdate(item.id, item.quantity - 1)}
                        className="size-9 flex items-center justify-center"
                        aria-label="Меньше"
                      >
                        <Minus className="size-3.5" />
                      </button>
                      <span className="w-7 text-center font-mono text-sm tabular-nums">{item.quantity}</span>
                      <button
                        onClick={() => onUpdate(item.id, item.quantity + 1)}
                        className="size-9 flex items-center justify-center"
                        aria-label="Больше"
                      >
                        <Plus className="size-3.5" />
                      </button>
                    </div>
                    <span className="font-mono font-semibold tabular-nums">
                      {formatPrice(Number(item.products.price) * item.quantity)}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:sticky lg:top-24 h-fit p-6 rounded-2xl bg-foreground text-background"
        >
          <h2 className="text-xl font-semibold mb-6">Итого</h2>
          <div className="space-y-3 text-sm">
            <Row label="Подытог" value={formatPrice(subtotal)} />
            <Row label="Доставка" value={shipping === 0 ? 'Бесплатно' : formatPrice(shipping)} />
            {subtotal < 10000 && subtotal > 0 && (
              <p className="text-xs opacity-60">
                Добавьте товаров на {formatPrice(10000 - subtotal)} для бесплатной доставки
              </p>
            )}
          </div>
          <div className="my-6 h-px bg-background/20" />
          <div className="flex items-baseline justify-between">
            <span className="text-sm opacity-70">К оплате</span>
            <span className="font-mono text-2xl font-semibold tabular-nums">{formatPrice(total)}</span>
          </div>
          <Link
            href="/checkout"
            className="mt-6 block w-full text-center rounded-full bg-accent text-accent-foreground py-3.5 font-medium hover:bg-background hover:text-foreground transition-colors"
          >
            Оформить заказ
          </Link>
          <Link
            href="/products"
            className="mt-3 block text-center text-sm opacity-70 hover:opacity-100 transition-opacity"
          >
            Продолжить покупки
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="opacity-70">{label}</span>
      <span className="font-mono tabular-nums">{value}</span>
    </div>
  )
}
