'use client'

import { Fragment, useEffect, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { X, ShoppingCart, Trash2, Plus, Minus } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { useCountry } from '@/contexts/CountryContext'
import { motion, AnimatePresence } from 'framer-motion'

interface CartPanelProps {
  isOpen: boolean
  onClose: () => void
}

interface CrossSellProduct {
  id: string
  name: string
  description: string
  price: number
  discountedPrice?: number
  recommended?: boolean
}

export default function CartPanel({ isOpen, onClose }: CartPanelProps) {
  const { cart, cartId, isLoading, refreshCart, removeFromCart, updateQuantity, addProductToCart } = useCart()
  const { currency, country } = useCountry()
  const [crossSellProducts, setCrossSellProducts] = useState<CrossSellProduct[]>([])
  const [isLoadingCheckout, setIsLoadingCheckout] = useState(false)
  const [isUpdatingPrices, setIsUpdatingPrices] = useState(false)

  useEffect(() => {
    if (isOpen && cartId && refreshCart) {
      refreshCart()
    }
  }, [isOpen, cartId, refreshCart])
  
  // Update cart prices when country changes
  useEffect(() => {
    const updatePricesForCountry = async () => {
      if (!cart || cart.items.length === 0) return
      
      setIsUpdatingPrices(true)
      
      try {
        // Update prices for all cart items based on new country
        const updatedItems = await Promise.all(
          cart.items.map(async (item) => {
            if (item.domain) {
              // Fetch new price for domain
              const searchParams = new URLSearchParams({
                q: item.domain,
                currencyType: currency,
                marketId: country.marketId,
                pageSize: '1'
              })
              
              const response = await fetch(`/api/domain/search/exact?${searchParams}`)
              const data = await response.json()
              
              if (data.exactMatchDomain) {
                const newPrice = data.exactMatchDomain.listPrice || item.price
                return {
                  ...item,
                  price: newPrice,
                  subtotal: newPrice * item.quantity
                }
              }
            }
            return item
          })
        )
        
        // Update cart with new prices
        const subtotal = updatedItems.reduce((sum, item) => sum + item.subtotal, 0)
        const updatedCart = {
          ...cart,
          items: updatedItems,
          subtotal,
          total: subtotal,
          currency
        }
        
        // Save updated cart to API
        const response = await fetch(`/api/cart/${cartId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedCart)
        })
        
        if (response.ok) {
          // Update localStorage directly
          localStorage.setItem('flickmax_cart', JSON.stringify(updatedCart))
          refreshCart()
        }
      } catch (error) {
        console.error('Error updating prices:', error)
      } finally {
        setIsUpdatingPrices(false)
      }
    }
    
    if (isOpen && cart && cart.currency !== currency) {
      updatePricesForCountry()
    }
  }, [country, currency, cart, isOpen, cartId, refreshCart])
  
  useEffect(() => {
    // Load cross-sell recommendations when cart has items
    if (isOpen && cart?.items && cart.items.length > 0) {
      // Mock cross-sell products - in production, these would come from API
      const mockCrossSell: CrossSellProduct[] = [
        {
          id: 'ssl-cert',
          name: 'SSL Certificate',
          description: 'Secure your website with HTTPS',
          price: 79.99,
          discountedPrice: 49.99,
          recommended: true
        },
        {
          id: 'email-pro',
          name: 'Professional Email',
          description: 'Get professional email for your domain',
          price: 5.99,
          discountedPrice: 3.99
        },
        {
          id: 'website-backup',
          name: 'Website Backup',
          description: 'Daily automatic backups',
          price: 2.99
        }
      ]
      
      // Only show cross-sell if cart has domains
      if (cart.items.some(item => item.domain)) {
        setCrossSellProducts(mockCrossSell)
      } else {
        setCrossSellProducts([])
      }
    }
  }, [isOpen, cart?.items?.length, cart?.items])

  const formatPrice = (price: number) => {
    const symbol = currency === 'INR' ? '₹' : currency === 'EUR' ? '€' : '$'
    return `${symbol}${price.toFixed(2)}`
  }

  const handleCheckout = async () => {
    if (!cart || cart.items.length === 0) return
    
    setIsLoadingCheckout(true)
    
    try {
      // Prepare items for GoDaddy API
      const items = cart.items.map(item => {
        if (item.domain) {
          return {
            id: 'domain',
            domain: item.domain
          }
        } else {
          return {
            id: item.productId,
            quantity: item.quantity || 1
          }
        }
      })
      
      console.log('Posting items to GoDaddy cart API:', items)
      
      // IMPORTANT: Client-side API call to set cookies in browser
      // This solution took 2 days to figure out - server-side calls don't work
      // because cookies are set on the server, not in the user's browser
      try {
        // Make the API call directly from the browser
        // This will set cookies in the browser where they're needed
        const plid = '590175'
        const godaddyUrl = `https://www.secureserver.net/api/v1/cart/${plid}?redirect=false`
        
        const godaddyResponse = await fetch(godaddyUrl, {
          method: 'POST',
          headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json'
          },
          mode: 'cors',
          credentials: 'include',
          body: JSON.stringify({
            items: items,
            skipCrossSell: true
          })
        })
        
        const godaddyResult = await godaddyResponse.json()
        console.log('Direct GoDaddy API response:', godaddyResult)
        
        if (godaddyResult.cartCount > 0) {
          // Cart created successfully, redirect to checkout
          const checkoutUrl = `https://cart.secureserver.net/go/checkout?pl_id=${plid}`
          console.log('Cart created with items:', godaddyResult.cartCount)
          console.log('Redirecting to:', checkoutUrl)
          window.location.href = checkoutUrl
          return
        }
      } catch {
        console.log('Direct API call failed (likely CORS), trying server-side approach')
      }
      
      // Fallback to server-side approach
      const response = await fetch('/api/cart/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          items: items,
          skipCrossSell: true
        })
      })
      
      const result = await response.json()
      console.log('Server API response:', result)
      
      // Check for redirect URL in response
      const redirectUrl = result.nextStepUrl || result.NextStepUrl || result.orderUrl
      
      if (redirectUrl) {
        console.log('Redirecting to GoDaddy checkout:', redirectUrl)
        window.location.href = redirectUrl
      } else {
        console.error('No redirect URL in response:', result)
        alert('Unable to proceed to checkout. Please try again.')
      }
      
    } catch (error) {
      console.error('Checkout error:', error)
      alert('An error occurred. Please try again.')
    } finally {
      setIsLoadingCheckout(false)
    }
  }

  const itemCount = cart?.items.reduce((sum, item) => sum + (item.quantity || 1), 0) || 0

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-300"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-300"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col bg-white shadow-xl">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b px-6 py-4">
                      <div className="flex items-center gap-2">
                        <h2 className="text-2xl font-bold text-gray-900">Cart</h2>
                        {itemCount > 0 && (
                          <span className="text-sm text-gray-500">({itemCount} items)</span>
                        )}
                      </div>
                      <button
                        type="button"
                        className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                        onClick={onClose}
                      >
                        <X className="h-6 w-6" />
                      </button>
                    </div>

                    {/* Cart Items */}
                    <div className="flex-1 overflow-y-auto">
                      {isLoading || isUpdatingPrices ? (
                        <div className="flex flex-col items-center justify-center h-32">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                          {isUpdatingPrices && (
                            <p className="mt-2 text-sm text-gray-500">Updating prices for {currency}...</p>
                          )}
                        </div>
                      ) : !cart || cart.items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full px-6 py-8">
                          <ShoppingCart className="h-16 w-16 text-gray-300 mb-4" />
                          <p className="text-gray-500 text-center">Your cart is empty</p>
                          <button
                            onClick={onClose}
                            className="mt-4 px-4 py-2 text-sm text-blue-600 hover:text-blue-700"
                          >
                            Continue Shopping
                          </button>
                        </div>
                      ) : (
                        <div className="px-6 py-4">
                          <AnimatePresence>
                            {cart.items.map((item, index) => (
                              <motion.div
                                key={item.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ delay: index * 0.05 }}
                                className="py-4 border-b last:border-b-0"
                              >
                                <div className="flex justify-between items-start">
                                  <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900">
                                      {item.domain || item.label}
                                    </h3>
                                    {item.domain && (
                                      <p className="text-sm text-gray-500 mt-1">
                                        .ORG Domain Registration
                                      </p>
                                    )}
                                    {item.period && (
                                      <p className="text-sm text-gray-500">
                                        {item.period} {item.periodUnit?.toLowerCase()}
                                      </p>
                                    )}
                                    <p className="text-sm text-gray-500 mt-1">
                                      Auto-renews every {item.period || 1} {item.periodUnit?.toLowerCase() || 'year'} for {formatPrice(item.renewalPrice || item.price)}
                                    </p>
                                  </div>
                                  <div className="text-right ml-4">
                                    <p className="font-semibold text-gray-900">
                                      {formatPrice(item.subtotal || item.price)}
                                    </p>
                                    {item.isDiscounted && item.discountAmount && (
                                      <p className="text-sm text-green-600 line-through">
                                        {formatPrice((item.subtotal || item.price) + item.discountAmount)}
                                      </p>
                                    )}
                                    <button
                                      onClick={() => removeFromCart && removeFromCart(item.id)}
                                      className="mt-2 text-red-600 hover:text-red-700"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                  </div>
                                </div>

                                {/* Quantity controls for products */}
                                {!item.domain && (
                                  <div className="flex items-center gap-2 mt-3">
                                    <button
                                      onClick={() => updateQuantity && updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                      className="p-1 rounded border border-gray-300 hover:bg-gray-50"
                                    >
                                      <Minus className="h-4 w-4" />
                                    </button>
                                    <span className="px-3 py-1 text-sm">{item.quantity}</span>
                                    <button
                                      onClick={() => updateQuantity && updateQuantity(item.id, item.quantity + 1)}
                                      className="p-1 rounded border border-gray-300 hover:bg-gray-50"
                                    >
                                      <Plus className="h-4 w-4" />
                                    </button>
                                  </div>
                                )}

                              </motion.div>
                            ))}
                          </AnimatePresence>
                          
                          {/* Cross-sell recommendations */}
                          {crossSellProducts.length > 0 && (
                            <div className="mt-8 border-t pt-6">
                              <h3 className="font-semibold text-gray-900 mb-4">
                                Recommended for your domain
                              </h3>
                              <div className="space-y-3">
                                {crossSellProducts.map((product) => (
                                  <div
                                    key={product.id}
                                    className={`p-4 border rounded-lg ${
                                      product.recommended ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                                    }`}
                                  >
                                    <div className="flex items-start justify-between">
                                      <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                          <h4 className="font-medium text-gray-900">
                                            {product.name}
                                          </h4>
                                          {product.recommended && (
                                            <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">
                                              RECOMMENDED
                                            </span>
                                          )}
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">
                                          {product.description}
                                        </p>
                                      </div>
                                      <div className="text-right ml-4">
                                        {product.discountedPrice ? (
                                          <>
                                            <p className="font-semibold text-gray-900">
                                              {formatPrice(product.discountedPrice)}
                                            </p>
                                            <p className="text-sm text-gray-500 line-through">
                                              {formatPrice(product.price)}
                                            </p>
                                          </>
                                        ) : (
                                          <p className="font-semibold text-gray-900">
                                            {formatPrice(product.price)}
                                          </p>
                                        )}
                                        <button
                                          onClick={() => addProductToCart(product.id, 12, 'MONTH')}
                                          className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                                        >
                                          Add to cart
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Footer with totals and checkout */}
                    {cart && cart.items.length > 0 && (
                      <div className="border-t">
                        <div className="px-6 py-4 space-y-3">
                          <div className="flex justify-between text-lg font-bold">
                            <span>Subtotal:</span>
                            <span>{formatPrice(cart.subtotal)}</span>
                          </div>
                        </div>

                        <div className="px-6 pb-6 space-y-3">
                          <button
                            onClick={handleCheckout}
                            disabled={isLoadingCheckout}
                            className="w-full bg-gray-900 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                          >
                            {isLoadingCheckout ? (
                              <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                Processing...
                              </>
                            ) : (
                              'Continue to Checkout'
                            )}
                          </button>
                          <button
                            onClick={onClose}
                            className="w-full bg-white text-gray-900 py-3 px-6 rounded-lg font-medium border border-gray-300 hover:bg-gray-50 transition-colors"
                          >
                            Continue Shopping
                          </button>
                          <p className="text-xs text-gray-500 text-center mt-3">
                            Pricing excludes applicable taxes and ICANN fees.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}