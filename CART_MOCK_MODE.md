# Cart Mock Mode

## Overview
The cart API now includes a mock mode for development when GoDaddy API credentials are not configured.

## How it works

1. **Automatic Detection**: The cart service automatically detects if `GODADDY_API_KEY` and `GODADDY_API_SECRET` environment variables are missing.

2. **Mock Implementation**: When credentials are missing:
   - Cart data is stored in memory (resets on server restart)
   - Mock prices are used ($10.99 per domain)
   - Mock tax calculation (8%)
   - All cart operations work without external API calls

3. **Seamless Development**: You can develop and test the cart functionality without needing real API credentials.

## Features in Mock Mode

- ✅ Add domains to cart
- ✅ View cart contents
- ✅ Calculate totals with mock prices
- ✅ Clear cart
- ✅ Cart persistence during session

## Switching to Production Mode

To use the real GoDaddy API:

1. Add to your `.env.local`:
```
GODADDY_API_KEY=your_actual_api_key
GODADDY_API_SECRET=your_actual_api_secret
```

2. Restart the development server

The system will automatically switch to using the real GoDaddy API.

## Mock Data Structure

In mock mode, domains are added with:
- Price: $10.99 per domain
- Tax: 8% of subtotal
- Currency: USD (can be changed in cart service)

This allows full testing of the cart UI and flow without incurring API costs.