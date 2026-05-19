'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function addToCart(productId: string, size: number, quantity: number = 1) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'auth' as const }
  }

  const { data: existing } = await supabase
    .from('cart_items')
    .select('id, quantity')
    .eq('user_id', user.id)
    .eq('product_id', productId)
    .eq('size', size)
    .maybeSingle()

  if (existing) {
    const { error } = await supabase
      .from('cart_items')
      .update({ quantity: existing.quantity + quantity })
      .eq('id', existing.id)
    if (error) return { error: error.message }
  } else {
    const { error } = await supabase.from('cart_items').insert({
      user_id: user.id,
      product_id: productId,
      size,
      quantity,
    })
    if (error) return { error: error.message }
  }

  revalidatePath('/', 'layout')
  return { success: true }
}

export async function updateCartItem(itemId: string, quantity: number) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'auth' as const }

  if (quantity <= 0) {
    await supabase.from('cart_items').delete().eq('id', itemId).eq('user_id', user.id)
  } else {
    await supabase.from('cart_items').update({ quantity }).eq('id', itemId).eq('user_id', user.id)
  }
  revalidatePath('/', 'layout')
  return { success: true }
}

export async function removeCartItem(itemId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'auth' as const }
  await supabase.from('cart_items').delete().eq('id', itemId).eq('user_id', user.id)
  revalidatePath('/', 'layout')
  return { success: true }
}

export async function toggleWishlist(productId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'auth' as const }

  const { data: existing } = await supabase
    .from('wishlist_items')
    .select('id')
    .eq('user_id', user.id)
    .eq('product_id', productId)
    .maybeSingle()

  if (existing) {
    await supabase.from('wishlist_items').delete().eq('id', existing.id)
    revalidatePath('/wishlist')
    return { success: true, added: false }
  }

  await supabase.from('wishlist_items').insert({ user_id: user.id, product_id: productId })
  revalidatePath('/wishlist')
  return { success: true, added: true }
}

export async function placeOrder(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const customer_name = String(formData.get('customer_name') ?? '')
  const customer_phone = String(formData.get('customer_phone') ?? '')
  const shipping_address = String(formData.get('shipping_address') ?? '')
  const shipping_city = String(formData.get('shipping_city') ?? '')
  const shipping_zip = String(formData.get('shipping_zip') ?? '')

  const { data: items } = await supabase
    .from('cart_items')
    .select('id, quantity, size, products(*)')
    .eq('user_id', user.id)

  if (!items || items.length === 0) {
    return { error: 'Корзина пуста' }
  }

  const total = items.reduce(
    (sum: number, it: any) => sum + Number(it.products.price) * it.quantity,
    0,
  )

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: user.id,
      total,
      shipping_address,
      shipping_city,
      shipping_zip,
      customer_name,
      customer_phone,
    })
    .select()
    .single()

  if (orderError || !order) {
    return { error: orderError?.message ?? 'Ошибка создания заказа' }
  }

  const orderItems = items.map((it: any) => ({
    order_id: order.id,
    product_id: it.products.id,
    product_name: it.products.name,
    product_image: it.products.image_url,
    size: it.size,
    quantity: it.quantity,
    price: it.products.price,
  }))

  await supabase.from('order_items').insert(orderItems)
  await supabase.from('cart_items').delete().eq('user_id', user.id)

  revalidatePath('/', 'layout')
  redirect(`/account/orders/${order.id}`)
}

export async function updateDisplayName(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'auth' as const }

  const display_name = String(formData.get('display_name') ?? '').trim()
  if (!display_name || display_name.length < 2 || display_name.length > 30) {
    return { error: 'Ник должен быть от 2 до 30 символов' }
  }

  const { error } = await supabase
    .from('profiles')
    .upsert({ id: user.id, display_name }, { onConflict: 'id' })

  if (error) return { error: error.message }

  revalidatePath('/account')
  return { success: true }
}

export async function updateOrderStatus(orderId: string, status: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'auth' as const }

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .maybeSingle()

  if (!profile?.is_admin) return { error: 'forbidden' }

  const { error } = await supabase.from('orders').update({ status }).eq('id', orderId)
  if (error) return { error: error.message }

  revalidatePath('/admin')
  return { success: true }
}

export async function adminUpsertProduct(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'auth' as const }

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .maybeSingle()
  if (!profile?.is_admin) return { error: 'forbidden' }

  const id = String(formData.get('id') ?? '')
  const payload = {
    slug: String(formData.get('slug') ?? '').trim(),
    name: String(formData.get('name') ?? '').trim(),
    brand: String(formData.get('brand') ?? '').trim(),
    description: String(formData.get('description') ?? '').trim(),
    price: Number(formData.get('price')),
    original_price: formData.get('original_price') ? Number(formData.get('original_price')) : null,
    category: String(formData.get('category') ?? '').trim(),
    image_url: String(formData.get('image_url') ?? '').trim(),
    stock: Number(formData.get('stock') ?? 100),
    is_featured: formData.get('is_featured') === 'on',
    is_new: formData.get('is_new') === 'on',
  }

  if (id) {
    const { error } = await supabase.from('products').update(payload).eq('id', id)
    if (error) return { error: error.message }
  } else {
    const { error } = await supabase.from('products').insert({
      ...payload,
      colors: ['Default'],
      sizes: [39, 40, 41, 42, 43, 44],
    })
    if (error) return { error: error.message }
  }

  revalidatePath('/admin')
  revalidatePath('/products')
  revalidatePath('/')
  return { success: true }
}

export async function adminDeleteProduct(productId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'auth' as const }

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .maybeSingle()
  if (!profile?.is_admin) return { error: 'forbidden' }

  const { error } = await supabase.from('products').delete().eq('id', productId)
  if (error) return { error: error.message }

  revalidatePath('/admin')
  revalidatePath('/products')
  return { success: true }
}
