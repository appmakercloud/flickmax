import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const currency = searchParams.get('currency') || 'USD'
    const type = searchParams.get('type') || 'diy' // 'diy' or 'managed'

    // Determine which API endpoint to use
    const apiTag = type === 'managed' ? 'ssl-managed' : 'ssl'
    
    // Always use en-US for marketId, only change currencyType
    const marketId = 'en-US'
    
    // Fetch SSL products from GoDaddy API
    const response = await fetch(
      `https://www.secureserver.net/api/v1/catalog/590175/tags/${apiTag}?currencyType=${currency}&marketId=${marketId}&separateDisclaimers=false`,
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
    
    // Transform the data to match our frontend structure
    const transformedProducts = data.products.map((product: any) => {
      // Parse price from string format (e.g., "$42.99" -> 42.99)
      const parsePrice = (priceStr: string) => {
        if (!priceStr) return 0
        return parseFloat(priceStr.replace(/[^0-9.]/g, ''))
      }

      // Map product IDs to our frontend plan structure
      const getPlanDetails = (id: string) => {
        switch(id) {
          case 'ssl-standard':
            return {
              name: 'Basic SSL',
              type: 'Domain Validation (DV)',
              icon: 'Shield',
              warranty: '$10,000',
              validation: '5 minutes',
              gradient: 'from-blue-500 to-cyan-500',
              popular: false,
              badge: null
            }
          case 'ssl-standard-ucc':
            return {
              name: 'Multi-Site SSL',
              type: 'Domain Validation (5 Sites)',
              icon: 'ShieldCheck',
              warranty: '$50,000',
              validation: '5 minutes',
              gradient: 'from-cyan-500 to-blue-500',
              popular: true,
              badge: 'MOST POPULAR'
            }
          case 'ssl-standard-wildcard':
            return {
              name: 'Wildcard SSL',
              type: 'Unlimited Subdomains',
              icon: 'Globe',
              warranty: '$100,000',
              validation: '5 minutes',
              gradient: 'from-green-500 to-teal-500',
              popular: false,
              badge: 'BEST VALUE'
            }
          case 'ssl-premium':
            return {
              name: 'Premium SSL',
              type: 'Extended Validation (EV)',
              icon: 'Award',
              warranty: '$1.5M',
              validation: '5-7 days',
              gradient: 'from-purple-500 to-pink-500',
              popular: false,
              badge: 'MAXIMUM TRUST'
            }
          case 'ssl-premium-ucc':
            return {
              name: 'Premium Multi-Site',
              type: 'Extended Validation (5 Sites)',
              icon: 'Crown',
              warranty: '$1.75M',
              validation: '5-7 days',
              gradient: 'from-indigo-500 to-purple-500',
              popular: false,
              badge: 'ENTERPRISE'
            }
          case 'ssl-managed-tier1':
            return {
              name: 'Managed DV SSL',
              type: 'Full Service - 1 Site',
              icon: 'Settings',
              warranty: 'Full Support',
              validation: 'We handle it',
              gradient: 'from-emerald-500 to-teal-500',
              popular: true,
              badge: 'HASSLE-FREE'
            }
          case 'ssl-managed-005sites-tier1':
            return {
              name: 'Managed SAN SSL',
              type: 'Full Service - 5 Sites',
              icon: 'Users',
              warranty: 'Full Support',
              validation: 'We handle it',
              gradient: 'from-indigo-500 to-blue-500',
              popular: false,
              badge: 'BEST FOR TEAMS'
            }
          default:
            return {
              name: product.title,
              type: product.alias,
              icon: 'Shield',
              warranty: 'Standard',
              validation: 'Varies',
              gradient: 'from-gray-500 to-gray-600',
              popular: false,
              badge: null
            }
        }
      }

      const planDetails = getPlanDetails(product.id)
      const listPrice = parsePrice(product.listPrice)
      const salePrice = product.salePrice ? parsePrice(product.salePrice) : listPrice
      
      // Determine if product is managed and its category
      const isManaged = product.id.includes('managed')
      let category: 'single' | 'multi' | 'wildcard' = 'single'
      if (product.id.includes('wildcard')) {
        category = 'wildcard'
      } else if (product.id.includes('ucc') || product.id.includes('005sites')) {
        category = 'multi'
      }

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

      return {
        id: product.id,
        name: planDetails.name,
        type: planDetails.type,
        title: product.title,
        alias: product.alias,
        price: {
          yearly: salePrice,
          multi: salePrice * 0.85, // Assume 15% discount for multi-year
          currency: currency
        },
        originalPrice: {
          yearly: listPrice,
          multi: listPrice * 0.85,
          currency: currency
        },
        features: extractFeatures(product.content),
        badge: planDetails.badge,
        gradient: planDetails.gradient,
        popular: planDetails.popular,
        icon: planDetails.icon,
        warranty: planDetails.warranty,
        validation: planDetails.validation,
        browsers: '99.9%',
        term: product.term,
        order: product.order,
        isManaged: isManaged,
        category: category
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
    console.error('Error fetching SSL products:', error)
    
    // Return fallback data on error
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch SSL products',
      data: {
        title: 'SSL Certificates',
        products: [
          {
            id: 'ssl-standard',
            name: 'Basic SSL',
            type: 'Domain Validation (DV)',
            price: { yearly: 69.99, multi: 59.99, currency: 'USD' },
            originalPrice: { yearly: 99.99, multi: 89.99, currency: 'USD' },
            features: [
              'Domain validation',
              'Strong SHA-2 & 2048-bit encryption',
              'Padlock in address bar',
              'Protects 1 website',
              'SEO ranking boost',
              '30-day money-back guarantee',
              'Issued in minutes',
              '24/7 security support'
            ],
            badge: null,
            gradient: 'from-blue-500 to-cyan-500',
            popular: false,
            icon: 'Shield',
            warranty: '$10,000',
            validation: '5 minutes',
            browsers: '99.9%'
          },
          {
            id: 'ssl-standard-ucc',
            name: 'Multi-Site SSL',
            type: 'Domain Validation (5 Sites)',
            price: { yearly: 149.99, multi: 129.99, currency: 'USD' },
            originalPrice: { yearly: 249.99, multi: 199.99, currency: 'USD' },
            features: [
              'Protects 5 websites',
              'Domain validation',
              'Strong SHA-2 & 2048-bit encryption',
              'Trust seal included',
              'SEO ranking boost',
              '30-day money-back guarantee',
              'Priority support',
              '$50,000 warranty protection'
            ],
            badge: 'MOST POPULAR',
            gradient: 'from-cyan-500 to-blue-500',
            popular: true,
            icon: 'ShieldCheck',
            warranty: '$50,000',
            validation: '5 minutes',
            browsers: '99.9%'
          },
          {
            id: 'ssl-standard-wildcard',
            name: 'Wildcard SSL',
            type: 'Unlimited Subdomains',
            price: { yearly: 276.99, multi: 249.99, currency: 'USD' },
            originalPrice: { yearly: 399.99, multi: 349.99, currency: 'USD' },
            features: [
              'Protects unlimited subdomains',
              'Domain validation',
              'Strong SHA-2 & 2048-bit encryption',
              'One certificate for all subdomains',
              'Padlock in address bar',
              'SEO ranking boost',
              '30-day money-back guarantee',
              'Easy subdomain management',
              '24/7 expert support',
              '$100,000 warranty protection'
            ],
            badge: 'BEST VALUE',
            gradient: 'from-green-500 to-teal-500',
            popular: false,
            icon: 'Globe',
            warranty: '$100,000',
            validation: '5 minutes',
            browsers: '99.9%'
          },
          {
            id: 'ssl-premium',
            name: 'Premium SSL',
            type: 'Extended Validation (EV)',
            price: { yearly: 149.99, multi: 129.99, currency: 'USD' },
            originalPrice: { yearly: 299.99, multi: 249.99, currency: 'USD' },
            features: [
              'Extended validation (EV)',
              'Strongest SHA-2 & 2048-bit encryption',
              'Green address bar with company name',
              'Protects 1 website',
              'Dynamic trust seal',
              'Maximum SEO boost',
              '30-day money-back guarantee',
              'Dedicated account manager',
              'Priority 24/7 support',
              '$1.5M warranty protection'
            ],
            badge: 'MAXIMUM TRUST',
            gradient: 'from-purple-500 to-pink-500',
            popular: false,
            icon: 'Award',
            warranty: '$1.5M',
            validation: '5-7 days',
            browsers: '99.9%'
          }
        ]
      }
    })
  }
}