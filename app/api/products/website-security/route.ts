import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const currency = searchParams.get('currency') || 'USD'
    
    // Always use en-US for marketId, only change currencyType
    const marketId = 'en-US'
    
    // Fetch Website Security products from GoDaddy API
    const response = await fetch(
      `https://www.secureserver.net/api/v1/catalog/590175/tags/website-security?currencyType=${currency}&marketId=${marketId}&separateDisclaimers=true`,
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
    
    // Parse price from string format (e.g., "$42.99" -> 42.99)
    const parsePrice = (priceStr: string) => {
      if (!priceStr) return 0
      return parseFloat(priceStr.replace(/[^0-9.]/g, ''))
    }

    // Transform the data to match our frontend structure
    const transformedProducts = data.products.map((product: any, index: number) => {
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
            .trim()
          if (feature) features.push(feature)
        }
        return features
      }

      // Map product IDs to our frontend plan structure
      const getPlanDetails = (id: string) => {
        switch(id) {
          case 'website-security-standard':
            return {
              name: 'Standard',
              type: 'Essential Protection',
              icon: 'Shield',
              gradient: 'from-blue-500 to-cyan-500',
              popular: false,
              badge: null,
              scanFrequency: 'Daily',
              cleanup: '1 per year',
              support: 'Email'
            }
          case 'website-security-advanced':
            return {
              name: 'Advanced',
              type: 'Complete Protection',
              icon: 'ShieldCheck',
              gradient: 'from-cyan-500 to-blue-500',
              popular: true,
              badge: 'MOST POPULAR',
              scanFrequency: '12-hour',
              cleanup: 'Unlimited',
              support: 'Priority'
            }
          case 'website-security-premium':
            return {
              name: 'Premium',
              type: 'Maximum Protection',
              icon: 'Award',
              gradient: 'from-purple-500 to-pink-500',
              popular: false,
              badge: 'BEST VALUE',
              scanFrequency: 'Real-time',
              cleanup: 'Unlimited + Priority',
              support: '24/7 Phone'
            }
          default:
            return {
              name: product.alias || product.title,
              type: 'Website Protection',
              icon: 'Shield',
              gradient: 'from-gray-500 to-gray-600',
              popular: false,
              badge: null,
              scanFrequency: 'Daily',
              cleanup: 'As needed',
              support: 'Standard'
            }
        }
      }

      const planDetails = getPlanDetails(product.id)
      
      // Determine pricing (convert to monthly for display)
      const monthlyPrice = product.term === 'month' ? salePrice : salePrice / 12
      const yearlyPrice = product.term === 'month' ? salePrice * 12 : salePrice

      return {
        id: product.id,
        name: planDetails.name,
        type: planDetails.type,
        title: product.title,
        alias: product.alias,
        price: {
          monthly: monthlyPrice,
          yearly: yearlyPrice,
          currency: currency
        },
        originalPrice: {
          monthly: product.term === 'month' ? listPrice : listPrice / 12,
          yearly: product.term === 'month' ? listPrice * 12 : listPrice,
          currency: currency
        },
        features: extractFeatures(product.content),
        badge: planDetails.badge,
        gradient: planDetails.gradient,
        popular: planDetails.popular,
        icon: planDetails.icon,
        scanFrequency: planDetails.scanFrequency,
        cleanup: planDetails.cleanup,
        support: planDetails.support,
        term: product.term,
        order: product.order
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
    console.error('Error fetching website security products:', error)
    
    // Return fallback data on error
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch website security products',
      data: {
        title: 'Website Security',
        products: [
          {
            id: 'website-security-standard',
            name: 'Standard',
            type: 'Essential Protection',
            price: { monthly: 36.99, yearly: 443.99, currency: 'USD' },
            originalPrice: { monthly: 36.99, yearly: 443.99, currency: 'USD' },
            features: [
              'Protects one website',
              'Firewall prevents hackers',
              'SSL certificate included',
              'Daily malware scanning',
              'Annual site cleanup'
            ],
            badge: null,
            gradient: 'from-blue-500 to-cyan-500',
            popular: false,
            icon: 'Shield',
            scanFrequency: 'Daily',
            cleanup: '1 per year',
            support: 'Email'
          },
          {
            id: 'website-security-advanced',
            name: 'Advanced',
            type: 'Complete Protection',
            price: { monthly: 123.41, yearly: 1480.99, currency: 'USD' },
            originalPrice: { monthly: 123.41, yearly: 1480.99, currency: 'USD' },
            features: [
              'Protects one website',
              'Firewall prevents hackers',
              'SSL certificate included',
              '12-hour malware scanning',
              'Unlimited site cleanups',
              'DDoS protection & CDN',
              '25 GB secure backup'
            ],
            badge: 'MOST POPULAR',
            gradient: 'from-cyan-500 to-blue-500',
            popular: true,
            icon: 'ShieldCheck',
            scanFrequency: '12-hour',
            cleanup: 'Unlimited',
            support: 'Priority'
          },
          {
            id: 'website-security-premium',
            name: 'Premium',
            type: 'Maximum Protection',
            price: { monthly: 29.99, yearly: 359.88, currency: 'USD' },
            originalPrice: { monthly: 29.99, yearly: 359.88, currency: 'USD' },
            features: [
              'Protects one website',
              'Firewall prevents hackers',
              'SSL certificate included',
              'Real-time malware scanning',
              'Unlimited site cleanups',
              'DDoS protection & CDN',
              'Priority cleanup & repair',
              '200 GB secure backup'
            ],
            badge: 'BEST VALUE',
            gradient: 'from-purple-500 to-pink-500',
            popular: false,
            icon: 'Award',
            scanFrequency: 'Real-time',
            cleanup: 'Unlimited + Priority',
            support: '24/7 Phone'
          }
        ]
      }
    })
  }
}