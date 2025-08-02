'use client'

import { useMemo } from 'react'
import { useProductsByTag } from './useCatalog'
import { useCountry } from '@/contexts/CountryContext'
import type { Product } from '@/types/catalog'
import type { HostingPlan } from './useHostingProducts'

function transformToCPanelPlan(product: Product): HostingPlan | null {
  const monthlyPrice = product.pricing.monthly?.price.current || 0
  const yearlyPrice = product.pricing.yearly?.price.current || 0
  const currency = product.pricing.monthly?.price.currency || 'USD'

  // Extract features from the product features array
  const features = product.features
    .filter(f => f.value === true || typeof f.value === 'string')
    .map(f => f.description || f.name)

  // Extract limits from features
  const limits: HostingPlan['limits'] = {}
  
  product.features.forEach(feature => {
    const name = feature.name.toLowerCase()
    if (name.includes('website') || name.includes('sites') || name.includes('domain')) {
      limits.websites = feature.value === 'unlimited' ? 'unlimited' : Number(feature.value) || 1
    } else if (name.includes('storage') || name.includes('disk')) {
      limits.storage = String(feature.value)
    } else if (name.includes('bandwidth')) {
      limits.bandwidth = String(feature.value)
    } else if (name.includes('database')) {
      limits.databases = feature.value === 'unlimited' ? 'unlimited' : Number(feature.value) || 0
    } else if (name.includes('email')) {
      limits.email = feature.value === 'unlimited' ? 'unlimited' : Number(feature.value) || 0
    }
  })

  return {
    id: product.id,
    name: product.name,
    description: product.shortDescription || product.description,
    price: {
      monthly: monthlyPrice,
      yearly: yearlyPrice,
      currency
    },
    features,
    recommended: product.recommended,
    badge: product.badge,
    limits
  }
}

interface UseCPanelPlansReturn {
  plans: HostingPlan[]
  loading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

export function useCPanelPlans(): UseCPanelPlansReturn {
  const { currency } = useCountry()
  
  const options = useMemo(() => ({
    currencyType: currency,
    marketId: 'en-US',
    separateDisclaimers: false
  }), [currency])
  
  const { products, loading, error, refetch } = useProductsByTag('cpanel', options)

  const plans = useMemo(() => {
    return products
      .map(transformToCPanelPlan)
      .filter((plan): plan is HostingPlan => plan !== null)
      .sort((a, b) => a.price.monthly - b.price.monthly)
  }, [products])

  return { plans, loading, error, refetch }
}