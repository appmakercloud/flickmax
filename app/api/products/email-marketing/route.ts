import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const currency = searchParams.get('currency') || 'USD'
    
    // Always use en-US for marketId
    const marketId = 'en-US'
    
    // Fetch Email Marketing products from GoDaddy API
    const response = await fetch(
      `https://www.secureserver.net/api/v1/catalog/590175/tags/email-marketing?currencyType=${currency}&marketId=${marketId}&separateDisclaimers=false`,
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
    
    // Parse price from string format (e.g., "$722.99" -> 722.99)
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

      // Extract description from content
      const extractDescription = (content: string) => {
        const match = content.match(/<strong>(.*?)<\/strong>/);
        return match ? match[1] : '';
      }

      // Map product IDs to our frontend plan structure
      const getPlanDetails = (id: string, content: string) => {
        const description = extractDescription(content);
        const features = extractFeatures(content);
        
        switch(id) {
          case 'email-marketing-beginner':
            return {
              name: 'Beginner',
              type: 'Get Started',
              description: 'Perfect for new businesses',
              tagline: description,
              icon: 'Rocket',
              gradient: 'from-blue-400 to-cyan-500',
              popular: false,
              badge: null,
              contacts: '500',
              emails: '5,000/month',
              forms: '1',
              storage: 'Basic',
              automation: false,
              features: features
            }
          case 'email-marketing-up-and-running':
            return {
              name: 'Up & Running',
              type: 'Growing Business',
              description: 'Most popular for active businesses',
              tagline: description,
              icon: 'TrendingUp',
              gradient: 'from-cyan-500 to-blue-600',
              popular: true,
              badge: 'MOST POPULAR',
              contacts: '2,500',
              emails: '25,000/month',
              forms: 'Unlimited',
              storage: 'Unlimited',
              automation: true,
              features: features
            }
          case 'email-marketing-pro':
            return {
              name: 'Pro',
              type: 'Scale & Automate',
              description: 'Advanced marketing automation',
              tagline: description,
              icon: 'Crown',
              gradient: 'from-blue-600 to-indigo-600',
              popular: false,
              badge: 'BEST VALUE',
              contacts: '5,000',
              emails: '50,000/month',
              forms: 'Unlimited',
              storage: 'Unlimited',
              automation: true,
              features: features
            }
          default:
            return {
              name: product.alias || product.title,
              type: 'Email Marketing',
              description: description || 'Email marketing solution',
              tagline: description,
              icon: 'Mail',
              gradient: 'from-gray-500 to-gray-600',
              popular: false,
              badge: null,
              contacts: 'Custom',
              emails: 'Custom',
              forms: 'Custom',
              storage: 'Custom',
              automation: false,
              features: features
            }
        }
      }

      const planDetails = getPlanDetails(product.id, product.content)
      
      // Prices are yearly, divide by 12 for monthly
      const yearlyPrice = salePrice
      const monthlyPrice = yearlyPrice / 12

      return {
        id: product.id,
        name: planDetails.name,
        type: planDetails.type,
        description: planDetails.description,
        tagline: planDetails.tagline,
        title: product.title,
        alias: product.alias,
        price: {
          monthly: monthlyPrice,
          yearly: yearlyPrice,
          currency: currency
        },
        originalPrice: {
          monthly: listPrice / 12,
          yearly: listPrice,
          currency: currency
        },
        features: planDetails.features,
        badge: planDetails.badge,
        gradient: planDetails.gradient,
        popular: planDetails.popular,
        icon: planDetails.icon,
        contacts: planDetails.contacts,
        emails: planDetails.emails,
        forms: planDetails.forms,
        storage: planDetails.storage,
        automation: planDetails.automation,
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
    console.error('Error fetching email marketing products:', error)
    
    // Return fallback data on error
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch email marketing products',
      data: {
        title: 'Email Marketing',
        products: []
      }
    })
  }
}