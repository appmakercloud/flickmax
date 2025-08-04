import { NextRequest, NextResponse } from 'next/server'
import { domainSearchService } from '@/lib/api/domain-service'
import { withRateLimit } from '@/lib/middleware/rate-limit'
import { withAuth } from '@/lib/middleware/auth'

async function handleCrossSellSearch(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const plid = searchParams.get('plid')
    const sld = searchParams.get('sld')
    const currencyType = searchParams.get('currencyType') || 'USD'
    
    if (!plid || !sld) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      )
    }

    // Validate sld length
    if (sld.length > 63) {
      return NextResponse.json(
        { error: 'Domain name too long' },
        { status: 400 }
      )
    }

    // Use the secure domain service
    const data = await domainSearchService.searchCrossSellDomains(sld, currencyType)
    
    return NextResponse.json(data, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-API-Key',
        'Cache-Control': 'public, max-age=300', // Cache for 5 minutes
        'Vary': 'Accept-Encoding'
      }
    })
  } catch (error) {
    console.error('Cross-sell domain search error:', error)
    
    let statusCode = 500
    let errorMessage = 'Internal server error'
    
    if (error instanceof Error) {
      if (error.message.includes('Invalid domain')) {
        statusCode = 400
        errorMessage = error.message
      } else if (error.message.includes('authentication')) {
        statusCode = 401
        errorMessage = 'Authentication failed'
      } else if (error.message.includes('rate limit')) {
        statusCode = 429
        errorMessage = 'Too many requests'
      }
    }
    
    return NextResponse.json(
      { error: errorMessage, details: error instanceof Error ? error.message : 'Unknown error' },
      { status: statusCode }
    )
  }
}

// Export GET with rate limiting and authentication
export const GET = withRateLimit(
  withAuth(handleCrossSellSearch, {
    requireAuth: false // Set to true in production
  }),
  {
    windowMs: 60000, // 1 minute
    maxRequests: 30 // 30 requests per minute per IP
  }
)