import { NextRequest, NextResponse } from 'next/server'

// Cache duration: 24 hours (in seconds)
const CACHE_DURATION = 24 * 60 * 60

// In-memory cache (in production, use Redis or similar)
let cache: {
  data: any | null
  timestamp: number | null
} = {
  data: null,
  timestamp: null
}

export async function GET(request: NextRequest) {
  try {
    const now = Date.now()
    
    // Check if cache is valid (less than 24 hours old)
    if (cache.data && cache.timestamp && (now - cache.timestamp) < (CACHE_DURATION * 1000)) {
      console.log('Serving legal agreements from cache')
      return NextResponse.json({
        success: true,
        data: cache.data,
        cached: true,
        cacheAge: Math.floor((now - cache.timestamp) / 1000), // age in seconds
        nextRefresh: new Date(cache.timestamp + (CACHE_DURATION * 1000)).toISOString()
      })
    }
    
    console.log('Fetching fresh legal agreements from API')
    
    // Fetch fresh data from GoDaddy API
    const response = await fetch(
      'https://www.secureserver.net/api/v1/agreements/590175/utos?marketId=en-US',
      {
        headers: {
          'Accept': 'application/json',
        },
        // Don't use Next.js cache for this request
        cache: 'no-store'
      }
    )

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`)
    }

    const data = await response.json()
    
    // Update cache
    cache = {
      data: data,
      timestamp: now
    }
    
    // Process and structure the agreements data
    const processedData = processAgreements(data)
    
    return NextResponse.json({
      success: true,
      data: processedData,
      cached: false,
      cacheAge: 0,
      nextRefresh: new Date(now + (CACHE_DURATION * 1000)).toISOString()
    })
  } catch (error) {
    console.error('Error fetching legal agreements:', error)
    
    // If we have cached data and there's an error, return cached data
    if (cache.data) {
      console.log('API error, serving stale cache')
      return NextResponse.json({
        success: true,
        data: cache.data,
        cached: true,
        stale: true,
        error: 'Using cached data due to API error'
      })
    }
    
    // No cache available, return error
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch legal agreements',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// Process and structure the agreements data
function processAgreements(data: any) {
  if (!data || !data.content) {
    return data
  }
  
  // Parse the content if it's a string
  let content = data.content
  if (typeof content === 'string') {
    // Clean up HTML entities and format
    content = content
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
  }
  
  return {
    ...data,
    content: content,
    lastUpdated: new Date().toISOString(),
    sections: extractSections(content)
  }
}

// Extract main sections from the content
function extractSections(content: string): any[] {
  const sections = []
  
  // Common legal document section patterns
  const sectionPatterns = [
    { pattern: /<h2[^>]*>(.*?)<\/h2>/gi, type: 'heading' },
    { pattern: /<h3[^>]*>(.*?)<\/h3>/gi, type: 'subheading' },
    { pattern: /<strong>(.*?)<\/strong>/gi, type: 'emphasis' }
  ]
  
  // Extract sections based on headings
  const h2Regex = /<h2[^>]*>(.*?)<\/h2>([\s\S]*?)(?=<h2|$)/gi
  let match
  
  while ((match = h2Regex.exec(content)) !== null) {
    const title = match[1].replace(/<[^>]*>/g, '').trim()
    const contentText = match[2].trim()
    
    sections.push({
      title: title,
      content: contentText,
      type: 'section'
    })
  }
  
  // If no sections found, return the content as a single section
  if (sections.length === 0) {
    sections.push({
      title: 'Terms of Service',
      content: content,
      type: 'full'
    })
  }
  
  return sections
}

// Optional: Add a POST endpoint to manually refresh the cache
export async function POST(request: NextRequest) {
  try {
    // Clear the cache
    cache = {
      data: null,
      timestamp: null
    }
    
    // Fetch fresh data
    const response = await GET(request)
    
    return NextResponse.json({
      success: true,
      message: 'Cache refreshed successfully'
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to refresh cache'
    }, { status: 500 })
  }
}