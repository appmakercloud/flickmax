import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const currency = searchParams.get('currency') || 'USD'
    
    // Always use en-IN for marketId for microsoft 365 products
    // This ensures correct pricing from the backend
    const marketId = 'en-IN'
    
    // Fetch Microsoft 365 products from GoDaddy API
    const response = await fetch(
      `https://www.secureserver.net/api/v1/catalog/590175/tags/microsoft-365?currencyType=${currency}&marketId=${marketId}&separateDisclaimers=false`,
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
            .replace(/–/g, '-')
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

      // Map product IDs to our frontend plan structure with simple content
      const getPlanDetails = (id: string, content: string) => {
        const description = extractDescription(content);
        
        switch(id) {
          case 'microsoft-365-email-essentials':
            return {
              name: 'Email Essentials',
              type: 'Basic Email',
              description: 'Perfect for getting started',
              simpleDescription: 'Get professional email with 10GB storage',
              icon: 'Mail',
              gradient: 'from-blue-400 to-cyan-500',
              popular: false,
              badge: null,
              storage: '10 GB',
              users: '1 user',
              support: '24/7 Support',
              apps: 'Email only',
              meetings: false
            }
          case 'microsoft-365-email-plus':
            return {
              name: 'Email Plus',
              type: 'Enhanced Email',
              description: 'More storage for growing needs',
              simpleDescription: 'Professional email with 50GB storage',
              icon: 'MailPlus',
              gradient: 'from-cyan-500 to-blue-500',
              popular: false,
              badge: null,
              storage: '50 GB',
              users: '1 user',
              support: '24/7 Support',
              apps: 'Email only',
              meetings: false
            }
          case 'microsoft-365-online-essentials':
            return {
              name: 'Business Essentials',
              type: 'Online Office + Email',
              description: 'Best for remote teams',
              simpleDescription: 'Web Office apps + email + video meetings',
              icon: 'Briefcase',
              gradient: 'from-blue-500 to-indigo-500',
              popular: true,
              badge: 'MOST POPULAR',
              storage: '1 TB + 50 GB email',
              users: '1 user',
              support: '24/7 Priority',
              apps: 'Web Office apps',
              meetings: 'Unlimited HD meetings'
            }
          case 'microsoft-365-business-premium':
            return {
              name: 'Business Professional',
              type: 'Complete Office Suite',
              description: 'Everything you need',
              simpleDescription: 'Desktop + web apps + email + meetings',
              icon: 'Crown',
              gradient: 'from-indigo-500 to-purple-500',
              popular: false,
              badge: 'BEST VALUE',
              storage: '1 TB + 50 GB email',
              users: '5 devices',
              support: '24/7 Premium',
              apps: 'Desktop + Web apps',
              meetings: 'Unlimited HD meetings'
            }
          default:
            return {
              name: product.alias || product.title,
              type: 'Microsoft 365',
              description: description || 'Microsoft productivity tools',
              simpleDescription: 'Professional productivity suite',
              icon: 'Mail',
              gradient: 'from-gray-500 to-gray-600',
              popular: false,
              badge: null,
              storage: 'Standard',
              users: '1 user',
              support: '24/7 Support',
              apps: 'Office apps',
              meetings: false
            }
        }
      }

      const planDetails = getPlanDetails(product.id, product.content)
      
      // Prices are monthly
      const monthlyPrice = salePrice
      const yearlyPrice = monthlyPrice * 12
      const monthlyListPrice = listPrice
      const yearlyListPrice = monthlyListPrice * 12

      return {
        id: product.id,
        name: planDetails.name,
        type: planDetails.type,
        description: planDetails.description,
        simpleDescription: planDetails.simpleDescription,
        title: product.title,
        alias: product.alias,
        price: {
          monthly: monthlyPrice,
          yearly: yearlyPrice,
          currency: currency
        },
        originalPrice: {
          monthly: monthlyListPrice,
          yearly: yearlyListPrice,
          currency: currency
        },
        features: extractFeatures(product.content),
        badge: planDetails.badge,
        gradient: planDetails.gradient,
        popular: planDetails.popular,
        icon: planDetails.icon,
        storage: planDetails.storage,
        users: planDetails.users,
        support: planDetails.support,
        apps: planDetails.apps,
        meetings: planDetails.meetings,
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
    console.error('Error fetching Microsoft 365 products:', error)
    
    // Return fallback data on error
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch Microsoft 365 products',
      data: {
        title: 'Microsoft 365',
        products: []
      }
    })
  }
}