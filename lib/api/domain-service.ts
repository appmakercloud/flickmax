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

    // Debug logging
    console.log('DomainSearchService initialized with:', {
      provider: this.config.provider,
      baseUrl: this.config.baseUrl,
      plid: this.config.plid,
      hasApiKey: !!this.config.apiKey,
      hasApiSecret: !!this.config.apiSecret,
      apiKeyLength: this.config.apiKey?.length || 0,
      apiSecretLength: this.config.apiSecret?.length || 0
    })

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
      console.log('=== VALIDATING PLID ===')
      console.log('PLID:', this.config.plid)
      console.log('API Base URL:', this.config.baseUrl)
      console.log('Has API Key:', !!this.config.apiKey)
      console.log('Has API Secret:', !!this.config.apiSecret)
      
      // Test the PLID with a simple API call
      const testUrl = `${this.config.baseUrl}/domains/${this.config.plid}?q=test&pageSize=1`
      console.log('Test URL:', testUrl)
      
      const headers = this.getAuthHeaders()
      console.log('Request headers:', {
        ...headers,
        'Authorization': headers['Authorization'] ? 'sso-key [REDACTED]' : 'NOT SET'
      })
      
      console.log('Making test request...')
      const response = await this.fetchWithRetry(testUrl, {
        method: 'GET',
        headers: headers
      })

      console.log('Response status:', response.status)
      console.log('Response headers:', Object.fromEntries(response.headers.entries()))

      if (response.ok) {
        this.plidValidated = true
        console.log('✓ PLID validation successful')
        const data = await response.json()
        console.log('Test response data:', JSON.stringify(data).substring(0, 200) + '...')
        return true
      } else {
        const errorText = await response.text()
        console.error('✗ PLID validation failed')
        console.error('Response status:', response.status)
        console.error('Response body:', errorText)
        
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
      console.error('PLID validation error:', error)
      throw error
    }
  }

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

    console.log('Domain search request:', {
      url: url.toString(),
      query: sanitizedQuery,
      provider: this.config.provider,
      plid: this.config.plid
    })

    try {
      console.log('Sending request to GoDaddy API...')
      console.log('Full URL:', url.toString())
      console.log('Headers:', {
        ...this.getAuthHeaders(),
        'Authorization': 'sso-key [REDACTED]'
      })
      
      const response = await this.fetchWithRetry(url.toString(), {
        method: 'GET',
        headers: this.getAuthHeaders()
      })

      console.log('GoDaddy response status:', response.status)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('GoDaddy API error response:')
        console.error('Status:', response.status)
        console.error('Status Text:', response.statusText)
        console.error('Response Body:', errorText)
        console.error('Response Headers:', Object.fromEntries(response.headers.entries()))
        
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
      console.error('Domain search error:', error)
      throw error
    }
  }

  async searchExactDomain(domain: string, currencyType: string = 'USD', marketId: string = 'en-US', pageSize: number = 5) {
    // Use the same endpoint as searchDomains which we know works
    console.log('searchExactDomain called for:', domain, 'with currency:', currencyType, 'and marketId:', marketId)
    
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
        console.error('Cross-sell API error:', response.status, errorText)
        
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
      console.error('Cross-sell domain search error:', error)
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

  private transformResponse(data: unknown) {
    // Transform the API response to a consistent format
    return data
  }

  private transformCrossSellResponse(data: {CrossSellDomains?: Array<{domain: string, listPrice: string}>}) {
    if (!data || !data.CrossSellDomains) {
      return { domains: [] }
    }

    return {
      domains: data.CrossSellDomains.map((domain) => ({
        domain: domain.Domain || domain.domain,
        available: domain.Available !== false,
        price: domain.Price ? {
          current: typeof domain.Price === 'object' ? domain.Price.Current : domain.Price,
          currency: typeof domain.Price === 'object' ? domain.Price.Currency : 'USD'
        } : undefined,
        period: domain.Period || 'year'
      }))
    }
  }
}

// Lazy initialization to ensure env vars are loaded
let domainSearchServiceInstance: DomainSearchService | null = null

export function getDomainSearchService(): DomainSearchService {
  if (!domainSearchServiceInstance) {
    domainSearchServiceInstance = new DomainSearchService()
  }
  return domainSearchServiceInstance
}

// For backward compatibility
export const domainSearchService = {
  searchDomains: async (options: DomainSearchOptions) => {
    return getDomainSearchService().searchDomains(options)
  },
  searchExactDomain: async (domain: string, currencyType?: string) => {
    return getDomainSearchService().searchExactDomain(domain, currencyType)
  },
  searchCrossSellDomains: async (sld: string, currencyType?: string) => {
    return getDomainSearchService().searchCrossSellDomains(sld, currencyType)
  }
}