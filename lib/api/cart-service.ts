import { API_CONFIG } from './config'
import { Cart, AddToCartRequest, CartResponse, CartErrorResponse, CartItem, CartItemDetail } from '@/types/cart'

class CartService {
  private baseUrl = 'https://www.secureserver.net/api/v1/cart'
  private plid = process.env.NEXT_PUBLIC_PLID || '590175'
  
  private async makeRequest(url: string, options: RequestInit = {}) {
    // Cart API doesn't require authentication, only PLID
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers
    }
    
    const response = await fetch(url, {
      ...options,
      headers
    })
    
    if (!response.ok) {
      const error = await response.json() as CartErrorResponse
      throw new Error(error.message || `Cart API error: ${response.status}`)
    }
    
    return response.json()
  }
  
  async getCart(cartId: string): Promise<Cart> {
    try {
      const data = await this.makeRequest(`${this.baseUrl}/${this.plid}`, {
        method: 'GET',
        credentials: 'include'
      })
      return data
    } catch (error) {
      console.error('Get cart error:', error)
      if (error instanceof Error && (error.message.includes('404') || error.message.includes('400'))) {
        return {
          cartId,
          currency: 'USD',
          items: [],
          subtotal: 0,
          taxes: 0,
          total: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      }
      throw error
    }
  }
  
  async addToCart(cartId: string, request: AddToCartRequest, redirect: boolean = false): Promise<CartResponse> {
    try {
      const url = `${this.baseUrl}/${this.plid}?redirect=${redirect}`
      const data = await this.makeRequest(url, {
        method: 'POST',
        body: JSON.stringify({
          ...request,
          currency: 'USD',
          marketId: 'en-US'
        })
      })
      return data
    } catch (error) {
      console.error('Add to cart error:', error)
      throw error
    }
  }

  async createServerCart(items: any[]): Promise<any> {
    try {
      // Use the correct GoDaddy cart API URL format
      const url = `https://www.secureserver.net/api/v1/cart/${this.plid}`
      console.log('Creating GoDaddy server cart at:', url)
      console.log('Items to send:', items)
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Origin': 'https://www.flickmax.com' // Add origin header
        },
        credentials: 'include', // Include cookies for session
        body: JSON.stringify({
          items,
          skipCrossSell: false,
          currency: 'USD',
          marketId: 'en-US'
        })
      })
      
      console.log('Response status:', response.status)
      
      // GoDaddy might return 302 redirect or 200 with orderUrl
      if (response.status === 302) {
        const location = response.headers.get('Location')
        console.log('Redirect location:', location)
        return { orderUrl: location }
      }
      
      const data = await response.json()
      console.log('Server cart response:', data)
      
      // Return the checkout URL if available
      if (data.orderUrl || data.checkoutUrl) {
        return { orderUrl: data.orderUrl || data.checkoutUrl }
      }
      
      // If no URL, return the cart data
      return data
    } catch (error) {
      console.error('Create server cart error:', error)
      throw error
    }
  }
  
  async deleteCart(cartId: string): Promise<void> {
    try {
      await this.makeRequest(`${this.baseUrl}/${this.plid}/${cartId}`, {
        method: 'DELETE'
      })
    } catch (error) {
      console.error('Delete cart error:', error)
      throw error
    }
  }
  
  // Helper method to get checkout URL
  getCheckoutUrl(cartId: string): string {
    return `https://cart.secureserver.net/go/checkout?plid=${this.plid}#/basket`
  }
}

export const cartService = new CartService()