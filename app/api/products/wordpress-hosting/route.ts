import { NextRequest, NextResponse } from 'next/server'

const PLID = process.env.NEXT_PUBLIC_PLID || '590175'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const currencyType = searchParams.get('currency') || 'USD'
    const marketId = searchParams.get('market') || 'en-US'
    
    // Fetch WordPress hosting products from GoDaddy
    const url = `https://www.secureserver.net/api/v1/catalog/${PLID}/tags/wordpress?currencyType=${currencyType}&marketId=${marketId}&separateDisclaimers=false`
    
    const response = await fetch(url, {
      headers: {
        'accept': 'application/json',
      },
      // Cache for 1 hour
      next: { revalidate: 3600 }
    })

    if (!response.ok) {
      throw new Error(`GoDaddy API responded with status: ${response.status}`)
    }

    const data = await response.json()
    
    // Transform the data to match our frontend structure
    const transformedPlans = transformProducts(data.products || [], currencyType)
    
    return NextResponse.json({
      success: true,
      plans: transformedPlans,
      tagInfo: {
        id: data.id,
        title: data.title,
        description: data.description,
        image: data.image
      }
    })
  } catch (error) {
    console.error('Error fetching WordPress hosting plans:', error)
    
    // Return fallback plans if API fails
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch WordPress hosting plans',
      plans: getFallbackPlans()
    })
  }
}

function extractPrice(priceString: string | boolean): number {
  // Handle false or boolean values
  if (typeof priceString === 'boolean') return 0
  
  // Remove currency symbols and spaces, keep numbers, commas and periods
  const cleanedPrice = priceString.replace(/[^\d.,]/g, '')
  
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
      // Clean the text - remove HTML tags but keep asterisks for SSL note
      const text = li.replace(/<[^>]*>/g, '')
                   .replace(/&#42;/g, ' *')
                   .replace(/&#\d+;/g, ' **')
                   .replace(/&amp;/g, '&')
                   .replace(/&lt;/g, '<')
                   .replace(/&gt;/g, '>')
                   .trim()
      
      if (text) {
        // Determine highlight based on important keywords
        const highlight = text.toLowerCase().includes('free') ||
                         text.toLowerCase().includes('unlimited') ||
                         text.toLowerCase().includes('cloudflare') ||
                         text.toLowerCase().includes('staging') ||
                         text.toLowerCase().includes('ddos') ||
                         text.toLowerCase().includes('optimizer') ||
                         text.toLowerCase().includes('woocommerce')
        
        features.push({
          text: text,
          highlight: highlight
        })
      }
    })
  }
  
  return features
}

interface Product {
  id: string;
  listPrice: string | boolean;
  salePrice: string | boolean;
  content?: string;
  alias?: string;
  title?: string;
  term?: string;
}

interface TransformedPlan {
  productId: string;
  name: string;
  tagline: string;
  alias: string;
  monthlyPrice: number;
  yearlyPrice: number;
  yearlyMonthlyRate: number;
  originalPrice: number;
  originalMonthlyPrice: number;
  savings: number;
  badge: string;
  isPopular: boolean;
  order: number;
  features: Feature[];
  content?: string;
  title?: string;
  term?: string;
  hasPromo: boolean;
}

function transformProducts(products: Product[], currencyType: string = 'USD'): TransformedPlan[] {
  const transformedPlans: TransformedPlan[] = []

  products.forEach((product: Product) => {
    const productId = product.id
    
    // Extract prices from API
    const listPrice = extractPrice(product.listPrice)
    const salePrice = product.salePrice !== false ? extractPrice(product.salePrice) : 0
    
    // Monthly price is always the list price
    const monthlyPrice = listPrice
    
    // Yearly price calculation:
    // If there's a sale price, use it for yearly (it's already a monthly rate)
    let yearlyMonthlyRate = salePrice || listPrice
    let yearlyPrice = yearlyMonthlyRate * 12
    
    // If no sale price, apply a 40% discount for yearly
    if (!salePrice && listPrice) {
      yearlyMonthlyRate = listPrice * 0.6 // 40% off
      yearlyPrice = yearlyMonthlyRate * 12
    }
    
    // Calculate the original yearly price (always based on list price)
    const originalYearlyPrice = listPrice * 12
    
    // Calculate exact savings percentage
    let savings = 0
    if (originalYearlyPrice > 0 && yearlyPrice < originalYearlyPrice) {
      savings = Math.round(((originalYearlyPrice - yearlyPrice) / originalYearlyPrice) * 100)
    }
    
    // Parse features from HTML content - EXACT features from API
    const features = parseFeatures(product.content || '')
    
    // Determine plan name and badge based on product ID
    let name = 'Basic'
    let tagline = 'Best for getting started'
    let badge = ''
    let isPopular = false
    let order = 0
    
    if (productId.includes('deluxe')) {
      name = 'Deluxe'
      tagline = 'Best for growing sites'
      badge = ''
      isPopular = false
      order = 1
    } else if (productId.includes('ultimate')) {
      name = 'Ultimate'
      tagline = 'Best for demanding sites'
      badge = 'MOST POPULAR'
      isPopular = true
      order = 2
    }

    transformedPlans.push({
      productId: productId,
      name: name,
      tagline: tagline,
      alias: product.alias || name,
      monthlyPrice: monthlyPrice,
      yearlyPrice: yearlyPrice,
      yearlyMonthlyRate: yearlyMonthlyRate,
      originalPrice: originalYearlyPrice,
      originalMonthlyPrice: listPrice,
      savings: savings,
      badge: badge,
      isPopular: isPopular,
      order: order,
      features: features,
      content: product.content,
      title: product.title,
      term: product.term,
      hasPromo: salePrice > 0
    })
  })

  // Add the Ecommerce plan - optimized to show unique features vs Ultimate
  // Focus on what's UNIQUE to Ecommerce that Ultimate doesn't have
  const ecommerceFeatures = [
    // Core differences from Ultimate
    { text: 'Unlimited storage (vs 30 GB)', highlight: true },
    { text: 'Unlimited visits per month', highlight: true },
    { text: 'Real-time backups (vs daily)', highlight: true },
    { text: 'Premium SSL certificate', highlight: true },
    // WooCommerce specific features - UNIQUE to this plan
    { text: 'WooCommerce auto-installed & optimized', highlight: true },
    { text: 'No transaction fees', highlight: true },
    { text: 'Unlimited products', highlight: true },
    { text: 'Bookings & appointment scheduling', highlight: true },
    { text: 'Real-time shipping rates', highlight: true },
    { text: 'Premium WooCommerce themes', highlight: true },
    { text: '$6,000+ WooCommerce extensions free', highlight: true },
    { text: 'Priority support for stores', highlight: true }
  ]
  
  // Calculate Ecommerce pricing based on currency
  // Using approximate conversion rates (these should ideally come from a real-time API)
  const conversionRates: { [key: string]: number } = {
    'USD': 1,
    'INR': 83,
    'EUR': 0.92,
    'GBP': 0.79,
    'AUD': 1.52,
    'CAD': 1.36,
    'JPY': 149,
    'SGD': 1.34,
    'HKD': 7.82,
    'NZD': 1.63,
    'ZAR': 18.5,
    'MXN': 17.0,
    'BRL': 4.95,
    'ARS': 800,
    'CLP': 950,
    'COP': 4100,
    'PEN': 3.75
  }
  
  const rate = conversionRates[currencyType] || 1
  const baseMonthlyPrice = 29.99
  const baseYearlyMonthlyRate = 24.99
  
  const ecommerceMonthlyPrice = Math.round(baseMonthlyPrice * rate * 100) / 100
  const ecommerceYearlyMonthlyRate = Math.round(baseYearlyMonthlyRate * rate * 100) / 100
  const ecommerceYearlyPrice = Math.round(ecommerceYearlyMonthlyRate * 12 * 100) / 100
  const ecommerceOriginalPrice = Math.round(ecommerceMonthlyPrice * 12 * 100) / 100
  
  transformedPlans.push({
    productId: 'wordpress-ecommerce',
    name: 'Ecommerce',
    tagline: 'Best for online stores',
    alias: 'Ecommerce',
    monthlyPrice: ecommerceMonthlyPrice,
    yearlyPrice: ecommerceYearlyPrice,
    yearlyMonthlyRate: ecommerceYearlyMonthlyRate,
    originalPrice: ecommerceOriginalPrice,
    originalMonthlyPrice: ecommerceMonthlyPrice,
    savings: 17,
    badge: 'BEST FOR STORES',
    isPopular: false,
    order: 3,
    features: ecommerceFeatures,
    content: '',
    title: 'WordPress Ecommerce',
    term: 'month',
    hasPromo: false
  })

  // Sort by order
  return transformedPlans.sort((a, b) => a.order - b.order)
}

function getFallbackPlans() {
  // Fallback plans with exact features as shown in GoDaddy
  return [
    {
      productId: 'wordpress-basic',
      name: 'Basic',
      tagline: 'Best for getting started',
      monthlyPrice: 9.99,
      yearlyPrice: 95.88,
      yearlyMonthlyRate: 7.99,
      originalPrice: 119.88,
      originalMonthlyPrice: 9.99,
      savings: 20,
      badge: '',
      isPopular: false,
      order: 0,
      hasPromo: true,
      features: [
        { text: '1 website', highlight: false },
        { text: '10 GB NVMe storage', highlight: false },
        { text: 'Unmetered bandwidth', highlight: false },
        { text: 'Free SSL Certificate', highlight: true },
        { text: 'WordPress pre-installed', highlight: true },
        { text: 'Weekly backups', highlight: false },
        { text: 'Web Application Firewall', highlight: false },
        { text: 'Daily malware scans', highlight: false },
        { text: 'One-time malware removal', highlight: false }
      ]
    },
    {
      productId: 'wordpress-deluxe',
      name: 'Deluxe',
      tagline: 'Best for growing sites',
      monthlyPrice: 13.99,
      yearlyPrice: 100.68,
      yearlyMonthlyRate: 8.39,
      originalPrice: 167.88,
      originalMonthlyPrice: 13.99,
      savings: 40,
      badge: '',
      isPopular: false,
      order: 1,
      hasPromo: false,
      features: [
        { text: '1 website', highlight: false },
        { text: '20 GB NVMe storage', highlight: false },
        { text: 'Unmetered bandwidth', highlight: false },
        { text: 'Free SSL Certificate', highlight: true },
        { text: 'WordPress pre-installed', highlight: true },
        { text: 'Daily backups', highlight: true },
        { text: 'Web Application Firewall', highlight: false },
        { text: 'Daily malware scans', highlight: false },
        { text: 'One-time malware removal', highlight: false },
        { text: 'Up to 2x faster performance with global Cloudflare CDN', highlight: true },
        { text: 'Enhanced security with DDoS protection', highlight: true },
        { text: 'Staging site', highlight: true }
      ]
    },
    {
      productId: 'wordpress-ultimate',
      name: 'Ultimate',
      tagline: 'Best for demanding sites',
      monthlyPrice: 18.99,
      yearlyPrice: 136.68,
      yearlyMonthlyRate: 11.39,
      originalPrice: 227.88,
      originalMonthlyPrice: 18.99,
      savings: 40,
      badge: 'MOST POPULAR',
      isPopular: true,
      order: 2,
      hasPromo: false,
      features: [
        { text: '1 website', highlight: false },
        { text: '30 GB NVMe storage', highlight: true },
        { text: 'Unmetered bandwidth', highlight: false },
        { text: 'Free SSL Certificate', highlight: true },
        { text: 'WordPress pre-installed', highlight: true },
        { text: 'Daily + on-demand backups', highlight: true },
        { text: 'Web Application Firewall', highlight: false },
        { text: 'Daily malware scans', highlight: false },
        { text: 'Unlimited malware removal', highlight: true },
        { text: 'Up to 2x faster performance with global Cloudflare CDN', highlight: true },
        { text: 'Enhanced security with DDoS protection', highlight: true },
        { text: 'Staging site', highlight: true },
        { text: 'WordPress code optimizer', highlight: true },
        { text: 'Smart WordPress plugin manager', highlight: true },
        { text: 'Sell online with WooCommerce', highlight: true }
      ]
    },
    {
      productId: 'wordpress-ecommerce',
      name: 'Ecommerce',
      tagline: 'Best for online stores',
      monthlyPrice: 29.99,
      yearlyPrice: 299.88,
      yearlyMonthlyRate: 24.99,
      originalPrice: 359.88,
      originalMonthlyPrice: 29.99,
      savings: 17,
      badge: 'BEST FOR STORES',
      isPopular: false,
      order: 3,
      hasPromo: false,
      features: [
        // Core differences from Ultimate
        { text: 'Unlimited storage (vs 30 GB)', highlight: true },
        { text: 'Unlimited visits per month', highlight: true },
        { text: 'Real-time backups (vs daily)', highlight: true },
        { text: 'Premium SSL certificate', highlight: true },
        // WooCommerce specific features - UNIQUE to this plan
        { text: 'WooCommerce auto-installed & optimized', highlight: true },
        { text: 'No transaction fees', highlight: true },
        { text: 'Unlimited products', highlight: true },
        { text: 'Bookings & appointment scheduling', highlight: true },
        { text: 'Real-time shipping rates', highlight: true },
        { text: 'Premium WooCommerce themes', highlight: true },
        { text: '$6,000+ WooCommerce extensions free', highlight: true },
        { text: 'Priority support for stores', highlight: true }
      ]
    }
  ]
}