'use client'

import { useCountry } from '@/contexts/CountryContext'
import { CartItemDetail } from '@/types/cart'

interface FormCheckoutProps {
  items: CartItemDetail[]
  onSubmit?: () => void
}

export default function FormCheckout({ items, onSubmit }: FormCheckoutProps) {
  const { currency, country } = useCountry()
  const plid = process.env.NEXT_PUBLIC_PLID || '590175'
  
  // Convert cart items to GoDaddy format
  const godaddyItems = items.map(item => {
    if (item.domain) {
      return {
        id: 'domain',
        domain: item.domain,
        quantity: item.quantity || 1
      }
    } else {
      return {
        id: item.productId || item.id,
        quantity: item.quantity || 1
      }
    }
  })
  
  const actionUrl = `https://www.secureserver.net/api/v1/cart/${plid}/?redirect=1&plid=${plid}&currencyType=${currency}&marketId=${country.marketId}`
  
  return (
    <form 
      method="POST" 
      action={actionUrl}
      onSubmit={onSubmit}
      className="hidden"
      id="godaddy-checkout-form"
    >
      <input 
        type="hidden" 
        name="items" 
        value={JSON.stringify(godaddyItems)} 
      />
      <input 
        type="hidden" 
        name="redirect" 
        value="1" 
      />
      <input 
        type="hidden" 
        name="currencyType" 
        value={currency} 
      />
      <input 
        type="hidden" 
        name="marketId" 
        value={country.marketId} 
      />
      <button type="submit">Checkout</button>
    </form>
  )
}