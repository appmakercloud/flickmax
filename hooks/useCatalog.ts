'use client'

import { useState, useEffect } from 'react'
import { catalogAPI } from '@/lib/api/catalog'
import type { Product, Tag } from '@/types/catalog'

interface UseProductsOptions {
  currencyType?: string
  marketId?: string
  separateDisclaimers?: boolean
}

interface UseProductsReturn {
  products: Product[]
  loading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

export function useProducts(options?: UseProductsOptions): UseProductsReturn {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await catalogAPI.getProducts(options)
      setProducts(data)
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [options?.currencyType, options?.marketId, options?.separateDisclaimers])

  return { products, loading, error, refetch: fetchProducts }
}

interface UseProductByIdReturn {
  product: Product | null
  loading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

export function useProductById(
  productId: string,
  options?: UseProductsOptions
): UseProductByIdReturn {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchProduct = async () => {
    if (!productId) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const data = await catalogAPI.getProductById(productId, options)
      setProduct(data)
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProduct()
  }, [productId, options?.currencyType, options?.marketId, options?.separateDisclaimers])

  return { product, loading, error, refetch: fetchProduct }
}

interface UseTagsReturn {
  tags: Tag[]
  loading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

export function useTags(marketId?: string): UseTagsReturn {
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchTags = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await catalogAPI.getTags(marketId)
      setTags(data)
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTags()
  }, [marketId])

  return { tags, loading, error, refetch: fetchTags }
}

interface UseProductsByTagReturn {
  products: Product[]
  loading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

export function useProductsByTag(
  tagId: string,
  options?: UseProductsOptions
): UseProductsByTagReturn {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchProducts = async () => {
    if (!tagId) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const data = await catalogAPI.getProductsByTag(tagId, options)
      setProducts(data)
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (tagId) {
      fetchProducts()
    }
  }, [tagId, options?.currencyType, options?.marketId, options?.separateDisclaimers])

  return { products, loading, error, refetch: fetchProducts }
}