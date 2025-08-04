import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { error: 'Items array is required and must not be empty' },
        { status: 400 }
      )
    }
    
    // Use the exact curl command format that works
    const plid = process.env.NEXT_PUBLIC_PLID || '590175'
    const godaddyUrl = `https://www.secureserver.net/api/v1/cart/${plid}`
    
    console.log('Posting to GoDaddy cart API:', godaddyUrl)
    console.log('Items:', JSON.stringify(body.items))
    
    // Make the request exactly like the working curl command
    const response = await fetch(godaddyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        items: body.items,
        skipCrossSell: body.skipCrossSell !== false
      })
    })
    
    // Get all headers
    const responseHeaders = Object.fromEntries(response.headers.entries())
    console.log('GoDaddy response headers:', responseHeaders)
    
    // Get response as text first
    const responseText = await response.text()
    console.log('GoDaddy response status:', response.status)
    console.log('GoDaddy response body:', responseText)
    
    // Try to parse as JSON
    let result
    try {
      result = JSON.parse(responseText)
    } catch {
      // If not JSON, return as is
      result = { 
        message: responseText,
        status: response.status,
        headers: responseHeaders
      }
    }
    
    // Check for cookies
    const setCookieHeader = response.headers.get('set-cookie')
    if (setCookieHeader) {
      console.log('Set-Cookie header:', setCookieHeader)
    }
    
    // If successful, return the result with nextStepUrl
    if (response.ok && result.nextStepUrl) {
      console.log('Success! Next step URL:', result.nextStepUrl)
      return NextResponse.json(result)
    }
    
    // Return whatever we got
    return NextResponse.json(result, {
      status: response.status
    })
    
  } catch (error) {
    console.error('Cart API error:', error)
    
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Failed to create cart',
      timestamp: new Date().toISOString()
    }, {
      status: 500
    })
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  })
}