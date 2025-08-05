'use client'

import { Fragment, useEffect, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { X, ShoppingCart, Trash2, Plus, Minus } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { useCountry } from '@/contexts/CountryContext'
import { motion, AnimatePresence } from 'framer-motion'
import FormCheckout from './FormCheckout'
import { PriceDisplay } from '@/components/ui/PriceDisplay'

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
  const [previousCountry, setPreviousCountry] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen && cartId) {
      console.log('CartPanel opened, refreshing cart with ID:', cartId)
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
              // Fetch new price for domain with the new market using GoDaddy's exact API
              const plid = '590175'
              const searchParams = new URLSearchParams({
                plid: plid,
                q: item.domain,
                currencyType: currency,
                marketId: 'en-US'  // Always use en-US for correct sale prices
              })
              
              console.log('Fetching price for domain:', item.domain, 'with params:', {
                q: item.domain,
                marketId: 'en-US',  // Fixed to en-US
                currencyType: currency,
                plid: plid
              })
              
              try {
                // Use the exact domain search endpoint for accurate pricing
                console.log('Fetching from URL:', `/api/domain/search/exact?${searchParams}`)
                const response = await fetch(`/api/domain/search/exact?${searchParams}`)
                
                if (!response.ok) {
                  console.error('API response not OK:', response.status, response.statusText)
                  const errorData = await response.text()
                  console.error('Error response:', errorData)
                  return item
                }
                
                const data = await response.json()
                console.log('Exact domain API response:', data)
                
                // Handle exact domain search response format
                if (data.exactMatchDomain) {
                  const domainData = data.exactMatchDomain
                  console.log('Cart price update - raw domain data:', domainData)
                  
                  // Parse both list and sale prices
                  const listPriceString = String(domainData.listPrice || '')
                  const salePriceString = String(domainData.salePrice || domainData.listPrice || '')
                  let listPrice = parseFloat(listPriceString.replace(/[^0-9.]/g, '')) || 0
                  let salePrice = parseFloat(salePriceString.replace(/[^0-9.]/g, '')) || 0
                  const finalPrice = salePrice || listPrice || parseFloat(String(item.price)) || 0
                  
                  
                  console.log('Cart price update - parsed prices:', {
                    domain: item.domain,
                    listPrice,
                    salePrice,
                    finalPrice,
                    currency
                  })
                  
                  return {
                    ...item,
                    price: finalPrice,
                    listPrice: listPrice > 0 ? listPrice : undefined,
                    salePrice: salePrice > 0 && salePrice < listPrice ? salePrice : undefined,
                    subtotal: finalPrice * (item.quantity || 1),
                    renewalPrice: finalPrice
                  }
                } else if (data.domains && data.domains.length > 0) {
                  // Fallback to domains array if exactMatchDomain is not available
                  const domainMatch = data.domains.find((d: { domain: string; salePrice?: string; listPrice?: string }) => 
                    d.domain.toLowerCase() === item.domain?.toLowerCase()
                  )
                  
                  if (domainMatch) {
                    const listPriceString = String(domainMatch.listPrice || '')
                    const salePriceString = String(domainMatch.salePrice || domainMatch.listPrice || '')
                    const listPrice = parseFloat(listPriceString.replace(/[^0-9.]/g, '')) || 0
                    const salePrice = parseFloat(salePriceString.replace(/[^0-9.]/g, '')) || 0
                    const finalPrice = salePrice || listPrice || parseFloat(String(item.price)) || 0
                    
                    return {
                      ...item,
                      price: finalPrice,
                      listPrice: listPrice || undefined,
                      salePrice: salePrice < listPrice ? salePrice : undefined,
                      subtotal: finalPrice * (item.quantity || 1),
                      renewalPrice: finalPrice
                    }
                  }
                }
                
                console.log('No price found in API response for domain:', item.domain)
              } catch (error) {
                console.error('Error fetching domain price:', error)
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
        
        // Save updated cart to localStorage
        localStorage.setItem('flickmax_cart', JSON.stringify(updatedCart))
        
        // Trigger cart refresh
        refreshCart()
      } catch (error) {
        console.error('Error updating prices:', error)
      } finally {
        setIsUpdatingPrices(false)
      }
    }
    
    // Update prices when country changes
    if (isOpen && cart && cart.items.length > 0) {
      // First time opening cart or country changed
      if (previousCountry === null || country.code !== previousCountry) {
        console.log('Updating prices - Country:', previousCountry, '->', country.code)
        console.log('Currency:', currency)
        setPreviousCountry(country.code)
        updatePricesForCountry()
      }
    }
  }, [country.code, country.marketId, currency, cart, isOpen, refreshCart, previousCountry])
  
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

  const formatPrice = (price: number | string | undefined) => {
    // Handle string prices that might contain currency symbols
    let numPrice = 0
    if (typeof price === 'string') {
      // Remove any non-numeric characters except decimal point
      const cleanPrice = price.replace(/[^0-9.]/g, '')
      numPrice = parseFloat(cleanPrice) || 0
    } else {
      numPrice = price || 0
    }
    
    // Handle currencies that return prices in cents/minor units
    // Check if the price is likely in cents (no decimal or ends with .00)
    const centsBasedCurrencies = ['EUR', 'GBP', 'SEK', 'NOK', 'DKK', 'CHF', 'PLN']
    const priceStr = numPrice.toString()
    const hasNoDecimals = !priceStr.includes('.') || priceStr.endsWith('.0') || priceStr.endsWith('.00')
    
    if (centsBasedCurrencies.includes(currency) && numPrice > 100 && hasNoDecimals) {
      // If the price seems to be in cents (e.g., 3299 instead of 32.99), convert it
      numPrice = numPrice / 100
    }
    
    // Currency configuration with symbols and codes
    const currencyConfig: Record<string, { symbol: string, code: string, position: 'before' | 'after' }> = {
      USD: { symbol: '$', code: 'USD', position: 'before' },
      INR: { symbol: '₹', code: 'INR', position: 'before' },
      EUR: { symbol: '€', code: 'EUR', position: 'before' },
      GBP: { symbol: '£', code: 'GBP', position: 'before' },
      CAD: { symbol: 'CA$', code: 'CAD', position: 'before' },
      AUD: { symbol: 'A$', code: 'AUD', position: 'before' },
      AED: { symbol: 'AED', code: 'AED', position: 'before' },
      SAR: { symbol: 'SAR', code: 'SAR', position: 'before' },
      ZAR: { symbol: 'R', code: 'ZAR', position: 'before' },
      MXN: { symbol: 'MX$', code: 'MXN', position: 'before' },
      BRL: { symbol: 'R$', code: 'BRL', position: 'before' },
      CNY: { symbol: '¥', code: 'CNY', position: 'before' },
      JPY: { symbol: '¥', code: 'JPY', position: 'before' },
      KRW: { symbol: '₩', code: 'KRW', position: 'before' },
      SGD: { symbol: 'S$', code: 'SGD', position: 'before' },
      HKD: { symbol: 'HK$', code: 'HKD', position: 'before' },
      NZD: { symbol: 'NZ$', code: 'NZD', position: 'before' },
      CHF: { symbol: 'CHF', code: 'CHF', position: 'before' },
      SEK: { symbol: 'SEK', code: 'SEK', position: 'after' },
      NOK: { symbol: 'NOK', code: 'NOK', position: 'after' },
      DKK: { symbol: 'DKK', code: 'DKK', position: 'after' },
      PLN: { symbol: 'zł', code: 'PLN', position: 'after' },
      RUB: { symbol: '₽', code: 'RUB', position: 'before' },
      THB: { symbol: '฿', code: 'THB', position: 'before' },
      IDR: { symbol: 'Rp', code: 'IDR', position: 'before' },
      MYR: { symbol: 'RM', code: 'MYR', position: 'before' },
      PHP: { symbol: '₱', code: 'PHP', position: 'before' },
      VND: { symbol: '₫', code: 'VND', position: 'after' },
      TWD: { symbol: 'NT$', code: 'TWD', position: 'before' },
      TRY: { symbol: '₺', code: 'TRY', position: 'before' }
    }
    
    const config = currencyConfig[currency] || { symbol: '$', code: 'USD', position: 'before' }
    
    if (config.position === 'before') {
      return `${config.symbol}${numPrice.toFixed(2)} ${config.code}`
    } else {
      return `${numPrice.toFixed(2)} ${config.symbol} ${config.code}`
    }
  }

  const handleCheckout = async () => {
    if (!cart || cart.items.length === 0) return
    
    setIsLoadingCheckout(true)
    
    // Use form-based checkout - works in both normal and private browsing!
    // This is the same method your WordPress site uses
    try {
      // Submit the hidden form
      const form = document.getElementById('godaddy-checkout-form') as HTMLFormElement
      if (form) {
        form.submit()
      } else {
        console.error('Checkout form not found')
        alert('Unable to proceed to checkout. Please try again.')
      }
    } catch (error) {
      console.error('Checkout error:', error)
      alert('An error occurred. Please try again.')
      setIsLoadingCheckout(false)
    }
  }

  const itemCount = cart?.items.reduce((sum, item) => sum + (item.quantity || 1), 0) || 0
  
  // Calculate total savings
  const totalSavings = cart?.items.reduce((sum, item) => {
    if (item.listPrice && item.salePrice && item.listPrice > item.salePrice) {
      const quantity = item.quantity || 1
      return sum + ((item.listPrice - item.salePrice) * quantity)
    }
    return sum
  }, 0) || 0
  

  return (
    <>
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
                    <div className="flex items-center justify-between border-b bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                          <ShoppingCart className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-white">Cart</h2>
                          {itemCount > 0 && (
                            <span className="text-sm text-white/80">({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
                          )}
                        </div>
                      </div>
                      <button
                        type="button"
                        className="rounded-full p-2 text-white/70 hover:text-white hover:bg-white/20 transition-colors focus:outline-none"
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
                        <div className="flex flex-col items-center justify-center h-full px-6 py-12">
                          <div className="bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full p-6 mb-6">
                            <ShoppingCart className="h-20 w-20 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600" stroke="url(#gradient)" />
                            <svg width="0" height="0">
                              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#2563eb" />
                                <stop offset="100%" stopColor="#06b6d4" />
                              </linearGradient>
                            </svg>
                          </div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h3>
                          <p className="text-gray-600 text-center mb-6">Add domains or products to get started</p>
                          <button
                            onClick={onClose}
                            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg hover:shadow-xl"
                          >
                            Start Shopping
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
                                className="py-3 border-b last:border-b-0"
                              >
                                <div className="space-y-2">
                                  <div className="flex justify-between items-start">
                                    <div className="flex-1 min-w-0">
                                      <h3 className="font-bold text-gray-900 text-lg">
                                        {item.domain || item.label}
                                      </h3>
                                      {item.domain && (
                                        <p className="text-sm text-gray-600 mt-0.5">
                                          {item.domain.substring(item.domain.lastIndexOf('.'))} Domain Registration
                                        </p>
                                      )}
                                    </div>
                                    <button
                                      onClick={() => removeFromCart && removeFromCart(item.id)}
                                      className="text-gray-400 hover:text-red-600 p-1 transition-colors"
                                      title="Remove from cart"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                  </div>
                                  
                                  {item.domain && (
                                    <div className="flex items-start justify-between">
                                      <div className="flex-1">
                                        <div className="text-sm text-gray-700 font-medium">
                                          1 Year
                                        </div>
                                        {item.renewalPrice && (
                                          <p className="text-xs text-gray-500 mt-1">
                                            Auto-renews every 1 Year for {formatPrice(item.renewalPrice)}
                                          </p>
                                        )}
                                      </div>
                                      <div className="text-right ml-4">
                                        <div className="flex flex-col items-end gap-1">
                                          <PriceDisplay 
                                            listPrice={item.listPrice}
                                            salePrice={item.salePrice || item.price}
                                            currency={currency}
                                            size="medium"
                                            theme="gradient"
                                            inline={false}
                                            showDiscount={false}
                                            className=""
                                          />
                                          {item.listPrice && item.salePrice && item.listPrice > item.salePrice && (
                                            <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full font-medium text-xs px-2 py-1 inline-block">
                                              Save {Math.round(((item.listPrice - item.salePrice) / item.listPrice) * 100)}%
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  )}
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
                      <div className="border-t bg-gradient-to-b from-gray-50 to-white">
                        <div className="px-4 py-3 space-y-2">
                          {totalSavings > 0 && (
                            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-md p-2 border border-green-200">
                              <div className="flex justify-between items-center">
                                <span className="text-xs font-medium text-green-700">Total Savings</span>
                                <span className="text-base font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                                  {formatPrice(totalSavings)}
                                </span>
                              </div>
                            </div>
                          )}
                          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-md p-2.5 border border-blue-100">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-semibold text-gray-700">Subtotal</span>
                              <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">{formatPrice(cart.subtotal)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="px-4 pb-4 space-y-2">
                          <button
                            onClick={handleCheckout}
                            disabled={isLoadingCheckout}
                            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-md hover:shadow-lg text-sm"
                          >
                            {isLoadingCheckout ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Processing...
                              </>
                            ) : (
                              <>
                                <ShoppingCart className="h-4 w-4 mr-2" />
                                Continue to Checkout
                              </>
                            )}
                          </button>
                          <button
                            onClick={onClose}
                            className="w-full bg-white text-gray-700 py-2.5 px-4 rounded-lg font-medium border border-gray-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 hover:border-blue-300 transition-all duration-200 text-sm"
                          >
                            Continue Shopping
                          </button>
                          <p className="text-[10px] text-gray-500 text-center mt-2">
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
      
      {/* Hidden form for checkout - works in private browsing! */}
      {cart && cart.items.length > 0 && (
        <FormCheckout 
          items={cart.items} 
          onSubmit={() => setIsLoadingCheckout(true)}
        />
      )}
    </>
  )
}