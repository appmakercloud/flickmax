'use client'

import { useState, useEffect } from 'react'
import { useCountry } from '@/contexts/CountryContext'
import type { HostingPlan } from '@/types/hosting-plans'

interface UseWebHostingPlansReturn {
  cpanelPlans: HostingPlan[]
  businessPlans: HostingPlan[]
  loading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

export function useWebHostingPlans(): UseWebHostingPlansReturn {
  const [cpanelPlans, setCpanelPlans] = useState<HostingPlan[]>([])
  const [businessPlans, setBusinessPlans] = useState<HostingPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const { currency } = useCountry()

  const fetchPlans = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/products/web-hosting?currency=${currency}`)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch plans: ${response.statusText}`)
      }
      
      const data = await response.json()
      
      // Transform API response to match HostingPlan interface
      if (data.cpanelPlans) {
        setCpanelPlans(data.cpanelPlans.map(transformToHostingPlan))
      }
      
      if (data.businessPlans) {
        setBusinessPlans(data.businessPlans.map(transformToHostingPlan))
      }
      
    } catch (err) {
      console.error('Error fetching web hosting plans:', err)
      setError(err as Error)
      // Keep existing plans if any
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPlans()
  }, [currency])

  return { cpanelPlans, businessPlans, loading, error, refetch: fetchPlans }
}

// Transform API response to match HostingPlan interface
function transformToHostingPlan(apiPlan: any): HostingPlan {
  return {
    id: apiPlan.id,
    name: apiPlan.name,
    description: apiPlan.description,
    price: {
      monthly: apiPlan.price.monthly,
      yearly: apiPlan.price.yearly,
      currency: apiPlan.price.currency
    },
    features: apiPlan.features || [],
    recommended: apiPlan.recommended || false,
    badge: apiPlan.badge,
    limits: apiPlan.limits || {},
    originalPrice: apiPlan.originalPrice,
    savings: apiPlan.savings
  }
}