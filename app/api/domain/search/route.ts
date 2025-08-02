import { NextRequest, NextResponse } from 'next/server'

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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    
    
    // Build the target URL with all query parameters except 't' (timestamp)
    const targetUrl = new URL('https://www.secureserver.net/api/v1/domains/590175')
    searchParams.forEach((value, key) => {
      // Skip timestamp parameter if present
      if (key !== 't') {
        targetUrl.searchParams.append(key, value)
      }
    })
    
    console.log('Proxying to:', targetUrl.toString())
    console.log('Query params:', Object.fromEntries(searchParams))
    
    // Log request details
    console.log('Request headers from browser:', Object.fromEntries(request.headers.entries()))
    
    // Forward the request with more complete headers
    const response = await fetch(targetUrl.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://www.godaddy.com/',
        'Origin': 'https://www.godaddy.com'
      },
      // Remove Next.js specific caching
      cache: 'no-store'
    })
    
    console.log('GoDaddy API response status:', response.status)
    
    const data = await response.json()
    
    // If the upstream API returns an error, provide a better response
    if (!response.ok && response.status >= 500) {
      const query = searchParams.get('q') || 'domain'
      console.error(`API returned ${response.status} for domain: ${query}`)
      console.error('Response headers:', Object.fromEntries(response.headers.entries()))
      console.error('Response data:', data)
      
    }
    
    // Return the response with CORS headers
    return NextResponse.json(data, {
      status: response.ok ? 200 : response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
  } catch (error) {
    console.error('Proxy error:', error)
    
    // Return a user-friendly response structure even on error
    const query = request.nextUrl.searchParams.get('q') || 'domain'
    
    return NextResponse.json({
      exactMatchDomain: {
        domain: query,
        available: false,
        id: 'domain',
        productId: 0,
        listPrice: 'Check availability',
        salePrice: 'Check availability',
        disclaimer: 'Unable to check availability at this time'
      },
      suggestedDomains: [],
      disclaimer: 'Domain search is temporarily unavailable. Please try again later.'
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
  }
}