import { NextRequest, NextResponse } from 'next/server'

// Cache for individual agreements
const agreementCache = new Map<string, { data: any; timestamp: number }>()
const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours in milliseconds

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const { searchParams } = new URL(request.url)
    const marketId = searchParams.get('marketId') || 'en-US'
    const plid = process.env.NEXT_PUBLIC_PLID || '590175'
    
    // Check cache
    const cacheKey = `${id}-${marketId}`
    const cached = agreementCache.get(cacheKey)
    const now = Date.now()
    
    if (cached && (now - cached.timestamp) < CACHE_DURATION) {
      console.log(`Serving agreement ${id} from cache`)
      return NextResponse.json({
        success: true,
        data: cached.data,
        cached: true
      })
    }
    
    console.log(`Fetching agreement ${id} from API`)
    
    // Fetch from GoDaddy API
    const response = await fetch(
      `https://www.secureserver.net/api/v1/agreements/${plid}/${id}?marketId=${marketId}`,
      {
        headers: {
          'Accept': 'application/json',
        },
        cache: 'no-store'
      }
    )

    if (!response.ok) {
      // Some agreements might be external links (ICANN)
      if (response.status === 404) {
        return NextResponse.json({
          success: false,
          error: 'Agreement not found or is an external link',
          code: 'NOT_FOUND'
        }, { status: 404 })
      }
      throw new Error(`API responded with status: ${response.status}`)
    }

    const data = await response.json()
    
    // Process the agreement content
    const processedData = processAgreementContent(data)
    
    // Update cache
    agreementCache.set(cacheKey, {
      data: processedData,
      timestamp: now
    })
    
    // Limit cache size
    if (agreementCache.size > 50) {
      const firstKey = agreementCache.keys().next().value
      agreementCache.delete(firstKey)
    }
    
    return NextResponse.json({
      success: true,
      data: processedData,
      cached: false
    })
  } catch (error) {
    console.error('Error fetching agreement:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch agreement content',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

function processAgreementContent(data: any) {
  // Clean up HTML content - GoDaddy returns it as 'body' not 'content'
  let content = data.body || data.content || ''
  
  if (typeof content === 'string') {
    // Basic HTML entity decoding
    content = content
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&rsquo;/g, "'")
      .replace(/&lsquo;/g, "'")
      .replace(/&rdquo;/g, '"')
      .replace(/&ldquo;/g, '"')
      .replace(/&mdash;/g, '—')
      .replace(/&ndash;/g, '–')
  }
  
  return {
    ...data,
    content,
    processedAt: new Date().toISOString(),
    sections: extractSections(content)
  }
}

function extractSections(content: string): any[] {
  const sections = []
  
  // Extract table of contents if present
  const tocMatch = content.match(/<div[^>]*class="[^"]*toc[^"]*"[^>]*>([\s\S]*?)<\/div>/i)
  if (tocMatch) {
    sections.push({
      type: 'toc',
      title: 'Table of Contents',
      content: tocMatch[1]
    })
  }
  
  // Extract main sections based on h2 tags
  const h2Regex = /<h2[^>]*>(.*?)<\/h2>([\s\S]*?)(?=<h2|$)/gi
  let match
  
  while ((match = h2Regex.exec(content)) !== null) {
    const title = match[1].replace(/<[^>]*>/g, '').trim()
    const sectionContent = match[2].trim()
    
    sections.push({
      type: 'section',
      title: title,
      content: sectionContent
    })
  }
  
  // If no sections found, treat the entire content as one section
  if (sections.length === 0 && content) {
    sections.push({
      type: 'main',
      title: 'Agreement Content',
      content: content
    })
  }
  
  return sections
}