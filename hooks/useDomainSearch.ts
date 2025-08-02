import { useState } from 'react'
import { searchDomainExact, DomainSearchResult } from '@/lib/api/domain'
import { useCountry } from '@/contexts/CountryContext'

export interface DomainSuggestion {
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

export function useDomainSearch() {
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<DomainSearchResult | null>(null)
  const [suggestions, setSuggestions] = useState<DomainSuggestion[]>([])
  const [error, setError] = useState<string | null>(null)
  const { currency } = useCountry()

  const search = async (domainInput: string) => {
    if (!domainInput.trim()) {
      setError('Please enter a domain name')
      return
    }

    setIsSearching(true)
    setError(null)
    setSearchResults(null)
    setSuggestions([])

    try {
      const query = domainInput.trim().toLowerCase()
      
      // Call the exact search API with the user's currency
      const searchData = await searchDomainExact(query, currency || 'INR')
      
      // Set the exact match domain result
      if (searchData.exactMatchDomain) {
        setSearchResults({
          domain: searchData.exactMatchDomain.domain,
          available: searchData.exactMatchDomain.available,
          listPrice: searchData.exactMatchDomain.listPrice,
          salePrice: searchData.exactMatchDomain.salePrice,
          currency: currency,
          productId: searchData.exactMatchDomain.productId,
          premium: searchData.exactMatchDomain.premium,
          disclaimer: searchData.exactMatchDomain.disclaimer
        })
      }
      
      // Set suggestions from the API response
      if (searchData.suggestedDomains && Array.isArray(searchData.suggestedDomains)) {
        const suggestionList = searchData.suggestedDomains
          .slice(0, 10)
          .map(d => ({
            domain: d.domain,
            available: d.available,
            listPrice: d.listPrice,
            salePrice: d.salePrice,
            currency: currency,
            productId: d.productId,
            premium: d.premium,
            disclaimer: d.disclaimer
          }))
        
        setSuggestions(suggestionList)
      } else {
        setSuggestions([])
      }
    } catch (err) {
      console.error('Domain search error:', err)
      
      // Provide more specific error messages
      if (err instanceof Error) {
        if (err.message.includes('temporarily unavailable')) {
          setError('Domain search is temporarily unavailable. Please try again in a moment.')
        } else if (err.message.includes('Failed to fetch')) {
          setError('Unable to connect to domain search. Please check your internet connection.')
        } else {
          setError('Failed to search domain. Please try again.')
        }
      } else {
        setError('An unexpected error occurred. Please try again.')
      }
    } finally {
      setIsSearching(false)
    }
  }

  const reset = () => {
    setSearchResults(null)
    setSuggestions([])
    setError(null)
  }

  return {
    search,
    reset,
    isSearching,
    searchResults,
    suggestions,
    error
  }
}