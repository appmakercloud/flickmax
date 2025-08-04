// Cart types based on GoDaddy SecureServer API

export interface CartItem {
  id: string
  domain?: string
  quantity?: number
  pfid?: number
  period?: number
  periodUnit?: string
}

export interface AddToCartRequest {
  items: CartItem[]
  skipCrossSell?: boolean
}

export interface Cart {
  cartId: string
  currency: string
  items: CartItemDetail[]
  subtotal: number
  taxes: number
  total: number
  createdAt?: string
  updatedAt?: string
}

export interface CartItemDetail {
  id: string
  label: string
  quantity: number
  price: number
  subtotal: number
  period?: number
  periodUnit?: string
  domain?: string
  productId?: string
  renewalPrice?: number
  isDiscounted?: boolean
  discountAmount?: number
}

export interface CartResponse {
  cart: Cart
  redirect?: boolean
  crossSellProducts?: any[]
}

export interface CartErrorResponse {
  code: string
  message: string
  fields?: any[]
}