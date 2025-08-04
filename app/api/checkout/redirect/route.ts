import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Get the checkout URL from query params
    const searchParams = request.nextUrl.searchParams
    const checkoutUrl = searchParams.get('url')
    
    if (!checkoutUrl) {
      return NextResponse.json(
        { error: 'Checkout URL is required' },
        { status: 400 }
      )
    }
    
    // Redirect to GoDaddy checkout
    // This will maintain the same browser session
    return NextResponse.redirect(checkoutUrl, {
      status: 302,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
  } catch (error) {
    console.error('Checkout redirect error:', error)
    return NextResponse.json(
      { error: 'Failed to redirect to checkout' },
      { status: 500 }
    )
  }
}