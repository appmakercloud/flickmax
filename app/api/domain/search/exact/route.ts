import { NextRequest, NextResponse } from 'next/server'
import { domainSearchService } from '@/lib/api/domain-service'
import { withRateLimit } from '@/lib/middleware/rate-limit'
import { withAuth } from '@/lib/middleware/auth'

async function handleExactDomainSearch(request: NextRequest) {
  try {
    console.log('=== EXACT DOMAIN SEARCH REQUEST ===')
    
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q')
    const currencyType = searchParams.get('currencyType') || 'USD'
    const marketId = searchParams.get('marketId') || 'en-US'
    const pageSize = searchParams.get('pageSize') || '5'
    
    console.log('Parameters:', { query, currencyType, marketId, pageSize })
    
    if (!query) {
      return NextResponse.json(
        { error: 'Missing query parameter' },
        { status: 400 }
      )
    }

    // Validate query
    if (query.length > 253) {
      return NextResponse.json(
        { error: 'Domain query too long' },
        { status: 400 }
      )
    }

    console.log('Calling domainSearchService.searchExactDomain...')
    
    // Use the secure domain service with all parameters
    const data = await domainSearchService.searchExactDomain(query, currencyType, marketId, parseInt(pageSize))
    
    console.log('Search completed successfully, returning data')
    
    // Return the API response with caching headers
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
    console.error('=== EXACT DOMAIN SEARCH ERROR ===')
    console.error('Error:', error)
    console.error('Error type:', error?.constructor?.name)
    console.error('Error message:', error instanceof Error ? error.message : 'Unknown error')
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    
    let statusCode = 500
    let errorMessage = 'Domain search service is temporarily unavailable'
    
    if (error instanceof Error) {
      console.log('Analyzing error message:', error.message)
      
      if (error.message.includes('GoDaddy API credentials are required')) {
        errorMessage = 'API credentials not configured'
        statusCode = 500
      } else if (error.message.includes('Invalid domain')) {
        statusCode = 400
        errorMessage = error.message
      } else if (error.message.includes('authentication')) {
        statusCode = 401
        errorMessage = 'Authentication failed'
      } else if (error.message.includes('rate limit')) {
        statusCode = 429
        errorMessage = 'Too many requests'
      } else {
        // Use the actual error message for debugging
        errorMessage = error.message
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
  withAuth(handleExactDomainSearch, {
    requireAuth: false // Set to true in production
  }),
  {
    windowMs: 60000, // 1 minute
    maxRequests: 30 // 30 requests per minute per IP
  }
)