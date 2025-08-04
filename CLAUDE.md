# Claude Code Project Guide

This file helps Claude Code understand the project structure and important implementation details.

## Project Overview
FlickMax - A modern domain and hosting reseller platform integrated with GoDaddy's APIs.

## Key Features
1. Domain search with real-time availability checking
2. Shopping cart with GoDaddy checkout integration
3. Multi-currency support (USD, INR, EUR, GBP)
4. Responsive design with Tailwind CSS

## Important Implementation Notes

### Cart Integration (SOLVED AFTER 2 DAYS!)
**Problem**: GoDaddy cart API was working (returning cartCount: 1) but items weren't showing in checkout.

**Root Cause**: Server-side API calls set cookies on the server, not in the user's browser. GoDaddy's checkout needs these cookies to identify the session.

**Solution**: Make cart API calls directly from the browser (client-side) so cookies are set where they're needed.

**Key Code**: `/components/cart/CartPanel.tsx` - Look for the client-side fetch call with `credentials: 'include'`

### Environment Variables
```
NEXT_PUBLIC_PLID=590175          # GoDaddy Reseller ID
GODADDY_API_KEY=                 # API Key for domain search
GODADDY_API_SECRET=              # API Secret for domain search
```

### API Endpoints
- Domain Search: `/api/domain/search/exact`
- Cart Creation: Direct client-side call to `https://www.secureserver.net/api/v1/cart/590175`

### Common Issues & Solutions
1. **Cart appears empty on GoDaddy**: Make sure API call is from browser, not server
2. **Domain search fails**: Check API credentials in .env.local
3. **Pricing errors on client**: Pricing service uses fallback prices on client-side

### Project Structure
```
/app              - Next.js 15 app directory
/components       - React components
/lib/api         - API service implementations
/hooks           - Custom React hooks
/contexts        - React contexts (Country, etc.)
/types           - TypeScript type definitions
```

### Technologies
- Next.js 15.4.5 with App Router
- TypeScript with strict mode
- Tailwind CSS for styling
- Framer Motion for animations
- React Hot Toast for notifications

### Testing Cart Integration
To test if cart is working, check browser console for:
1. "Direct GoDaddy API response: {cartCount: 1}" - Confirms item added
2. Check that cookies are set in browser (not just in API response)
3. Verify redirect goes to checkout with items visible

For detailed cart integration documentation, see `/docs/CART_INTEGRATION.md`