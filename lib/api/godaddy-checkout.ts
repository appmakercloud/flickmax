// GoDaddy checkout URL builder
interface CheckoutItem {
  domain?: string
  id?: string
  quantity?: number
}

export function buildGoDaddyCheckoutUrl(items: CheckoutItem[], plid: string = '590175'): string {
  // Base URL for GoDaddy cart
  const baseUrl = 'https://www.secureserver.net/products/domain-registration/find'
  
  // For a single domain, use the domain registration flow
  if (items.length === 1 && items[0].domain) {
    const domain = items[0].domain
    return `${baseUrl}?plid=${plid}&domainToCheck=${domain}`
  }
  
  // For multiple items or products, use the cart URL
  const cartUrl = new URL('https://cart.secureserver.net/go/checkout')
  cartUrl.searchParams.append('plid', plid)
  
  // Add program ID for tracking
  cartUrl.searchParams.append('prog_id', 'flickmax')
  
  return cartUrl.toString()
}

// Alternative: Build URL with items pre-filled
export function buildDirectAddToCartUrl(domain: string, plid: string = '590175'): string {
  // This URL format adds a domain directly to GoDaddy cart
  const baseUrl = 'https://www.secureserver.net/products/domain-registration'
  const params = new URLSearchParams({
    plid,
    checkAvail: '1',
    domainToCheck: domain,
    tld: domain.split('.').pop() || 'com'
  })
  
  return `${baseUrl}?${params.toString()}`
}