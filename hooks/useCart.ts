import { useState, useCallback, useEffect } from 'react'
import { Cart, AddToCartRequest, CartItem } from '@/types/cart'
import { clientCartService } from '@/lib/api/client-cart'
import toast from 'react-hot-toast'

export function useCart() {
  const [cart, setCart] = useState<Cart | null>(null)
  const [cartId, setCartId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Initialize cart ID from localStorage
  useEffect(() => {
    const storedCartId = localStorage.getItem('cartId')
    if (storedCartId) {
      setCartId(storedCartId)
      fetchCart(storedCartId)
    } else {
      // Generate new cart ID
      const newCartId = generateCartId()
      localStorage.setItem('cartId', newCartId)
      setCartId(newCartId)
    }
  }, [])

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
      // Silently handle cart fetch errors - it's normal for cart to not exist initially
      setError(null)
      setCart(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const addToCart = useCallback(async (items: CartItem[], skipCrossSell: boolean = true) => {
    if (!cartId) return

    try {
      setIsLoading(true)
      setError(null)

      // Use client-side cart service
      const updatedCart = await clientCartService.addToCart(cartId, items)
      setCart(updatedCart)
      
      toast.success('Added to cart successfully!')
      return { cart: updatedCart }
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
      pfid: productId,
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

  const getCartItemsCount = useCallback(() => {
    if (!cart || !cart.items) return 0
    return cart.items.reduce((total, item) => total + (item.quantity || 1), 0)
  }, [cart])

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
        total: updatedItems.reduce((sum, item) => sum + item.subtotal, 0) * 1.08 // Include estimated tax
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
        total: updatedItems.reduce((sum, item) => sum + item.subtotal, 0) * 1.08 // Include estimated tax
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

  return {
    cart,
    cartId,
    isLoading,
    error,
    addToCart,
    addDomainToCart,
    addProductToCart,
    clearCart,
    getCartItemsCount,
    removeFromCart,
    updateQuantity,
    refreshCart: () => cartId && fetchCart(cartId)
  }
}