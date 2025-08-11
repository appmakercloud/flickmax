import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const currency = searchParams.get('currency') || 'USD'
    
    // Always use en-IN for marketId for professional email products
    // This ensures correct pricing from the backend
    const marketId = 'en-IN'
    
    // Fetch Professional Email products from GoDaddy API
    const response = await fetch(
      `https://www.secureserver.net/api/v1/catalog/590175/tags/professional-email?currencyType=${currency}&marketId=${marketId}&separateDisclaimers=false`,
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
    
    // Parse price from string format (e.g., "₹ 169.00" -> 169.00)
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

      // Extract recommendation from content
      const extractRecommendation = (content: string) => {
        const match = content.match(/<strong>(.*?)<\/strong>/);
        return match ? match[1] : '';
      }

      // Map product IDs to our frontend plan structure
      const getPlanDetails = (id: string, content: string) => {
        const recommendation = extractRecommendation(content);
        
        switch(id) {
          case 'professional-email-individual':
            return {
              name: 'Individual',
              type: 'Essential Email',
              description: 'Perfect for getting started',
              icon: 'Mail',
              gradient: 'from-blue-400 to-cyan-500',
              popular: false,
              badge: null,
              storage: '10 GB',
              users: '1 user',
              support: 'Email support',
              recommendation: recommendation
            }
          case 'professional-email-team':
            return {
              name: 'Team',
              type: 'Collaborative Email',
              description: 'Great for teams',
              icon: 'Users',
              gradient: 'from-cyan-500 to-blue-600',
              popular: true,
              badge: 'MOST POPULAR',
              storage: '25 GB',
              users: 'Multiple users',
              support: 'Priority support',
              recommendation: recommendation
            }
          default:
            return {
              name: product.alias || product.title,
              type: 'Professional Email',
              description: recommendation || 'Professional email solution',
              icon: 'Mail',
              gradient: 'from-gray-500 to-gray-600',
              popular: false,
              badge: null,
              storage: 'Standard',
              users: '1 user',
              support: 'Standard',
              recommendation: recommendation
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
        recommendation: planDetails.recommendation,
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
    console.error('Error fetching professional email products:', error)
    
    // Return fallback data on error
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch professional email products',
      data: {
        title: 'Professional Email',
        products: [
          {
            id: 'professional-email-individual',
            name: 'Individual',
            type: 'Essential Email',
            price: { monthly: 39, yearly: 468, currency: 'INR' },
            originalPrice: { monthly: 169, yearly: 2028, currency: 'INR' },
            features: [
              'Email that matches your domain',
              '10 GB of email storage',
              'Mobile-friendly webmail',
              'Calendar, contacts and tasks',
              'Works with the email app of your choice'
            ],
            badge: null,
            gradient: 'from-blue-400 to-cyan-500',
            popular: false,
            icon: 'Mail',
            storage: '10 GB',
            users: '1 user',
            support: 'Email support'
          },
          {
            id: 'professional-email-team',
            name: 'Team',
            type: 'Collaborative Email',
            price: { monthly: 119, yearly: 1428, currency: 'INR' },
            originalPrice: { monthly: 269, yearly: 3228, currency: 'INR' },
            features: [
              'Email that matches your domain',
              '25 GB of email storage',
              'Mobile-friendly webmail',
              'Share calendar, contacts and tasks',
              'Assign tasks to your team members',
              'Works with the email app of your choice'
            ],
            badge: 'MOST POPULAR',
            gradient: 'from-cyan-500 to-blue-600',
            popular: true,
            icon: 'Users',
            storage: '25 GB',
            users: 'Multiple users',
            support: 'Priority support'
          }
        ]
      }
    })
  }
}