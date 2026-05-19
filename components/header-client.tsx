'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, Heart, User, Menu, X, Search } from 'lucide-react'
import type { User as SupabaseUser } from '@supabase/supabase-js'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { href: '/products', label: 'Каталог' },
  { href: '/products?category=Бег', label: 'Бег' },
  { href: '/products?category=Повседневные', label: 'Повседневные' },
  { href: '/products?category=Ботинки', label: 'Ботинки' },
]

export function HeaderClient({
  user,
  cartCount,
}: {
  user: SupabaseUser | null
  cartCount: number
}) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={cn(
          'sticky top-0 z-50 w-full transition-all duration-500',
          scrolled
            ? 'bg-background/80 backdrop-blur-xl border-b border-border'
            : 'bg-transparent'
        )}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 lg:h-20 items-center justify-between gap-4">
            <div className="flex items-center gap-8">
              <Link href="/" className="group flex items-center gap-2">
                <motion.div
                  whileHover={{ rotate: -12, scale: 1.1 }}
                  className="size-9 rounded-full bg-foreground flex items-center justify-center"
                >
                  <span className="text-background font-serif text-lg leading-none italic">S</span>
                </motion.div>
                <span className="font-bold tracking-tight text-lg text-foreground">
                  Shoe<span className="text-accent">Store</span>
                </span>
              </Link>

              <nav className="hidden lg:flex items-center gap-1">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="relative px-3 py-2 text-sm font-medium text-foreground/70 hover:text-foreground transition-colors group"
                  >
                    {link.label}
                    <span className="absolute bottom-1 left-3 right-3 h-px bg-accent scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                  </Link>
                ))}
              </nav>
            </div>

            <div className="flex items-center gap-1">
              <Button asChild variant="ghost" size="icon" className="hidden sm:flex">
                <Link href="/products">
                  <Search className="size-5" />
                  <span className="sr-only">Поиск</span>
                </Link>
              </Button>
              <Button asChild variant="ghost" size="icon" className="hidden sm:flex">
                <Link href="/wishlist">
                  <Heart className="size-5" />
                  <span className="sr-only">Избранное</span>
                </Link>
              </Button>
              <Button asChild variant="ghost" size="icon">
                <Link href={user ? '/account' : '/auth/login'}>
                  <User className="size-5" />
                  <span className="sr-only">Аккаунт</span>
                </Link>
              </Button>
              <Button asChild variant="ghost" size="icon" className="relative">
                <Link href="/cart">
                  <ShoppingBag className="size-5" />
                  <AnimatePresence>
                    {cartCount > 0 && (
                      <motion.span
                        key={cartCount}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute -top-0.5 -right-0.5 size-5 rounded-full bg-accent text-accent-foreground text-[10px] font-bold flex items-center justify-center tabular-nums"
                      >
                        {cartCount}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  <span className="sr-only">Корзина</span>
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setMobileOpen(true)}
              >
                <Menu className="size-5" />
                <span className="sr-only">Меню</span>
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] lg:hidden"
          >
            <div
              className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-background p-6 flex flex-col"
            >
              <div className="flex items-center justify-between mb-8">
                <span className="font-semibold tracking-tight">Меню</span>
                <Button variant="ghost" size="icon" onClick={() => setMobileOpen(false)}>
                  <X className="size-5" />
                </Button>
              </div>
              <nav className="flex flex-col gap-1">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="py-3 text-lg font-medium border-b border-border hover:text-accent transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href="/wishlist"
                  onClick={() => setMobileOpen(false)}
                  className="py-3 text-lg font-medium border-b border-border hover:text-accent transition-colors"
                >
                  Избранное
                </Link>
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
