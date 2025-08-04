'use client'

import { useEffect } from 'react'
import { useCart } from '@/hooks/useCart'
import { clientCartService } from '@/lib/api/client-cart'
import { Loader2 } from 'lucide-react'

export default function CheckoutPage() {
  const { cart } = useCart()

  useEffect(() => {
    if (cart && cart.items.length > 0) {
      // Redirect to GoDaddy checkout with cart items
      const checkoutUrl = clientCartService.prepareCheckoutUrl()
      window.location.href = checkoutUrl
    }
  }, [cart])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
      <p className="text-gray-600">Redirecting to secure checkout...</p>
    </div>
  )
}