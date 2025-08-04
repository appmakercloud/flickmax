# Cart API Implementation Guide

## Overview
This implementation provides a shopping cart API that integrates with GoDaddy's SecureServer API for managing domain and product purchases.

## API Endpoints

### 1. GET /api/cart/[cartId]
Retrieves the current cart contents.

**Example Request:**
```bash
curl -X GET 'http://localhost:3000/api/cart/590175' \
  -H 'accept: application/json'
```

### 2. POST /api/cart/[cartId]
Adds items to the cart.

**Example Request:**
```bash
curl -X POST 'http://localhost:3000/api/cart/590175?redirect=false' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
    "items": [
      {
        "id": "domain-com-example",
        "domain": "example.com"
      }
    ],
    "skipCrossSell": true
  }'
```

### 3. DELETE /api/cart/[cartId]
Clears the cart.

**Example Request:**
```bash
curl -X DELETE 'http://localhost:3000/api/cart/590175' \
  -H 'accept: application/json'
```

## Frontend Integration

### Using the useCart Hook

```typescript
import { useCart } from '@/hooks/useCart'

function MyComponent() {
  const { 
    cart, 
    isLoading, 
    addDomainToCart, 
    addProductToCart,
    clearCart,
    getCartItemsCount 
  } = useCart()

  // Add a domain to cart
  const handleAddDomain = async () => {
    await addDomainToCart('example.com', 'domain-com-example')
  }

  // Add a hosting product to cart
  const handleAddHosting = async () => {
    await addProductToCart('hosting-basic', 12, 'MONTH')
  }

  return (
    <div>
      <button onClick={handleAddDomain}>Add Domain</button>
      <button onClick={handleAddHosting}>Add Hosting</button>
      <span>Cart Items: {getCartItemsCount()}</span>
    </div>
  )
}
```

### Integration with Domain Search

Update your DomainSearch component to add domains to cart:

```typescript
// In DomainSearch.tsx
import { useCart } from '@/hooks/useCart'

export default function DomainSearch() {
  const { addDomainToCart } = useCart()
  
  const handleAddToCart = async (domain: string, productId: string) => {
    await addDomainToCart(domain, productId)
  }
  
  // Add button in your domain results
  <button 
    onClick={() => handleAddToCart(domainName, domainProductId)}
    className="btn-primary"
  >
    Add to Cart
  </button>
}
```

## Cart Item Structure

### Domain Item
```json
{
  "id": "unique-domain-id",
  "domain": "example.com",
  "quantity": 1
}
```

### Product Item (Hosting, Email, etc.)
```json
{
  "id": "product-id",
  "pfid": "product-id",
  "quantity": 1,
  "period": 12,
  "periodUnit": "MONTH"
}
```

## Environment Variables Required

Add these to your `.env.local`:
```
GODADDY_API_KEY=your_api_key
GODADDY_API_SECRET=your_api_secret
```

## Error Handling

The API includes comprehensive error handling:
- Rate limiting (60 requests per minute for GET, 30 for POST/DELETE)
- Authentication middleware (currently disabled, set `requireAuth: true` for production)
- CORS headers for cross-origin requests
- Detailed error messages with timestamps

## Next Steps

1. Update the Header component to show cart count
2. Create a cart page to display items
3. Implement checkout flow
4. Add cart persistence across sessions
5. Implement cart item quantity updates
6. Add price calculations and tax handling