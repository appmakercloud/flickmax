import { useState, useEffect } from 'react'
import { useCountry } from '@/contexts/CountryContext'

export interface SSLProduct {
  id: string
  name: string
  type: string
  title?: string
  alias?: string
  price: {
    yearly: number
    multi: number
    currency: string
  }
  originalPrice: {
    yearly: number
    multi: number
    currency: string
  }
  features: string[]
  badge: string | null
  gradient: string
  popular: boolean
  icon: string
  warranty: string
  validation: string
  browsers: string
  term?: string
  order?: number
  isManaged?: boolean
  category?: 'single' | 'multi' | 'wildcard'
}

interface SSLProductsResponse {
  success: boolean
  error?: string
  data: {
    title: string
    subtitle?: string
    description?: string
    products: SSLProduct[]
    currency: string
    market: string
  }
}

export function useSSLProducts(type: 'diy' | 'managed' | 'all' = 'all') {
  const [products, setProducts] = useState<SSLProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { currency, locale } = useCountry()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        setError(null)

        if (type === 'all') {
          // Fetch both DIY and Managed products
          const [diyResponse, managedResponse] = await Promise.all([
            fetch(`/api/products/ssl?currency=${currency}&market=${locale}&type=diy`),
            fetch(`/api/products/ssl?currency=${currency}&market=${locale}&type=managed`)
          ])

          if (!diyResponse.ok || !managedResponse.ok) {
            throw new Error('Failed to fetch SSL products')
          }

          const diyData: SSLProductsResponse = await diyResponse.json()
          const managedData: SSLProductsResponse = await managedResponse.json()

          const allProducts = [
            ...(diyData.data.products || []),
            ...(managedData.data.products || [])
          ]

          setProducts(allProducts)
        } else {
          const response = await fetch(
            `/api/products/ssl?currency=${currency}&market=${locale}&type=${type}`
          )

          if (!response.ok) {
            throw new Error('Failed to fetch SSL products')
          }

          const data: SSLProductsResponse = await response.json()

          if (data.success && data.data.products) {
            setProducts(data.data.products)
          } else {
            // Use fallback data if API fails
            setProducts(data.data.products || [])
          }
        }
      } catch (err) {
        console.error('Error fetching SSL products:', err)
        setError(err instanceof Error ? err.message : 'Failed to load SSL products')
        
        // Set fallback products on error
        setProducts([
          {
            id: 'ssl-standard',
            name: 'Basic SSL',
            type: 'Domain Validation (DV)',
            price: { yearly: 69.99, multi: 59.99, currency: currency },
            originalPrice: { yearly: 99.99, multi: 89.99, currency: currency },
            features: [
              'Domain validation',
              'Strong SHA-2 & 2048-bit encryption',
              'Padlock in address bar',
              'Protects 1 website',
              'SEO ranking boost',
              '30-day money-back guarantee',
              'Issued in minutes',
              '24/7 security support'
            ],
            badge: null,
            gradient: 'from-blue-500 to-cyan-500',
            popular: false,
            icon: 'Shield',
            warranty: '$10,000',
            validation: '5 minutes',
            browsers: '99.9%'
          },
          {
            id: 'ssl-standard-ucc',
            name: 'Multi-Site SSL',
            type: 'Domain Validation (5 Sites)',
            price: { yearly: 149.99, multi: 129.99, currency: currency },
            originalPrice: { yearly: 249.99, multi: 199.99, currency: currency },
            features: [
              'Protects 5 websites',
              'Domain validation',
              'Strong SHA-2 & 2048-bit encryption',
              'Trust seal included',
              'SEO ranking boost',
              '30-day money-back guarantee',
              'Priority support',
              '$50,000 warranty protection'
            ],
            badge: 'MOST POPULAR',
            gradient: 'from-cyan-500 to-blue-500',
            popular: true,
            icon: 'ShieldCheck',
            warranty: '$50,000',
            validation: '5 minutes',
            browsers: '99.9%'
          },
          {
            id: 'ssl-standard-wildcard',
            name: 'Wildcard SSL',
            type: 'Unlimited Subdomains',
            price: { yearly: 276.99, multi: 249.99, currency: currency },
            originalPrice: { yearly: 399.99, multi: 349.99, currency: currency },
            features: [
              'Protects unlimited subdomains',
              'Domain validation',
              'Strong SHA-2 & 2048-bit encryption',
              'One certificate for all subdomains',
              'Padlock in address bar',
              'SEO ranking boost',
              '30-day money-back guarantee',
              'Easy subdomain management',
              '24/7 expert support',
              '$100,000 warranty protection'
            ],
            badge: 'BEST VALUE',
            gradient: 'from-green-500 to-teal-500',
            popular: false,
            icon: 'Globe',
            warranty: '$100,000',
            validation: '5 minutes',
            browsers: '99.9%'
          },
          {
            id: 'ssl-premium',
            name: 'Premium SSL',
            type: 'Extended Validation (EV)',
            price: { yearly: 149.99, multi: 129.99, currency: currency },
            originalPrice: { yearly: 299.99, multi: 249.99, currency: currency },
            features: [
              'Extended validation (EV)',
              'Strongest SHA-2 & 2048-bit encryption',
              'Green address bar with company name',
              'Protects 1 website',
              'Dynamic trust seal',
              'Maximum SEO boost',
              '30-day money-back guarantee',
              'Dedicated account manager',
              'Priority 24/7 support',
              '$1.5M warranty protection'
            ],
            badge: 'MAXIMUM TRUST',
            gradient: 'from-purple-500 to-pink-500',
            popular: false,
            icon: 'Award',
            warranty: '$1.5M',
            validation: '5-7 days',
            browsers: '99.9%'
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [currency, locale, type])

  return { products, loading, error }
}