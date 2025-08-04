// Client-side cart implementation for GoDaddy integration
import { Cart, CartItem, CartItemDetail } from '@/types/cart'
import { pricingService } from './pricing-service'
import { countries } from '@/lib/countries'

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
  
  async updateCart(cart: Cart): Promise<Cart> {
    await this.saveLocalCart(cart)
    return cart
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
    
    // For domain items, fetch exact prices from GoDaddy API
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      
      const existingItem = cart.items.find(i => 
        i.domain === item.domain || i.productId === item.pfid?.toString()
      )
      
      if (existingItem) {
        existingItem.quantity += item.quantity || 1
        existingItem.subtotal = existingItem.price * existingItem.quantity
      } else {
        let price = 19.99 // Default fallback price
        
        // If it's a domain, fetch the exact price from GoDaddy
        if (item.domain) {
          try {
            // Get current country from localStorage
            let marketId = 'en-US'
            let currencyType = 'USD'
            
            const storedCountry = localStorage.getItem('selectedCountry')
            if (storedCountry) {
              try {
                // Handle both JSON and plain string formats
                let countryCode = storedCountry
                try {
                  countryCode = JSON.parse(storedCountry)
                } catch {
                  // Already a plain string, use as-is
                }
                const country = countries.find(c => c.code === countryCode)
                if (country) {
                  marketId = country.marketId
                  currencyType = country.currency
                }
              } catch (e) {
                console.error('Error parsing stored country:', e)
              }
            }
            
            const searchParams = new URLSearchParams({
              plid: '590175',
              q: item.domain,
              currencyType: currencyType,
              marketId: marketId
            })
            
            console.log('Adding to cart - fetching price with params:', {
              domain: item.domain,
              currencyType,
              marketId
            })
            
            const response = await fetch(`/api/domain/search/exact?${searchParams}`)
            if (response.ok) {
              const data = await response.json()
              console.log('Domain price lookup response:', data)
              
              // Handle exact domain search response format
              if (data.exactMatchDomain) {
                const domainData = data.exactMatchDomain
                const priceString = String(domainData.salePrice || domainData.listPrice)
                // Remove currency symbols and parse
                price = parseFloat(priceString.replace(/[^0-9.]/g, '')) || price
                console.log('Found exact match price for', item.domain, ':', price, currencyType, '(original:', priceString, ')')
              } else if (data.domains && data.domains.length > 0) {
                // Fallback to domains array
                const domainMatch = data.domains.find((d: any) => 
                  d.domain.toLowerCase() === item.domain?.toLowerCase()
                )
                if (domainMatch) {
                  const priceString = String(domainMatch.salePrice || domainMatch.listPrice)
                  price = parseFloat(priceString.replace(/[^0-9.]/g, '')) || price
                  console.log('Found price from domains array for', item.domain, ':', price, currencyType, '(original:', priceString, ')')
                }
              }
            }
          } catch (error) {
            console.error('Error fetching domain price:', error)
          }
        }
        
        const cartItem: CartItemDetail = {
          id: item.id,
          label: item.domain || `Product ${item.id}`,
          quantity: item.quantity || 1,
          price: price,
          subtotal: price * (item.quantity || 1),
          domain: item.domain,
          productId: item.pfid?.toString(),
          period: item.period || 1,
          periodUnit: item.periodUnit || 'YEAR',
          renewalPrice: price,
          isDiscounted: false,
          discountAmount: undefined
        }
        cart.items.push(cartItem)
      }
    }
    
    // Update cart currency if needed
    const storedCountry = localStorage.getItem('selectedCountry')
    if (storedCountry) {
      try {
        // Handle both JSON and plain string formats
        let countryCode = storedCountry
        try {
          countryCode = JSON.parse(storedCountry)
        } catch {
          // Already a plain string, use as-is
        }
        const country = countries.find(c => c.code === countryCode)
        if (country) {
          cart.currency = country.currency
        }
      } catch (e) {
        console.error('Error parsing stored country:', e)
      }
    }
    
    // Recalculate totals
    cart.subtotal = cart.items.reduce((sum, item) => sum + item.subtotal, 0)
    cart.taxes = 0 // No tax calculation
    cart.total = cart.subtotal // Total equals subtotal
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