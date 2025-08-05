/**
 * Domain Search Service - GoDaddy Reseller API Integration
 * 
 * This service handles all domain search operations using GoDaddy's Reseller API.
 * It provides domain availability checking, pricing information, and cross-sell suggestions.
 * 
 * IMPORTANT NOTES:
 * 1. Always use marketId='en-US' to get correct sale prices
 * 2. Currency can be changed independently from marketId
 * 3. The service uses retry logic for better reliability
 * 4. PLID validation is done on first request to ensure configuration is correct
 * 
 * @example
 * const service = getDomainSearchService()
 * const results = await service.searchDomains({
 *   query: 'example.com',
 *   currencyType: 'INR',
 *   marketId: 'en-US' // Always use en-US for correct pricing
 * })
 */

import { createRetryFetch } from './retry'

export interface DomainAPIConfig {
  provider: string
  baseUrl: string
  apiKey?: string
  apiSecret?: string
  plid: string
}

export interface DomainSearchOptions {
  query: string
  currencyType?: string
  marketId?: string
  pageSize?: number
}

// Type definitions for API responses
interface DomainData {
  domain: string
  available: boolean
  listPrice?: string | number
  salePrice?: string | number
  price?: string | number
  currentPrice?: string | number
  amount?: string | number
  value?: string | number
  priceInfo?: {
    listPrice?: string | number
    currentPrice?: string | number
    salePrice?: string | number
    price?: string | number
  }
  pricing?: {
    list?: string | number
    sale?: string | number
    current?: string | number
    price?: string | number
  }
  productId?: string | number
  premium?: boolean
  disclaimer?: string
  [key: string]: string | number | boolean | undefined | {
    listPrice?: string | number
    currentPrice?: string | number
    salePrice?: string | number
    price?: string | number
    list?: string | number
    sale?: string | number
    current?: string | number
  } // Allow additional properties with specific types
}

interface ApiResponse {
  exactMatchDomain?: DomainData
  suggestedDomains?: DomainData[]
  domains?: DomainData[]
  disclaimer?: string
}

/**
 * Main service class for domain search operations
 * Handles GoDaddy Reseller API integration with automatic retry and error handling
 */
export class DomainSearchService {
  private config: DomainAPIConfig
  private fetchWithRetry: ReturnType<typeof createRetryFetch>
  private plidValidated: boolean = false

  constructor() {
    // Load configuration from environment variables
    this.config = {
      provider: 'godaddy',
      baseUrl: process.env.GODADDY_RESELLER_API_BASE_URL || 'https://www.secureserver.net/api/v1',
      apiKey: process.env.GODADDY_API_KEY,
      apiSecret: process.env.GODADDY_API_SECRET,
      plid: process.env.GODADDY_PLID || '590175'
    }

    // Service initialized

    // Validate configuration
    this.validateConfig()

    // Create fetch instance with retry logic
    this.fetchWithRetry = createRetryFetch({
      maxRetries: 3,
      initialDelay: 500,
      maxDelay: 5000
    })
  }

  private validateConfig() {
    if (!this.config.baseUrl) {
      throw new Error('GODADDY_RESELLER_API_BASE_URL is required')
    }
    
    if (!this.config.plid) {
      throw new Error('GODADDY_PLID is required')
    }
    
    // For GoDaddy API, credentials are required
    if (!this.config.apiKey || !this.config.apiSecret) {
      console.error('ERROR: GoDaddy API credentials not configured.')
      console.error('Please set GODADDY_API_KEY and GODADDY_API_SECRET in your .env.local file')
      throw new Error('GoDaddy API credentials are required')
    }
  }

  private getAuthHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'User-Agent': 'FlickMax/1.0'
    }

    // GoDaddy API uses Authorization header with sso-key format
    headers['Authorization'] = `sso-key ${this.config.apiKey}:${this.config.apiSecret}`

    return headers
  }

  // Validate PLID before making API calls
  private async validatePLID(): Promise<boolean> {
    if (this.plidValidated) {
      return true
    }

    try {
      // Test the PLID with a simple API call
      const testUrl = `${this.config.baseUrl}/domains/${this.config.plid}?q=test&pageSize=1`
      
      const headers = this.getAuthHeaders()
      const response = await this.fetchWithRetry(testUrl, {
        method: 'GET',
        headers: headers
      })

      if (response.ok) {
        this.plidValidated = true
        const data = await response.json()
        return true
      } else {
        const errorText = await response.text()
        
        if (response.status === 401) {
          throw new Error('GoDaddy API authentication failed. Please check your API credentials.')
        } else if (response.status === 403) {
          throw new Error('Invalid PLID or insufficient permissions for this reseller account.')
        } else if (response.status === 404) {
          throw new Error(`PLID ${this.config.plid} not found. Please check your PLID.`)
        }
        
        throw new Error(`PLID validation failed with status ${response.status}: ${errorText}`)
      }
    } catch (error) {
      throw error
    }
  }

  /**
   * Search for domain availability and pricing
   * 
   * @param options - Search options
   * @param options.query - Domain name to search for
   * @param options.currencyType - Currency for pricing (USD, INR, EUR, etc.)
   * @param options.marketId - Market ID (ALWAYS use 'en-US' for correct sale prices)
   * @param options.pageSize - Number of suggestions to return (default: 5)
   * 
   * @returns Object containing exactMatchDomain and suggestedDomains with pricing
   * 
   * @throws Error if domain query is invalid or API request fails
   */
  async searchDomains(options: DomainSearchOptions) {
    // Reduced pageSize to 5 for fewer suggestions
    const { query, currencyType = 'USD', marketId = 'en-US', pageSize = 5 } = options

    // Validate PLID first
    await this.validatePLID()

    // Sanitize and validate input
    const sanitizedQuery = this.sanitizeQuery(query)
    if (!sanitizedQuery) {
      throw new Error('Invalid domain query')
    }

    const url = new URL(`${this.config.baseUrl}/domains/${this.config.plid}`)
    url.searchParams.append('q', sanitizedQuery)
    url.searchParams.append('currencyType', currencyType)
    url.searchParams.append('marketId', marketId)
    url.searchParams.append('pageSize', pageSize.toString())

    // Domain search request prepared

    try {
      const response = await this.fetchWithRetry(url.toString(), {
        method: 'GET',
        headers: this.getAuthHeaders()
      })
      
      if (!response.ok) {
        const errorText = await response.text()
        
        if (response.status === 401) {
          throw new Error('GoDaddy API authentication failed. Please check your API credentials.')
        } else if (response.status === 403) {
          throw new Error('Access denied. Please check your PLID and API permissions.')
        } else if (response.status === 429) {
          throw new Error('Domain API rate limit exceeded. Please try again later.')
        }
        
        throw new Error(`Domain search failed: ${response.statusText}`)
      }

      const data = await response.json()
      return this.transformResponse(data)
    } catch (error) {
      throw error
    }
  }

  /**
   * Search for exact domain match with pricing
   * 
   * This is the primary method used by the cart to get updated pricing when currency changes.
   * 
   * @param domain - Exact domain name to search for
   * @param currencyType - Currency for pricing (USD, INR, EUR, etc.)
   * @param marketId - Market ID (ALWAYS use 'en-US' for correct sale prices)
   * @param pageSize - Number of suggestions (kept small to avoid errors)
   * 
   * @returns Object with exactMatchDomain containing pricing information
   * 
   * @example
   * // Get pricing for a domain in INR
   * const result = await service.searchExactDomain(
   *   'example.com',
   *   'INR',     // Get prices in Indian Rupees
   *   'en-US'    // But use US market for correct sale prices
   * )
   */
  async searchExactDomain(domain: string, currencyType: string = 'USD', marketId: string = 'en-US', pageSize: number = 5) {
    // Use the same endpoint as searchDomains which we know works
    
    // Just use the regular search endpoint which includes exact match
    // Use smaller pageSize to avoid 500 errors with certain domains
    const result = await this.searchDomains({
      query: domain,
      currencyType,
      marketId,
      pageSize
    })
    
    // The result already has exactMatchDomain and suggestedDomains
    return result
  }

  async searchCrossSellDomains(sld: string, currencyType: string = 'USD') {
    // Validate PLID first
    await this.validatePLID()

    const sanitizedSld = this.sanitizeQuery(sld)
    if (!sanitizedSld) {
      throw new Error('Invalid domain name')
    }

    const url = new URL(`${this.config.baseUrl}/search/crosssell`)
    url.searchParams.append('plid', this.config.plid)
    url.searchParams.append('sld', sanitizedSld)
    url.searchParams.append('currencyType', currencyType)

    try {
      const response = await this.fetchWithRetry(url.toString(), {
        method: 'GET',
        headers: this.getAuthHeaders()
      })

      if (!response.ok) {
        const errorText = await response.text()
        
        if (response.status === 401) {
          throw new Error('GoDaddy API authentication failed.')
        } else if (response.status === 403) {
          throw new Error('Access denied for cross-sell search.')
        }
        
        throw new Error(`Cross-sell domain search failed: ${response.statusText}`)
      }

      const data = await response.json()
      return this.transformCrossSellResponse(data)
    } catch (error) {
      throw error
    }
  }

  private sanitizeQuery(query: string): string {
    if (!query || typeof query !== 'string') {
      return ''
    }

    // Remove potentially harmful characters and normalize
    return query
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9.-]/g, '')
      .slice(0, 253) // Max domain length
  }

  /**
   * Transform GoDaddy API response to consistent format
   * Handles various pricing structures returned by the API
   * 
   * @private
   */
  private transformResponse(data: ApiResponse) {
    // Transform the API response to a consistent format
    // Handle different pricing formats from GoDaddy API
    
    if (!data) return data
    
    // Process exact match domain
    if (data.exactMatchDomain) {
      data.exactMatchDomain = this.normalizePricing(data.exactMatchDomain)
    }
    
    // Process suggested domains
    if (data.suggestedDomains && Array.isArray(data.suggestedDomains)) {
      data.suggestedDomains = data.suggestedDomains.map((domain) => 
        this.normalizePricing(domain)
      )
    }
    
    // Process domains array (for different response formats)
    if (data.domains && Array.isArray(data.domains)) {
      data.domains = data.domains.map((domain) => 
        this.normalizePricing(domain)
      )
    }
    
    return data
  }
  
  /**
   * Normalize domain pricing data from various GoDaddy API response formats
   * 
   * GoDaddy API returns pricing in different formats:
   * - Sometimes as direct properties (listPrice, salePrice)
   * - Sometimes nested in priceInfo object
   * - Sometimes nested in pricing object
   * - Sometimes only a single price field
   * 
   * This method normalizes all formats to consistent listPrice/salePrice
   * 
   * @private
   */
  private normalizePricing(domain: DomainData) {
    if (!domain) return domain
    
    
    // Handle various pricing formats from GoDaddy API
    let listPrice = domain.listPrice
    let salePrice = domain.salePrice
    let singlePrice = domain.price
    
    // Check if pricing is nested in priceInfo
    if (domain.priceInfo) {
      if (domain.priceInfo.listPrice !== undefined) {
        listPrice = domain.priceInfo.listPrice
      }
      if (domain.priceInfo.currentPrice !== undefined) {
        salePrice = domain.priceInfo.currentPrice
      } else if (domain.priceInfo.salePrice !== undefined) {
        salePrice = domain.priceInfo.salePrice
      }
      if (domain.priceInfo.price !== undefined && !salePrice) {
        singlePrice = domain.priceInfo.price
      }
    }
    
    // Check if pricing is nested in pricing object
    if (domain.pricing) {
      if (domain.pricing.list !== undefined) {
        listPrice = domain.pricing.list
      }
      if (domain.pricing.sale !== undefined) {
        salePrice = domain.pricing.sale
      } else if (domain.pricing.current !== undefined) {
        salePrice = domain.pricing.current
      }
      if (domain.pricing.price !== undefined && !salePrice) {
        singlePrice = domain.pricing.price
      }
    }
    
    // Handle case where only a single price is provided (common for non-US markets)
    if (!listPrice && !salePrice && singlePrice) {
      // Use the single price as the sale price
      salePrice = singlePrice
    }
    
    // If still no prices, check for any price field
    if (!listPrice && !salePrice) {
      const priceFields = ['price', 'currentPrice', 'amount', 'value'] as const
      for (const field of priceFields) {
        const fieldValue = domain[field as keyof DomainData]
        if (fieldValue) {
          salePrice = fieldValue as string | number
          break
        }
      }
    }
    
    // If no sale price but have list price, don't duplicate
    if (listPrice && !salePrice) {
      salePrice = listPrice
      listPrice = undefined // Don't show both if they're the same
    }
    
    // Ensure prices are properly formatted
    const formatPrice = (price: string | number | undefined) => {
      if (price === null || price === undefined) return undefined
      
      // If it's already a string with currency symbol, extract the number
      if (typeof price === 'string' && price.match(/[₹$£€]/)) {
        const numStr = price.replace(/[^0-9.]/g, '')
        return numStr
      }
      
      // If it's a number or numeric string, format it
      const numPrice = typeof price === 'string' ? parseFloat(price) : price
      if (!isNaN(numPrice)) {
        return numPrice.toFixed(2)
      }
      
      return price
    }
    
    const formattedListPrice = formatPrice(listPrice)
    const formattedSalePrice = formatPrice(salePrice)
    
    // Only return listPrice if it's different from salePrice
    const finalListPrice = formattedListPrice !== formattedSalePrice ? formattedListPrice : undefined
    
    return {
      ...domain,
      listPrice: finalListPrice,
      salePrice: formattedSalePrice
    }
  }

  private transformCrossSellResponse(data: {CrossSellDomains?: Array<{domain: string, listPrice: string}>}) {
    if (!data || !data.CrossSellDomains) {
      return { domains: [] }
    }

    return {
      domains: data.CrossSellDomains.map((domain) => ({
        domain: domain.domain,
        available: true,
        price: undefined,
        period: 'year'
      }))
    }
  }
}

/**
 * Singleton instance management
 * 
 * We use lazy initialization to ensure environment variables are loaded
 * before the service is created. This prevents initialization errors
 * during module loading.
 */
let domainSearchServiceInstance: DomainSearchService | null = null

/**
 * Get or create the domain search service instance
 * 
 * @returns Singleton instance of DomainSearchService
 */
export function getDomainSearchService(): DomainSearchService {
  if (!domainSearchServiceInstance) {
    domainSearchServiceInstance = new DomainSearchService()
  }
  return domainSearchServiceInstance
}

/**
 * Export a convenience object for backward compatibility
 * 
 * This provides a simpler API for common use cases while maintaining
 * the singleton pattern internally.
 * 
 * @example
 * import { domainSearchService } from '@/lib/api/domain-service'
 * 
 * // Search for domains
 * const results = await domainSearchService.searchDomains({
 *   query: 'example',
 *   currencyType: 'USD',
 *   marketId: 'en-US'
 * })
 * 
 * // Get exact domain pricing (used by cart)
 * const pricing = await domainSearchService.searchExactDomain(
 *   'example.com',
 *   'INR',    // Currency
 *   'en-US'   // Always use en-US for correct sale prices!
 * )
 */
export const domainSearchService = {
  searchDomains: async (options: DomainSearchOptions) => {
    return getDomainSearchService().searchDomains(options)
  },
  searchExactDomain: async (domain: string, currencyType?: string, marketId?: string, pageSize?: number) => {
    return getDomainSearchService().searchExactDomain(domain, currencyType || 'USD', marketId || 'en-US', pageSize || 5)
  },
  searchCrossSellDomains: async (sld: string, currencyType?: string) => {
    return getDomainSearchService().searchCrossSellDomains(sld, currencyType)
  }
}