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

### Cart Integration (FINAL SOLUTION - JWT Tokens via Backend API)
**Problem Evolution**:
1. Direct form submission → 500 errors with mixed cart
2. Client-side API calls → No cookies in private browsing
3. Sequential submission → Unreliable, cookies lost between calls
4. **SOLUTION**: Backend API returns real JWT tokens from GoDaddy

**How It Works (Like FXDomains):**
1. **Frontend → Backend**: Send items + existing tokens (if any)
2. **Backend → GoDaddy**: Server-side API call with cookies
3. **GoDaddy → Backend**: Returns cart data + JWT tokens (first item only)
4. **Backend → Frontend**: Extracts and forwards JWT tokens
5. **Frontend Storage**: Saves tokens in localStorage
6. **Checkout**: Uses intersite-sync with JWT tokens

**Critical Implementation Points**: 
- GoDaddy returns REAL signed JWT tokens (RS256) - NEVER generate fake ones
- Only FIRST item returns tokens, subsequent items return empty tokens
- Must pass existing tokens to maintain session (prevents new cart creation)
- Works in private browsing because tokens are in localStorage, not cookies

**Files Updated**:
- `/contexts/CartContext.tsx` - JWT token flow with detailed comments
- `/components/cart/CartPanel.tsx` - Intersite-sync checkout implementation
- `/app/api/cart/add-item/route.ts` - Backend API with token extraction
- `/docs/CART_JWT_IMPLEMENTATION.md` - Complete technical documentation

**Testing**:
- Add first item → Check localStorage has tokens
- Add second item → Verify cartCount: 2
- Test in private browsing → Should work perfectly

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