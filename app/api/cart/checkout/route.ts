import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
  try {
    const cookieStore = cookies()
    const plid = process.env.NEXT_PUBLIC_PLID || '590175'
    
    // Get authentication tokens from cookies
    const custIdp = cookieStore.get('cust_idp')?.value
    const infoCustIdp = cookieStore.get('info_cust_idp')?.value
    
    if (!custIdp || !infoCustIdp) {
      return NextResponse.json(
        { success: false, error: 'No authentication tokens found. Please add items to cart first.' },
        { status: 400 }
      )
    }
    
    // Create the checkout URL
    const checkoutUrl = `https://cart.secureserver.net/go/checkout?pl_id=${plid}`
    
    // Return the tokens and checkout URL
    return NextResponse.json({
      success: true,
      custIdp,
      infoCustIdp,
      checkoutUrl
    })
    
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to process checkout' },
      { status: 500 }
    )
  }
}