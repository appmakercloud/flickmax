# Cart Checkout Flow Documentation

## Overview
The cart system uses a hybrid approach with local storage for cart management and GoDaddy's checkout system for payment processing.

## Current Implementation

### Local Cart Storage
- Cart items are stored in localStorage using `flickmax_cart` key
- Each cart has a unique ID generated on first visit
- Prices are fetched from GoDaddy API when available (with fallback pricing)

### Checkout Process

When user clicks "Continue to Cart", the system:

1. **For Single Domain Orders:**
   - Redirects to GoDaddy's domain registration page
   - URL: `https://www.secureserver.net/products/domain-registration?plid=590175&domainToCheck=example.com`
   - Domain is automatically searched and can be added to GoDaddy cart

2. **For Multiple Items or Products:**
   - Redirects to GoDaddy's general checkout page
   - URL: `https://cart.secureserver.net/go/checkout?plid=590175`
   - User needs to manually add items on GoDaddy's site

### Why Direct Cart API Doesn't Work

GoDaddy's cart API (`https://www.secureserver.net/api/v1/cart/`) has several limitations:

1. **CORS Restrictions**: The API doesn't allow cross-origin requests from browsers
2. **Session-Based**: Requires server-side sessions that can't be created from client
3. **Authentication**: Some endpoints require OAuth tokens not available to resellers

### Alternative Solutions

1. **URL Parameters**: Some GoDaddy pages accept items via URL parameters
2. **Domain Registration Flow**: Single domains can use the registration page
3. **Server-Side Proxy**: Could implement a backend service to handle cart creation

## Files Structure

- `/lib/api/cart-service.ts` - Cart API service (attempted direct integration)
- `/lib/api/client-cart.ts` - Local cart management
- `/lib/api/godaddy-checkout.ts` - Checkout URL builders
- `/components/cart/CartPanel.tsx` - Cart UI component
- `/hooks/useCart.ts` - React hook for cart state
- `/app/api/cart/` - API routes for cart operations

## Environment Variables

```
NEXT_PUBLIC_PLID=590175  # Your GoDaddy reseller ID
GODADDY_API_KEY=your_key # For price fetching
GODADDY_API_SECRET=your_secret
```

## Limitations

1. Cart items don't automatically appear in GoDaddy checkout
2. Prices in local cart may differ from GoDaddy's final pricing
3. Cross-sell products are mocked (not from live API)

## Future Improvements

1. Implement server-side cart creation using GoDaddy's API
2. Use webhooks to sync cart state
3. Build custom checkout page with GoDaddy's payment API
4. Cache product prices for better performance