import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const currency = searchParams.get('currency') || 'USD'
    
    // Always use en-US for marketId, only change currencyType
    const marketId = 'en-US'
    
    // Fetch Website Backup products from GoDaddy API
    const response = await fetch(
      `https://www.secureserver.net/api/v1/catalog/590175/tags/website-backup?currencyType=${currency}&marketId=${marketId}&separateDisclaimers=true`,
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

      // Extract recommendation from content
      const extractRecommendation = (content: string) => {
        const match = content.match(/<strong>(.*?)<\/strong>/);
        return match ? match[1].replace('Recommended for ', '') : '';
      }

      // Map product IDs to our frontend plan structure
      const getPlanDetails = (id: string, content: string) => {
        const recommendation = extractRecommendation(content);
        
        switch(id) {
          case 'website-backup-5gb':
            return {
              name: 'Starter',
              type: '5 GB Storage',
              description: 'Documents and files',
              icon: 'HardDrive',
              gradient: 'from-blue-400 to-blue-600',
              popular: false,
              badge: null,
              storageSize: '5 GB',
              websites: '1 website',
              frequency: 'Daily backups',
              retention: '30 days',
              support: 'Email',
              recommendation: recommendation
            }
          case 'website-backup-25gb':
            return {
              name: 'Professional',
              type: '25 GB Storage',
              description: 'Photos and music',
              icon: 'Database',
              gradient: 'from-cyan-500 to-blue-500',
              popular: true,
              badge: 'MOST POPULAR',
              storageSize: '25 GB',
              websites: '1 website',
              frequency: 'Daily backups',
              retention: '90 days',
              support: 'Priority',
              recommendation: recommendation
            }
          case 'website-backup-50gb':
            return {
              name: 'Business',
              type: '50 GB Storage',
              description: 'Videos and multimedia',
              icon: 'Cloud',
              gradient: 'from-blue-600 to-indigo-600',
              popular: false,
              badge: 'BEST VALUE',
              storageSize: '50 GB',
              websites: '1 website',
              frequency: 'Daily backups',
              retention: '1 year',
              support: '24/7 Phone',
              recommendation: recommendation
            }
          default:
            return {
              name: product.alias || product.title,
              type: 'Backup Storage',
              description: recommendation || 'Website backup',
              icon: 'HardDrive',
              gradient: 'from-gray-500 to-gray-600',
              popular: false,
              badge: null,
              storageSize: product.alias || 'Custom',
              websites: '1 website',
              frequency: 'Daily backups',
              retention: '30 days',
              support: 'Standard',
              recommendation: recommendation
            }
        }
      }

      const planDetails = getPlanDetails(product.id, product.content)
      
      // Determine pricing - API term says "month" and prices are monthly
      // So we need to calculate yearly price by multiplying by 12
      const monthlyPrice = salePrice
      const yearlyPrice = monthlyPrice * 12

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
          monthly: listPrice,
          yearly: listPrice * 12,
          currency: currency
        },
        features: extractFeatures(product.content),
        badge: planDetails.badge,
        gradient: planDetails.gradient,
        popular: planDetails.popular,
        icon: planDetails.icon,
        storageSize: planDetails.storageSize,
        websites: planDetails.websites,
        frequency: planDetails.frequency,
        retention: planDetails.retention,
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
    console.error('Error fetching website backup products:', error)
    
    // Return fallback data on error
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch website backup products',
      data: {
        title: 'Website Backup',
        products: [
          {
            id: 'website-backup-5gb',
            name: 'Starter',
            type: '5 GB Storage',
            price: { monthly: 17.67, yearly: 211.99, currency: 'USD' },
            originalPrice: { monthly: 17.67, yearly: 211.99, currency: 'USD' },
            features: [
              'Automatic daily backups',
              'Built-in daily malware scanning',
              'Back up a file, folder or an entire database',
              'Continuous security monitoring',
              'Downloads to local storage',
              'Easy one-click restore',
              'Secure cloud storage',
              'One website per account'
            ],
            badge: null,
            gradient: 'from-emerald-500 to-teal-500',
            popular: false,
            icon: 'HardDrive',
            storageSize: '5 GB',
            websites: '1 website',
            frequency: 'Daily backups',
            retention: '30 days',
            support: 'Email'
          },
          {
            id: 'website-backup-25gb',
            name: 'Professional',
            type: '25 GB Storage',
            price: { monthly: 28.50, yearly: 341.99, currency: 'USD' },
            originalPrice: { monthly: 28.50, yearly: 341.99, currency: 'USD' },
            features: [
              'Automatic daily backups',
              'Built-in daily malware scanning',
              'Back up a file, folder or an entire database',
              'Continuous security monitoring',
              'Downloads to local storage',
              'Easy one-click restore',
              'Secure cloud storage',
              'One website per account',
              'Priority support',
              'Extended retention period'
            ],
            badge: 'MOST POPULAR',
            gradient: 'from-blue-500 to-cyan-500',
            popular: true,
            icon: 'Database',
            storageSize: '25 GB',
            websites: '1 website',
            frequency: 'Daily backups',
            retention: '90 days',
            support: 'Priority'
          },
          {
            id: 'website-backup-50gb',
            name: 'Business',
            type: '50 GB Storage',
            price: { monthly: 44.33, yearly: 531.99, currency: 'USD' },
            originalPrice: { monthly: 44.33, yearly: 531.99, currency: 'USD' },
            features: [
              'Automatic daily backups',
              'Built-in daily malware scanning',
              'Back up a file, folder or an entire database',
              'Continuous security monitoring',
              'Downloads to local storage',
              'Easy one-click restore',
              'Secure cloud storage',
              'One website per account',
              '24/7 phone support',
              '1 year retention period'
            ],
            badge: 'BEST VALUE',
            gradient: 'from-purple-500 to-pink-500',
            popular: false,
            icon: 'Cloud',
            storageSize: '50 GB',
            websites: '1 website',
            frequency: 'Daily backups',
            retention: '1 year',
            support: '24/7 Phone'
          }
        ]
      }
    })
  }
}