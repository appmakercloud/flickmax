/**
 * Geolocation Service
 * 
 * Detects user's country based on their IP address
 * Uses ipapi.co free tier (1000 requests/day)
 * 
 * Falls back to US if detection fails
 */

interface GeoLocationResponse {
  country_code: string
  country_name: string
  city?: string
  region?: string
}

export async function detectUserCountry(): Promise<string> {
  try {
    // Use our API route which handles both client and server side
    const response = await fetch('/api/geo', {
      cache: 'no-store' // Don't cache to ensure accurate detection
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch geolocation')
    }
    
    const data: GeoLocationResponse = await response.json()
    return data.country_code || 'US'
    
  } catch (error) {
    console.error('Geolocation detection failed:', error)
    // Default to US if detection fails
    return 'US'
  }
}

// Alternative free APIs (as fallbacks):
// - https://ip-api.com/json/ (no HTTPS on free tier)
// - https://ipinfo.io/json (requires token)
// - https://api.ipgeolocation.io/ipgeo (requires API key)
// - https://freegeoip.app/json/ (limited requests)