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

// Define the specific product IDs for each category - FROM GODADDY API
const STANDARD_PRODUCT_IDS = [
  'vps4-linux-managed-1vcpu',
  'vps4-linux-managed-2vcpu',
  'vps4-linux-managed-4vcpu',
  'vps4-linux-managed-8vcpu',
  'vps4-linux-managed-16vcpu'
]

const HIGH_PERFORMANCE_PRODUCT_IDS = [
  'vps4-linux-managed-high-mem-1vcpu',
  'vps4-linux-managed-high-mem-2vcpu',
  'vps4-linux-managed-high-mem-4vcpu',
  'vps4-linux-managed-high-mem-8vcpu',
  'vps4-linux-managed-high-mem-16vcpu'
]

// Fallback plans data with ACTUAL GODADDY PRICES
const fallbackPlansStandard = [
  {
    productId: 'vps4-linux-managed-1vcpu',
    name: '1 vCPU / 2GB RAM',
    monthlyPrice: 117.99,
    yearlyPrice: 1415.88,
    originalPrice: 117.99,
    savings: 0,
    isPopular: false,
    specs: {
      cpu: '1 vCPU core',
      ram: '2 GB RAM',
      storage: '40 GB SSD Storage',
      snapshots: 'Automated backups',
      os: 'Linux only',
      panel: 'cPanel/WHM or Plesk included',
      ips: '1 dedicated IP included',
      datacenters: 'Global data centers',
      management: 'Dedicated team of experts to fully manage your server'
    },
    features: {
      term: 'Monthly',
      management: 'Fully managed by experts',
      support: '24/7 priority support',
      monitoring: 'Proactive monitoring included'
    }
  },
  {
    productId: 'vps4-linux-managed-2vcpu',
    name: '2 vCPU / 4GB RAM',
    monthlyPrice: 130.99,
    yearlyPrice: 1571.88,
    originalPrice: 130.99,
    savings: 0,
    isPopular: true,
    isRecommended: true,
    specs: {
      cpu: '2 vCPU cores',
      ram: '4 GB RAM',
      storage: '100 GB SSD Storage',
      snapshots: 'Automated backups',
      os: 'Linux or Windows',
      panel: 'cPanel/WHM or Plesk included',
      ips: '2 dedicated IPs included',
      datacenters: 'Global data centers',
      management: 'Dedicated team of experts to fully manage your server'
    },
    features: {
      term: 'Monthly',
      management: 'Fully managed by experts',
      support: '24/7 priority support',
      monitoring: 'Proactive monitoring included'
    }
  },
  {
    productId: 'vps4-linux-managed-4vcpu',
    name: '4 vCPU / 8GB RAM',
    monthlyPrice: 163.99,
    yearlyPrice: 1967.88,
    originalPrice: 163.99,
    savings: 0,
    isPopular: false,
    specs: {
      cpu: '4 vCPU cores',
      ram: '8 GB RAM',
      storage: '200 GB SSD Storage',
      snapshots: 'Automated backups',
      os: 'Linux or Windows',
      panel: 'cPanel/WHM or Plesk included',
      ips: '3 dedicated IPs included',
      datacenters: 'Global data centers',
      management: 'Dedicated team of experts to fully manage your server'
    },
    features: {
      term: 'Monthly',
      management: 'Fully managed by experts',
      support: '24/7 priority support',
      monitoring: 'Proactive monitoring included'
    }
  },
  {
    productId: 'vps4-linux-managed-8vcpu',
    name: '8 vCPU / 16GB RAM',
    monthlyPrice: 210.99,
    yearlyPrice: 2531.88,
    originalPrice: 210.99,
    savings: 0,
    isPopular: false,
    specs: {
      cpu: '8 vCPU cores',
      ram: '16 GB RAM',
      storage: '400 GB SSD Storage',
      snapshots: 'Automated backups',
      os: 'Linux or Windows',
      panel: 'cPanel/WHM or Plesk included',
      ips: '4 dedicated IPs included',
      datacenters: 'Global data centers',
      management: 'Dedicated team of experts to fully manage your server'
    },
    features: {
      term: 'Monthly',
      management: 'Fully managed by experts',
      support: '24/7 priority support',
      monitoring: 'Proactive monitoring included'
    }
  },
  {
    productId: 'vps4-linux-managed-16vcpu',
    name: '16 vCPU / 32GB RAM',
    monthlyPrice: 267.99,
    yearlyPrice: 3215.88,
    originalPrice: 267.99,
    savings: 0,
    isPopular: false,
    specs: {
      cpu: '16 vCPU cores',
      ram: '32 GB RAM',
      storage: '800 GB SSD Storage',
      snapshots: 'Automated backups',
      os: 'Linux or Windows',
      panel: 'cPanel/WHM or Plesk included',
      ips: '5 dedicated IPs included',
      datacenters: 'Global data centers',
      management: 'Dedicated team of experts to fully manage your server'
    },
    features: {
      term: 'Monthly',
      management: 'Fully managed by experts',
      support: '24/7 priority support',
      monitoring: 'Proactive monitoring included'
    }
  }
]

// High Performance Plans with MORE RAM from GoDaddy API
const fallbackPlansHighPerformance = [
  {
    productId: 'vps4-linux-managed-high-mem-1vcpu',
    name: '1 vCPU / 4GB RAM',
    monthlyPrice: 125.99,
    yearlyPrice: 1511.88,
    originalPrice: 125.99,
    savings: 0,
    isPopular: false,
    specs: {
      cpu: '1 vCPU core',
      ram: '4 GB RAM',
      storage: '40 GB SSD Storage',
      snapshots: 'Automated backups',
      os: 'Linux or Windows',
      panel: 'cPanel/WHM or Plesk included',
      ips: '1 dedicated IP included',
      datacenters: 'Global data centers',
      management: 'Dedicated team of experts to fully manage your server'
    },
    features: {
      term: 'Monthly',
      management: 'Fully managed by experts',
      support: '24/7 priority support',
      monitoring: 'Proactive monitoring included'
    }
  },
  {
    productId: 'vps4-linux-managed-high-mem-2vcpu',
    name: '2 vCPU / 8GB RAM',
    monthlyPrice: 145.99,
    yearlyPrice: 1751.88,
    originalPrice: 145.99,
    savings: 0,
    isPopular: true,
    isRecommended: true,
    specs: {
      cpu: '2 vCPU cores',
      ram: '8 GB RAM',
      storage: '100 GB SSD Storage',
      snapshots: 'Automated backups',
      os: 'Linux or Windows',
      panel: 'cPanel/WHM or Plesk included',
      ips: '2 dedicated IPs included',
      datacenters: 'Global data centers',
      management: 'Dedicated team of experts to fully manage your server'
    },
    features: {
      term: 'Monthly',
      management: 'Fully managed by experts',
      support: '24/7 priority support',
      monitoring: 'Proactive monitoring included'
    }
  },
  {
    productId: 'vps4-linux-managed-high-mem-4vcpu',
    name: '4 vCPU / 16GB RAM',
    monthlyPrice: 179.99,
    yearlyPrice: 2159.88,
    originalPrice: 179.99,
    savings: 0,
    isPopular: false,
    specs: {
      cpu: '4 vCPU cores',
      ram: '16 GB RAM',
      storage: '200 GB SSD Storage',
      snapshots: 'Automated backups',
      os: 'Linux or Windows',
      panel: 'cPanel/WHM or Plesk included',
      ips: '3 dedicated IPs included',
      datacenters: 'Global data centers',
      management: 'Dedicated team of experts to fully manage your server'
    },
    features: {
      term: 'Monthly',
      management: 'Fully managed by experts',
      support: '24/7 priority support',
      monitoring: 'Proactive monitoring included'
    }
  },
  {
    productId: 'vps4-linux-managed-high-mem-8vcpu',
    name: '8 vCPU / 32GB RAM',
    monthlyPrice: 257.99,
    yearlyPrice: 3095.88,
    originalPrice: 257.99,
    savings: 0,
    isPopular: false,
    specs: {
      cpu: '8 vCPU cores',
      ram: '32 GB RAM',
      storage: '400 GB SSD Storage',
      snapshots: 'Automated backups',
      os: 'Linux or Windows',
      panel: 'cPanel/WHM or Plesk included',
      ips: '4 dedicated IPs included',
      datacenters: 'Global data centers',
      management: 'Dedicated team of experts to fully manage your server'
    },
    features: {
      term: 'Monthly',
      management: 'Fully managed by experts',
      support: '24/7 priority support',
      monitoring: 'Proactive monitoring included'
    }
  },
  {
    productId: 'vps4-linux-managed-high-mem-16vcpu',
    name: '16 vCPU / 64GB RAM',
    monthlyPrice: 320.99,
    yearlyPrice: 3851.88,
    originalPrice: 320.99,
    savings: 0,
    isPopular: false,
    specs: {
      cpu: '16 vCPU cores',
      ram: '64 GB RAM',
      storage: '800 GB SSD Storage',
      snapshots: 'Automated backups',
      os: 'Linux or Windows',
      panel: 'cPanel/WHM or Plesk included',
      ips: '5 dedicated IPs included',
      datacenters: 'Global data centers',
      management: 'Dedicated team of experts to fully manage your server'
    },
    features: {
      term: 'Monthly',
      management: 'Fully managed by experts',
      support: '24/7 priority support',
      monitoring: 'Proactive monitoring included'
    }
  }
]

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const currency = searchParams.get('currency') || 'USD'
  const marketId = searchParams.get('market') || 'en-US'

  try {
    // For now, we'll use the fallback data since GoDaddy API doesn't provide direct pricing for all currencies
    // In production, you would integrate with GoDaddy's full API to get localized pricing
    
    const plans = {
      standard: fallbackPlansStandard,
      high: fallbackPlansHighPerformance
    }

    // Apply currency conversion if needed (simplified - in production use real exchange rates)
    const exchangeRates: { [key: string]: number } = {
      USD: 1,
      EUR: 0.85,
      GBP: 0.73,
      INR: 83.12,
      CAD: 1.36,
      AUD: 1.52
    }

    const rate = exchangeRates[currency] || 1

    // Convert prices based on currency
    const convertedPlans = {
      standard: plans.standard.map(plan => ({
        ...plan,
        monthlyPrice: plan.monthlyPrice * rate,
        yearlyPrice: plan.yearlyPrice * rate,
        originalPrice: plan.originalPrice * rate
      })),
      high: plans.high.map(plan => ({
        ...plan,
        monthlyPrice: plan.monthlyPrice * rate,
        yearlyPrice: plan.yearlyPrice * rate,
        originalPrice: plan.originalPrice * rate
      }))
    }

    return NextResponse.json({
      success: true,
      plans: convertedPlans,
      currency,
      marketId
    })
  } catch (error) {
    console.error('Error fetching VPS plans:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch VPS plans',
      plans: {
        standard: fallbackPlansStandard,
        high: fallbackPlansHighPerformance
      }
    })
  }
}