/**
 * Client-side Cart Service
 * 
 * This service manages the shopping cart entirely on the client side using localStorage.
 * It handles cart persistence, item management, and price fetching from the domain API.
 * 
 * KEY FEATURES:
 * 1. Cart data stored in localStorage with key 'flickmax_cart'
 * 2. Automatically fetches domain prices when items are added
 * 3. Handles currency conversion based on selected country
 * 4. Generates unique IDs for cart items to prevent duplicates
 * 
 * IMPORTANT NOTES:
 * - Always uses marketId='en-US' when fetching prices for correct sale prices
 * - Currency is determined by the user's selected country
 * - Domain items use the domain name as a unique identifier
 * - Cart persists across page refreshes and browser sessions
 * 
 * @class
 */
import { Cart, CartItem, CartItemDetail } from '@/types/cart'
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
  
  /**
   * Add items to cart
   * 
   * This method:
   * 1. Checks if items already exist (by domain name or product ID)
   * 2. Fetches current pricing from GoDaddy API for domain items
   * 3. Updates quantities for existing items or adds new items
   * 4. Recalculates cart totals
   * 
   * @param cartId - The cart identifier
   * @param items - Array of items to add
   * @returns Updated cart object
   */
  async addToCart(cartId: string, items: CartItem[]): Promise<Cart> {
    const cart = await this.getCart(cartId)
    
    // For domain items, fetch exact prices from GoDaddy API
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      
      // For domain items, use domain as unique identifier
      // For other products, use productId
      const existingItem = cart.items.find(i => {
        if (item.domain && i.domain) {
          return i.domain.toLowerCase() === item.domain.toLowerCase()
        }
        return i.productId === item.pfid?.toString()
      })
      
      if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 1) + (item.quantity || 1)
        existingItem.subtotal = existingItem.price * existingItem.quantity
      } else {
        let price = 19.99 // Default fallback price
        let listPrice = 0
        let salePrice = 0
        
        // If it's a domain, fetch the exact price from GoDaddy
        if (item.domain) {
          try {
            /**
             * Determine currency based on selected country
             * 
             * CRITICAL: Always use marketId='en-US' regardless of country
             * to ensure sale prices are returned. Only the currency changes.
             */
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
                  // Always use en-US for marketId to get correct sale prices
                  marketId = 'en-US'
                  currencyType = country.currency
                }
              } catch (e) {
                // Error parsing stored country
              }
            }
            
            const searchParams = new URLSearchParams({
              plid: '590175',
              q: item.domain,
              currencyType: currencyType,
              marketId: marketId
            })
            
            const response = await fetch(`/api/domain/search/exact?${searchParams}`)
            if (response.ok) {
              const data = await response.json()
              
              // Handle exact domain search response format
              if (data.exactMatchDomain) {
                const domainData = data.exactMatchDomain
                const listPriceString = String(domainData.listPrice || '')
                const salePriceString = String(domainData.salePrice || domainData.listPrice || '')
                listPrice = parseFloat(listPriceString.replace(/[^0-9.]/g, '')) || 0
                salePrice = parseFloat(salePriceString.replace(/[^0-9.]/g, '')) || 0
                price = salePrice || listPrice || price
              } else if (data.domains && data.domains.length > 0) {
                // Fallback to domains array
                const domainMatch = data.domains.find((d: { domain: string; salePrice?: string; listPrice?: string }) => 
                  d.domain.toLowerCase() === item.domain?.toLowerCase()
                )
                if (domainMatch) {
                  const listPriceString = String(domainMatch.listPrice || '')
                  const salePriceString = String(domainMatch.salePrice || domainMatch.listPrice || '')
                  listPrice = parseFloat(listPriceString.replace(/[^0-9.]/g, '')) || 0
                  salePrice = parseFloat(salePriceString.replace(/[^0-9.]/g, '')) || 0
                  price = salePrice || listPrice || price
                }
              }
            }
          } catch (error) {
            // Error fetching domain price
          }
        }
        
        const cartItem: CartItemDetail = {
          id: item.domain ? `domain_${item.domain.toLowerCase()}` : item.id,
          label: item.domain || `Product ${item.id}`,
          quantity: item.quantity || 1,
          price: price,
          subtotal: price * (item.quantity || 1),
          domain: item.domain,
          productId: item.pfid?.toString(),
          period: item.period || 1,
          periodUnit: item.periodUnit || 'YEAR',
          renewalPrice: price,
          isDiscounted: salePrice > 0 && salePrice < listPrice,
          discountAmount: listPrice > salePrice ? listPrice - salePrice : undefined,
          listPrice: listPrice || undefined,
          salePrice: salePrice < listPrice ? salePrice : undefined
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
        // Error parsing stored country
      }
    }
    
    // Recalculate totals
    cart.subtotal = cart.items.reduce((sum, item) => sum + item.subtotal, 0)
    cart.taxes = 0 // No tax calculation
    cart.total = cart.subtotal // Total equals subtotal
    cart.updatedAt = new Date().toISOString()
    
    await this.saveLocalCart(cart)
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
  
  /**
   * Prepare checkout URL for GoDaddy
   * 
   * Builds a URL with cart items as query parameters.
   * This method is not currently used as we use form-based checkout instead.
   * 
   * @returns GoDaddy checkout URL with cart items
   * @deprecated Use FormCheckout component instead
   */
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