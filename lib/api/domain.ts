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
        'accept': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`Domain search failed: ${response.statusText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Domain search error:', error)
    throw error
  }
}

export async function searchDomainExact(query: string, currencyType: string = 'USD'): Promise<ExactSearchResponse> {
  try {
    // Clean the query - remove any extra spaces or special characters
    const cleanQuery = query.trim().toLowerCase()
    
    // Determine the correct marketId based on currency
    let marketId = 'en-US'
    switch(currencyType) {
      case 'INR': marketId = 'en-IN'; break
      case 'GBP': marketId = 'en-GB'; break
      case 'EUR': marketId = 'en-EU'; break
      case 'AUD': marketId = 'en-AU'; break
      case 'CAD': marketId = 'en-CA'; break
    }
    
    // Build the URL path
    const path = `/api/domain/search?q=${encodeURIComponent(cleanQuery)}&currencyType=${currencyType}&marketId=${marketId}&pageSize=100`
    
    console.log('Frontend calling domain search API for:', cleanQuery)
    console.log('API path:', path)

    const response = await fetch(path, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })

    console.log('Response status:', response.status)
    console.log('Response ok:', response.ok)

    // Always try to parse the response, even if not ok
    const data = await response.json()
    console.log('Domain search API data received:', JSON.stringify(data, null, 2))
    console.log('Exact match domain available:', data.exactMatchDomain?.available)
    console.log('Exact match domain:', data.exactMatchDomain?.domain)
    
    // If we have valid data structure, return it
    if (data && (data.exactMatchDomain || data.suggestedDomains)) {
      return data
    }
    
    // If response is not ok and no valid data, throw error
    if (!response.ok) {
      console.error('API Error Response:', data)
      throw new Error(data.error || `Domain search failed: ${response.statusText}`)
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