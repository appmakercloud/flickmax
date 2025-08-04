import { NextResponse } from 'next/server'
import { getDomainSearchService } from '@/lib/api/domain-service'

export async function GET() {
  console.log('=== TEST GODADDY API CONNECTION ===')
  
  try {
    // Test 1: Check if service can be instantiated
    console.log('Test 1: Creating domain service instance...')
    const service = getDomainSearchService()
    console.log('✓ Domain service created successfully')
    
    // Test 2: Try a simple domain search
    console.log('Test 2: Searching for test.com...')
    const result = await service.searchDomains({
      query: 'test',
      currencyType: 'USD',
      marketId: 'en-US',
      pageSize: 10
    })
    
    console.log('✓ Search completed successfully')
    console.log('Result:', JSON.stringify(result, null, 2))
    
    return NextResponse.json({
      success: true,
      message: 'GoDaddy API connection successful',
      result: result
    })
  } catch (error) {
    console.error('=== GODADDY API TEST FAILED ===')
    console.error('Error:', error)
    console.error('Error type:', error?.constructor?.name)
    console.error('Error message:', error instanceof Error ? error.message : 'Unknown error')
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack?.split('\n').slice(0, 5)
      } : null
    }, { status: 500 })
  }
}