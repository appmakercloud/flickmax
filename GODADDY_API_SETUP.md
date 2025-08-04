# GoDaddy API Setup Guide

## ⚠️ CRITICAL SECURITY WARNING

**NEVER commit your actual API credentials to version control!**

If you've accidentally exposed your credentials:
1. Log into GoDaddy immediately
2. Revoke the exposed API keys
3. Generate new credentials
4. Update your local configuration

## 🔐 Secure Setup Instructions

### 1. Create Local Environment File

Create a `.env.local` file in your project root (this file is gitignored):

```bash
cp .env.local.example .env.local
```

### 2. Add Your GoDaddy Credentials

Edit `.env.local` and add your credentials:

```env
# GoDaddy API Configuration
GODADDY_API_KEY=your_actual_api_key_here
GODADDY_API_SECRET=your_actual_api_secret_here
GODADDY_PLID=590175

# Other required configs
API_SECRET_KEY=generate_using_node_scripts/generate-api-key.js
NEXT_PUBLIC_API_KEY=same_as_api_secret_key
```

### 3. Generate Internal API Key

```bash
node scripts/generate-api-key.js
```

Copy the generated key to both `API_SECRET_KEY` and `NEXT_PUBLIC_API_KEY` in your `.env.local`.

## 🏗️ Architecture Overview

### API Flow with PLID Validation

1. **First Request**: Validates PLID with GoDaddy API
   - Tests authentication credentials
   - Confirms PLID is valid and has proper permissions
   - Caches validation result for session

2. **Subsequent Requests**: Uses validated credentials
   - Skips PLID validation (already cached)
   - Makes direct API calls with authentication

### Security Layers

1. **Environment Variables**: Credentials stored securely
2. **API Service Layer**: Centralized authentication management
3. **Rate Limiting**: Prevents API abuse (30 req/min per IP)
4. **Request Validation**: Sanitizes all inputs
5. **Error Handling**: No credential leakage in errors

## 🧪 Testing Your Setup

### 1. Test Authentication

Visit: `http://localhost:3000/test-godaddy-auth`

Click "Test GoDaddy API Authentication" to verify:
- API credentials are valid
- PLID is correct
- Authentication headers work

### 2. Test Domain Search

Try searching for domains like:
- `example.com`
- `test123.net`
- `mydomain.org`

### 3. Monitor Console

Check browser console and terminal for:
- "PLID validation successful"
- Proper API responses
- No authentication errors

## 📊 API Response Format

### Successful Authentication
```json
{
  "exactMatchDomain": {
    "domain": "example.com",
    "available": true,
    "listPrice": "$11.99",
    "salePrice": "$9.99"
  },
  "suggestedDomains": [...]
}
```

### Authentication Failure
```json
{
  "error": "GoDaddy API authentication failed. Please check your API credentials.",
  "status": 401
}
```

## 🚨 Common Issues

### 1. 401 Unauthorized
- Check API key and secret are correct
- Ensure credentials are active in GoDaddy account
- Verify Authorization header format: `sso-key key:secret`

### 2. 403 Forbidden
- PLID doesn't match your reseller account
- Insufficient permissions for domain operations
- API access not enabled for your account

### 3. 429 Too Many Requests
- Rate limit exceeded
- Implement client-side throttling
- Consider caching results

## 🔒 Production Checklist

- [ ] API credentials in secure environment variables
- [ ] `.env.local` is gitignored
- [ ] Rate limiting configured appropriately
- [ ] Error messages don't expose credentials
- [ ] HTTPS enabled for all API calls
- [ ] Monitoring set up for API failures
- [ ] Regular credential rotation scheduled

## 📝 Environment Variables Reference

```env
# Required for GoDaddy API
GODADDY_API_KEY=        # Your GoDaddy API key
GODADDY_API_SECRET=     # Your GoDaddy API secret
GODADDY_PLID=          # Your Private Label ID (reseller ID)

# Internal Security
API_SECRET_KEY=         # For internal API authentication
NEXT_PUBLIC_API_KEY=    # Client-side API key

# Optional Configuration
RATE_LIMIT_WINDOW_MS=60000     # Rate limit window (1 minute)
RATE_LIMIT_MAX_REQUESTS=30     # Max requests per window
```

## 🔄 Credential Rotation

1. Log into GoDaddy Developer Portal
2. Generate new API credentials
3. Update `.env.local` with new credentials
4. Restart your development server
5. Test authentication with new credentials
6. Update production environment variables

Remember: **NEVER** commit `.env.local` or share credentials publicly!