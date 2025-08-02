import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q')
    const plid = searchParams.get('plid') || '590175'
    const currencyType = searchParams.get('currencyType') || 'USD'
    
    if (!query) {
      return NextResponse.json(
        { error: 'Missing query parameter' },
        { status: 400 }
      )
    }

    // Use the exact search endpoint
    const apiUrl = `https://www.secureserver.net/api/v1/search/exact?plid=${plid}&q=${query}`
    
    console.log('Calling exact search API:', apiUrl)
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    })

    if (!response.ok) {
      console.error('API Error:', response.status, response.statusText)
      const errorText = await response.text()
      console.error('Error body:', errorText)
      
      return NextResponse.json(
        { error: `API request failed: ${response.statusText}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    console.log('Exact search API response:', data)
    
    // Return the API response as-is
    return NextResponse.json(data)
    
  } catch (error) {
    console.error('Domain exact search error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}