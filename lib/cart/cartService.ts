// Cart service for handling GoDaddy cart operations
import { CartItem } from '@/types/cart'

interface CartResponse {
  cartCount?: number
  nextStepUrl?: string
  error?: {
    status: number
    name: string
    message: string
  }
}

export class CartService {
  private static plid = process.env.NEXT_PUBLIC_PLID || '590175'

  // Add items to cart using JSONP (bypasses CORS, works in private browsing)
  static addItemsJSONP(
    items: CartItem[], 
    currency: string, 
    marketId: string
  ): Promise<CartResponse> {
    return new Promise((resolve, reject) => {
      // Create unique callback name
      const callbackName = 'jsonpCallback_' + Date.now() + '_' + Math.random().toString(36).substring(7)
      
      // Build cart data
      const cartData = {
        items: items.map(item => {
          if (item.domain) {
            return {
              id: 'domain',
              domain: item.domain,
              quantity: item.quantity || 1
            }
          } else {
            return {
              id: item.productId || item.id,
              quantity: item.quantity || 1
            }
          }
        })
      }
      
      // Build URL with cart data as parameter
      const params = new URLSearchParams({
        callback: callbackName,
        cart: JSON.stringify(cartData),
        plid: this.plid,
        currencyType: currency,
        marketId: marketId
      })
      
      const url = `https://www.secureserver.net/api/v1/cart/${this.plid}?${params.toString()}`
      
      // Setup callback function  
      ;(window as typeof window & Record<string, (data: CartResponse) => void>)[callbackName] = (data: CartResponse) => {
        // Cleanup
        delete (window as typeof window & Record<string, (data: CartResponse) => void>)[callbackName]
        const scriptElement = document.getElementById(callbackName)
        if (scriptElement) {
          scriptElement.remove()
        }
        
        if (data.error) {
          reject(new Error(data.error.message || 'Cart error'))
        } else {
          resolve(data)
        }
      }
      
      // Create script tag for JSONP request
      const script = document.createElement('script')
      script.id = callbackName
      script.src = url
      script.onerror = () => {
        delete (window as typeof window & Record<string, (data: CartResponse) => void>)[callbackName]
        reject(new Error('Failed to load cart API'))
      }
      
      document.body.appendChild(script)
    })
  }

  // Add mixed cart items sequentially (works around API limitation)
  static async addMixedCart(
    items: CartItem[], 
    currency: string, 
    marketId: string
  ): Promise<CartResponse> {
    // Separate domain and hosting items
    const domainItems = items.filter(item => item.domain)
    const hostingItems = items.filter(item => !item.domain)
    
    let lastResponse: CartResponse = {}
    
    // Add domain items first
    if (domainItems.length > 0) {
      lastResponse = await this.addItemsJSONP(domainItems, currency, marketId)
    }
    
    // Add hosting items second
    if (hostingItems.length > 0) {
      // Small delay to ensure cart state is updated
      await new Promise(resolve => setTimeout(resolve, 500))
      lastResponse = await this.addItemsJSONP(hostingItems, currency, marketId)
    }
    
    return lastResponse
  }

  // Direct form submission for immediate checkout
  static submitToCheckout(items: CartItem[]) {
    const form = document.createElement('form')
    form.method = 'POST'
    form.action = `https://www.secureserver.net/api/v1/cart/${this.plid}/?redirect=1&plid=${this.plid}`
    form.target = '_blank'
    
    const formattedItems = items.map(item => {
      if (item.domain) {
        return {
          id: 'domain',
          domain: item.domain,
          quantity: item.quantity || 1
        }
      } else {
        return {
          id: item.productId || item.id,
          quantity: item.quantity || 1
        }
      }
    })
    
    const input = document.createElement('input')
    input.type = 'hidden'
    input.name = 'items'
    input.value = JSON.stringify(formattedItems)
    
    form.appendChild(input)
    document.body.appendChild(form)
    form.submit()
    document.body.removeChild(form)
  }
}