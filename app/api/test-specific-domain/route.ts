import { NextRequest, NextResponse } from 'next/server'
import { getDomainSearchService } from '@/lib/api/domain-service'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const domain = searchParams.get('domain') || 'flickmax.org'
  const currency = searchParams.get('currency') || 'USD'
  
  console.log(`=== TESTING SPECIFIC DOMAIN: ${domain} with currency: ${currency} ===`)
  
  try {
    const service = getDomainSearchService()
    
    // Test 1: Try with USD first
    console.log('Test 1: Searching with USD currency...')
    try {
      const resultUSD = await service.searchDomains({
        query: domain,
        currencyType: 'USD',
        marketId: 'en-US',
        pageSize: 10
      })
      console.log('✓ USD search successful')
      console.log('Result:', JSON.stringify(resultUSD, null, 2).substring(0, 500) + '...')
    } catch (error) {
      console.error('✗ USD search failed:', error)
    }
    
    // Test 2: Try with requested currency if different
    if (currency !== 'USD') {
      console.log(`Test 2: Searching with ${currency} currency...`)
      try {
        const resultCurrency = await service.searchDomains({
          query: domain,
          currencyType: currency,
          marketId: currency === 'GBP' ? 'en-GB' : 'en-US',
          pageSize: 10
        })
        console.log(`✓ ${currency} search successful`)
        return NextResponse.json({
          success: true,
          domain: domain,
          currency: currency,
          result: resultCurrency
        })
      } catch (error) {
        console.error(`✗ ${currency} search failed:`, error)
        throw error
      }
    }
    
    // Return USD result if that's what was requested
    const result = await service.searchDomains({
      query: domain,
      currencyType: 'USD',
      marketId: 'en-US',
      pageSize: 10
    })
    
    return NextResponse.json({
      success: true,
      domain: domain,
      currency: 'USD',
      result: result
    })
  } catch (error) {
    console.error('=== DOMAIN TEST FAILED ===')
    console.error('Error:', error)
    
    return NextResponse.json({
      success: false,
      domain: domain,
      currency: currency,
      error: error instanceof Error ? error.message : 'Unknown error',
      suggestion: 'Try with USD currency: /api/test-specific-domain?domain=flickmax.org&currency=USD'
    }, { status: 500 })
  }
}