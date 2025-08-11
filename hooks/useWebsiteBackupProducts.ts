import { useState, useEffect } from 'react'
import { useCountry } from '@/contexts/CountryContext'

export interface WebsiteBackupProduct {
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
  storageSize: string
  websites: string
  frequency: string
  retention: string
  support: string
  recommendation?: string
  term?: string
  order?: number
}

interface WebsiteBackupProductsResponse {
  success: boolean
  error?: string
  data: {
    title: string
    subtitle?: string
    description?: string
    products: WebsiteBackupProduct[]
    currency: string
    market: string
  }
}

export function useWebsiteBackupProducts() {
  const [products, setProducts] = useState<WebsiteBackupProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { currency, locale } = useCountry()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        setError(null)

        console.log('Fetching backup products with currency:', currency)
        const response = await fetch(
          `/api/products/website-backup?currency=${currency}`
        )

        if (!response.ok) {
          throw new Error('Failed to fetch website backup products')
        }

        const data: WebsiteBackupProductsResponse = await response.json()

        if (data.success && data.data.products) {
          console.log('Received products with currency:', data.data.currency)
          console.log('First product price:', data.data.products[0]?.price)
          setProducts(data.data.products)
        } else {
          // Use fallback data if API fails
          setProducts(data.data.products || [])
        }
      } catch (err) {
        console.error('Error fetching website backup products:', err)
        setError(err instanceof Error ? err.message : 'Failed to load website backup products')
        
        // Set fallback products on error
        setProducts([
          {
            id: 'website-backup-5gb',
            name: 'Starter',
            type: '5 GB Storage',
            price: { monthly: 17.67, yearly: 211.99, currency: currency },
            originalPrice: { monthly: 17.67, yearly: 211.99, currency: currency },
            features: [
              'Automatic daily backups',
              'Built-in daily malware scanning',
              'Back up a file, folder or an entire database',
              'Continuous security monitoring',
              'Downloads to local storage',
              'Easy one-click restore',
              'Secure cloud storage',
              'One website per account'
            ],
            badge: null,
            gradient: 'from-emerald-500 to-teal-500',
            popular: false,
            icon: 'HardDrive',
            storageSize: '5 GB',
            websites: '1 website',
            frequency: 'Daily backups',
            retention: '30 days',
            support: 'Email',
            order: 1
          },
          {
            id: 'website-backup-25gb',
            name: 'Professional',
            type: '25 GB Storage',
            price: { monthly: 28.50, yearly: 341.99, currency: currency },
            originalPrice: { monthly: 28.50, yearly: 341.99, currency: currency },
            features: [
              'Automatic daily backups',
              'Built-in daily malware scanning',
              'Back up a file, folder or an entire database',
              'Continuous security monitoring',
              'Downloads to local storage',
              'Easy one-click restore',
              'Secure cloud storage',
              'One website per account',
              'Priority support',
              'Extended retention period'
            ],
            badge: 'MOST POPULAR',
            gradient: 'from-blue-500 to-cyan-500',
            popular: true,
            icon: 'Database',
            storageSize: '25 GB',
            websites: '1 website',
            frequency: 'Daily backups',
            retention: '90 days',
            support: 'Priority',
            order: 2
          },
          {
            id: 'website-backup-50gb',
            name: 'Business',
            type: '50 GB Storage',
            price: { monthly: 44.33, yearly: 531.99, currency: currency },
            originalPrice: { monthly: 44.33, yearly: 531.99, currency: currency },
            features: [
              'Automatic daily backups',
              'Built-in daily malware scanning',
              'Back up a file, folder or an entire database',
              'Continuous security monitoring',
              'Downloads to local storage',
              'Easy one-click restore',
              'Secure cloud storage',
              'One website per account',
              '24/7 phone support',
              '1 year retention period'
            ],
            badge: 'BEST VALUE',
            gradient: 'from-purple-500 to-pink-500',
            popular: false,
            icon: 'Cloud',
            storageSize: '50 GB',
            websites: '1 website',
            frequency: 'Daily backups',
            retention: '1 year',
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