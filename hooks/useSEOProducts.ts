import { useState, useEffect } from 'react'
import { useCountry } from '@/contexts/CountryContext'

export interface SEOProduct {
  id: string
  name: string
  alias?: string
  description?: string
  price: {
    monthly: number
    currency: string
  }
  originalPrice: {
    monthly: number
    currency: string
  }
  features: string[]
  term?: string
  order?: number
  image?: string
  imageId?: string
}

interface SEOProductsResponse {
  success: boolean
  error?: string
  data: {
    title: string
    subtitle?: string
    description?: string
    products: SEOProduct[]
    currency: string
    market: string
  }
}

export function useSEOProducts() {
  const [products, setProducts] = useState<SEOProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [metadata, setMetadata] = useState<{
    title: string
    subtitle?: string
    description?: string
  }>({
    title: 'SEO'
  })
  const { currency, locale } = useCountry()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(
          `/api/products/seo?currency=${currency}`
        )

        if (!response.ok) {
          throw new Error('Failed to fetch SEO products')
        }

        const data: SEOProductsResponse = await response.json()

        if (data.success && data.data.products) {
          setProducts(data.data.products)
          setMetadata({
            title: data.data.title,
            subtitle: data.data.subtitle,
            description: data.data.description
          })
        } else {
          setProducts([])
        }
      } catch (err) {
        console.error('Error fetching SEO products:', err)
        setError(err instanceof Error ? err.message : 'Failed to load SEO products')
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [currency, locale])

  return { products, loading, error, metadata }
}