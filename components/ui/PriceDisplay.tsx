'use client'

import { memo } from 'react'

interface PriceDisplayProps {
  listPrice?: string | number
  salePrice?: string | number
  currency: string
  size?: 'small' | 'medium' | 'large'
  showDiscount?: boolean
  className?: string
  theme?: 'default' | 'gradient' | 'dark'
  inline?: boolean
}

// Memoized component to prevent unnecessary re-renders
export const PriceDisplay = memo(function PriceDisplay({ 
  listPrice, 
  salePrice, 
  currency, 
  size = 'medium',
  showDiscount = true,
  className = '',
  theme = 'default',
  inline = false
}: PriceDisplayProps) {
  // Parse prices once
  const parsePrice = (price: string | number | undefined): number => {
    if (!price) return 0
    if (typeof price === 'number') return price
    return parseFloat(price.replace(/[^0-9.]/g, ''))
  }

  const listPriceNum = parsePrice(listPrice)
  const salePriceNum = parsePrice(salePrice)
  
  // Determine if we have a discount
  const hasDiscount = listPriceNum > 0 && salePriceNum > 0 && salePriceNum < listPriceNum
  const displayPrice = salePriceNum || listPriceNum
  
  if (!displayPrice) return null

  // Calculate discount percentage
  const discountPercent = hasDiscount 
    ? Math.round(((listPriceNum - salePriceNum) / listPriceNum) * 100)
    : 0

  // Format price with currency
  const formatPrice = (price: number) => {
    const symbol = currency === 'INR' ? '₹' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '$'
    return `${symbol}${price.toFixed(2)}`
  }

  // Size classes
  const sizeClasses = {
    small: {
      container: 'text-sm',
      price: 'text-base',
      original: 'text-xs',
      badge: 'text-xs px-1.5 py-0.5'
    },
    medium: {
      container: 'text-base',
      price: 'text-xl',
      original: 'text-sm',
      badge: 'text-xs px-2 py-1'
    },
    large: {
      container: 'text-lg',
      price: 'text-3xl',
      original: 'text-base',
      badge: 'text-sm px-2.5 py-1'
    }
  }

  const styles = sizeClasses[size]

  const containerClass = inline ? 'inline-flex items-center gap-2' : 'inline-flex items-baseline gap-2'
  
  const priceColorClass = theme === 'gradient' 
    ? 'text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-500'
    : theme === 'dark'
    ? 'text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400'
    : 'text-green-600'
    
  const badgeClass = theme === 'gradient' || theme === 'dark'
    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
    : 'bg-green-100 text-green-800'
    
  const originalPriceClass = theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
  const yearTextClass = theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
  const regularPriceClass = theme === 'dark' ? 'text-white' : 'text-gray-900'

  if (!showDiscount || !hasDiscount) {
    // Simple inline display without badge
    return (
      <div className={`flex items-baseline gap-2 ${className}`}>
        {hasDiscount && (
          <>
            <span className={`${originalPriceClass} line-through ${styles.original}`}>
              {formatPrice(listPriceNum)}
            </span>
            <span className={`font-bold ${priceColorClass} ${styles.price}`}>
              {formatPrice(salePriceNum)}
            </span>
          </>
        )}
        {!hasDiscount && (
          <span className={`font-bold ${theme === 'gradient' ? regularPriceClass : theme === 'dark' ? 'text-white' : ''} ${styles.price}`}>
            {formatPrice(displayPrice)}
          </span>
        )}
        <span className={`${yearTextClass} ${styles.container}`}>/yr</span>
      </div>
    )
  }

  // Full display with badge
  return (
    <div className={`${containerClass} ${className}`}>
      <div className="flex items-baseline gap-2">
        {hasDiscount && (
          <>
            <span className={`${originalPriceClass} line-through ${styles.original}`}>
              {formatPrice(listPriceNum)}
            </span>
            <span className={`font-bold ${priceColorClass} ${styles.price}`}>
              {formatPrice(salePriceNum)}
            </span>
          </>
        )}
        {!hasDiscount && (
          <span className={`font-bold ${theme === 'gradient' ? regularPriceClass : theme === 'dark' ? 'text-white' : ''} ${styles.price}`}>
            {formatPrice(displayPrice)}
          </span>
        )}
        <span className={`${yearTextClass} ${styles.container}`}>/yr</span>
      </div>
      {hasDiscount && showDiscount && discountPercent > 0 && (
        <span className={`${badgeClass} rounded-full font-medium ${styles.badge} inline-block mt-1`}>
          Save {discountPercent}%
        </span>
      )}
    </div>
  )
})