import { useState, useEffect } from 'react'
import { useCountry } from '@/contexts/CountryContext'

export interface ProfessionalEmailProduct {
  id: string
  name: string
  type: string
  description?: string
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
  recommendation?: string
  term?: string
  order?: number
}

interface ProfessionalEmailProductsResponse {
  success: boolean
  error?: string
  data: {
    title: string
    subtitle?: string
    description?: string
    products: ProfessionalEmailProduct[]
    currency: string
    market: string
  }
}

export function useProfessionalEmailProducts() {
  const [products, setProducts] = useState<ProfessionalEmailProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { currency, locale } = useCountry()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(
          `/api/products/professional-email?currency=${currency}`
        )

        if (!response.ok) {
          throw new Error('Failed to fetch professional email products')
        }

        const data: ProfessionalEmailProductsResponse = await response.json()

        if (data.success && data.data.products) {
          setProducts(data.data.products)
        } else {
          // Use fallback data if API fails
          setProducts(data.data.products || [])
        }
      } catch (err) {
        console.error('Error fetching professional email products:', err)
        setError(err instanceof Error ? err.message : 'Failed to load professional email products')
        
        // Set fallback products on error
        setProducts([
          {
            id: 'professional-email-individual',
            name: 'Individual',
            type: 'Essential Email',
            description: 'Perfect for getting started',
            price: { monthly: 39, yearly: 468, currency: currency },
            originalPrice: { monthly: 169, yearly: 2028, currency: currency },
            features: [
              'Email that matches your domain',
              '10 GB of email storage',
              'Mobile-friendly webmail',
              'Calendar, contacts and tasks',
              'Works with the email app of your choice'
            ],
            badge: null,
            gradient: 'from-blue-400 to-cyan-500',
            popular: false,
            icon: 'Mail',
            storage: '10 GB',
            users: '1 user',
            support: 'Email support',
            order: 1
          },
          {
            id: 'professional-email-team',
            name: 'Team',
            type: 'Collaborative Email',
            description: 'Great for teams',
            price: { monthly: 119, yearly: 1428, currency: currency },
            originalPrice: { monthly: 269, yearly: 3228, currency: currency },
            features: [
              'Email that matches your domain',
              '25 GB of email storage',
              'Mobile-friendly webmail',
              'Share calendar, contacts and tasks',
              'Assign tasks to your team members',
              'Works with the email app of your choice'
            ],
            badge: 'MOST POPULAR',
            gradient: 'from-cyan-500 to-blue-600',
            popular: true,
            icon: 'Users',
            storage: '25 GB',
            users: 'Multiple users',
            support: 'Priority support',
            order: 2
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