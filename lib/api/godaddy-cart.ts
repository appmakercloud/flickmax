// Server-side GoDaddy cart integration
export interface GoDaddyCartItem {
  id: string
  domain?: string
  quantity?: number
  productId?: string
}

export interface GoDaddyCartRequest {
  items: GoDaddyCartItem[]
  skipCrossSell?: boolean
}

export interface GoDaddyCartResponse {
  nextStepUrl?: string
  NextStepUrl?: string
  orderUrl?: string
  redirectUrl?: string
  url?: string
  cartId?: string
  sessionId?: string
  cartCount?: number
  shopperId?: string
  pathway?: string
}

export class GoDaddyCartService {
  private plid: string
  private baseUrl = 'https://www.secureserver.net/api/v1'

  constructor() {
    this.plid = process.env.NEXT_PUBLIC_PLID || '590175'
  }

  async createCart(items: GoDaddyCartItem[]): Promise<GoDaddyCartResponse> {
    const url = `${this.baseUrl}/cart/${this.plid}?redirect=false`
    
    // Format items exactly as the curl command
    const formattedItems = items.map(item => {
      if (item.domain) {
        return {
          id: 'domain',
          domain: item.domain
        }
      }
      return {
        id: item.productId || item.id,
        quantity: item.quantity || 1
      }
    })

    console.log('Creating GoDaddy cart with URL:', url)
    console.log('Formatted items:', JSON.stringify(formattedItems, null, 2))

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        items: formattedItems,
        skipCrossSell: true
      })
    })

    const responseText = await response.text()
    console.log('GoDaddy response status:', response.status)
    console.log('GoDaddy response:', responseText)
    
    // Extract session info from headers
    const headers = response.headers
    let shopperId: string | undefined
    let pathway: string | undefined
    
    // In Next.js, headers are already parsed, so we can't access set-cookie directly
    // The session info would be in the cookies but we can't access them from server-side
    
    let result: GoDaddyCartResponse & { response?: string }
    try {
      result = JSON.parse(responseText)
    } catch {
      result = { response: responseText }
    }

    // Check if cart was created successfully
    if (result.cartCount && result.cartCount > 0) {
      console.log('Cart created successfully with items:', result.cartCount)
      
      // Since we can't transfer the session, we need to use a different approach
      // The cart API works but the session doesn't transfer to the browser
      // This is a limitation of cross-domain cookie security
      
      const checkoutUrl = result.nextStepUrl || result.NextStepUrl || 
                         `https://cart.secureserver.net/go/checkout?pl_id=${this.plid}`
      
      return {
        nextStepUrl: checkoutUrl,
        orderUrl: checkoutUrl,
        cartCount: result.cartCount
      }
    }
    
    // Extract the redirect URL from various possible response formats
    const redirectUrl = result.nextStepUrl || 
                       result.NextStepUrl || 
                       result.orderUrl || 
                       result.redirectUrl ||
                       result.url ||
                       `https://cart.secureserver.net/go/checkout?pl_id=${this.plid}`

    return {
      nextStepUrl: redirectUrl,
      orderUrl: redirectUrl,
      cartCount: result.cartCount
    }
  }
}

export const godaddyCartService = new GoDaddyCartService()