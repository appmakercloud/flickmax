import { NextRequest, NextResponse } from 'next/server'

// Cache duration: 24 hours (in seconds)
const CACHE_DURATION = 24 * 60 * 60

// In-memory cache
let cache: {
  data: any | null
  timestamp: number | null
} = {
  data: null,
  timestamp: null
}

export async function GET(request: NextRequest) {
  try {
    const now = Date.now()
    const { searchParams } = new URL(request.url)
    const marketId = searchParams.get('marketId') || 'en-US'
    const plid = process.env.NEXT_PUBLIC_PLID || '590175'
    
    // Check if cache is valid
    if (cache.data && cache.timestamp && (now - cache.timestamp) < (CACHE_DURATION * 1000)) {
      console.log('Serving legal agreements list from cache')
      return NextResponse.json({
        success: true,
        data: cache.data,
        cached: true
      })
    }
    
    console.log('Fetching fresh legal agreements list from API')
    
    // Fetch fresh data from GoDaddy API
    const response = await fetch(
      `https://www.secureserver.net/api/v1/agreements/${plid}?marketId=${marketId}`,
      {
        headers: {
          'Accept': 'application/json',
        },
        cache: 'no-store'
      }
    )

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`)
    }

    const data = await response.json()
    
    // Process and categorize agreements
    const processedData = processAgreementsList(data)
    
    // Update cache
    cache = {
      data: processedData,
      timestamp: now
    }
    
    return NextResponse.json({
      success: true,
      data: processedData,
      cached: false
    })
  } catch (error) {
    console.error('Error fetching legal agreements:', error)
    
    // If we have cached data and there's an error, return cached data
    if (cache.data) {
      console.log('API error, serving stale cache')
      return NextResponse.json({
        success: true,
        data: cache.data,
        cached: true,
        stale: true
      })
    }
    
    // No cache available, return error
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch legal agreements',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// Process and categorize the agreements list
function processAgreementsList(data: any[]) {
  const agreements: any[] = []
  const policies: any[] = []
  
  data.forEach(item => {
    const displayName = formatDisplayName(item.key)
    const processedItem = {
      ...item,
      displayName,
      slug: item.key,
      url: item.href || null // External URLs for ICANN policies
    }
    
    if (item.type === 'policy' || item.key.includes('policy')) {
      policies.push(processedItem)
    } else {
      agreements.push(processedItem)
    }
  })
  
  return {
    agreements,
    policies,
    total: data.length,
    lastUpdated: new Date().toISOString()
  }
}

// Format the key into a readable display name
function formatDisplayName(key: string): string {
  const specialCases: Record<string, string> = {
    'universal-terms-of-service-agreement': 'Universal Terms of Service Agreement',
    'registrant-rights': 'ICANN Registrant Rights',
    'registrar-transfer-dispute-resolution-policy': 'ICANN Registrar Transfer Dispute Resolution Policy',
    'uniform-domain-name-dispute-resolution-policy': 'Uniform Domain Name Dispute Resolution Policy',
    'data-processing-addendum': 'Data Processing Addendum (Customers)',
  }
  
  if (specialCases[key]) {
    return specialCases[key]
  }
  
  return key
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}