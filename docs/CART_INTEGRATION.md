# GoDaddy Cart Integration Solution

## Problem
We spent 2 days trying to integrate GoDaddy's cart API. The main issue was that when calling the cart API from the server, the session cookies were set on the server, not in the user's browser. This caused the cart to appear empty when redirecting to GoDaddy's checkout page.

## How the Cart API Works
1. POST to `https://www.secureserver.net/api/v1/cart/{PLID}?redirect=false`
2. GoDaddy creates a session and returns cookies
3. The response includes `cartCount: 1` confirming the item was added
4. But the cookies need to be in the user's browser for checkout to work

## The Solution
Make the API call directly from the browser (client-side) instead of from the server. This ensures cookies are set in the user's browser.

### Implementation Details

**File: `/components/cart/CartPanel.tsx`**
```javascript
// Try the client-side approach first
const plid = '590175'
const godaddyUrl = `https://www.secureserver.net/api/v1/cart/${plid}?redirect=false`

const godaddyResponse = await fetch(godaddyUrl, {
  method: 'POST',
  headers: {
    'accept': 'application/json',
    'Content-Type': 'application/json'
  },
  mode: 'cors',
  credentials: 'include', // Important: includes cookies
  body: JSON.stringify({
    items: items,
    skipCrossSell: true
  })
})
```

### Why This Works
1. Browser makes the API call directly to GoDaddy
2. GoDaddy sets session cookies in the browser
3. When redirecting to checkout, browser has the cookies
4. GoDaddy recognizes the session and shows cart items

### Testing
You can test the API using curl in browser console:
```bash
curl -X 'POST' \
  'https://www.secureserver.net/api/v1/cart/590175?redirect=false' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "items": [
    {
      "id": "domain",
      "domain": "example.com"
    }
  ],
  "skipCrossSell": true
}'
```

### Important Notes
- The server-side approach (`/api/cart/create`) is kept as fallback
- CORS might block client-side calls in some cases
- The solution requires `credentials: 'include'` to handle cookies
- PLID (reseller ID) is 590175

### What Didn't Work
1. Server-side API calls - cookies set on wrong side
2. Trying to transfer session via URL parameters
3. Attempting to extract and pass shopper ID
4. Using redirect URLs without proper session

This solution was discovered when testing the curl command directly in the browser, which showed that client-side API calls work correctly.