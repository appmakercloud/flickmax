import { useState, useEffect } from 'react'
import { useCountry } from '@/contexts/CountryContext'

export interface Microsoft365Product {
  id: string
  name: string
  type: string
  description?: string
  simpleDescription?: string
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
  storage: string
  users: string
  support: string
  apps: string
  meetings: string | boolean
  term?: string
  order?: number
}

interface Microsoft365ProductsResponse {
  success: boolean
  error?: string
  data: {
    title: string
    subtitle?: string
    description?: string
    products: Microsoft365Product[]
    currency: string
    market: string
  }
}

export function useMicrosoft365Products() {
  const [products, setProducts] = useState<Microsoft365Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { currency, locale } = useCountry()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(
          `/api/products/microsoft-365?currency=${currency}`
        )

        if (!response.ok) {
          throw new Error('Failed to fetch Microsoft 365 products')
        }

        const data: Microsoft365ProductsResponse = await response.json()

        if (data.success && data.data.products) {
          setProducts(data.data.products)
        } else {
          setProducts([])
        }
      } catch (err) {
        console.error('Error fetching Microsoft 365 products:', err)
        setError(err instanceof Error ? err.message : 'Failed to load Microsoft 365 products')
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [currency, locale])

  return { products, loading, error }
}