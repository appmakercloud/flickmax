import { API_CONFIG } from './config'

export interface DomainValuationReason {
  rank: number
  Type: string
  Text: string
  Title: string
  Keyword?: string
  Avg_sold_price?: number
  AvgSoldPriceDisplay?: string
  Domain?: string
  Sld?: string
}

export interface DomainSearchResult {
  domain: string
  available: boolean
  listPrice?: string | number
  salePrice?: string | number
  currency?: string
  productId?: number
  premium?: boolean
  disclaimer?: string | null
  extendedValidation?: boolean
  valuation?: {
    GoValue?: number
    GoValueDisplay?: string
    Sale?: number
    SaleDisplay?: string
    Prices?: {
      GoValue?: number
      GoValueDisplay?: string
      Sale?: number
      SaleDisplay?: string
    }
    Reasons?: DomainValuationReason[]
  }
}

export interface ExactSearchResponse {
  exactMatchDomain: DomainSearchResult
  suggestedDomains: DomainSearchResult[]
  disclaimer: string
}

export interface CrossSellResponse {
  domains: Array<{
    domain: string
    available: boolean
    price?: {
      current: number
      currency: string
    }
    period?: string
  }>
}

export async function searchDomain(sld: string, currencyType: string = 'USD'): Promise<CrossSellResponse> {
  try {
    const url = new URL('/api/domain/search/crosssell', window.location.origin)
    url.searchParams.append('plid', API_CONFIG.PRIVATE_LABEL_ID)
    url.searchParams.append('sld', sld)
    url.searchParams.append('currencyType', currencyType)

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        // Add API key if configured (for production)
        ...(process.env.NEXT_PUBLIC_API_KEY && {
          'X-API-Key': process.env.NEXT_PUBLIC_API_KEY
        })
      }
    })

    if (!response.ok) {
      let errorData
      try {
        errorData = await response.json()
      } catch {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      throw new Error(errorData.error || `Domain search failed: ${response.statusText}`)
    }

    const data = await response.json()
    
    // Validate response has domains array
    if (!data || !Array.isArray(data.domains)) {
      console.warn('Invalid crosssell response, returning empty array')
      return { domains: [] }
    }
    
    return data
  } catch (error) {
    console.error('Domain search error:', error)
    throw error
  }
}

export async function searchDomainExact(query: string, currencyType: string = 'USD', marketId?: string): Promise<ExactSearchResponse> {
  try {
    // Clean the query - remove any extra spaces or special characters
    const cleanQuery = query.trim().toLowerCase()
    
    // Always use en-US marketId for correct sale prices
    // Only change currency to get proper pricing
    marketId = 'en-US'
    
    // Build the URL path - use the exact search endpoint with optimized pageSize
    const path = `/api/domain/search/exact?q=${encodeURIComponent(cleanQuery)}&currencyType=${currencyType}&marketId=${marketId}&pageSize=6`
    

    const response = await fetch(path, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
        // Add API key if configured (for production)
        ...(process.env.NEXT_PUBLIC_API_KEY && {
          'X-API-Key': process.env.NEXT_PUBLIC_API_KEY
        })
      }
    })


    // Check if response is ok before parsing
    if (!response.ok) {
      let errorData
      try {
        errorData = await response.json()
      } catch {
        // If JSON parsing fails, use status text
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      // Throw error with API message or default
      throw new Error(errorData.error || errorData.message || `Domain search failed: ${response.statusText}`)
    }

    // Parse successful response
    const data = await response.json()
    
    // Validate response structure
    if (!data || (!data.exactMatchDomain && !data.suggestedDomains)) {
      throw new Error('Invalid response format from domain search API')
    }
    
    return data
  } catch (error) {
    console.error('Domain exact search error:', error)
    throw error
  }
}

export async function checkDomainAvailability(domain: string, currencyType: string = 'USD'): Promise<DomainSearchResult> {
  try {
    const [sld] = domain.split('.')
    
    const response = await searchDomain(sld, currencyType)
    
    const exactMatch = response.domains?.find(d => 
      d.domain.toLowerCase() === domain.toLowerCase()
    )
    
    if (exactMatch) {
      return {
        domain: exactMatch.domain,
        available: exactMatch.available,
        listPrice: exactMatch.price?.current,
        currency: exactMatch.price?.currency || currencyType
      }
    }
    
    return {
      domain,
      available: false
    }
  } catch (error) {
    console.error('Domain availability check error:', error)
    throw error
  }
}