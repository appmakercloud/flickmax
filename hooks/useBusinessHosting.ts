'use client'

import { useMemo } from 'react'
import { useProductsByTag } from './useCatalog'
import { useCountry } from '@/contexts/CountryContext'
import type { Product } from '@/types/catalog'
import type { HostingPlan } from './useHostingProducts'

function transformToBusinessPlan(product: Product): HostingPlan | null {
  const monthlyPrice = product.pricing.monthly?.price.current || 0
  const yearlyPrice = product.pricing.yearly?.price.current || 0
  const currency = product.pricing.monthly?.price.currency || 'USD'

  // Extract features from the product features array
  const features = product.features
    .filter(f => f.value === true || typeof f.value === 'string')
    .map(f => f.description || f.name)

  // Extract limits from features - parse from description if value is boolean
  const limits: HostingPlan['limits'] = {}
  
  product.features.forEach(feature => {
    const name = feature.name.toLowerCase()
    const desc = (feature.description || '').toLowerCase()
    
    // For features where value is true, parse from description
    if (feature.value === true && feature.description) {
      // Parse websites from description like "50 websites"
      if (name === 'websites' || desc.includes('website')) {
        const match = feature.description.match(/(\d+|unlimited)\s*website/i)
        if (match) {
          limits.websites = match[1] === 'unlimited' ? 'unlimited' : Number(match[1])
        }
      }
      // Parse storage from description like "100 GB storage"
      else if (name === 'storage' || desc.includes('storage')) {
        const match = feature.description.match(/(\d+)\s*GB/i)
        if (match) {
          limits.storage = `${match[1]} GB NVMe storage`
        }
      }
      // Parse databases
      else if (name === 'databases' || desc.includes('database')) {
        const match = feature.description.match(/(\d+|unlimited)\s*database/i)
        if (match) {
          limits.databases = match[1] === 'unlimited' ? 'unlimited' : Number(match[1])
        }
      }
      // Parse RAM
      else if (desc.includes('ram') || desc.includes('gb ram')) {
        const match = feature.description.match(/(\d+)\s*GB\s*RAM/i)
        if (match) {
          limits.ram = `${match[1]} GB RAM`
        }
      }
      // Parse CPU
      else if (desc.includes('cpu') || desc.includes('vcpu')) {
        const match = feature.description.match(/(\d+)\s*(v?CPU|core)/i)
        if (match) {
          limits.cpu = `${match[1]} CPUs`
        }
      }
    } else if (feature.value !== true) {
      // Use the actual value if it's not a boolean
      if (name.includes('website')) {
        limits.websites = feature.value === 'unlimited' ? 'unlimited' : Number(feature.value) || 1
      } else if (name.includes('storage')) {
        limits.storage = `${feature.value} NVMe storage`
      } else if (name.includes('database')) {
        limits.databases = feature.value === 'unlimited' ? 'unlimited' : Number(feature.value) || 0
      } else if (name.includes('ram')) {
        limits.ram = `${feature.value} RAM`
      } else if (name.includes('cpu')) {
        limits.cpu = `${feature.value}`
      }
    }
  })
  
  // Add default values if not found
  if (!limits.websites) limits.websites = 50
  if (!limits.storage) limits.storage = '100 GB NVMe storage'
  if (!limits.databases) limits.databases = 'unlimited'
  if (!limits.ssl) limits.ssl = 'Free, unlimited SSL for all your websites'

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

interface UseBusinessHostingReturn {
  plans: HostingPlan[]
  loading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

export function useBusinessHosting(): UseBusinessHostingReturn {
  const { currency } = useCountry()
  
  const options = useMemo(() => ({
    currencyType: currency,
    marketId: 'en-US',
    separateDisclaimers: false
  }), [currency])
  
  const { products, loading, error, refetch } = useProductsByTag('business', options)

  const plans = useMemo(() => {
    return products
      .map(transformToBusinessPlan)
      .filter((plan): plan is HostingPlan => plan !== null)
      .sort((a, b) => a.price.monthly - b.price.monthly)
  }, [products])

  return { plans, loading, error, refetch }
}