import { useState, useEffect } from 'react'
import { useCountry } from '@/contexts/CountryContext'

export interface WebsiteSecurityProduct {
  id: string
  name: string
  type: string
  title?: string
  alias?: string
  price: {
    monthly: number
    yearly: number
    currency: string
  }
  originalPrice: {
    monthly: number
    yearly: number
    currency: string
  }
  features: string[]
  badge: string | null
  gradient: string
  popular: boolean
  icon: string
  scanFrequency: string
  cleanup: string
  support: string
  term?: string
  order?: number
}

interface WebsiteSecurityProductsResponse {
  success: boolean
  error?: string
  data: {
    title: string
    subtitle?: string
    description?: string
    products: WebsiteSecurityProduct[]
    currency: string
    market: string
  }
}

export function useWebsiteSecurityProducts() {
  const [products, setProducts] = useState<WebsiteSecurityProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { currency, locale } = useCountry()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(
          `/api/products/website-security?currency=${currency}`
        )

        if (!response.ok) {
          throw new Error('Failed to fetch website security products')
        }

        const data: WebsiteSecurityProductsResponse = await response.json()

        if (data.success && data.data.products) {
          setProducts(data.data.products)
        } else {
          // Use fallback data if API fails
          setProducts(data.data.products || [])
        }
      } catch (err) {
        console.error('Error fetching website security products:', err)
        setError(err instanceof Error ? err.message : 'Failed to load website security products')
        
        // Set fallback products on error
        setProducts([
          {
            id: 'website-security-standard',
            name: 'Standard',
            type: 'Essential Protection',
            price: { monthly: 36.99, yearly: 443.99, currency: currency },
            originalPrice: { monthly: 36.99, yearly: 443.99, currency: currency },
            features: [
              'Protects one website',
              'Firewall prevents hackers',
              'SSL certificate included',
              'Daily malware scanning',
              'Annual site cleanup'
            ],
            badge: null,
            gradient: 'from-blue-500 to-cyan-500',
            popular: false,
            icon: 'Shield',
            scanFrequency: 'Daily',
            cleanup: '1 per year',
            support: 'Email',
            order: 1
          },
          {
            id: 'website-security-advanced',
            name: 'Advanced',
            type: 'Complete Protection',
            price: { monthly: 123.41, yearly: 1480.99, currency: currency },
            originalPrice: { monthly: 123.41, yearly: 1480.99, currency: currency },
            features: [
              'Protects one website',
              'Firewall prevents hackers',
              'SSL certificate included',
              '12-hour malware scanning',
              'Unlimited site cleanups',
              'DDoS protection & CDN',
              '25 GB secure backup'
            ],
            badge: 'MOST POPULAR',
            gradient: 'from-cyan-500 to-blue-500',
            popular: true,
            icon: 'ShieldCheck',
            scanFrequency: '12-hour',
            cleanup: 'Unlimited',
            support: 'Priority',
            order: 2
          },
          {
            id: 'website-security-premium',
            name: 'Premium',
            type: 'Maximum Protection',
            price: { monthly: 29.99, yearly: 359.88, currency: currency },
            originalPrice: { monthly: 29.99, yearly: 359.88, currency: currency },
            features: [
              'Protects one website',
              'Firewall prevents hackers',
              'SSL certificate included',
              'Real-time malware scanning',
              'Unlimited site cleanups',
              'DDoS protection & CDN',
              'Priority cleanup & repair',
              '200 GB secure backup'
            ],
            badge: 'BEST VALUE',
            gradient: 'from-purple-500 to-pink-500',
            popular: false,
            icon: 'Award',
            scanFrequency: 'Real-time',
            cleanup: 'Unlimited + Priority',
            support: '24/7 Phone',
            order: 3
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [currency, locale])

  return { products, loading, error }
}