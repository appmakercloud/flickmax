# GoDaddy Cart JWT Token Implementation

## Overview
This implementation mimics how fxdomains.com and other successful GoDaddy resellers handle cart functionality using JWT tokens for authentication.

## How It Works

### 1. First Item Added to Cart
- Frontend calls backend API endpoint
- Backend calls GoDaddy API server-side
- GoDaddy returns:
  - Cart data (cartCount, etc.)
  - JWT tokens in cookies:
    - `cust_idp`: Signed RS256 JWT token with shopper info
    - `info_cust_idp`: URL-encoded JSON with additional cart data
- Backend extracts these tokens and returns them to frontend
- Frontend stores tokens in localStorage

### 2. Additional Items Added to Same Cart
- Frontend retrieves existing tokens from localStorage
- Passes tokens to backend with new item request
- Backend includes tokens as cookies when calling GoDaddy
- This maintains the same session/cart
- GoDaddy returns updated cart (cartCount: 2, etc.)
- No new tokens returned (session already exists)

### 3. Checkout Process
- Frontend retrieves stored JWT tokens
- Creates form submission to intersite-sync API
- Includes JWT tokens as form data
- GoDaddy validates tokens and creates session
- User redirected to checkout with active cart

## Critical Implementation Details

### JWT Token Format
```javascript
// Real GoDaddy JWT token example:
{
  custIdp: "eyJhbGciOiAiUlMyNTYiLCAia2lkIjogImxQdF9hdTM1eHcifQ...", // RS256 signed
  infoCustIdp: "{%22typ%22:%20%22idp%22%2C%20%22info_shopperId%22:%20%22669554936%22...}" // URL encoded
}
```

### Backend API Requirements
1. Must call GoDaddy from server-side (avoids CORS)
2. Must extract JWT tokens from response cookies
3. Must pass existing tokens for session persistence

### Frontend Requirements
1. Store JWT tokens in localStorage after first item
2. Pass existing tokens when adding more items
3. Use intersite-sync for checkout (not direct API)

## Why This Works

### Normal Browsing
- Cookies are maintained by browser
- JWT tokens provide additional authentication
- Works seamlessly

### Private/Incognito Browsing
- Cookies are NOT persisted between requests
- JWT tokens stored in localStorage work around this
- Session maintained through token passing

## API Endpoints

### Add to Cart
```
POST /api/cart/add-item
Body: {
  items: [...],
  existingTokens: { custIdp, infoCustIdp } // Optional, for session persistence
}
```

### Backend to GoDaddy
```
POST https://www.secureserver.net/api/v1/cart/{plid}/
Headers: {
  Cookie: "cust_idp={token}; info_cust_idp={token}" // If existing tokens provided
}
```

### Checkout (Intersite-sync)
```
POST https://www.secureserver.net/api/v1/intersite-sync
Query: ?plid={plid}&redirect={checkoutUrl}
Form Data: {
  cust_idp: {token},
  info_cust_idp: {token}
}
```

## Common Issues & Solutions

### Issue: Cart shows empty at checkout
**Cause**: No JWT tokens or invalid tokens
**Solution**: Ensure tokens are properly stored and passed

### Issue: Each item creates new cart
**Cause**: Not passing existing tokens
**Solution**: Always pass existing tokens for additional items

### Issue: "JWT is invalid or missing" error
**Cause**: Using fake/generated tokens instead of real GoDaddy tokens
**Solution**: Only use tokens returned by GoDaddy, never generate your own

## Testing Checklist
- [ ] First item returns JWT tokens
- [ ] Second item maintains same session (cartCount: 2)
- [ ] Tokens stored in localStorage
- [ ] Checkout uses intersite-sync with tokens
- [ ] Works in private browsing mode
- [ ] Works with mixed cart (domains + hosting)