import { createClient } from '@/lib/supabase/server'
import { HeaderClient } from './header-client'

export async function Header() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let cartCount = 0
  if (user) {
    const { data } = await supabase
      .from('cart_items')
      .select('quantity')
      .eq('user_id', user.id)
    cartCount = data?.reduce((sum, item) => sum + item.quantity, 0) ?? 0
  }

  return <HeaderClient user={user} cartCount={cartCount} />
}
