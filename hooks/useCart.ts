import { useState, useCallback, useEffect } from 'react'
import { Cart, AddToCartRequest, CartItem } from '@/types/cart'
import { clientCartService } from '@/lib/api/client-cart'
import toast from 'react-hot-toast'

export function useCart() {
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
      console.log('Cart fetched:', cartData)
      setCart(cartData)
      setError(null)
    } catch (error) {
      console.error('Error fetching cart:', error)
      // Silently handle cart fetch errors - it's normal for cart to not exist initially
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
      console.log('Found stored cart ID:', storedCartId)
      setCartId(storedCartId)
      fetchCart(storedCartId)
    } else {
      // Generate new cart ID
      const newCartId = generateCartId()
      console.log('Generated new cart ID:', newCartId)
      localStorage.setItem('cartId', newCartId)
      setCartId(newCartId)
    }
  }, [fetchCart])

  const addToCart = useCallback(async (items: CartItem[]) => {
    if (!cartId) {
      console.error('No cart ID available')
      return
    }
    
    console.log('useCart.addToCart called with cartId:', cartId, 'items:', items)

    try {
      setIsLoading(true)
      setError(null)

      // Use client-side cart service
      const updatedCart = await clientCartService.addToCart(cartId, items)
      console.log('Cart updated in useCart:', updatedCart)
      setCart(updatedCart)
      
      // Force a refresh to ensure state is synced
      const refreshedCart = await clientCartService.getCart(cartId)
      console.log('Cart refreshed:', refreshedCart)
      setCart(refreshedCart)
      
      toast.success('Added to cart successfully!')
      return { cart: refreshedCart }
    } catch (error) {
      console.error('Error adding to cart:', error)
      const message = error instanceof Error ? error.message : 'Failed to add to cart'
      setError(message)
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }, [cartId])

  const addDomainToCart = useCallback(async (domain: string, productId: string | number) => {
    console.log('useCart.addDomainToCart called with:', { domain, productId })
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

  const clearCart = useCallback(async () => {
    if (!cartId) return

    try {
      setIsLoading(true)
      // Use client-side cart service
      await clientCartService.clearCart(cartId)
      const emptyCart = await clientCartService.getCart(cartId)
      setCart(emptyCart)
      toast.success('Cart cleared successfully!')
    } catch (error) {
      console.error('Error clearing cart:', error)
      const message = error instanceof Error ? error.message : 'Failed to clear cart'
      setError(message)
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }, [cartId])

  const cartItemsCount = cart?.items?.reduce((total, item) => total + (item.quantity || 1), 0) || 0

  const removeFromCart = useCallback(async (itemId: string) => {
    if (!cartId || !cart) return

    try {
      setIsLoading(true)
      setError(null)

      // Remove item from local cart
      const updatedItems = cart.items.filter(item => item.id !== itemId)
      const updatedCart = {
        ...cart,
        items: updatedItems,
        subtotal: updatedItems.reduce((sum, item) => sum + item.subtotal, 0),
        total: updatedItems.reduce((sum, item) => sum + item.subtotal, 0) // No tax
      }
      
      setCart(updatedCart)
      await clientCartService.saveLocalCart(updatedCart)
      
      toast.success('Item removed from cart')
    } catch (error) {
      console.error('Error removing from cart:', error)
      const message = error instanceof Error ? error.message : 'Failed to remove item'
      setError(message)
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }, [cart, cartId])

  const updateQuantity = useCallback(async (itemId: string, newQuantity: number) => {
    if (!cartId || !cart) return

    try {
      setIsLoading(true)
      setError(null)

      // Update quantity in local cart
      const updatedItems = cart.items.map(item => {
        if (item.id === itemId) {
          return {
            ...item,
            quantity: newQuantity,
            subtotal: item.price * newQuantity
          }
        }
        return item
      })

      const updatedCart = {
        ...cart,
        items: updatedItems,
        subtotal: updatedItems.reduce((sum, item) => sum + item.subtotal, 0),
        total: updatedItems.reduce((sum, item) => sum + item.subtotal, 0) // No tax
      }
      
      setCart(updatedCart)
      await clientCartService.saveLocalCart(updatedCart)
      
      toast.success('Quantity updated')
    } catch (error) {
      console.error('Error updating quantity:', error)
      const message = error instanceof Error ? error.message : 'Failed to update quantity'
      setError(message)
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }, [cart, cartId])

  const refreshCart = useCallback(() => {
    if (cartId) {
      console.log('Refreshing cart with ID:', cartId)
      fetchCart(cartId)
    }
  }, [cartId, fetchCart])

  return {
    cart,
    cartId,
    isLoading,
    error,
    addToCart,
    addDomainToCart,
    addProductToCart,
    clearCart,
    getCartItemsCount: () => cartItemsCount,
    cartItemsCount,
    removeFromCart,
    updateQuantity,
    refreshCart
  }
}