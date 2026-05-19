import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from 'sonner'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import './globals.css'

const geist = Geist({ subsets: ['latin', 'cyrillic'], variable: '--font-geist' })

export const metadata: Metadata = {
  title: 'ShoeStore — Премиальная обувь нового поколения',
  description:
    'Откройте мир культовой обуви. ShoeStore — это кроссовки, ботинки и лайфстайл-модели от ведущих брендов. Бесплатная доставка, гарантия подлинности.',
  generator: 'v0.app',
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" className={`${geist.variable} bg-background`}>
      <body className="font-sans antialiased min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster position="bottom-right" theme="light" />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
