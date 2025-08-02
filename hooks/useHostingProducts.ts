'use client'

import { useMemo } from 'react'
import { useProducts, useProductsByTag } from './useCatalog'
import type { Product } from '@/types/catalog'

export interface HostingPlan {
  id: string
  name: string
  description: string
  price: {
    monthly: number
    yearly: number
    currency: string
  }
  features: string[]
  recommended?: boolean
  badge?: string
  limits: {
    websites?: number | 'unlimited'
    storage?: string
    bandwidth?: string
    databases?: number | 'unlimited'
    email?: number | 'unlimited'
    domains?: number | 'unlimited'
    ram?: string
    cpu?: string
    ssl?: string
  }
}

function transformToHostingPlan(product: Product): HostingPlan | null {
  // Only transform hosting products
  if (product.category !== 'hosting' && !product.tags.includes('hosting')) {
    return null
  }

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
    if (name.includes('website') || name.includes('sites')) {
      limits.websites = feature.value === 'unlimited' ? 'unlimited' : Number(feature.value) || 1
    } else if (name.includes('storage') || name.includes('disk')) {
      limits.storage = String(feature.value)
    } else if (name.includes('bandwidth')) {
      limits.bandwidth = String(feature.value)
    } else if (name.includes('database')) {
      limits.databases = feature.value === 'unlimited' ? 'unlimited' : Number(feature.value) || 0
    } else if (name.includes('email')) {
      limits.email = feature.value === 'unlimited' ? 'unlimited' : Number(feature.value) || 0
    } else if (name.includes('domain')) {
      limits.domains = feature.value === 'unlimited' ? 'unlimited' : Number(feature.value) || 1
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

interface UseHostingPlansReturn {
  plans: HostingPlan[]
  loading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

export function useHostingPlans(): UseHostingPlansReturn {
  // First try to get products by hosting tag
  const { products: taggedProducts, loading: tagLoading, error: tagError, refetch: tagRefetch } = useProductsByTag('hosting')
  
  // Fallback to all products and filter
  const { products: allProducts, loading: allLoading, error: allError, refetch: allRefetch } = useProducts()

  const plans = useMemo(() => {
    const productsToUse = taggedProducts.length > 0 ? taggedProducts : allProducts
    return productsToUse
      .map(transformToHostingPlan)
      .filter((plan): plan is HostingPlan => plan !== null)
      .sort((a, b) => a.price.monthly - b.price.monthly)
  }, [taggedProducts, allProducts])

  const loading = taggedProducts.length > 0 ? tagLoading : allLoading
  const error = taggedProducts.length > 0 ? tagError : allError
  const refetch = async () => {
    await Promise.all([tagRefetch(), allRefetch()])
  }

  return { plans, loading, error, refetch }
}

export function useHostingPlanById(planId: string): {
  plan: HostingPlan | null
  loading: boolean
  error: Error | null
} {
  const { plans, loading, error } = useHostingPlans()
  
  const plan = useMemo(() => {
    return plans.find(p => p.id === planId) || null
  }, [plans, planId])

  return { plan, loading, error }
}