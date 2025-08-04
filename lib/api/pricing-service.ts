import { API_CONFIG } from './config'

interface PriceRequest {
  productId: string | number
  quantity?: number
  period?: number
  periodUnit?: string
  currency?: string
}

interface PriceResponse {
  productId: string
  listPrice: number
  salePrice: number
  currency: string
  period?: number
  periodUnit?: string
  renewalPrice?: number
  isDiscounted: boolean
  discountPercentage?: number
}

class PricingService {
  private baseUrl = 'https://api.secureserver.net/v1'
  
  private async makeRequest(url: string, options: RequestInit = {}) {
    // For now, skip API calls if credentials are not set
    if (!API_CONFIG.apiKey || !API_CONFIG.apiSecret) {
      throw new Error('API credentials not configured')
    }
    
    const headers = {
      'Authorization': `sso-key ${API_CONFIG.apiKey}:${API_CONFIG.apiSecret}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers
    }
    
    const response = await fetch(url, {
      ...options,
      headers
    })
    
    if (!response.ok) {
      throw new Error(`Pricing API error: ${response.status}`)
    }
    
    return response.json()
  }
  
  async getDomainPrice(domain: string, productId: number, currency: string = 'USD'): Promise<PriceResponse> {
    try {
      // For domains, we can use the domain availability endpoint which includes pricing
      const response = await this.makeRequest(
        `${this.baseUrl}/domains/available?domain=${domain}&checkType=FAST&forTransfer=false`
      )
      
      if (response.available && response.price) {
        return {
          productId: productId.toString(),
          listPrice: response.price || 0,
          salePrice: response.price || 0,
          currency,
          renewalPrice: response.renewalPrice || response.price,
          isDiscounted: false
        }
      }
      
      // Fallback pricing if API doesn't return price
      return this.getFallbackPrice(productId, currency)
    } catch (error) {
      console.error('Error fetching domain price:', error)
      return this.getFallbackPrice(productId, currency)
    }
  }
  
  async getProductPrice(request: PriceRequest): Promise<PriceResponse> {
    try {
      // For products, try to get pricing from the products endpoint
      const response = await this.makeRequest(
        `${this.baseUrl}/products/${request.productId}/pricing?currency=${request.currency || 'USD'}`
      )
      
      return {
        productId: request.productId.toString(),
        listPrice: response.list || response.current || 0,
        salePrice: response.current || response.list || 0,
        currency: request.currency || 'USD',
        period: request.period,
        periodUnit: request.periodUnit,
        renewalPrice: response.renewal || response.current,
        isDiscounted: response.list !== response.current,
        discountPercentage: response.list > response.current 
          ? Math.round(((response.list - response.current) / response.list) * 100)
          : 0
      }
    } catch (error) {
      console.error('Error fetching product price:', error)
      return this.getFallbackPrice(request.productId, request.currency || 'USD')
    }
  }
  
  private getFallbackPrice(productId: string | number, currency: string): PriceResponse {
    // Fallback prices for common products
    const fallbackPrices: Record<string, number> = {
      '101': 11.99,     // .com
      '12101': 14.99,   // .org
      '201': 19.99,     // .net
      '41000': 7.99,    // .co.in
      '41400': 7.99,    // .net.in
      '56401': 33.99,   // .co
      '1315082': 22.99, // .biz
      '1624920': 35.99, // .site
      '1706679': 34.99, // .news
      '1695849': 41.99, // .llc
      '857948': 31.99,  // .love
      '1734293': 35.99, // .systems
      '1705973': 34.99, // .live
      '1553716': 13.99, // .mov
    }
    
    const basePrice = fallbackPrices[productId.toString()] || 15.99
    
    return {
      productId: productId.toString(),
      listPrice: basePrice,
      salePrice: basePrice,
      currency,
      renewalPrice: basePrice,
      isDiscounted: false
    }
  }
  
  async getBulkPrices(items: PriceRequest[]): Promise<PriceResponse[]> {
    const pricePromises = items.map(item => {
      if (item.productId) {
        return this.getProductPrice(item)
      }
      return Promise.resolve(null)
    })
    
    const results = await Promise.allSettled(pricePromises)
    
    return results
      .filter((result): result is PromiseFulfilledResult<PriceResponse | null> => 
        result.status === 'fulfilled' && result.value !== null
      )
      .map(result => result.value as PriceResponse)
  }
}

export const pricingService = new PricingService()