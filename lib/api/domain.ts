import { API_CONFIG } from './config'

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
    
    // Use provided marketId or determine based on currency
    if (!marketId) {
      switch(currencyType) {
        case 'INR': marketId = 'en-IN'; break
        case 'GBP': marketId = 'en-GB'; break
        case 'EUR': marketId = 'en-EU'; break
        case 'AUD': marketId = 'en-AU'; break
        case 'CAD': marketId = 'en-CA'; break
        case 'BRL': marketId = 'pt-BR'; break
        case 'MXN': marketId = 'es-MX'; break
        case 'JPY': marketId = 'ja-JP'; break
        default: marketId = 'en-US'; break
      }
    }
    
    // Build the URL path - use the exact search endpoint with smaller pageSize
    const path = `/api/domain/search/exact?q=${encodeURIComponent(cleanQuery)}&currencyType=${currencyType}&marketId=${marketId}&pageSize=5`
    
    console.log('Frontend calling EXACT domain search API for:', cleanQuery)
    console.log('API path:', path)

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

    console.log('Response status:', response.status)
    console.log('Response ok:', response.ok)

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
    console.log('Domain search API data received:', JSON.stringify(data, null, 2))
    console.log('Exact match domain available:', data.exactMatchDomain?.available)
    console.log('Exact match domain:', data.exactMatchDomain?.domain)
    
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
    const [sld, ...tldParts] = domain.split('.')
    const tld = tldParts.join('.')
    
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