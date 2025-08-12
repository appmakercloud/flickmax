import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const domain = searchParams.get('domain')
  
  if (!domain) {
    return NextResponse.json(
      { error: 'Domain parameter is required' },
      { status: 400 }
    )
  }

  try {
    // Call GoDaddy's bundle API
    const bundleUrl = `https://www.secureserver.net/api/v1/search/bundles?plid=590175&q=${encodeURIComponent(domain)}`
    
    const response = await fetch(bundleUrl, {
      headers: {
        'accept': 'application/json',
      },
      cache: 'no-store'
    })

    if (!response.ok) {
      throw new Error(`Bundle API returned ${response.status}`)
    }

    const data = await response.json()
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Bundle search error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bundle information' },
      { status: 500 }
    )
  }
}