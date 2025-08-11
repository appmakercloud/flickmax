import { NextRequest, NextResponse } from 'next/server'

const PLID = process.env.NEXT_PUBLIC_PLID || '590175'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const currencyType = searchParams.get('currency') || 'USD'
    // Always use en-US for marketId to get consistent pricing across regions
    // Only the currencyType changes for multi-currency support
    const marketId = 'en-US'
    
    // Fetch Website Builder products from GoDaddy
    const url = `https://www.secureserver.net/api/v1/catalog/${PLID}/tags/website-builder?currencyType=${currencyType}&marketId=${marketId}&separateDisclaimers=false`
    
    console.log('Fetching Website Builder products from GoDaddy:', { currencyType, marketId })
    
    const response = await fetch(url, {
      headers: {
        'accept': 'application/json',
        'Cache-Control': 'no-cache',
      },
      // Disable caching to always get fresh prices
      cache: 'no-store',
      next: { revalidate: 0 }
    })

    if (!response.ok) {
      throw new Error(`GoDaddy API responded with status: ${response.status}`)
    }

    const data = await response.json()
    
    console.log('GoDaddy API Response:', {
      id: data.id,
      productsCount: data.products?.length || 0,
      firstProduct: data.products?.[0],
    })
    
    // Transform the data to match our frontend structure
    const transformedPlans = transformProducts(data.products || [], currencyType)
    
    console.log('Returning transformed plans:', transformedPlans.length, 'plans')
    
    return NextResponse.json({
      success: true,
      plans: transformedPlans,
      currencyType,
      marketId,
      rawProductCount: data.products?.length || 0,
      tagInfo: {
        id: data.id,
        title: data.title,
        description: data.description,
        image: data.image
      }
    })
  } catch (error) {
    console.error('Error fetching Website Builder plans:', error)
    
    // Return fallback plans if API fails
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch Website Builder plans',
      plans: getFallbackPlans()
    })
  }
}

function extractPrice(priceString: string | number | boolean | any): number {
  // Handle various input types
  if (typeof priceString === 'boolean') return 0
  if (typeof priceString === 'number') return priceString
  if (!priceString) return 0
  
  // Convert to string if it's an object
  const priceStr = typeof priceString === 'string' ? priceString : String(priceString)
  
  // Remove currency symbols and spaces, keep numbers, commas and periods
  const cleanedPrice = priceStr.replace(/[^\d.,]/g, '')
  
  // Remove commas (thousand separators)
  const normalizedPrice = cleanedPrice.replace(/,/g, '')
  
  // Extract numeric value
  const match = normalizedPrice.match(/[\d.]+/)
  return match ? parseFloat(match[0]) : 0
}

interface Feature {
  text: string;
  highlight: boolean;
}

function parseFeatures(htmlContent: string): Feature[] {
  const features: Feature[] = []
  
  // Extract features from HTML list items
  const liMatches = htmlContent.match(/<li>(.*?)<\/li>/g)
  if (liMatches) {
    liMatches.forEach(li => {
      // Clean the text - remove HTML tags
      const text = li.replace(/<[^>]*>/g, '')
                   .replace(/&#42;/g, ' *')
                   .replace(/&#\d+;/g, ' **')
                   .replace(/&amp;/g, '&')
                   .replace(/&lt;/g, '<')
                   .replace(/&gt;/g, '>')
                   .trim()
      
      if (text) {
        // Determine highlight based on important keywords for website builder
        const highlight = text.toLowerCase().includes('free') ||
                         text.toLowerCase().includes('unlimited') ||
                         text.toLowerCase().includes('ssl') ||
                         text.toLowerCase().includes('templates') ||
                         text.toLowerCase().includes('mobile') ||
                         text.toLowerCase().includes('seo') ||
                         text.toLowerCase().includes('e-commerce') ||
                         text.toLowerCase().includes('drag')
        
        features.push({
          text: text,
          highlight: highlight
        })
      }
    })
  }
  
  return features
}

function transformProducts(products: any[], currency: string) {
  return products.map((product, index) => {
    // Extract prices from GoDaddy format
    // listPrice is the monthly price (no discount)
    const listPrice = extractPrice(product.listPrice || '0')
    
    // salePrice is the discounted yearly price (per month)
    // If salePrice is false or not available, use listPrice
    const hasSalePrice = product.salePrice !== false && product.salePrice
    const salePrice = hasSalePrice ? extractPrice(product.salePrice) : null
    
    // Pricing structure:
    // Monthly: always use listPrice (full price, no discount)
    const monthlyPrice = listPrice
    
    // Yearly: use salePrice if available, otherwise use listPrice
    const yearlyMonthlyRate = salePrice || listPrice
    const yearlyPrice = yearlyMonthlyRate * 12
    
    // Calculate original yearly price (what it would cost without discount)
    const originalYearlyPrice = listPrice * 12
    
    // Calculate exact percentage discount
    let savings = 0
    if (salePrice && listPrice > salePrice) {
      // Exact calculation: ((original - sale) / original) * 100
      savings = Math.round(((listPrice - salePrice) / listPrice) * 100)
    }
    
    // Parse features from HTML content
    const features = parseFeatures(product.content || '')
    
    // Determine plan type and badge based on actual product IDs and aliases
    let badge = ''
    let isPopular = false
    const productId = product.id || ''
    const alias = product.alias || ''
    
    // Map based on actual product IDs from the response
    if (productId.includes('onlinestore') || alias === 'Online Store') {
      badge = 'BEST FOR STORES'
    } else if (productId.includes('plus') || alias === 'Business Plus') {
      badge = 'ADVANCED'
      isPopular = true // Make Business Plus the popular one
    } else if (productId.includes('business') && !productId.includes('plus')) {
      badge = ''
    }
    
    // Use the alias directly as it's cleaner
    const planName = product.alias || 'Website Builder'
    
    return {
      productId: product.id,
      name: planName,
      tagline: getTagline(planName),
      monthlyPrice: monthlyPrice,
      yearlyPrice: yearlyPrice,
      yearlyMonthlyRate: yearlyMonthlyRate,
      originalPrice: originalYearlyPrice,
      originalMonthlyPrice: listPrice,
      savings: savings,
      hasSalePrice: hasSalePrice,
      badge: badge,
      isPopular: isPopular,
      features: features,
      description: product.content || '',
      term: product.term || 'month',
      order: product.order || index,
      resources: {
        storage: extractStorage(product),
        bandwidth: 'Unlimited',
        websites: extractWebsites(product),
        templates: extractTemplates(product)
      }
    }
  }).sort((a, b) => a.order - b.order)
}

function getTagline(planName: string): string {
  const name = planName.toLowerCase()
  if (name === 'personal') return 'Share your passion online'
  if (name === 'business plus') return 'Attract more customers'
  if (name === 'business') return 'Create an online presence'
  if (name === 'online store') return 'Sell products and services'
  return 'Build your website with ease'
}

function extractStorage(product: any): string {
  const title = product.title?.toLowerCase() || ''
  const features = product.content?.features?.toLowerCase() || ''
  
  // Try to extract storage from features
  const storageMatch = features.match(/(\d+)\s*gb/i)
  if (storageMatch) {
    return `${storageMatch[1]} GB`
  }
  
  // Default based on plan type
  if (title.includes('commerce') || title.includes('plus')) return 'Unlimited'
  if (title.includes('business')) return '100 GB'
  if (title.includes('professional')) return '50 GB'
  return '10 GB'
}

function extractWebsites(product: any): string {
  const title = product.title?.toLowerCase() || ''
  const features = product.content?.features?.toLowerCase() || ''
  
  // Try to extract website count from features
  const websiteMatch = features.match(/(\d+)\s*website/i)
  if (websiteMatch) {
    return `${websiteMatch[1]} Website${parseInt(websiteMatch[1]) > 1 ? 's' : ''}`
  }
  
  // Default based on plan type
  if (title.includes('commerce') || title.includes('plus')) return 'Unlimited'
  if (title.includes('business')) return '5 Websites'
  return '1 Website'
}

function extractTemplates(product: any): string {
  const title = product.title?.toLowerCase() || ''
  
  // Default based on plan type
  if (title.includes('commerce') || title.includes('plus')) return '300+ Templates'
  if (title.includes('business')) return '200+ Templates'
  if (title.includes('professional')) return '150+ Templates'
  return '100+ Templates'
}

function getFallbackPlans() {
  return [
    {
      productId: 'website-builder-personal',
      name: 'Personal',
      tagline: 'Share your passion online',
      monthlyPrice: 6.99,  // listPrice - full monthly price
      yearlyPrice: 59.88,  // salePrice * 12 (4.99 * 12)
      yearlyMonthlyRate: 4.99,  // salePrice - discounted yearly rate
      originalPrice: 83.88,  // listPrice * 12 - what yearly would cost without discount
      originalMonthlyPrice: 6.99,
      savings: 29,  // exact: ((6.99 - 4.99) / 6.99) * 100 = 28.6% ≈ 29%
      hasSalePrice: true,
      badge: '',
      isPopular: false,
      order: 0,
      features: [
        { text: 'Responsive mobile design', highlight: true },
        { text: 'Website hosting', highlight: false },
        { text: 'Rapid Page-Load performance', highlight: false },
        { text: 'Create a blog', highlight: false },
        { text: 'Security (SSL)', highlight: true },
        { text: '24/7 Support', highlight: false }
      ],
      resources: {
        storage: '10 GB',
        bandwidth: 'Unlimited',
        websites: '1 Website',
        templates: '100+ Templates'
      }
    },
    {
      productId: 'website-builder-business',
      name: 'Business',
      tagline: 'Create an online presence',
      monthlyPrice: 10.99,  // listPrice - no discount
      yearlyPrice: 131.88,  // No salePrice, so listPrice * 12
      yearlyMonthlyRate: 10.99,  // No discount for yearly
      originalPrice: 131.88,  // listPrice * 12
      originalMonthlyPrice: 10.99,
      savings: 0,  // No discount available
      hasSalePrice: false,
      badge: '',
      isPopular: false,
      order: 1,
      features: [
        { text: 'Responsive mobile design', highlight: true },
        { text: 'Website hosting', highlight: false },
        { text: 'Rapid Page-Load performance', highlight: false },
        { text: 'Create a blog', highlight: false },
        { text: 'Security (SSL)', highlight: true },
        { text: 'PayPal Buy Now or Donate button', highlight: true },
        { text: 'Search Engine Optimization (SEO)', highlight: true },
        { text: '24/7 Support', highlight: false }
      ],
      resources: {
        storage: '50 GB',
        bandwidth: 'Unlimited',
        websites: '1 Website',
        templates: '200+ Templates'
      }
    },
    {
      productId: 'website-builder-plus',
      name: 'Business Plus',
      tagline: 'Attract more customers',
      monthlyPrice: 15.99,  // listPrice
      yearlyPrice: 143.88,  // salePrice * 12 (11.99 * 12)
      yearlyMonthlyRate: 11.99,  // salePrice
      originalPrice: 191.88,  // listPrice * 12
      originalMonthlyPrice: 15.99,
      savings: 25,  // exact: ((15.99 - 11.99) / 15.99) * 100 = 25%
      hasSalePrice: true,
      badge: 'MOST POPULAR',
      isPopular: true,
      order: 2,
      features: [
        { text: 'Responsive mobile design', highlight: true },
        { text: 'Website hosting', highlight: false },
        { text: 'Rapid Page-Load performance', highlight: false },
        { text: 'Create a blog', highlight: false },
        { text: 'Security (SSL)', highlight: true },
        { text: 'PayPal Buy Now or Donate button', highlight: true },
        { text: 'Search Engine Optimization (SEO)', highlight: true },
        { text: 'Social Media Integration', highlight: true },
        { text: 'Share content to Facebook', highlight: true },
        { text: 'Online Appointments', highlight: true },
        { text: 'Priority Support', highlight: true }
      ],
      resources: {
        storage: '100 GB',
        bandwidth: 'Unlimited',
        websites: '1 Website',
        templates: '300+ Templates'
      }
    },
    {
      productId: 'website-builder-onlinestore',
      name: 'Online Store',
      tagline: 'Sell products and services',
      monthlyPrice: 29.99,  // listPrice
      yearlyPrice: 240.00,  // salePrice * 12 (20.00 * 12)
      yearlyMonthlyRate: 20.00,  // salePrice
      originalPrice: 359.88,  // listPrice * 12
      originalMonthlyPrice: 29.99,
      savings: 33,  // exact: ((29.99 - 20.00) / 29.99) * 100 = 33.3%
      hasSalePrice: true,
      badge: 'BEST FOR STORES',
      isPopular: false,
      order: 3,
      features: [
        { text: 'All Business Plus features', highlight: false },
        { text: 'Built-in shopping cart', highlight: true },
        { text: 'Sell physical and digital products', highlight: true },
        { text: 'Accept credit/debit cards, PayPal', highlight: true },
        { text: 'Flexible shipping options', highlight: true },
        { text: 'Discounts and promotions', highlight: true },
        { text: 'Manage inventory', highlight: true },
        { text: 'Abandoned Cart Recovery', highlight: true },
        { text: 'Product Catalog Management', highlight: true },
        { text: 'No transaction fees', highlight: true }
      ],
      resources: {
        storage: 'Unlimited',
        bandwidth: 'Unlimited',
        websites: '1 Website',
        templates: 'All Templates'
      }
    }
  ]
}