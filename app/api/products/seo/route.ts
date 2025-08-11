import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const currency = searchParams.get('currency') || 'USD'
    
    // Always use en-US for marketId
    const marketId = 'en-US'
    
    // Fetch SEO products from GoDaddy API
    const response = await fetch(
      `https://www.secureserver.net/api/v1/catalog/590175/tags/seo?currencyType=${currency}&marketId=${marketId}&separateDisclaimers=false`,
      {
        headers: {
          'Accept': 'application/json',
        },
        cache: 'no-store'
      }
    )

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`)
    }

    const data = await response.json()
    
    // Parse price from string format (e.g., "$6.99" -> 6.99)
    const parsePrice = (priceStr: string) => {
      if (!priceStr) return 0
      return parseFloat(priceStr.replace(/[^0-9.]/g, ''))
    }

    // Transform the data to match our frontend structure
    const transformedProducts = data.products.map((product: any) => {
      const listPrice = parsePrice(product.listPrice)
      const salePrice = product.salePrice ? parsePrice(product.salePrice) : listPrice

      // Extract features from content HTML
      const extractFeatures = (content: string) => {
        const features: string[] = []
        const regex = /<li[^>]*>(.*?)<\/li>/gi
        let match
        while ((match = regex.exec(content)) !== null) {
          const feature = match[1]
            .replace(/<[^>]*>/g, '') // Remove HTML tags
            .replace(/&amp;/g, '&')
            .replace(/&nbsp;/g, ' ')
            .replace(/:/g, ':')
            .trim()
          if (feature) features.push(feature)
        }
        return features
      }

      // Extract description from content
      const extractDescription = (content: string) => {
        const match = content.match(/<strong>(.*?)<\/strong>/);
        return match ? match[1].replace(/<[^>]*>/g, '') : '';
      }

      const features = extractFeatures(product.content)
      const description = extractDescription(product.content)

      return {
        id: product.id,
        name: product.title,
        alias: product.alias,
        description: description || product.description,
        price: {
          monthly: salePrice,
          currency: currency
        },
        originalPrice: {
          monthly: listPrice,
          currency: currency
        },
        features: features,
        term: product.term,
        order: product.order,
        image: product.image,
        imageId: product.imageId
      }
    })

    // Sort by order
    transformedProducts.sort((a: any, b: any) => a.order - b.order)

    return NextResponse.json({
      success: true,
      data: {
        title: data.title,
        subtitle: data.subtitle,
        description: data.description,
        products: transformedProducts,
        currency: currency,
        market: marketId
      }
    })
  } catch (error) {
    console.error('Error fetching SEO products:', error)
    
    // Return fallback data on error
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch SEO products',
      data: {
        title: 'SEO',
        products: []
      }
    })
  }
}