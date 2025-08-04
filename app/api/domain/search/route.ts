import { NextRequest, NextResponse } from 'next/server'
import { domainSearchService } from '@/lib/api/domain-service'
import { withRateLimit } from '@/lib/middleware/rate-limit'
import { withAuth } from '@/lib/middleware/auth'

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  })
}

async function handleDomainSearch(request: NextRequest) {
  try {
    console.log('Domain search request received')
    
    const { searchParams } = request.nextUrl
    const query = searchParams.get('q')
    const currencyType = searchParams.get('currencyType') || 'USD'
    const marketId = searchParams.get('marketId') || 'en-US'
    const pageSize = parseInt(searchParams.get('pageSize') || '100')
    
    console.log('Search params:', { query, currencyType, marketId, pageSize })
    
    if (!query) {
      return NextResponse.json(
        { error: 'Missing query parameter' },
        { status: 400 }
      )
    }
    
    // Validate query length
    if (query.length > 253) {
      return NextResponse.json(
        { error: 'Domain query too long' },
        { status: 400 }
      )
    }
    
    console.log('Calling domainSearchService.searchDomains...')
    
    // Use the secure domain service
    const data = await domainSearchService.searchDomains({
      query,
      currencyType,
      marketId,
      pageSize
    })
    
    // Return the response with CORS headers
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
    console.error('Domain search error - Full details:', error)
    console.error('Error type:', error?.constructor?.name)
    console.error('Error message:', error instanceof Error ? error.message : 'Unknown error')
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    
    // Determine appropriate error message based on error type
    let errorMessage = 'Domain search service is temporarily unavailable'
    let statusCode = 503
    
    if (error instanceof Error) {
      console.log('Checking error message:', error.message)
      
      if (error.message.includes('GoDaddy API credentials are required')) {
        errorMessage = 'API credentials not configured. Please check server environment variables.'
        statusCode = 500
      } else if (error.message.includes('authentication')) {
        errorMessage = 'Domain search authentication failed'
        statusCode = 401
      } else if (error.message.includes('rate limit')) {
        errorMessage = 'Too many requests. Please try again later.'
        statusCode = 429
      } else if (error.message.includes('Invalid domain')) {
        errorMessage = error.message
        statusCode = 400
      } else if (error.message.includes('fetch')) {
        errorMessage = 'Unable to connect to domain search service'
        statusCode = 502
      } else if (error.message.includes('timeout')) {
        errorMessage = 'Domain search request timed out'
        statusCode = 504
      }
    }
    
    return NextResponse.json({
      error: errorMessage,
      details: 'Please try again in a few moments. If the problem persists, contact support.',
      timestamp: new Date().toISOString()
    }, {
      status: statusCode,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
  }
}

// Export GET with rate limiting and authentication
export const GET = withRateLimit(
  withAuth(handleDomainSearch, {
    requireAuth: false // Set to true in production
  }),
  {
    windowMs: 60000, // 1 minute
    maxRequests: 30 // 30 requests per minute per IP
  }
)