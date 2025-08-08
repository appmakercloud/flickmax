import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const { items } = await request.json()
    const plid = process.env.NEXT_PUBLIC_PLID || '590175'
    
    // Make request to GoDaddy API from server
    const response = await fetch(`https://www.secureserver.net/api/v1/cart/${plid}/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        items,
        redirect: '0',
        plid,
        currencyType: 'USD',
        marketId: 'en-US'
      })
    })
    
    const data = await response.json()
    
    // Extract cookies from GoDaddy response
    const setCookieHeaders = response.headers.getSetCookie()
    const cookieStore = cookies()
    
    // Parse and set cookies
    setCookieHeaders.forEach(cookieString => {
      const [nameValue] = cookieString.split(';').map(s => s.trim())
      const [name, value] = nameValue.split('=')
      
      if (name === 'cust_idp' || name === 'info_cust_idp') {
        // Set these cookies for the client
        cookieStore.set(name, value, {
          domain: '.flickmax.com', // Your domain
          path: '/',
          secure: true,
          sameSite: 'none',
          maxAge: 60 * 60 * 24 * 365 // 1 year
        })
      }
    })
    
    return NextResponse.json({
      success: true,
      data,
      cartCount: data.cartCount
    })
    
  } catch (error) {
    console.error('Cart add error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to add to cart' },
      { status: 500 }
    )
  }
}