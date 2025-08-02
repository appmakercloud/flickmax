export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://www.secureserver.net/api/v1',
  PRIVATE_LABEL_ID: process.env.NEXT_PUBLIC_PRIVATE_LABEL_ID || '590175',
  DEFAULT_CURRENCY: process.env.NEXT_PUBLIC_DEFAULT_CURRENCY || 'USD',
  DEFAULT_MARKET: process.env.NEXT_PUBLIC_DEFAULT_MARKET || 'en-US',
} as const

export const API_ENDPOINTS = {
  PRODUCTS: (privateLabelId: string) => `/catalog/${privateLabelId}/products`,
  PRODUCT_BY_ID: (privateLabelId: string, productId: string) => `/catalog/${privateLabelId}/products/${productId}`,
  TAGS: (privateLabelId: string) => `/catalog/${privateLabelId}/tags`,
  TAG_BY_ID: (privateLabelId: string, tagId: string) => `/catalog/${privateLabelId}/tags/${tagId}`,
} as const