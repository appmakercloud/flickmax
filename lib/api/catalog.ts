import { API_CONFIG, API_ENDPOINTS } from './config'
import type { Product, Tag, ApiError, Feature } from '@/types/catalog'
import type { APIProduct, APIPricing, APIFeature, APITag } from '@/types/api-responses'

interface FetchOptions {
  currencyType?: string
  marketId?: string
  separateDisclaimers?: boolean
}

class CatalogAPI {
  private baseUrl: string
  private privateLabelId: string

  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL
    this.privateLabelId = API_CONFIG.PRIVATE_LABEL_ID
  }

  private buildUrl(endpoint: string, params?: Record<string, string | number | boolean>): string {
    const url = new URL(`${this.baseUrl}${endpoint}`)
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.append(key, String(value))
        }
      })
    }
    return url.toString()
  }

  private async fetcher<T>(url: string): Promise<T> {
    try {
      const response = await fetch(url, {
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        credentials: 'omit',
      })

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`
        try {
          const error: ApiError = await response.json()
          errorMessage = error.message || errorMessage
        } catch {
          // If response is not JSON, use default error message
        }
        throw new Error(errorMessage)
      }

      return await response.json()
    } catch (error) {
      console.error('API fetch error:', error)
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error. Please check your connection.')
      }
      throw error
    }
  }

  /**
   * Get all products from the catalog
   */
  async getProducts(options?: FetchOptions): Promise<Product[]> {
    const endpoint = API_ENDPOINTS.PRODUCTS(this.privateLabelId)
    const url = this.buildUrl(endpoint, {
      currencyType: options?.currencyType || API_CONFIG.DEFAULT_CURRENCY,
      marketId: options?.marketId || API_CONFIG.DEFAULT_MARKET,
      separateDisclaimers: options?.separateDisclaimers ?? false,
    })

    const response = await this.fetcher<APIProduct[]>(url)
    // Transform the API response to match our Product type
    return this.transformProducts(response)
  }

  /**
   * Get a specific product by ID
   */
  async getProductById(productId: string, options?: FetchOptions): Promise<Product> {
    const endpoint = API_ENDPOINTS.PRODUCT_BY_ID(this.privateLabelId, productId)
    const url = this.buildUrl(endpoint, {
      currencyType: options?.currencyType || API_CONFIG.DEFAULT_CURRENCY,
      marketId: options?.marketId || API_CONFIG.DEFAULT_MARKET,
      separateDisclaimers: options?.separateDisclaimers ?? false,
    })

    const response = await this.fetcher<APIProduct[]>(url)
    // API returns an array even for single product
    if (response.length === 0) {
      throw new Error('Product not found')
    }
    return this.transformProduct(response[0])
  }

  /**
   * Get all tags
   */
  async getTags(marketId?: string): Promise<Tag[]> {
    const endpoint = API_ENDPOINTS.TAGS(this.privateLabelId)
    const url = this.buildUrl(endpoint, {
      marketId: marketId || API_CONFIG.DEFAULT_MARKET,
    })

    const response = await this.fetcher<APIProduct[]>(url)
    return this.transformTags(response)
  }

  /**
   * Get products by tag
   */
  async getProductsByTag(tagId: string, options?: FetchOptions): Promise<Product[]> {
    const endpoint = API_ENDPOINTS.TAG_BY_ID(this.privateLabelId, tagId)
    const url = this.buildUrl(endpoint, {
      currencyType: options?.currencyType || API_CONFIG.DEFAULT_CURRENCY,
      marketId: options?.marketId || API_CONFIG.DEFAULT_MARKET,
      separateDisclaimers: options?.separateDisclaimers ?? false,
    })

    const response = await this.fetcher<APIProduct[]>(url)
    return this.transformProducts(response)
  }

  /**
   * Transform API response to our Product type
   */
  private transformProduct(apiProduct: APIProduct): Product {
    // Try to find pricing data in various locations
    const pricingData = apiProduct.pricing || 
                       apiProduct.plans || 
                       apiProduct.pricePlans ||
                       apiProduct.priceInfo ||
                       apiProduct.prices ||
                       []

    return {
      id: apiProduct.productId || apiProduct.id || '',
      name: apiProduct.title || apiProduct.name || '',
      description: apiProduct.content || apiProduct.description || '',
      shortDescription: apiProduct.alias || apiProduct.shortDescription,
      category: apiProduct.category || 'hosting',
      subcategory: apiProduct.subcategory,
      features: this.transformFeatures(apiProduct.features || [], apiProduct),
      pricing: this.transformPricing(pricingData, apiProduct),
      tags: this.transformTags(apiProduct.tags || []).map(tag => tag.name || ''),
      popular: apiProduct.popular || false,
      recommended: apiProduct.recommended || false,
      badge: apiProduct.badge,
      disclaimers: apiProduct.disclaimers || [],
    }
  }

  private transformProducts(apiProducts: APIProduct[]): Product[] {
    if (!Array.isArray(apiProducts)) {
      return []
    }
    return apiProducts.map(product => this.transformProduct(product))
  }

  private transformFeatures(apiFeatures: APIFeature[], apiProduct?: APIProduct): Feature[] {
    // If features array exists, use it
    if (apiFeatures && apiFeatures.length > 0) {
      return apiFeatures.map(feature => ({
        id: feature.id || feature.name || '',
        name: feature.name || '',
        value: feature.value ?? '',
        description: feature.description,
      }))
    }
    
    // Otherwise, try to parse from content HTML (for cPanel products)
    if (apiProduct?.content) {
      const features: Feature[] = []
      
      // Parse HTML content to extract features
      const content = apiProduct.content
      
      // Extract list items from content
      const listItemRegex = /<li>(.*?)<\/li>/g
      let match
      let index = 0
      
      while ((match = listItemRegex.exec(content)) !== null) {
        const featureText = match[1].replace(/<[^>]*>/g, '').trim()
        
        // Parse feature text to extract name and value
        if (featureText.includes(' website')) {
          features.push({
            id: `websites-${index}`,
            name: 'Websites',
            value: parseInt(featureText) || 1,
            description: featureText
          })
        } else if (featureText.includes(' database')) {
          features.push({
            id: `databases-${index}`,
            name: 'Databases',
            value: parseInt(featureText) || 1,
            description: featureText
          })
        } else if (featureText.includes(' GB storage') || featureText.includes(' storage')) {
          const storageMatch = featureText.match(/(\d+)\s*GB/)
          features.push({
            id: `storage-${index}`,
            name: 'Storage',
            value: storageMatch ? `${storageMatch[1]} GB` : featureText,
            description: featureText
          })
        } else if (featureText.toLowerCase().includes('ssl')) {
          features.push({
            id: `ssl-${index}`,
            name: 'SSL Certificate',
            value: true,
            description: featureText
          })
        } else {
          features.push({
            id: `feature-${index}`,
            name: featureText,
            value: true,
            description: featureText
          })
        }
        index++
      }
      
      // Add standard cPanel features
      features.push(
        { id: 'cpanel', name: 'cPanel Access', value: true, description: 'Full cPanel control panel' },
        { id: 'uptime', name: 'Uptime Guarantee', value: '99.9%', description: '99.9% uptime guarantee' },
        { id: 'support', name: 'Support', value: '24/7', description: '24/7 customer support' },
        { id: 'backup', name: 'Daily Backups', value: true, description: 'Daily automatic backups' }
      )
      
      return features
    }
    
    return []
  }

  private transformPricing(apiPricing: APIPricing, apiProduct?: APIProduct): Product['pricing'] {
    const pricing: Product['pricing'] = {}

    // Check if pricing is in the product level (like cPanel products)
    if (apiProduct?.listPrice || apiProduct?.salePrice) {
      const listPriceStr = String(apiProduct.listPrice || '$0')
      const salePriceStr = String(apiProduct.salePrice || apiProduct.listPrice || '$0')
      
      // Parse price strings like "$9.99" or "₹349.00" to numbers and extract currency
      const parsePrice = (priceStr: string | boolean): number => {
        if (typeof priceStr === 'boolean') return 0
        const price = priceStr.replace(/[^0-9.]/g, '')
        return parseFloat(price) || 0
      }
      
      // Extract currency symbol from price string
      const getCurrencyFromPrice = (priceStr: string | boolean): string => {
        if (typeof priceStr === 'boolean') return 'USD'
        const match = priceStr.match(/^([₹$€£¥R₦₵¥₨₱₡₴₪₺₩﷼]|[A-Z]{2,3}\$?)/);
        if (match) {
          const currencyMap: Record<string, string> = {
            '$': 'USD',
            '₹': 'INR',
            '€': 'EUR',
            '£': 'GBP',
            '¥': 'JPY',
            'R': 'ZAR',
            '₦': 'NGN',
            '₵': 'GHS',
            '₨': 'PKR',
            '₱': 'PHP',
            '₡': 'CRC',
            '₴': 'UAH',
            '₪': 'ILS',
            '₺': 'TRY',
            '₩': 'KRW',
            '﷼': 'SAR',
            'AU$': 'AUD',
            'CA$': 'CAD',
            'NZ$': 'NZD',
            'HK$': 'HKD',
            'S$': 'SGD',
            'MX$': 'MXN'
          }
          return currencyMap[match[1]] || 'USD'
        }
        return 'USD'
      }
      
      const listPrice = parsePrice(listPriceStr)
      const salePrice = parsePrice(salePriceStr)
      const currency = getCurrencyFromPrice(listPriceStr)
      
      // Assume monthly pricing when term is "month"
      if (apiProduct.term === 'month') {
        pricing.monthly = {
          id: 'monthly',
          period: 1,
          unit: 'MONTH',
          price: {
            current: salePrice || listPrice,
            list: listPrice,
            discount: listPrice > salePrice ? Math.round(((listPrice - salePrice) / listPrice) * 100) : 0,
            unit: 'MONTH',
            currency: currency
          }
        }
        
        // Estimate yearly pricing (common industry discount)
        const yearlyDiscount = 0.2 // 20% discount for yearly
        const yearlyPrice = listPrice * (1 - yearlyDiscount)
        pricing.yearly = {
          id: 'yearly',
          period: 1,
          unit: 'YEAR',
          price: {
            current: Math.round(yearlyPrice * 100) / 100,
            list: listPrice,
            discount: 20,
            unit: 'YEAR',
            currency: currency
          }
        }
      }
      
      return pricing
    }

    if (Array.isArray(apiPricing)) {
      apiPricing.forEach(plan => {
        const period = plan.period || plan.term || 1
        const unit = plan.unit || plan.billingCycle || 'MONTH'
        
        // Try multiple price field names
        const currentPrice = plan.price?.current || 
                           plan.currentPrice || 
                           plan.salePrice || 
                           plan.price ||
                           plan.amount ||
                           0
        
        const listPrice = plan.price?.list || 
                         plan.listPrice || 
                         plan.regularPrice || 
                         plan.price ||
                         currentPrice
        
        const pricingPlan = {
          id: plan.id || plan.planId,
          period: period,
          unit: unit,
          price: {
            current: typeof currentPrice === 'object' ? currentPrice.amount : currentPrice,
            list: typeof listPrice === 'object' ? listPrice.amount : listPrice,
            discount: plan.price?.discount || plan.discount || plan.discountPercent,
            unit: plan.price?.unit || unit,
            currency: plan.price?.currency || plan.currency || API_CONFIG.DEFAULT_CURRENCY,
          }
        }

        // Handle different billing cycles
        if ((unit === 'MONTH' || unit === 'monthly') && period === 1) {
          pricing.monthly = pricingPlan
        } else if ((unit === 'YEAR' || unit === 'yearly' || unit === 'annual') && period === 1) {
          pricing.yearly = pricingPlan
        } else if (unit === 'MONTH' && period === 12) {
          // Annual billing shown as monthly price
          pricing.yearly = {
            ...pricingPlan,
            unit: 'YEAR',
            price: {
              ...pricingPlan.price,
              current: pricingPlan.price.current,
              list: pricingPlan.price.list
            }
          }
        } else {
          pricing[`${period}${unit}`] = pricingPlan
        }
      })
    } else if (apiPricing && typeof apiPricing === 'object') {
      // Handle non-array pricing structure
      const monthlyPrice = apiPricing.monthly || apiPricing.month || apiPricing.monthlyPrice
      const yearlyPrice = apiPricing.yearly || apiPricing.year || apiPricing.annualPrice
      
      if (monthlyPrice) {
        pricing.monthly = {
          id: 'monthly',
          period: 1,
          unit: 'MONTH',
          price: {
            current: typeof monthlyPrice === 'object' ? monthlyPrice.amount : monthlyPrice,
            list: typeof monthlyPrice === 'object' ? monthlyPrice.list : monthlyPrice,
            discount: 0,
            unit: 'MONTH',
            currency: apiPricing.currency || apiPricing.currencyCode || API_CONFIG.DEFAULT_CURRENCY
          }
        }
      }
      
      if (yearlyPrice) {
        pricing.yearly = {
          id: 'yearly',
          period: 1,
          unit: 'YEAR',
          price: {
            current: typeof yearlyPrice === 'object' ? yearlyPrice.amount : yearlyPrice,
            list: typeof yearlyPrice === 'object' ? yearlyPrice.list : yearlyPrice,
            discount: 0,
            unit: 'YEAR',
            currency: apiPricing.currency || apiPricing.currencyCode || API_CONFIG.DEFAULT_CURRENCY
          }
        }
      }
    }

    return pricing
  }

  private transformTags(apiTags: APITag[]): Tag[] {
    return apiTags.map(tag => ({
      id: tag.id || '',
      name: tag.name || '',
      description: tag.description,
      products: tag.products || [],
      count: tag.count || tag.products?.length || 0,
    }))
  }
}

// Export singleton instance
export const catalogAPI = new CatalogAPI()