import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Get client IP from headers
    const forwarded = request.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip')
    
    // Check Vercel geo headers first
    const vercelCountry = request.headers.get('x-vercel-ip-country')
    if (vercelCountry) {
      return NextResponse.json({ country_code: vercelCountry })
    }
    
    // Use ipapi.co for geolocation
    const geoResponse = await fetch(`https://ipapi.co/${ip}/json/`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Flickmax/1.0)'
      }
    })
    
    if (!geoResponse.ok) {
      throw new Error('Geolocation API failed')
    }
    
    const geoData = await geoResponse.json()
    
    return NextResponse.json({
      country_code: geoData.country_code || 'US',
      country_name: geoData.country_name,
      city: geoData.city,
      region: geoData.region
    })
    
  } catch (error) {
    console.error('Geo detection error:', error)
    // Default to US if detection fails
    return NextResponse.json({ country_code: 'US' })
  }
}