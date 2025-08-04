import { NextResponse } from 'next/server'
import { getDomainSearchService } from '@/lib/api/domain-service'

export async function GET() {
  console.log('=== DOMAIN DEBUG TEST ===')
  
  const testDomains = [
    'test',           // Works
    'flickmax',       // Test without extension
    'example.com',    // Common test domain
    'example.org',    // Test .org extension
    'flickmax.com',   // Test with .com
    'flickmax.org'    // Original failing domain
  ]
  
  const results: Array<{
    domain: string
    status: string
    available?: boolean
    exactMatch?: string
    error?: string
  }> = []
  const service = getDomainSearchService()
  
  for (const domain of testDomains) {
    console.log(`\nTesting: ${domain}`)
    try {
      await service.searchDomains({
        query: domain,
        currencyType: 'USD',
        marketId: 'en-US',
        pageSize: 1
      })
      
      console.log(`✓ ${domain} - SUCCESS`)
      results.push({
        domain,
        status: 'success',
        available: undefined,
        exactMatch: undefined
      })
    } catch (error) {
      console.error(`✗ ${domain} - FAILED:`, error instanceof Error ? error.message : error)
      results.push({
        domain,
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }
  
  return NextResponse.json({
    message: 'Domain debug test complete',
    results,
    summary: {
      total: results.length,
      successful: results.filter(r => r.status === 'success').length,
      failed: results.filter(r => r.status === 'failed').length
    }
  })
}