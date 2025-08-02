import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const apiUrl = 'https://www.secureserver.net/api/v1/search/crosssell?plid=590175&sld=example&currencyType=USD'
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    })

    const responseText = await response.text()
    console.log('Response status:', response.status)
    console.log('Response headers:', Object.fromEntries(response.headers.entries()))
    console.log('Response body:', responseText)

    let data
    try {
      data = JSON.parse(responseText)
    } catch (e) {
      data = { rawResponse: responseText }
    }

    return NextResponse.json({
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      data: data
    })
  } catch (error) {
    console.error('Test API Error:', error)
    return NextResponse.json(
      { error: 'Test failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}