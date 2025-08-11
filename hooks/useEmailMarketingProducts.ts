import { useState, useEffect } from 'react'
import { useCountry } from '@/contexts/CountryContext'

export interface EmailMarketingProduct {
  id: string
  name: string
  type: string
  description?: string
  tagline?: string
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
  contacts: string
  emails: string
  forms: string
  storage: string
  automation: boolean
  term?: string
  order?: number
}

interface EmailMarketingProductsResponse {
  success: boolean
  error?: string
  data: {
    title: string
    subtitle?: string
    description?: string
    products: EmailMarketingProduct[]
    currency: string
    market: string
  }
}

export function useEmailMarketingProducts() {
  const [products, setProducts] = useState<EmailMarketingProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { currency, locale } = useCountry()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(
          `/api/products/email-marketing?currency=${currency}`
        )

        if (!response.ok) {
          throw new Error('Failed to fetch email marketing products')
        }

        const data: EmailMarketingProductsResponse = await response.json()

        if (data.success && data.data.products) {
          setProducts(data.data.products)
        } else {
          setProducts([])
        }
      } catch (err) {
        console.error('Error fetching email marketing products:', err)
        setError(err instanceof Error ? err.message : 'Failed to load email marketing products')
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [currency, locale])

  return { products, loading, error }
}