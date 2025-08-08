import { NextRequest, NextResponse } from 'next/server'

const GODADDY_API_KEY = process.env.GODADDY_API_KEY
const GODADDY_API_SECRET = process.env.GODADDY_API_SECRET

// Transfer pricing by TLD
const transferPricing: { [key: string]: { usd: number, inr: number } } = {
  '.com': { usd: 10.99, inr: 899 },
  '.net': { usd: 12.99, inr: 1099 },
  '.org': { usd: 11.99, inr: 999 },
  '.in': { usd: 8.99, inr: 749 },
  '.co': { usd: 24.99, inr: 2099 },
  '.io': { usd: 44.99, inr: 3799 },
  '.ai': { usd: 89.99, inr: 7499 },
  '.app': { usd: 15.99, inr: 1349 },
  '.dev': { usd: 14.99, inr: 1249 },
  '.store': { usd: 4.99, inr: 399 },
  '.website': { usd: 3.99, inr: 329 },
  '.online': { usd: 5.99, inr: 499 },
  '.tech': { usd: 9.99, inr: 849 },
  '.xyz': { usd: 2.99, inr: 249 },
  '.info': { usd: 4.99, inr: 399 },
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { domain, authCode, currency = 'USD' } = body

    if (!domain) {
      return NextResponse.json(
        { error: 'Domain name is required' },
        { status: 400 }
      )
    }

    if (!authCode) {
      return NextResponse.json(
        { error: 'Authorization code is required' },
        { status: 400 }
      )
    }

    // Extract TLD from domain
    const tld = '.' + domain.split('.').pop()
    const domainName = domain.toLowerCase().trim()

    // Check if we support this TLD for transfer
    const pricing = transferPricing[tld]
    if (!pricing) {
      return NextResponse.json(
        { 
          error: `Domain transfers for ${tld} are not currently supported`,
          supportedTlds: Object.keys(transferPricing)
        },
        { status: 400 }
      )
    }

    // In production, you would verify with GoDaddy API
    // For now, we'll simulate the transfer eligibility check
    const transferData = {
      domain: domainName,
      available: true,
      eligible: true,
      price: currency === 'INR' ? pricing.inr : pricing.usd,
      currency: currency,
      renewalPrice: currency === 'INR' ? pricing.inr * 1.3 : pricing.usd * 1.3, // Typically renewal is higher
      transferTime: '5-7 days',
      requirements: {
        authCode: true,
        unlocked: true,
        days60: tld !== '.in' && tld !== '.io' && tld !== '.ai', // Some TLDs don't have 60-day lock
        emailVerification: true
      },
      benefits: [
        'Free WHOIS Privacy Protection',
        'Free DNS Management',
        '1 Year Extension Included',
        '24/7 Expert Support',
        'No Hidden Fees'
      ],
      productId: `domain-transfer-${domainName}`,
      tld: tld
    }

    // Check with GoDaddy API (if credentials are available)
    if (GODADDY_API_KEY && GODADDY_API_SECRET) {
      try {
        // Check domain availability/status
        const availabilityResponse = await fetch(
          `https://api.godaddy.com/v1/domains/available?domain=${domainName}`,
          {
            headers: {
              'Authorization': `sso-key ${GODADDY_API_KEY}:${GODADDY_API_SECRET}`,
              'Content-Type': 'application/json'
            }
          }
        )

        if (availabilityResponse.ok) {
          const availabilityData = await availabilityResponse.json()
          
          // If domain is available for registration, it can't be transferred
          if (availabilityData.available) {
            return NextResponse.json(
              { 
                error: 'This domain is not registered and cannot be transferred. You can register it instead.',
                available: true,
                forRegistration: true
              },
              { status: 400 }
            )
          }
        }
      } catch (apiError) {
        console.error('GoDaddy API error:', apiError)
        // Continue with simulated data if API fails
      }
    }

    return NextResponse.json({
      success: true,
      data: transferData
    })

  } catch (error) {
    console.error('Domain transfer check error:', error)
    return NextResponse.json(
      { error: 'Failed to check domain transfer eligibility' },
      { status: 500 }
    )
  }
}

// GET endpoint to fetch transfer pricing
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const currency = searchParams.get('currency') || 'USD'
  const tld = searchParams.get('tld')

  if (tld) {
    const pricing = transferPricing[tld]
    if (pricing) {
      return NextResponse.json({
        tld,
        price: currency === 'INR' ? pricing.inr : pricing.usd,
        currency
      })
    }
    return NextResponse.json(
      { error: `Pricing not available for ${tld}` },
      { status: 404 }
    )
  }

  // Return all pricing
  const allPricing = Object.entries(transferPricing).map(([tld, prices]) => ({
    tld,
    price: currency === 'INR' ? prices.inr : prices.usd,
    currency
  }))

  return NextResponse.json({
    pricing: allPricing,
    currency
  })
}