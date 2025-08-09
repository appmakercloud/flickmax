# VPS Multi-Currency Implementation Guide

## Problem Statement
The VPS hosting page was not displaying correct localized prices when users changed currencies. Instead of showing proper regional prices (e.g., ₹499 for India), it was showing USD prices with just the currency symbol changed (e.g., ₹4.20).

## Root Causes Identified

### 1. Market ID Issue
- **Problem**: The frontend was passing `country.code` (e.g., "IN") instead of `country.marketId` (e.g., "en-IN")
- **Impact**: GoDaddy API requires proper market IDs like "en-IN", "en-US" to return localized prices
- **Solution**: Changed from `country.code` to `country.marketId` in the API call

### 2. Sale Price Availability
- **Discovery**: GoDaddy only returns sale prices when `marketId=en-US`
- **Solution**: Always use `marketId=en-US` but vary the `currencyType` parameter
- **Result**: Users see promotional prices in their local currency

### 3. Frontend Caching
- **Problem**: Frontend was not re-fetching data when currency changed
- **Solution**: Added `currency` and `country` to useEffect dependencies

## Implementation Details

### Frontend Changes (`/app/hosting/vps/page.tsx`)

#### Before:
```typescript
// Missing dependencies - only ran once on mount
useEffect(() => {
  fetchPlans()
}, [])

// Wrong market parameter
const url = `/api/products/vps-hosting?currency=${currency}&market=${country.code || 'en-US'}`
```

#### After:
```typescript
// Properly re-fetches when currency changes
useEffect(() => {
  fetchPlans()
}, [currency, country])

// Always use en-US market for sale prices, but change currency
const url = `/api/products/vps-hosting?currency=${currency}&market=en-US&t=${Date.now()}`
```

### API Changes (`/app/api/products/vps-hosting/route.ts`)

#### Key Improvements:
1. **Price Parsing**: Enhanced to handle multiple currency formats
```typescript
function parsePrice(priceStr: string): number {
  if (!priceStr || priceStr === 'false') return 0
  
  const cleanPrice = String(priceStr)
    .replace(/[^0-9.,]/g, '') // Remove currency symbols
    .replace(/,(?=\d{3}(?:[.,]|$))/g, '') // Remove thousand separators
    .replace(',', '.') // Handle European decimal format
  
  return parseFloat(cleanPrice) || 0
}
```

2. **Discount Calculation**: Only show real discounts
```typescript
if (salePrice < listPrice) {
  // Real discount exists
  originalPrice = listPrice
  savings = Math.round(((listPrice - salePrice) / listPrice) * 100)
} else {
  // No discount - don't fake it
  originalPrice = listPrice
  savings = 0
}
```

3. **Cache Prevention**: 
```typescript
// API endpoint
cache: 'no-store',
next: { revalidate: 0 }

// Response headers
response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate')
```

## GoDaddy API Behavior

### Key Findings:
1. **Sale Prices**: Only available when `marketId=en-US`
2. **Currency Support**: Respects `currencyType` parameter regardless of market
3. **Price Format**: Returns prices like "₹499.00", "$5.99", "€4.99"

### API URL Pattern:
```
https://www.secureserver.net/api/v1/catalog/590175/tags/vps
  ?currencyType={CURRENCY}  // USD, INR, EUR, GBP, etc.
  &marketId=en-US           // Always en-US for sale prices
  &separateDisclaimers=false
```

## Testing Scenarios

### 1. Currency Change Test
- Switch from USD → INR → EUR → GBP
- Verify prices update immediately
- Check that sale prices are maintained

### 2. Price Verification
| Currency | 1 vCPU Plan | Expected Price | Sale Price |
|----------|-------------|----------------|------------|
| USD      | $5.99       | $4.20          | Yes        |
| INR      | ₹499        | ₹358.25        | Yes        |
| EUR      | €4.99       | €3.58          | Yes        |
| GBP      | £3.99       | £2.87          | Yes        |

### 3. Discount Badge
- Only shows when `salePrice < listPrice`
- Displays actual discount percentage
- No fake "SAVE 50%" badges

## UI Improvements

### 1. Pricing Text
- Simplified from long paragraph to concise format
- "Just ₹4299 for 12 months"
- "30-day money back • Cancel anytime"

### 2. Visual Design
- Recommended card: Teal border (3px) matching GoDaddy style
- Clean white backgrounds for all cards
- Gradient button for recommended plan
- Subtle hover effects

## Common Pitfalls to Avoid

1. **Don't use country.code** - Always use `country.marketId` for API calls
2. **Don't cache API responses** - Prices need to update with currency changes
3. **Don't fake discounts** - Only show real sale prices from API
4. **Don't hardcode fallback prices** - They won't match other currencies

## Debugging Tips

### Check API Response:
```bash
# Test with different currencies
curl "http://localhost:3000/api/products/vps-hosting?currency=INR&market=en-US"
```

### Verify GoDaddy API:
```bash
# Direct GoDaddy API test
curl "https://www.secureserver.net/api/v1/catalog/590175/tags/vps?currencyType=INR&marketId=en-US"
```

### Console Debugging:
```javascript
console.log('[VPS Frontend] Fetching from:', url)
console.log('[VPS Frontend] API response:', data)
```

## Summary

The multi-currency feature now works correctly by:
1. Using the correct market ID format
2. Always fetching from `marketId=en-US` for promotional prices
3. Properly parsing prices in different currency formats
4. Re-fetching data when currency changes
5. Showing only real discounts from the API

This ensures users see accurate, localized pricing with proper promotional discounts regardless of their selected currency.

## Related Files
- `/app/hosting/vps/page.tsx` - VPS hosting page component
- `/app/api/products/vps-hosting/route.ts` - API endpoint for VPS plans
- `/contexts/CountryContext.tsx` - Country/currency context provider
- `/lib/countries.ts` - Country configuration with market IDs