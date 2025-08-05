'use client'

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { Cart, CartItem } from '@/types/cart'
import { clientCartService } from '@/lib/api/client-cart'
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
    const item: CartItem = {
      id: String(productId),
      domain,
      quantity: 1,
      pfid: typeof productId === 'number' ? productId : parseInt(productId) || undefined
    }
    
    return addToCart([item])
  }, [addToCart])

  const addProductToCart = useCallback(async (productId: string, period?: number, periodUnit?: string) => {
    const item: CartItem = {
      id: productId,
      pfid: parseInt(productId) || undefined,
      quantity: 1,
      period,
      periodUnit
    }
    
    return addToCart([item])
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