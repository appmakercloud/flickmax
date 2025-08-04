import { NextRequest, NextResponse } from 'next/server'
import { godaddyCartService } from '@/lib/api/godaddy-cart'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { error: 'Items array is required and must not be empty' },
        { status: 400 }
      )
    }
    
    console.log('Creating cart with items:', JSON.stringify(body.items, null, 2))
    
    // Use the GoDaddy cart service
    const result = await godaddyCartService.createCart(body.items)
    
    console.log('Cart creation result:', result)
    
    // Always return success with the checkout URL
    return NextResponse.json({
      success: true,
      ...result
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