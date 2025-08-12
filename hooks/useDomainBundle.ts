import { useState, useEffect } from 'react'
import { searchDomainExact } from '@/lib/api/domain'

export interface BundleDomain {
  domain: string
  available: boolean
  price?: {
    list: number
    sale?: number
    currency: string
  }
  productId?: string
}

export interface BundleData {
  domains: BundleDomain[]
  totalPrice: {
    list: number
    sale?: number
    currency: string
  }
  savings?: number
}

export function useDomainBundle(baseDomain: string, currency: string = 'USD') {
  const [loading, setLoading] = useState(false)
  const [bundleData, setBundleData] = useState<BundleData | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!baseDomain) {
      setBundleData(null)
      return
    }

    const fetchBundleData = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const response = await fetch(`/api/domain/bundles?domain=${encodeURIComponent(baseDomain)}`)
        
        if (!response.ok) {
          console.warn(`Bundle API returned status ${response.status} for domain: ${baseDomain}`)
          // Don't throw error, return empty bundle data
          setBundleData(null)
          setLoading(false)
          return
        }
        
        const data = await response.json()
        
        // Parse the response - it returns an array with bundle information
        if (data && Array.isArray(data) && data.length > 0) {
          const bundleInfo = data[0]
          
          // Extract domains from the Domains array
          if (bundleInfo.Domains && Array.isArray(bundleInfo.Domains)) {
            // Fetch real prices for each domain from the search API
            const domainPromises = bundleInfo.Domains.map(async (domain: any) => {
              try {
                // Search for exact domain to get real pricing and product ID
                const searchResult = await searchDomainExact(domain.Fqdn, currency, 'en-US')
                
                if (searchResult.exactMatchDomain) {
                  return {
                    domain: domain.Fqdn,
                    available: searchResult.exactMatchDomain.available,
                    price: {
                      list: searchResult.exactMatchDomain.listPrice || searchResult.exactMatchDomain.salePrice || 29.99,
                      sale: searchResult.exactMatchDomain.salePrice || searchResult.exactMatchDomain.listPrice || 29.99,
                      currency: currency
                    },
                    productId: String(searchResult.exactMatchDomain.productId)
                  }
                }
                
                // Fallback if search fails
                return {
                  domain: domain.Fqdn,
                  available: true,
                  price: {
                    list: 29.99,
                    sale: 29.99,
                    currency: currency
                  },
                  productId: undefined
                }
              } catch (err) {
                // If individual search fails, use fallback
                console.warn(`Failed to fetch price for ${domain.Fqdn}:`, err)
                return {
                  domain: domain.Fqdn,
                  available: true,
                  price: {
                    list: 29.99,
                    sale: 29.99,
                    currency: currency
                  },
                  productId: undefined
                }
              }
            })
            
            const domains: BundleDomain[] = await Promise.all(domainPromises)
            
            // Calculate total prices from actual domain prices
            const totalList = domains.reduce((sum, d) => sum + (d.price?.list || 0), 0)
            const totalSale = domains.reduce((sum, d) => sum + (d.price?.sale || d.price?.list || 0), 0)
            
            setBundleData({
              domains,
              totalPrice: {
                list: totalList,
                sale: totalSale < totalList ? totalSale : undefined,
                currency: 'USD'
              },
              savings: totalList - totalSale
            })
          } else {
            // Fallback if no domains in response
            throw new Error('No bundle domains in response')
          }
        } else {
          // Fallback to default bundle extensions if API doesn't return data
          const extensions = ['.org', '.xyz', '.info', '.net']
          const defaultDomains = extensions.map(ext => ({
            domain: baseDomain.split('.')[0] + ext,
            available: true,
            price: {
              list: 21.99,
              sale: 21.99,
              currency: 'USD'
            }
          }))
          
          const totalPrice = defaultDomains.reduce((sum, d) => sum + d.price.list, 0)
          setBundleData({
            domains: defaultDomains,
            totalPrice: {
              list: totalPrice,
              sale: totalPrice,
              currency: currency
            },
            savings: 0
          })
        }
      } catch (err) {
        console.error('Bundle fetch error:', err)
        setError(err instanceof Error ? err.message : 'Failed to load bundle data')
        
        // Don't use fallback data, just set null
        setBundleData(null)
      } finally {
        setLoading(false)
      }
    }

    fetchBundleData()
  }, [baseDomain, currency])

  return { bundleData, loading, error }
}