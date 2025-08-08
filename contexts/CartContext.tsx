'use client'

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { Cart, CartItem } from '@/types/cart'
import { clientCartService } from '@/lib/api/client-cart'
import { useCountry } from './CountryContext'
import toast from 'react-hot-toast'

export const cartAnimationEvent = typeof window !== 'undefined' ? new EventTarget() : null

interface CartContextType {
  cart: Cart | null
  cartId: string | null
  isLoading: boolean
  error: string | null
  cartItemsCount: number
  addToCart: (items: CartItem[]) => Promise<{ cart: Cart } | undefined>
  addDomainToCart: (domain: string, productId: string | number) => Promise<{ cart: Cart } | undefined>
  addProductToCart: (productId: string, period?: number, periodUnit?: string) => Promise<{ cart: Cart } | undefined>
  removeFromCart: (itemId: string) => Promise<void>
  updateQuantity: (itemId: string, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  refreshCart: () => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null)
  const [cartId, setCartId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateCartId = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  }

  const fetchCart = useCallback(async (id: string) => {
    if (!id) return
    
    try {
      setIsLoading(true)
      const cartData = await clientCartService.getCart(id)
      setCart(cartData)
      setError(null)
    } catch (error) {
      setError(null)
      setCart(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Initialize cart ID from localStorage
  useEffect(() => {
    const storedCartId = localStorage.getItem('cartId')
    if (storedCartId) {
      setCartId(storedCartId)
      fetchCart(storedCartId)
    } else {
      const newCartId = generateCartId()
      localStorage.setItem('cartId', newCartId)
      setCartId(newCartId)
    }
  }, [fetchCart])

  const triggerCartAnimation = useCallback(() => {
    if (cartAnimationEvent) {
      cartAnimationEvent.dispatchEvent(new CustomEvent('cartAnimation'))
    }
  }, [])

  const addToCart = useCallback(async (items: CartItem[]) => {
    if (!cartId) return

    try {
      setIsLoading(true)
      setError(null)

      const updatedCart = await clientCartService.addToCart(cartId, items)
      setCart(updatedCart)
      
      const refreshedCart = await clientCartService.getCart(cartId)
      setCart(refreshedCart)
      
      // Trigger cart animation
      triggerCartAnimation()
      
      return { cart: refreshedCart }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to add to cart'
      setError(message)
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }, [cartId, triggerCartAnimation])

  const addDomainToCart = useCallback(async (domain: string, productId: string | number) => {
    try {
      /**
       * JWT Token Cart Flow - Step 1: Check for existing tokens
       * 
       * If this is the second+ item being added, we need to pass existing JWT tokens
       * to maintain the same cart session. Without this, each item creates a new cart.
       */
      const existingTokens = localStorage.getItem('cart_tokens')
      const tokens = existingTokens ? JSON.parse(existingTokens) : null
      
      /**
       * Step 2: Call backend API
       * 
       * Backend will:
       * 1. Call GoDaddy API server-side (avoids CORS issues)
       * 2. Include existing tokens as cookies if provided
       * 3. Extract JWT tokens from GoDaddy's response
       * 4. Return tokens + cart data to frontend
       */
      const response = await fetch('/api/cart/add-item', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: [{
            id: 'domain',
            domain: domain
          }],
          existingTokens: tokens // Pass tokens to maintain session
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        
        /**
         * Step 3: Store JWT tokens
         * 
         * IMPORTANT: Only first item returns new tokens
         * Subsequent items return empty tokens but maintain session
         * Only update stored tokens if new ones are provided
         */
        if (data.tokens && (data.tokens.custIdp || data.tokens.infoCustIdp)) {
          localStorage.setItem('cart_tokens', JSON.stringify(data.tokens))
        }
        
        // Add to local cart for UI display
        const item: CartItem = {
          id: String(productId),
          domain,
          quantity: 1,
          pfid: typeof productId === 'number' ? productId : parseInt(productId) || undefined
        }
        
        toast.success(`${domain} added to cart`)
        return addToCart([item])
      } else {
        throw new Error('Failed to add domain to cart')
      }
    } catch (error) {
      toast.error('Failed to add domain to cart')
      throw error
    }
  }, [addToCart])

  const addProductToCart = useCallback(async (productId: string, period?: number, periodUnit?: string) => {
    try {
      /**
       * JWT Token Cart Flow for Hosting Products
       * 
       * Same flow as domains - must pass existing tokens to maintain session
       * This ensures domains and hosting end up in the same cart
       */
      const existingTokens = localStorage.getItem('cart_tokens')
      const tokens = existingTokens ? JSON.parse(existingTokens) : null
      
      /**
       * Call backend API with hosting product details
       * 
       * IMPORTANT: Mixed cart (domains + hosting) works because:
       * 1. We maintain same session via JWT tokens
       * 2. Backend adds items sequentially, not together
       * 3. Each item is added to existing cart, not new cart
       */
      const response = await fetch('/api/cart/add-item', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: [{
            id: productId,
            quantity: 1,
            period: period,
            periodUnit: periodUnit
          }],
          existingTokens: tokens // Critical for session persistence
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        
        // Store tokens only if new ones provided (first item only)
        if (data.tokens && (data.tokens.custIdp || data.tokens.infoCustIdp)) {
          localStorage.setItem('cart_tokens', JSON.stringify(data.tokens))
        }
        
        // Add to local cart for UI display
        const item: CartItem = {
          id: productId,
          pfid: parseInt(productId) || undefined,
          quantity: 1,
          period,
          periodUnit
        }
        
        toast.success('Hosting plan added to cart')
        return addToCart([item])
      } else {
        throw new Error('Failed to add hosting to cart')
      }
    } catch (error) {
      toast.error('Failed to add hosting to cart')
      throw error
    }
  }, [addToCart])

  const removeFromCart = useCallback(async (itemId: string) => {
    if (!cartId || !cart) return

    try {
      setIsLoading(true)
      // Remove item from cart
      const updatedItems = cart.items.filter(item => item.id !== itemId)
      const updatedCart = { ...cart, items: updatedItems }
      await clientCartService.updateCart(updatedCart)
      setCart(updatedCart)
    } catch (error) {
      toast.error('Failed to remove item from cart')
    } finally {
      setIsLoading(false)
    }
  }, [cartId, cart])

  const updateQuantity = useCallback(async (itemId: string, quantity: number) => {
    if (!cartId || !cart) return

    try {
      setIsLoading(true)
      // Update item quantity
      const updatedItems = cart.items.map(item => 
        item.id === itemId ? { ...item, quantity } : item
      )
      const updatedCart = { ...cart, items: updatedItems }
      await clientCartService.updateCart(updatedCart)
      setCart(updatedCart)
    } catch (error) {
      toast.error('Failed to update quantity')
    } finally {
      setIsLoading(false)
    }
  }, [cartId, cart])

  const clearCart = useCallback(async () => {
    if (!cartId) return

    try {
      setIsLoading(true)
      // Clear the cart
      const emptyCart: Cart = {
        cartId,
        currency: 'USD',
        items: [],
        subtotal: 0,
        taxes: 0,
        total: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      await clientCartService.updateCart(emptyCart)
      setCart(emptyCart)
    } catch (error) {
      toast.error('Failed to clear cart')
    } finally {
      setIsLoading(false)
    }
  }, [cartId])

  const refreshCart = useCallback(async () => {
    if (cartId) {
      await fetchCart(cartId)
    }
  }, [cartId, fetchCart])

  const cartItemsCount = cart?.items?.reduce((acc, item) => acc + (item.quantity || 1), 0) || 0

  return (
    <CartContext.Provider value={{
      cart,
      cartId,
      isLoading,
      error,
      cartItemsCount,
      addToCart,
      addDomainToCart,
      addProductToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      refreshCart
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}