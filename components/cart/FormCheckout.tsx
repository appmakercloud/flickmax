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
  
  // Filter out items that were already submitted via form (hosting products)
  const domainItems = items.filter(item => !item.submittedViaForm)
  
  // If no domain items, don't render the form
  if (domainItems.length === 0) {
    return null
  }
  
  const actionUrl = `https://www.secureserver.net/api/v1/cart/${plid}/`
  
  return (
    <form 
      method="POST" 
      action={actionUrl}
      target="_blank"
      onSubmit={onSubmit}
      className="hidden"
      id="godaddy-checkout-form"
    >
      {/* Submit domain items as JSON */}
      <input 
        type="hidden" 
        name="items" 
        value={JSON.stringify(
          domainItems
            .filter(item => item.domain)
            .map(item => ({
              id: 'domain',
              domain: item.domain
            }))
        )} 
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
      <input 
        type="hidden" 
        name="skipCrossSell" 
        value="true" 
      />
      <button type="submit">Checkout</button>
    </form>
  )
}