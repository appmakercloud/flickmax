export function getCurrencySymbol(currency: string): string {
  const symbols: { [key: string]: string } = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    INR: '₹',
    AUD: 'A$',
    CAD: 'C$',
    JPY: '¥',
    CNY: '¥',
    HKD: 'HK$',
    SGD: 'S$',
    NZD: 'NZ$',
    ZAR: 'R',
    BRL: 'R$',
    MXN: '$',
    ARS: '$',
    CLP: '$',
    COP: '$',
    PEN: 'S/',
    KRW: '₩',
    IDR: 'Rp',
    MYR: 'RM',
    PHP: '₱',
    THB: '฿',
    VND: '₫',
    PKR: 'Rs',
    ILS: '₪',
    AED: 'د.إ',
    SAR: 'ر.س',
    NOK: 'kr',
    SEK: 'kr',
    DKK: 'kr',
    PLN: 'zł',
    CZK: 'Kč',
    HUF: 'Ft',
    RON: 'lei',
    BGN: 'лв',
    HRK: 'kn',
    RUB: '₽',
    TRY: '₺',
    CHF: 'CHF'
  }
  
  return symbols[currency] || currency + ' '
}

export function formatCurrency(amount: number, currency: string): string {
  const symbol = getCurrencySymbol(currency)
  
  // For currencies that typically show symbol after amount
  const symbolAfter = ['EUR', 'SEK', 'NOK', 'DKK', 'CZK', 'PLN', 'HUF', 'RON', 'BGN', 'HRK', 'TRY']
  
  if (symbolAfter.includes(currency)) {
    return `${amount.toFixed(2)} ${symbol}`
  }
  
  // Special formatting for specific currencies
  if (currency === 'JPY' || currency === 'KRW') {
    return `${symbol}${Math.round(amount)}`
  }
  
  return `${symbol}${amount.toFixed(2)}`
}

export function formatPrice(amount: number, currency: string, options?: {
  showDecimal?: boolean
  compact?: boolean
}): string {
  const symbol = getCurrencySymbol(currency)
  const { showDecimal = true, compact = false } = options || {}
  
  // For currencies without decimal places
  const noDecimal = ['JPY', 'KRW', 'VND', 'IDR', 'CLP', 'HUF']
  
  let formattedAmount: string
  
  if (compact && amount >= 1000) {
    formattedAmount = (amount / 1000).toFixed(1) + 'k'
  } else if (noDecimal.includes(currency) || !showDecimal) {
    formattedAmount = Math.round(amount).toString()
  } else {
    formattedAmount = amount.toFixed(2)
  }
  
  // For currencies that typically show symbol after amount
  const symbolAfter = ['EUR', 'SEK', 'NOK', 'DKK', 'CZK', 'PLN', 'HUF', 'RON', 'BGN', 'HRK', 'TRY']
  
  if (symbolAfter.includes(currency)) {
    return `${formattedAmount} ${symbol}`
  }
  
  return `${symbol}${formattedAmount}`
}