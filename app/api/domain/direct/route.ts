import { NextRequest, NextResponse } from 'next/server'

// This endpoint bypasses fetch issues by using a different approach
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const query = searchParams.get('q') || 'example.com'
  
  // For development, return mock data based on common patterns
  // In production, this would use a proper proxy service
  const mockResponse = {
    exactMatchDomain: {
      domain: query,
      available: !query.includes('flickmax'), // flickmax domains are taken
      id: 'domain',
      productId: 12101,
      listPrice: query.endsWith('.org') ? '$19.99' : 
                 query.endsWith('.com') ? '$12.99' :
                 query.endsWith('.net') ? '$14.99' :
                 query.endsWith('.co.in') ? '$10.99' :
                 query.endsWith('.in') ? '$8.99' :
                 query.endsWith('.ai') ? '$124.99' :
                 '$15.99',
      salePrice: query.endsWith('.org') ? '$19.99' : 
                 query.endsWith('.com') ? '$12.99' :
                 query.endsWith('.net') ? '$14.99' :
                 query.endsWith('.co.in') ? '$10.99' :
                 query.endsWith('.in') ? '$8.99' :
                 query.endsWith('.ai') ? '$124.99' :
                 '$15.99',
      extendedValidation: false,
      disclaimer: null
    },
    suggestedDomains: [] as Array<{
      domain: string;
      available: boolean;
      id: string;
      productId: number;
      listPrice: string;
      salePrice: null;
      extendedValidation: boolean;
      disclaimer: null;
    }>,
    disclaimer: "Prices shown are estimates. Final pricing confirmed at checkout."
  }
  
  // Add some popular alternatives
  const baseName = query.split('.')[0]
  const extensions = ['.com', '.net', '.org', '.co', '.io', '.app']
  
  mockResponse.suggestedDomains = extensions
    .filter(ext => !query.endsWith(ext))
    .slice(0, 5)
    .map(ext => ({
      domain: baseName + ext,
      available: true,
      id: 'domain',
      productId: 0,
      listPrice: ext === '.com' ? '$12.99' :
                 ext === '.net' ? '$14.99' :
                 ext === '.org' ? '$19.99' :
                 ext === '.io' ? '$32.99' :
                 '$24.99',
      salePrice: null,
      extendedValidation: false,
      disclaimer: null
    }))
  
  return NextResponse.json(mockResponse, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-cache'
    }
  })
}