// Client-side cart implementation for GoDaddy integration
import { Cart, CartItem, CartItemDetail } from '@/types/cart'
import { pricingService } from './pricing-service'

class ClientCartService {
  private plid = process.env.NEXT_PUBLIC_PLID || '590175'
  
  // Store cart in localStorage
  private getLocalCart(): Cart | null {
    if (typeof window === 'undefined') return null
    
    const cartData = localStorage.getItem('flickmax_cart')
    if (!cartData) return null
    
    try {
      return JSON.parse(cartData)
    } catch {
      return null
    }
  }
  
  async saveLocalCart(cart: Cart): Promise<void> {
    if (typeof window === 'undefined') return
    localStorage.setItem('flickmax_cart', JSON.stringify(cart))
  }
  
  async getCart(cartId: string): Promise<Cart> {
    // Try to get cart from localStorage first
    const localCart = this.getLocalCart()
    if (localCart && localCart.cartId === cartId) {
      return localCart
    }
    
    // Return empty cart
    const emptyCart: Cart = {
      cartId,
      currency: 'USD',
      items: [],
      subtotal: 0,
      taxes: 0,
      total: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    await this.saveLocalCart(emptyCart)
    return emptyCart
  }
  
  async addToCart(cartId: string, items: CartItem[]): Promise<Cart> {
    console.log('clientCartService.addToCart called with:', { cartId, items })
    const cart = await this.getCart(cartId)
    
    // Fetch real-time prices for new items
    const priceRequests = items.map(item => ({
      productId: item.pfid || item.id,
      quantity: item.quantity,
      period: item.period,
      periodUnit: item.periodUnit,
      currency: cart.currency || 'USD'
    }))
    
    let prices: Array<{productId: string, listPrice: number, salePrice: number}> = []
    // Since we're on the client, pricing service will use fallback prices
    // No need to catch errors as fallback is always returned
    prices = await pricingService.getBulkPrices(priceRequests)
    
    // Add items to cart with real prices
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      const priceInfo = prices.find(p => p?.productId === (item.pfid || item.id)?.toString())
      
      console.log('Processing item:', item, 'Price info:', priceInfo)
      
      const existingItem = cart.items.find(i => 
        i.domain === item.domain || i.productId === item.pfid?.toString()
      )
      
      if (existingItem) {
        existingItem.quantity += item.quantity || 1
        existingItem.subtotal = existingItem.price * existingItem.quantity
      } else {
        const price = priceInfo?.salePrice || 10.99
        const cartItem: CartItemDetail = {
          id: item.id,
          label: item.domain || `Product ${item.id}`,
          quantity: item.quantity || 1,
          price: price,
          subtotal: price * (item.quantity || 1),
          domain: item.domain,
          productId: item.pfid?.toString(),
          period: item.period,
          periodUnit: item.periodUnit,
          renewalPrice: price,
          isDiscounted: false,
          discountAmount: undefined
        }
        cart.items.push(cartItem)
      }
    }
    
    // Recalculate totals
    cart.subtotal = cart.items.reduce((sum, item) => sum + item.subtotal, 0)
    cart.taxes = cart.subtotal * 0.08 // Estimated tax
    cart.total = cart.subtotal + cart.taxes
    cart.updatedAt = new Date().toISOString()
    
    console.log('Saving cart with items:', cart.items.length)
    await this.saveLocalCart(cart)
    console.log('Cart saved, returning:', cart)
    return cart
  }
  
  async clearCart(cartId: string): Promise<void> {
    const emptyCart: Cart = {
      cartId,
      currency: 'USD',
      items: [],
      subtotal: 0,
      taxes: 0,
      total: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    await this.saveLocalCart(emptyCart)
  }
  
  // Prepare cart for GoDaddy checkout
  prepareCheckoutUrl(): string {
    const cart = this.getLocalCart()
    if (!cart || cart.items.length === 0) {
      return `https://cart.secureserver.net/go/checkout?plid=${this.plid}`
    }
    
    // Build query parameters for cart items
    const params = new URLSearchParams()
    params.append('plid', this.plid)
    
    // Add each item to the URL
    cart.items.forEach((item, index) => {
      if (item.domain) {
        params.append(`items[${index}][id]`, 'domain')
        params.append(`items[${index}][domain]`, item.domain)
      } else if (item.productId) {
        params.append(`items[${index}][id]`, item.productId)
        params.append(`items[${index}][quantity]`, item.quantity.toString())
      }
    })
    
    return `https://cart.secureserver.net/go/checkout?${params.toString()}`
  }
}

export const clientCartService = new ClientCartService()