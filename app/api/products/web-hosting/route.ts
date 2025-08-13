import { NextRequest, NextResponse } from 'next/server'

const PLID = process.env.NEXT_PUBLIC_PLID || '590175'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const currencyType = searchParams.get('currency') || 'USD'
    // Always use en-US for marketId to get consistent pricing
    const marketId = 'en-US'
    
    // Fetch both cPanel and Business hosting products from GoDaddy in parallel
    const [cpanelResponse, businessResponse] = await Promise.all([
      // Fetch cPanel (Standard Performance) hosting
      fetch(
        `https://www.secureserver.net/api/v1/catalog/${PLID}/tags/cpanel?currencyType=${currencyType}&marketId=${marketId}&separateDisclaimers=false`,
        {
          headers: {
            'accept': 'application/json',
          },
          // Cache for 1 hour
          next: { revalidate: 3600 }
        }
      ),
      // Fetch Business (High Performance) hosting
      fetch(
        `https://www.secureserver.net/api/v1/catalog/${PLID}/tags/business?currencyType=${currencyType}&marketId=${marketId}&separateDisclaimers=false`,
        {
          headers: {
            'accept': 'application/json',
          },
          // Cache for 1 hour
          next: { revalidate: 3600 }
        }
      )
    ])

    if (!cpanelResponse.ok || !businessResponse.ok) {
      throw new Error(`GoDaddy API responded with error`)
    }

    const cpanelData = await cpanelResponse.json()
    const businessData = await businessResponse.json()
    
    // Transform the data to match our frontend structure
    const transformedCpanelPlans = transformCpanelProducts(cpanelData.products || [], currencyType)
    const transformedBusinessPlans = transformBusinessProducts(businessData.products || [], currencyType)
    
    return NextResponse.json({
      success: true,
      cpanelPlans: transformedCpanelPlans,
      businessPlans: transformedBusinessPlans,
      cpanelTagInfo: {
        id: cpanelData.id,
        title: cpanelData.title,
        description: cpanelData.description,
        image: cpanelData.image
      },
      businessTagInfo: {
        id: businessData.id,
        title: businessData.title,
        description: businessData.description,
        image: businessData.image
      }
    })
  } catch (error) {
    console.error('Error fetching web hosting plans:', error)
    
    // Return fallback plans if API fails
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch web hosting plans',
      cpanelPlans: getFallbackCpanelPlans(currencyType),
      businessPlans: getFallbackBusinessPlans(currencyType)
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

interface Limit {
  websites?: number | 'unlimited';
  storage?: string;
  bandwidth?: string;
  databases?: number | 'unlimited';
  ram?: string;
  cpu?: string;
  ssl?: string;
  email?: number | 'unlimited';
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
        // Determine highlight based on important keywords
        const highlight = text.toLowerCase().includes('free') ||
                         text.toLowerCase().includes('unlimited') ||
                         text.toLowerCase().includes('ssl') ||
                         text.toLowerCase().includes('cpanel') ||
                         text.toLowerCase().includes('nvme')
        
        features.push({
          text: text,
          highlight: highlight
        })
      }
    })
  }
  
  return features
}

function extractLimits(features: Feature[]): Limit {
  const limits: Limit = {}
  
  features.forEach(feature => {
    const text = feature.text.toLowerCase()
    
    // Extract website count
    if (text.includes('website')) {
      const websiteMatch = text.match(/(\d+|unlimited)\s*website/i)
      if (websiteMatch) {
        limits.websites = websiteMatch[1] === 'unlimited' ? 'unlimited' : parseInt(websiteMatch[1])
      }
    }
    
    // Extract storage
    if (text.includes('gb') && (text.includes('storage') || text.includes('disk') || text.includes('nvme'))) {
      const storageMatch = text.match(/(\d+)\s*gb/i)
      if (storageMatch) {
        limits.storage = `${storageMatch[1]} GB${text.includes('nvme') ? ' NVMe SSD' : ' storage'}`
      }
    }
    
    // Extract databases
    if (text.includes('database')) {
      const dbMatch = text.match(/(\d+|unlimited)\s*database/i)
      if (dbMatch) {
        limits.databases = dbMatch[1] === 'unlimited' ? 'unlimited' : parseInt(dbMatch[1])
      }
    }
    
    // Extract RAM
    if (text.includes('ram') || text.includes('memory')) {
      const ramMatch = text.match(/(\d+)\s*gb\s*(ram|memory)/i)
      if (ramMatch) {
        limits.ram = `${ramMatch[1]} GB RAM`
      }
    }
    
    // Extract CPU
    if (text.includes('cpu') || text.includes('vcpu') || text.includes('core')) {
      const cpuMatch = text.match(/(\d+)\s*(cpu|vcpu|core)/i)
      if (cpuMatch) {
        limits.cpu = `${cpuMatch[1]} ${cpuMatch[2].toUpperCase()}${parseInt(cpuMatch[1]) > 1 ? 's' : ''}`
      }
    }
    
    // Extract SSL
    if (text.includes('ssl')) {
      if (text.includes('unlimited')) {
        limits.ssl = 'Free, unlimited SSL for all your websites'
      } else {
        limits.ssl = 'Free SSL Certificate'
      }
    }
    
    // Set default bandwidth
    limits.bandwidth = 'Unmetered'
  })
  
  return limits
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
  id: string;
  name: string;
  description: string;
  price: {
    monthly: number;
    yearly: number;
    currency: string;
  };
  features: string[];
  recommended: boolean;
  badge?: string;
  limits: Limit;
  originalPrice?: number;
  savings?: number;
}

function transformCpanelProducts(products: Product[], currencyType: string = 'USD'): TransformedPlan[] {
  const transformedPlans: TransformedPlan[] = []

  // Define the expected cPanel plans in order
  const planOrder = ['starter', 'economy', 'deluxe', 'ultimate']
  const planNames: { [key: string]: string } = {
    'starter': 'cPanel Starter',
    'economy': 'cPanel Economy', 
    'deluxe': 'cPanel Deluxe',
    'ultimate': 'cPanel Ultimate'
  }

  products.forEach((product: Product) => {
    const productId = product.id.toLowerCase()
    
    // Extract prices from API
    const listPrice = extractPrice(product.listPrice)
    const salePrice = product.salePrice !== false ? extractPrice(product.salePrice) : 0
    
    // Monthly price is always the list price
    const monthlyPrice = listPrice
    
    // Yearly price calculation:
    // If there's a sale price from API, use it (it's the discounted yearly rate)
    // Otherwise, use the list price (no discount)
    let yearlyPrice = salePrice || listPrice
    
    // Calculate the original price for comparison (only if sale price exists)
    let originalPrice = 0
    let savings = 0
    
    if (salePrice > 0 && listPrice > 0) {
      // When there's a sale price, show the discount
      originalPrice = listPrice * 12  // Original yearly total
      const discountedYearlyTotal = salePrice * 12  // Discounted yearly total
      
      if (discountedYearlyTotal < originalPrice) {
        savings = Math.round(((originalPrice - discountedYearlyTotal) / originalPrice) * 100)
      }
    }
    
    // Parse features from HTML content
    const features = parseFeatures(product.content || '')
    const limits = extractLimits(features)
    
    // Determine plan name based on product ID
    let planKey = ''
    let name = 'cPanel Hosting'
    let description = "cPanel Hosting that's easy, reliable and lightning-fast"
    let recommended = false
    let badge = ''
    
    // Find which plan this is
    for (const key of planOrder) {
      if (productId.includes(key)) {
        planKey = key
        name = planNames[key] || name
        break
      }
    }
    
    // Set recommendations
    if (planKey === 'deluxe') {
      recommended = true
      badge = 'MOST POPULAR'
    }

    transformedPlans.push({
      id: product.id,
      name: name,
      description: description,
      price: {
        monthly: monthlyPrice,
        yearly: yearlyPrice,
        currency: currencyType
      },
      features: features.map(f => f.text),
      recommended: recommended,
      badge: badge,
      limits: limits,
      originalPrice: originalPrice,
      savings: savings
    })
  })

  // Sort by plan order
  return transformedPlans.sort((a, b) => {
    const aIndex = planOrder.findIndex(p => a.id.toLowerCase().includes(p))
    const bIndex = planOrder.findIndex(p => b.id.toLowerCase().includes(p))
    return aIndex - bIndex
  })
}

function transformBusinessProducts(products: Product[], currencyType: string = 'USD'): TransformedPlan[] {
  const transformedPlans: TransformedPlan[] = []

  // Define the expected Business plans in order
  const planOrder = ['launch', 'enhance', 'grow', 'expand']
  const planNames: { [key: string]: string } = {
    'launch': 'Web Hosting Plus Launch',
    'enhance': 'Web Hosting Plus Enhance',
    'grow': 'Web Hosting Plus Grow',
    'expand': 'Web Hosting Plus Expand'
  }
  const planDescriptions: { [key: string]: string } = {
    'launch': 'High performance hosting for growing sites',
    'enhance': 'Enhanced performance for busy sites',
    'grow': 'Powerful hosting for high-traffic sites',
    'expand': 'Maximum resources for enterprise sites'
  }

  products.forEach((product: Product) => {
    const productId = product.id.toLowerCase()
    
    // Extract prices from API
    const listPrice = extractPrice(product.listPrice)
    const salePrice = product.salePrice !== false ? extractPrice(product.salePrice) : 0
    
    // Monthly price is always the list price
    const monthlyPrice = listPrice
    
    // Yearly price calculation:
    // If there's a sale price from API, use it (it's the discounted yearly rate)
    // Otherwise, use the list price (no discount)
    let yearlyPrice = salePrice || listPrice
    
    // Calculate the original price for comparison (only if sale price exists)
    let originalPrice = 0
    let savings = 0
    
    if (salePrice > 0 && listPrice > 0) {
      // When there's a sale price, show the discount
      originalPrice = listPrice * 12  // Original yearly total
      const discountedYearlyTotal = salePrice * 12  // Discounted yearly total
      
      if (discountedYearlyTotal < originalPrice) {
        savings = Math.round(((originalPrice - discountedYearlyTotal) / originalPrice) * 100)
      }
    }
    
    // Parse features from HTML content
    const features = parseFeatures(product.content || '')
    const limits = extractLimits(features)
    
    // Determine plan name based on product ID
    let planKey = ''
    let name = 'Web Hosting Plus'
    let description = 'High performance hosting'
    let recommended = false
    let badge = ''
    
    // Find which plan this is
    for (const key of planOrder) {
      if (productId.includes(key)) {
        planKey = key
        name = planNames[key] || name
        description = planDescriptions[key] || description
        break
      }
    }
    
    // Set recommendations
    if (planKey === 'grow') {
      recommended = true
      badge = 'BEST VALUE'
    }

    // Add dedicated IP and other business features to limits
    if (!limits.ssl) {
      limits.ssl = 'Free, unlimited SSL for all your websites'
    }

    transformedPlans.push({
      id: product.id,
      name: name,
      description: description,
      price: {
        monthly: monthlyPrice,
        yearly: yearlyPrice,
        currency: currencyType
      },
      features: features.map(f => f.text),
      recommended: recommended,
      badge: badge,
      limits: limits,
      originalPrice: originalPrice,
      savings: savings
    })
  })

  // Sort by plan order
  return transformedPlans.sort((a, b) => {
    const aIndex = planOrder.findIndex(p => a.id.toLowerCase().includes(p))
    const bIndex = planOrder.findIndex(p => b.id.toLowerCase().includes(p))
    return aIndex - bIndex
  })
}

function getFallbackCpanelPlans(currencyType: string = 'USD'): TransformedPlan[] {
  // Currency conversion rates (approximate)
  const conversionRates: { [key: string]: number } = {
    'USD': 1,
    'INR': 83,
    'EUR': 0.92,
    'GBP': 0.79,
    'AUD': 1.52,
    'CAD': 1.36
  }
  
  const rate = conversionRates[currencyType] || 1
  
  return [
    {
      id: 'cpanel-starter',
      name: 'cPanel Starter',
      description: "cPanel that's easy, reliable and lightning-fast",
      price: {
        monthly: Math.round(3.99 * rate * 100) / 100,
        yearly: Math.round(2.39 * rate * 100) / 100,
        currency: currencyType
      },
      features: [
        '1 website',
        '1 database',
        '10 GB storage',
        'Unmetered bandwidth',
        'Free SSL Certificate',
        'cPanel control panel'
      ],
      recommended: false,
      limits: {
        websites: 1,
        storage: '10 GB storage',
        bandwidth: 'Unmetered',
        databases: 1,
        ssl: 'Free SSL Certificate'
      },
      savings: 40
    },
    {
      id: 'cpanel-economy',
      name: 'cPanel Economy',
      description: "cPanel Hosting that's easy, reliable and lightning-fast",
      price: {
        monthly: Math.round(9.99 * rate * 100) / 100,
        yearly: Math.round(5.99 * rate * 100) / 100,
        currency: currencyType
      },
      features: [
        '1 website',
        '10 databases',
        '25 GB storage',
        'Unmetered bandwidth',
        'Free SSL Certificate',
        'cPanel control panel'
      ],
      recommended: false,
      limits: {
        websites: 1,
        storage: '25 GB storage',
        bandwidth: 'Unmetered',
        databases: 10,
        ssl: 'Free SSL Certificate'
      },
      savings: 40
    },
    {
      id: 'cpanel-deluxe',
      name: 'cPanel Deluxe',
      description: "cPanel Hosting that's easy, reliable and lightning-fast",
      price: {
        monthly: Math.round(14.99 * rate * 100) / 100,
        yearly: Math.round(8.99 * rate * 100) / 100,
        currency: currencyType
      },
      features: [
        '10 websites',
        '25 databases',
        '50 GB storage',
        'Unmetered bandwidth',
        'Free, unlimited SSL for all your websites',
        'cPanel control panel'
      ],
      recommended: true,
      badge: 'MOST POPULAR',
      limits: {
        websites: 10,
        storage: '50 GB storage',
        bandwidth: 'Unmetered',
        databases: 25,
        ssl: 'Free, unlimited SSL for all your websites'
      },
      savings: 40
    },
    {
      id: 'cpanel-ultimate',
      name: 'cPanel Ultimate',
      description: "cPanel Hosting that's easy, reliable and lightning-fast",
      price: {
        monthly: Math.round(18.99 * rate * 100) / 100,
        yearly: Math.round(11.39 * rate * 100) / 100,
        currency: currencyType
      },
      features: [
        '25 websites',
        '50 databases',
        '75 GB storage',
        'Unmetered bandwidth',
        'Free, unlimited SSL for all your websites',
        'cPanel control panel'
      ],
      recommended: false,
      limits: {
        websites: 25,
        storage: '75 GB storage',
        bandwidth: 'Unmetered',
        databases: 50,
        ssl: 'Free, unlimited SSL for all your websites'
      },
      savings: 40
    }
  ]
}

function getFallbackBusinessPlans(currencyType: string = 'USD'): TransformedPlan[] {
  // Currency conversion rates (approximate)
  const conversionRates: { [key: string]: number } = {
    'USD': 1,
    'INR': 83,
    'EUR': 0.92,
    'GBP': 0.79,
    'AUD': 1.52,
    'CAD': 1.36
  }
  
  const rate = conversionRates[currencyType] || 1
  
  return [
    {
      id: 'business-launch',
      name: 'Web Hosting Plus Launch',
      description: 'High performance hosting for growing sites',
      price: {
        monthly: Math.round(30.99 * rate * 100) / 100,
        yearly: Math.round(15.49 * rate * 100) / 100,
        currency: currencyType
      },
      features: [
        '50 websites',
        'Unlimited databases',
        '100 GB NVMe storage',
        'cPanel',
        '4 GB RAM, 2 vCPUs',
        'Free dedicated IP',
        'Free domain',
        'Free, unlimited SSL for all your websites',
        '30-day, money-back guarantee',
        'Site security trial offer'
      ],
      recommended: false,
      limits: {
        websites: 50,
        storage: '100 GB NVMe storage',
        databases: 'unlimited',
        ram: '4 GB RAM',
        cpu: '2 CPUs',
        ssl: 'Free, unlimited SSL for all your websites'
      },
      savings: 50
    },
    {
      id: 'business-enhance',
      name: 'Web Hosting Plus Enhance',
      description: 'Enhanced performance for busy sites',
      price: {
        monthly: Math.round(49.99 * rate * 100) / 100,
        yearly: Math.round(24.99 * rate * 100) / 100,
        currency: currencyType
      },
      features: [
        '100 websites',
        'Unlimited databases',
        '200 GB NVMe storage',
        'cPanel',
        '8 GB RAM, 4 vCPUs',
        'Free dedicated IP',
        'Free domain',
        'Free, unlimited SSL for all your websites',
        '30-day, money-back guarantee',
        'Site security trial offer'
      ],
      recommended: false,
      limits: {
        websites: 100,
        storage: '200 GB NVMe storage',
        databases: 'unlimited',
        ram: '8 GB RAM',
        cpu: '4 CPUs',
        ssl: 'Free, unlimited SSL for all your websites'
      },
      savings: 50
    },
    {
      id: 'business-grow',
      name: 'Web Hosting Plus Grow',
      description: 'Powerful hosting for high-traffic sites',
      price: {
        monthly: Math.round(69.99 * rate * 100) / 100,
        yearly: Math.round(34.99 * rate * 100) / 100,
        currency: currencyType
      },
      features: [
        '150 websites',
        'Unlimited databases',
        '300 GB NVMe storage',
        'cPanel',
        '16 GB RAM, 8 vCPUs',
        'Free dedicated IP',
        'Free domain',
        'Free, unlimited SSL for all your websites',
        '30-day, money-back guarantee',
        'Site security trial offer'
      ],
      recommended: true,
      badge: 'BEST VALUE',
      limits: {
        websites: 150,
        storage: '300 GB NVMe storage',
        databases: 'unlimited',
        ram: '16 GB RAM',
        cpu: '8 CPUs',
        ssl: 'Free, unlimited SSL for all your websites'
      },
      savings: 50
    },
    {
      id: 'business-expand',
      name: 'Web Hosting Plus Expand',
      description: 'Maximum resources for enterprise sites',
      price: {
        monthly: Math.round(99.99 * rate * 100) / 100,
        yearly: Math.round(49.99 * rate * 100) / 100,
        currency: currencyType
      },
      features: [
        '200 websites',
        'Unlimited databases',
        '400 GB NVMe storage',
        'cPanel',
        '32 GB RAM, 16 vCPUs',
        'Free dedicated IP',
        'Free domain',
        'Free, unlimited SSL for all your websites',
        '30-day, money-back guarantee',
        'Site security trial offer'
      ],
      recommended: false,
      limits: {
        websites: 200,
        storage: '400 GB NVMe storage',
        databases: 'unlimited',
        ram: '32 GB RAM',
        cpu: '16 CPUs',
        ssl: 'Free, unlimited SSL for all your websites'
      },
      savings: 50
    }
  ]
}