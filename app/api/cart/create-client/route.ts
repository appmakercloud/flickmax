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
    
    // Instead of making the API call server-side, 
    // return the API details for the client to call directly
    const plid = process.env.NEXT_PUBLIC_PLID || '590175'
    const apiUrl = `https://www.secureserver.net/api/v1/cart/${plid}?redirect=false`
    
    return NextResponse.json({
      success: true,
      apiUrl,
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: {
        items: body.items,
        skipCrossSell: body.skipCrossSell !== false
      },
      message: 'Use this configuration to make the API call from the client side'
    })
    
  } catch (error) {
    console.error('Cart configuration error:', error)
    
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Failed to prepare cart configuration',
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