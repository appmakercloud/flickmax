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
    
    // Check if we're in development and having issues with GoDaddy API
    const isDevelopment = process.env.NODE_ENV === 'development'
    const useMockApi = process.env.NEXT_PUBLIC_USE_MOCK_API === 'true'
    
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
      
      // In development or when explicitly using mock API, provide mock data for testing
      if (isDevelopment || useMockApi) {
        const mockAvailable = !query.includes('flickmax') && !query.includes('google') && !query.includes('facebook')
        const baseName = query.split('.')[0]
        const extension = query.substring(baseName.length)
        
        return NextResponse.json({
          exactMatchDomain: {
            domain: query,
            available: mockAvailable,
            id: 'domain',
            productId: mockAvailable ? 12101 : 0,
            listPrice: mockAvailable ? (
              extension === '.org' ? '$19.99' : 
              extension === '.com' ? '$12.99' :
              extension === '.net' ? '$14.99' :
              extension === '.co.in' ? '$10.99' :
              extension === '.in' ? '$8.99' :
              extension === '.ai' ? '$124.99' :
              '$15.99'
            ) : null,
            salePrice: mockAvailable ? (
              extension === '.org' ? '$19.99' : 
              extension === '.com' ? '$12.99' :
              extension === '.net' ? '$14.99' :
              extension === '.co.in' ? '$10.99' :
              extension === '.in' ? '$8.99' :
              extension === '.ai' ? '$124.99' :
              '$15.99'
            ) : null,
            disclaimer: 'Development mode - Mock data'
          },
          suggestedDomains: [
            { domain: `${baseName}.com`, available: true, listPrice: '$12.99', salePrice: '$12.99', productId: 101 },
            { domain: `${baseName}.net`, available: true, listPrice: '$14.99', salePrice: '$14.99', productId: 12001 },
            { domain: `${baseName}.org`, available: true, listPrice: '$19.99', salePrice: '$19.99', productId: 12101 }
          ],
          disclaimer: 'Development mode - Using mock data due to API restrictions'
        }, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
        }
      })
      }
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