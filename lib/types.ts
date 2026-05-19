export type Product = {
  id: string
  slug: string
  name: string
  brand: string
  description: string
  price: number
  original_price: number | null
  category: string
  image_url: string
  colors: string[]
  sizes: number[]
  stock: number
  rating: number
  reviews_count: number
  is_featured: boolean
  is_new: boolean
  is_drop?: boolean
  drop_total?: number | null
  drop_sold?: number
  drop_ends_at?: string | null
  created_at: string
}

export type CartItemWithProduct = {
  id: string
  product_id: string
  size: number
  quantity: number
  products: Product
}

export type WishlistItemWithProduct = {
  id: string
  product_id: string
  products: Product
}
