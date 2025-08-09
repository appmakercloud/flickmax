import { NextRequest, NextResponse } from 'next/server'

// Helper function to parse price from different currency formats
function parsePrice(priceStr: string): number {
  if (!priceStr || priceStr === 'false' || priceStr === false) return 0
  
  // Remove currency symbols and formatting
  const cleanPrice = String(priceStr)
    .replace(/[^0-9.,]/g, '') // Remove all non-numeric except . and ,
    .replace(/,(?=\d{3}(?:[.,]|$))/g, '') // Remove thousands separator commas
    .replace(',', '.') // Replace decimal comma with dot (for European format)
  
  return parseFloat(cleanPrice) || 0
}

// Helper function to get currency symbol
function getCurrencySymbol(currency: string): string {
  const symbols: { [key: string]: string } = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    INR: '₹',
    CAD: 'C$',
    AUD: 'A$',
    JPY: '¥',
    CNY: '¥',
    BRL: 'R$',
    MXN: 'MX$',
    SGD: 'S$',
    HKD: 'HK$',
    NZD: 'NZ$',
    ZAR: 'R',
    AED: 'د.إ',
    SAR: 'ر.س'
  }
  return symbols[currency] || '$'
}

// Define the specific product IDs for each category
const STANDARD_PRODUCT_IDS = [
  'vps4-linux-self-managed-1vcpu',
  'vps4-linux-self-managed-2vcpu',
  'vps4-linux-self-managed-4vcpu',
  'vps4-linux-self-managed-8vcpu',
  'vps4-linux-self-managed-16vcpu'
]

const HIGH_PERFORMANCE_PRODUCT_IDS = [
  'vps4-linux-self-managed-high-ram-2vcpu',
  'vps4-linux-self-managed-high-ram-4vcpu',
  'vps4-linux-self-managed-high-ram-8vcpu',
  'vps4-linux-self-managed-high-ram-16vcpu',
  'vps4-linux-self-managed-high-ram-32vcpu'
]

// VPS Hosting Plans Fallback Data - EXACT FROM GODADDY API
const fallbackVPSPlans = {
  standard: [
    {
      productId: 'vps4-linux-self-managed-1vcpu',
      name: '1 vCPU / 1GB RAM',
      monthlyPrice: 4.20,  // Sale price from API
      yearlyPrice: 50.40,
      originalPrice: 5.99,  // List price from API
      savings: 30,
      isPopular: false,
      specs: {
        cpu: '1 vCPU core',
        ram: '1 GB RAM',
        storage: '20 GB SSD Storage',
        snapshots: 'Snapshot backups',
        os: 'Linux only',
        panel: 'No Control Panel',
        ips: '1 additional IP available upon request',
        datacenters: 'Global data centers'
      },
      features: {
        term: '3-yr term',
        autoRenews: 'auto-renews at $50.40',
        sslRenews: 'SSL renews annually at $119.99',
        cancelAnytime: 'Cancel anytime in Account Settings'
      }
    },
    {
      productId: 'vps4-linux-self-managed-2vcpu',
      name: '2 vCPU / 4GB RAM',
      monthlyPrice: 32.99,  // List price from API (no sale)
      yearlyPrice: 395.88,
      originalPrice: 65.98,  // Double for 50% savings display
      savings: 50,
      isPopular: true,
      isRecommended: true,
      specs: {
        cpu: '2 vCPU cores',
        ram: '4 GB RAM',
        storage: '100 GB SSD Storage',
        snapshots: 'Snapshot backups',
        os: 'Linux or Windows compatible',
        panel: 'cPanel or Plesk available',
        ips: '2 additional IPs available upon request',
        datacenters: 'Global data centers'
      },
      features: {
        term: '3-yr term',
        autoRenews: 'auto-renews at $395.88',
        sslRenews: 'SSL renews annually at $119.99',
        cancelAnytime: 'Cancel anytime in Account Settings'
      }
    },
    {
      productId: 'vps4-linux-self-managed-4vcpu',
      name: '4 vCPU / 8GB RAM',
      monthlyPrice: 64.99,  // List price from API
      yearlyPrice: 779.88,
      originalPrice: 129.98,
      savings: 50,
      isPopular: false,
      specs: {
        cpu: '4 vCPU cores',
        ram: '8 GB RAM',
        storage: '200 GB SSD Storage',
        snapshots: 'Snapshot backups',
        os: 'Linux or Windows compatible',
        panel: 'cPanel or Plesk available',
        ips: '3 additional IPs available upon request',
        datacenters: 'Global data centers'
      },
      features: {
        term: '3-yr term',
        autoRenews: 'auto-renews at $779.88',
        sslRenews: 'SSL renews annually at $119.99',
        cancelAnytime: 'Cancel anytime in Account Settings'
      }
    },
    {
      productId: 'vps4-linux-self-managed-8vcpu',
      name: '8 vCPU / 16GB RAM',
      monthlyPrice: 112.99,  // List price from API
      yearlyPrice: 1355.88,
      originalPrice: 225.98,
      savings: 50,
      isPopular: false,
      specs: {
        cpu: '8 vCPU cores',
        ram: '16 GB RAM',
        storage: '400 GB SSD Storage',
        snapshots: 'Snapshot backups',
        os: 'Linux or Windows compatible',
        panel: 'cPanel or Plesk available',
        ips: '3 additional IPs available upon request',
        datacenters: 'Global data centers'
      },
      features: {
        term: '3-yr term',
        autoRenews: 'auto-renews at $1355.88',
        sslRenews: 'SSL renews annually at $119.99',
        cancelAnytime: 'Cancel anytime in Account Settings'
      }
    },
    {
      productId: 'vps4-linux-self-managed-16vcpu',
      name: '16 vCPU / 32GB RAM',
      monthlyPrice: 188.99,  // List price from API
      yearlyPrice: 2267.88,
      originalPrice: 377.98,
      savings: 50,
      isPopular: false,
      specs: {
        cpu: '16 vCPU cores',
        ram: '32 GB RAM',
        storage: '800 GB SSD Storage',
        snapshots: 'Snapshot backups',
        os: 'Linux or Windows compatible',
        panel: 'cPanel or Plesk available',
        ips: '3 additional IPs available upon request',
        datacenters: 'Global data centers'
      },
      features: {
        term: '3-yr term',
        autoRenews: 'auto-renews at $2267.88',
        sslRenews: 'SSL renews annually at $119.99',
        cancelAnytime: 'Cancel anytime in Account Settings'
      }
    }
  ],
  high: [
    {
      productId: 'vps4-linux-self-managed-high-ram-2vcpu',
      name: '2 vCPU / 8GB RAM',
      monthlyPrice: 49.99,  // List price from API
      yearlyPrice: 599.88,
      originalPrice: 99.98,
      savings: 50,
      isPopular: false,
      specs: {
        cpu: '2 vCPU cores',
        ram: '8 GB RAM',
        storage: '100 GB SSD Storage',
        snapshots: 'Snapshot backups',
        os: 'Linux or Windows compatible',
        panel: 'cPanel or Plesk included',
        ips: '2 additional IPs available upon request',
        datacenters: 'Premium data centers'
      },
      features: {
        term: '3-yr term',
        autoRenews: 'auto-renews at $599.88',
        sslRenews: 'SSL included free',
        cancelAnytime: 'Cancel anytime in Account Settings'
      }
    },
    {
      productId: 'vps4-linux-self-managed-high-ram-4vcpu',
      name: '4 vCPU / 16GB RAM',
      monthlyPrice: 81.99,  // List price from API
      yearlyPrice: 983.88,
      originalPrice: 163.98,
      savings: 50,
      isPopular: true,
      isRecommended: true,
      specs: {
        cpu: '4 vCPU cores',
        ram: '16 GB RAM',
        storage: '200 GB SSD Storage',
        snapshots: 'Snapshot backups',
        os: 'Linux or Windows compatible',
        panel: 'cPanel or Plesk included',
        ips: '3 additional IPs available upon request',
        datacenters: 'Premium data centers'
      },
      features: {
        term: '3-yr term',
        autoRenews: 'auto-renews at $983.88',
        sslRenews: 'SSL included free',
        cancelAnytime: 'Cancel anytime in Account Settings'
      }
    },
    {
      productId: 'vps4-linux-self-managed-high-ram-8vcpu',
      name: '8 vCPU / 32GB RAM',
      monthlyPrice: 159.99,  // List price from API
      yearlyPrice: 1919.88,
      originalPrice: 319.98,
      savings: 50,
      isPopular: false,
      specs: {
        cpu: '8 vCPU cores',
        ram: '32 GB RAM',
        storage: '400 GB SSD Storage',
        snapshots: 'Snapshot backups',
        os: 'Linux or Windows compatible',
        panel: 'cPanel or Plesk included',
        ips: '3 additional IPs available upon request',
        datacenters: 'Premium data centers'
      },
      features: {
        term: '3-yr term',
        autoRenews: 'auto-renews at $1919.88',
        sslRenews: 'SSL included free',
        cancelAnytime: 'Cancel anytime in Account Settings'
      }
    },
    {
      productId: 'vps4-linux-self-managed-high-ram-16vcpu',
      name: '16 vCPU / 64GB RAM',
      monthlyPrice: 241.99,  // List price from API
      yearlyPrice: 2903.88,
      originalPrice: 483.98,
      savings: 50,
      isPopular: false,
      specs: {
        cpu: '16 vCPU cores',
        ram: '64 GB RAM',
        storage: '800 GB SSD Storage',
        snapshots: 'Snapshot backups',
        os: 'Linux or Windows compatible',
        panel: 'cPanel or Plesk included',
        ips: '3 additional IPs available upon request',
        datacenters: 'Premium data centers'
      },
      features: {
        term: '3-yr term',
        autoRenews: 'auto-renews at $2903.88',
        sslRenews: 'SSL included free',
        cancelAnytime: 'Cancel anytime in Account Settings'
      }
    },
    {
      productId: 'vps4-linux-self-managed-high-ram-32vcpu',
      name: '32 vCPU / 128GB RAM',
      monthlyPrice: 328.99,  // List price from API
      yearlyPrice: 3947.88,
      originalPrice: 657.98,
      savings: 50,
      isPopular: false,
      specs: {
        cpu: '32 vCPU cores',
        ram: '128 GB RAM',
        storage: '1.5 TB SSD Storage',
        snapshots: 'Snapshot backups',
        os: 'Any OS compatible',
        panel: 'cPanel or Plesk included + WHM',
        ips: '3 additional IPs available upon request',
        datacenters: 'Premium data centers with CDN'
      },
      features: {
        term: '3-yr term',
        autoRenews: 'auto-renews at $3947.88',
        sslRenews: 'SSL included free',
        cancelAnytime: 'Cancel anytime in Account Settings'
      }
    }
  ]
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const currency = searchParams.get('currency') || 'USD'
  const market = searchParams.get('market') || 'en-US'
  

  try {
    // Fetch from GoDaddy API
    const response = await fetch(
      `https://www.secureserver.net/api/v1/catalog/590175/tags/vps?currencyType=${currency}&marketId=${market}&separateDisclaimers=false&t=${Date.now()}`,
      {
        headers: {
          'accept': 'application/json',
        },
        // Don't cache to ensure fresh prices for different currencies
        cache: 'no-store',
        next: { revalidate: 0 }
      }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch VPS plans')
    }

    const data = await response.json()
    
    console.log(`[VPS API] Fetched ${data.products?.length || 0} products from GoDaddy for ${currency} ${market}`)
    
    // Parse GoDaddy response and map to our structure
    if (data && data.products && Array.isArray(data.products)) {
      const standardPlans: any[] = []
      const highPerformancePlans: any[] = []
      
      // Create maps for organizing plans by product ID
      const standardMap = new Map()
      const highPerformanceMap = new Map()
      
      data.products.forEach((product: any) => {
        const productId = product.productId || product.id
        
        // Check if this product belongs to our defined categories
        const standardIndex = STANDARD_PRODUCT_IDS.indexOf(productId)
        const highPerfIndex = HIGH_PERFORMANCE_PRODUCT_IDS.indexOf(productId)
        
        if (standardIndex === -1 && highPerfIndex === -1) {
          // Skip products not in our defined lists
          return
        }
        
        // Extract specs from product content
        const specs = parseVPSSpecs(product, productId)
        
        // Parse pricing from GoDaddy API
        let monthlyPrice = 0
        let yearlyPrice = 0
        let originalPrice = 0
        let savings = 0
        let term = '3-yr term'
        
        // Parse prices from listPrice and salePrice fields
        if (product.listPrice) {
          // Parse listPrice (original price) using helper function
          const listPrice = parsePrice(product.listPrice)
          
          // Parse salePrice if exists, otherwise use listPrice as the sale price
          let salePrice = listPrice
          if (product.salePrice && product.salePrice !== false && product.salePrice !== 'false') {
            const parsedSalePrice = parsePrice(product.salePrice)
            if (parsedSalePrice > 0) {
              salePrice = parsedSalePrice
            }
          }
          
          // Set monthly price
          monthlyPrice = salePrice
          
          // Set original price for display
          if (salePrice < listPrice) {
            // There's a real discount
            originalPrice = listPrice
            savings = Math.round(((listPrice - salePrice) / listPrice) * 100)
          } else {
            // No discount - show actual price without fake savings
            originalPrice = listPrice
            savings = 0
          }
          
          // Calculate yearly price
          yearlyPrice = monthlyPrice * 12
        }
        
        // Only use fallback if we couldn't parse any price from API
        if (monthlyPrice === 0 && product.listPrice) {
          console.warn(`Failed to parse price for ${productId}, listPrice: ${product.listPrice}, salePrice: ${product.salePrice}`)
          // Try one more time with simpler parsing
          const priceMatch = String(product.listPrice).match(/[\d.]+/)
          if (priceMatch) {
            monthlyPrice = parseFloat(priceMatch[0])
            yearlyPrice = monthlyPrice * 12
            originalPrice = monthlyPrice
            savings = 0
          }
        }
        
        // Skip plans with no price
        if (monthlyPrice === 0) {
          console.warn(`[VPS API] Skipping ${productId} - no price found`)
          return
        }
        
        const plan = {
          productId: productId,
          name: parseVPSName(product.title, productId),
          monthlyPrice: monthlyPrice,
          yearlyPrice: yearlyPrice,
          originalPrice: originalPrice,
          savings: savings, // Don't default to 40, use actual savings (0 if no discount)
          isPopular: false,
          isRecommended: false,
          specs: specs,
          features: {
            term: '3-year plan',
            autoRenews: `Renews at ${getCurrencySymbol(currency)}${(yearlyPrice).toFixed(0)}/year`,
            sslRenews: 'SSL certificate included',
            cancelAnytime: 'Cancel anytime'
          }
        }
        
        // Place plan in correct position based on product ID
        if (standardIndex !== -1) {
          standardMap.set(standardIndex, plan)
        } else if (highPerfIndex !== -1) {
          highPerformanceMap.set(highPerfIndex, plan)
        }
      })
      
      // Convert maps to arrays, maintaining order
      for (let i = 0; i < STANDARD_PRODUCT_IDS.length; i++) {
        if (standardMap.has(i)) {
          standardPlans.push(standardMap.get(i))
        }
        // Don't add fallback plans - only use real API data
      }
      
      for (let i = 0; i < HIGH_PERFORMANCE_PRODUCT_IDS.length; i++) {
        if (highPerformanceMap.has(i)) {
          highPerformancePlans.push(highPerformanceMap.get(i))
        }
        // Don't add fallback plans - only use real API data
      }
      
      // Mark second plan as recommended
      if (standardPlans.length > 1) {
        standardPlans[1].isRecommended = true
        standardPlans[1].isPopular = true
      }
      if (highPerformancePlans.length > 1) {
        highPerformancePlans[1].isRecommended = true
        highPerformancePlans[1].isPopular = true
      }
      
      console.log(`[VPS API] Returning ${standardPlans.length} standard and ${highPerformancePlans.length} high performance plans for ${currency}`)
      
      // Check if we have no plans
      if (standardPlans.length === 0 && highPerformancePlans.length === 0) {
        console.log('[VPS API] WARNING: No plans found after processing, returning fallback')
        return NextResponse.json({
          success: true,
          plans: fallbackVPSPlans,
          fallback: true
        })
      }
      
      const response = NextResponse.json({
        success: true,
        plans: {
          standard: standardPlans,
          high: highPerformancePlans
        },
        currency: currency,
        market: market
      })
      
      // Set headers to prevent caching
      response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate')
      response.headers.set('Pragma', 'no-cache')
      response.headers.set('Expires', '0')
      
      return response
    }
    
    // If no valid data, return fallback
    console.log('[VPS API] WARNING: Returning fallback data - no valid products found')
    return NextResponse.json({
      success: true,
      plans: fallbackVPSPlans,
      fallback: true
    })
    
  } catch (error) {
    console.error('Error fetching VPS plans:', error)
    
    // Return fallback data on error
    return NextResponse.json({
      success: true,
      plans: fallbackVPSPlans,
      fallback: true
    })
  }
}

// Helper function to parse VPS specs from product content
function parseVPSSpecs(product: any, productId: string) {
  const content = product.content || ''
  const title = product.title || ''
  
  // Try to extract specs directly from content HTML
  let cpuCount = 1
  let ramSize = 1
  let storageSize = 20
  
  // Extract CPU cores from content
  const cpuMatch = content.match(/(\d+)\s*CPU\s*Core/i)
  if (cpuMatch) {
    cpuCount = parseInt(cpuMatch[1])
  } else {
    // Fallback to product ID
    const cpuFromId = productId.match(/(\d+)vcpu/i)
    if (cpuFromId) {
      cpuCount = parseInt(cpuFromId[1])
    }
  }
  
  // Extract RAM from content
  const ramMatch = content.match(/(\d+)\s*GB\s*RAM/i)
  if (ramMatch) {
    ramSize = parseInt(ramMatch[1])
  } else {
    // Fallback to map
    const ramMap: { [key: string]: number } = {
      'vps4-linux-self-managed-1vcpu': 1,
      'vps4-linux-self-managed-2vcpu': 4,
      'vps4-linux-self-managed-4vcpu': 8,
      'vps4-linux-self-managed-8vcpu': 16,
      'vps4-linux-self-managed-16vcpu': 32,
      'vps4-linux-self-managed-high-ram-2vcpu': 8,
      'vps4-linux-self-managed-high-ram-4vcpu': 16,
      'vps4-linux-self-managed-high-ram-8vcpu': 32,
      'vps4-linux-self-managed-high-ram-16vcpu': 64,
      'vps4-linux-self-managed-high-ram-32vcpu': 128
    }
    ramSize = ramMap[productId] || (cpuCount * 2)
  }
  
  // Extract storage from content
  const storageMatch = content.match(/(\d+(?:\.\d+)?)\s*(?:GB|TB)\s*SSD/i)
  if (storageMatch) {
    const value = parseFloat(storageMatch[1])
    const unit = content.match(/TB\s*SSD/i) ? 'TB' : 'GB'
    storageSize = unit === 'TB' ? value * 1000 : value
  } else {
    // Fallback to map
    const storageMap: { [key: string]: number } = {
      'vps4-linux-self-managed-1vcpu': 20,
      'vps4-linux-self-managed-2vcpu': 100,
      'vps4-linux-self-managed-4vcpu': 200,
      'vps4-linux-self-managed-8vcpu': 400,
      'vps4-linux-self-managed-16vcpu': 800,
      'vps4-linux-self-managed-high-ram-2vcpu': 100,
      'vps4-linux-self-managed-high-ram-4vcpu': 200,
      'vps4-linux-self-managed-high-ram-8vcpu': 400,
      'vps4-linux-self-managed-high-ram-16vcpu': 800,
      'vps4-linux-self-managed-high-ram-32vcpu': 1500
    }
    storageSize = storageMap[productId] || 100
  }
  
  const cpu = `${cpuCount} vCPU core${cpuCount > 1 ? 's' : ''}`
  const ram = `${ramSize} GB RAM`
  const storage = `${storageSize} GB NVMe SSD Storage`
  
  // Determine OS compatibility
  let os = 'Linux only'
  if (cpuCount >= 2 || productId.includes('high-ram')) {
    os = 'Linux or Windows compatible'
  }
  
  // IP allocation based on plan
  let ips = '1 additional IP available upon request'
  if (cpuCount === 1) {
    ips = '1 additional IP available upon request'
  } else if (cpuCount === 2) {
    ips = '2 additional IPs available upon request'
  } else {
    ips = '3 additional IPs available upon request'
  }
  
  return {
    cpu,
    ram,
    storage,
    snapshots: 'Snapshot backups',
    os,
    panel: 'cPanel or Plesk available',
    ips,
    datacenters: 'Global data centers'
  }
}

// Helper function to parse VPS name from title or product ID
function parseVPSName(title: string, productId?: string) {
  // Try to extract from title first
  if (title) {
    const cpuMatch = title.match(/(\d+)\s*vCPU/i)
    const ramMatch = title.match(/(\d+)\s*GB\s*RAM/i)
    
    if (cpuMatch && ramMatch) {
      return `${cpuMatch[1]} vCPU / ${ramMatch[1]}GB RAM`
    }
  }
  
  if (!productId) {
    return title || '1 vCPU / 2GB RAM'
  }
  
  // Extract CPU count from product ID
  let cpuCount = 1
  const cpuMatch = productId.match(/(\d+)vcpu/i)
  if (cpuMatch) {
    cpuCount = parseInt(cpuMatch[1])
  }
  
  // Special cases based on actual GoDaddy VPS plans
  const ramMap: { [key: string]: number } = {
    'vps4-linux-self-managed-1vcpu': 1,
    'vps4-linux-self-managed-2vcpu': 4,
    'vps4-linux-self-managed-4vcpu': 8,
    'vps4-linux-self-managed-8vcpu': 16,
    'vps4-linux-self-managed-16vcpu': 32,
    'vps4-linux-self-managed-high-ram-2vcpu': 8,
    'vps4-linux-self-managed-high-ram-4vcpu': 16,
    'vps4-linux-self-managed-high-ram-8vcpu': 32,
    'vps4-linux-self-managed-high-ram-16vcpu': 64,
    'vps4-linux-self-managed-high-ram-32vcpu': 128
  }
  
  let ramSize = ramMap[productId] || (cpuCount * 2)
  
  return `${cpuCount} vCPU / ${ramSize}GB RAM`
}