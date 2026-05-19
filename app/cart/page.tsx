import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { CartView } from '@/components/cart-view'

export default async function CartPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login?next=/cart')

  const { data } = await supabase
    .from('cart_items')
    .select('id, product_id, size, quantity, products(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return <CartView items={(data ?? []) as any} />
}
