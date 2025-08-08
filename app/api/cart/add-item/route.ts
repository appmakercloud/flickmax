import { NextRequest, NextResponse } from 'next/server'

/**
 * Backend API endpoint for adding items to GoDaddy cart
 * 
 * This endpoint mimics the approach used by fxdomains.com:
 * 1. Receives cart items from frontend
 * 2. Calls GoDaddy API server-side (avoids CORS issues)
 * 3. Extracts JWT tokens from GoDaddy's response
 * 4. Returns tokens to frontend for session management
 * 
 * Why backend is necessary:
 * - GoDaddy API has CORS restrictions
 * - JWT tokens are in HTTP-only cookies that frontend can't access
 * - Backend can extract and forward these tokens
 */
export async function POST(request: NextRequest) {
  try {
    const { items, existingTokens } = await request.json()
    const plid = process.env.NEXT_PUBLIC_PLID || '590175'
    
    /**
     * Step 1: Prepare headers for GoDaddy API call
     * 
     * User-Agent is important - some APIs behave differently without it
     */
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    }
    
    /**
     * Step 2: Include existing JWT tokens as cookies
     * 
     * CRITICAL: This is how we maintain the same cart session
     * Without this, each API call creates a new cart
     * 
     * The tokens must be in cookie format:
     * Cookie: cust_idp={token}; info_cust_idp={token}
     */
    if (existingTokens && existingTokens.custIdp && existingTokens.infoCustIdp) {
      headers['Cookie'] = `cust_idp=${existingTokens.custIdp}; info_cust_idp=${existingTokens.infoCustIdp}`
    }
    
    /**
     * Step 3: Call GoDaddy Cart API
     * 
     * Important parameters:
     * - redirect: '0' - Don't redirect, just return JSON
     * - plid: Your reseller ID
     * - currencyType/marketId: For pricing (doesn't affect cart session)
     */
    const response = await fetch(`https://www.secureserver.net/api/v1/cart/${plid}/`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        items,
        redirect: '0',
        plid,
        currencyType: 'USD',
        marketId: 'en-US'
      })
    })
    
    const data = await response.json()
    
    /**
     * Step 4: Extract JWT tokens from response cookies
     * 
     * GoDaddy returns these tokens in Set-Cookie headers:
     * - cust_idp: RS256 signed JWT with shopper info
     * - info_cust_idp: URL-encoded JSON with session data
     * 
     * These are HTTP-only cookies that frontend can't access directly
     * That's why we extract them here and send as JSON
     */
    const cookies = response.headers.getSetCookie()
    let custIdp = ''
    let infoCustIdp = ''
    let cartId = ''
    
    // Parse each cookie to find our tokens
    cookies.forEach(cookie => {
      if (cookie.includes('cust_idp=')) {
        const match = cookie.match(/cust_idp=([^;]+)/)
        if (match) custIdp = match[1]
      }
      if (cookie.includes('info_cust_idp=')) {
        const match = cookie.match(/info_cust_idp=([^;]+)/)
        if (match) infoCustIdp = match[1]
      }
      if (cookie.includes('cart_id=')) {
        const match = cookie.match(/cart_id=([^;]+)/)
        if (match) cartId = match[1]
      }
    })
    
    /**
     * Step 5: Return response to frontend
     * 
     * IMPORTANT: Only first item in a new session returns tokens
     * Subsequent items return empty tokens but maintain session
     * 
     * Response includes:
     * - data: Cart info from GoDaddy (cartCount, etc.)
     * - tokens: JWT tokens for session management
     * - cookies: Raw cookies for debugging
     */
    return NextResponse.json({
      success: true,
      data,
      tokens: {
        custIdp,
        infoCustIdp,
        cartId
      },
      cookies: cookies // Include for debugging
    })
    
  } catch (error) {
    console.error('Cart add error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to add to cart' },
      { status: 500 }
    )
  }
}