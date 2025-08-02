export interface Price {
  current: number
  list: number
  discount?: number
  unit: string
  currency: string
}

export interface PricingPlan {
  id: string
  period: number
  unit: string
  price: Price
}

export interface Feature {
  id: string
  name: string
  value: string | boolean | number | 'unlimited'
  description?: string
}

export interface Product {
  id: string
  name: string
  description: string
  shortDescription?: string
  category: string
  subcategory?: string
  features: Feature[]
  pricing: {
    monthly?: PricingPlan
    yearly?: PricingPlan
    [key: string]: PricingPlan | undefined
  }
  tags: string[]
  popular?: boolean
  recommended?: boolean
  badge?: string
  disclaimers?: string[]
}

export interface CatalogResponse {
  products: Product[]
  pagination: {
    total: number
    page: number
    pageSize: number
  }
}

export interface Tag {
  id: string
  name: string
  description?: string
  products: string[]
  count: number
}

export interface ApiError {
  code: string
  message: string
  details?: Record<string, any>
}