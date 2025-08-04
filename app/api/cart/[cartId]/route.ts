import { NextRequest, NextResponse } from 'next/server'
import { cartService } from '@/lib/api/cart-service'
import { withRateLimit } from '@/lib/middleware/rate-limit'
import { withAuth } from '@/lib/middleware/auth'
import { AddToCartRequest } from '@/types/cart'

// GET /api/cart/[cartId]
async function handleGetCart(
  request: NextRequest,
  context?: { params: { cartId: string } }
) {
  try {
    // Extract cartId from URL if context is not provided
    const cartId = context?.params?.cartId || request.nextUrl.pathname.split('/').pop() || ''
    
    if (!cartId) {
      return NextResponse.json(
        { error: 'Cart ID is required' },
        { status: 400 }
      )
    }
    
    const cart = await cartService.getCart(cartId)
    
    return NextResponse.json(cart, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-API-Key',
        'Cache-Control': 'no-cache'
      }
    })
  } catch (error) {
    console.error('Get cart error:', error)
    
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Failed to retrieve cart',
      timestamp: new Date().toISOString()
    }, {
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    })
  }
}

// POST /api/cart/[cartId]
async function handleAddToCart(
  request: NextRequest,
  context?: { params: { cartId: string } }
) {
  try {
    // Extract cartId from URL if context is not provided
    const cartId = context?.params?.cartId || request.nextUrl.pathname.split('/').pop() || ''
    const { searchParams } = request.nextUrl
    const redirect = searchParams.get('redirect') === 'true'
    
    if (!cartId) {
      return NextResponse.json(
        { error: 'Cart ID is required' },
        { status: 400 }
      )
    }
    
    const body: AddToCartRequest = await request.json()
    
    if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { error: 'Items array is required and must not be empty' },
        { status: 400 }
      )
    }
    
    const response = await cartService.addToCart(cartId, body, redirect)
    
    return NextResponse.json(response, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-API-Key'
      }
    })
  } catch (error) {
    console.error('Add to cart error:', error)
    
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Failed to add items to cart',
      timestamp: new Date().toISOString()
    }, {
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    })
  }
}

// DELETE /api/cart/[cartId]
async function handleDeleteCart(
  request: NextRequest,
  context?: { params: { cartId: string } }
) {
  try {
    // Extract cartId from URL if context is not provided
    const cartId = context?.params?.cartId || request.nextUrl.pathname.split('/').pop() || ''
    
    if (!cartId) {
      return NextResponse.json(
        { error: 'Cart ID is required' },
        { status: 400 }
      )
    }
    
    await cartService.deleteCart(cartId)
    
    return NextResponse.json(
      { success: true, message: 'Cart deleted successfully' },
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, X-API-Key'
        }
      }
    )
  } catch (error) {
    console.error('Delete cart error:', error)
    
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Failed to delete cart',
      timestamp: new Date().toISOString()
    }, {
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    })
  }
}

// OPTIONS for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-API-Key'
    }
  })
}

// Export methods with rate limiting
export const GET = async (request: NextRequest, { params }: { params: Promise<{ cartId: string }> }) => {
  const { cartId } = await params
  const context = { params: { cartId } }
  const handler = withRateLimit(
    withAuth((req) => handleGetCart(req, context), { requireAuth: false }),
    { windowMs: 60000, maxRequests: 60 }
  )
  return handler(request)
}

export const POST = async (request: NextRequest, { params }: { params: Promise<{ cartId: string }> }) => {
  const { cartId } = await params
  const context = { params: { cartId } }
  const handler = withRateLimit(
    withAuth((req) => handleAddToCart(req, context), { requireAuth: false }),
    { windowMs: 60000, maxRequests: 30 }
  )
  return handler(request)
}

export const DELETE = async (request: NextRequest, { params }: { params: Promise<{ cartId: string }> }) => {
  const { cartId } = await params
  const context = { params: { cartId } }
  const handler = withRateLimit(
    withAuth((req) => handleDeleteCart(req, context), { requireAuth: false }),
    { windowMs: 60000, maxRequests: 30 }
  )
  return handler(request)
}