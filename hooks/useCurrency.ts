'use client'

import { useCountry } from '@/contexts/CountryContext'
import { convertPrice, formatCurrency } from '@/lib/countries'

export function useCurrency() {
  const { currency, locale } = useCountry()

  const convertFromUSD = (priceUSD: number): number => {
    return convertPrice(priceUSD, currency)
  }

  const format = (amount: number, currencyOverride?: string): string => {
    return formatCurrency(amount, currencyOverride || currency, locale)
  }

  const formatUSD = (priceUSD: number): string => {
    const convertedPrice = convertFromUSD(priceUSD)
    return format(convertedPrice)
  }

  return {
    currency,
    locale,
    convertFromUSD,
    format,
    formatUSD,
  }
}