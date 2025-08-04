# Domain Search Security Implementation

## Overview
This document describes the security improvements implemented for the domain search functionality.

## 🔐 Security Features Implemented

### 1. API Service Abstraction Layer
- **Location**: `/lib/api/domain-service.ts`
- **Features**:
  - Centralized API configuration
  - Environment-based settings
  - Request sanitization
  - Proper error handling
  - Authentication header management

### 2. Rate Limiting
- **Location**: `/lib/middleware/rate-limit.ts`
- **Configuration**:
  - Default: 30 requests per minute per IP
  - Configurable via environment variables
  - In-memory storage (upgradeable to Redis)
  - Proper rate limit headers in responses

### 3. API Authentication
- **Location**: `/lib/middleware/auth.ts`
- **Features**:
  - API key validation
  - Origin checking
  - Request signature verification (optional)
  - Environment-based auth requirements

### 4. Request Validation
- Domain name length validation (max 253 chars)
- SLD validation (max 63 chars)
- Query sanitization (alphanumeric + dash/dot only)
- Parameter type validation

## 🚀 Setup Instructions

### 1. Environment Variables
Copy `.env.example` to `.env` and configure:

```bash
# Domain API Configuration
DOMAIN_API_PROVIDER=godaddy
DOMAIN_API_BASE_URL=https://www.secureserver.net/api/v1
DOMAIN_API_KEY=your_api_key_here
DOMAIN_API_SECRET=your_api_secret_here
DOMAIN_API_PLID=590175

# Rate Limiting
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=30

# Security
API_SECRET_KEY=generate_using_script
ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com
```

### 2. Generate API Key
Run the provided script to generate a secure API key:

```bash
node scripts/generate-api-key.js
```

### 3. API Usage

#### Client-Side Usage
```typescript
// Add API key header to requests
const response = await fetch('/api/domain/search?q=example', {
  headers: {
    'X-API-Key': 'your_api_key_here'
  }
});
```

#### Rate Limit Headers
Response includes rate limit information:
- `X-RateLimit-Limit`: Total requests allowed
- `X-RateLimit-Remaining`: Requests remaining
- `X-RateLimit-Reset`: Reset timestamp

## 📊 Security Configuration

### Development Mode
- Authentication: Optional (set `requireAuth: false`)
- Rate Limiting: Active
- CORS: Permissive

### Production Mode
- Authentication: Required
- Rate Limiting: Active
- CORS: Restricted to allowed origins
- HTTPS: Required

## 🛡️ Security Best Practices

1. **Never commit `.env` files**
   - Use `.env.example` as template
   - Store secrets in secure vault

2. **Rotate API keys regularly**
   - Generate new keys monthly
   - Update all clients

3. **Monitor rate limits**
   - Track 429 responses
   - Adjust limits as needed

4. **Use HTTPS in production**
   - Enforce SSL/TLS
   - Use secure headers

## 📈 Monitoring

### Key Metrics to Track
- API response times
- Rate limit hits (429 responses)
- Authentication failures (401 responses)
- Error rates by endpoint

### Logging
All security events are logged:
- Failed authentication attempts
- Rate limit violations
- Invalid domain queries
- API errors

## 🔄 Migration Guide

### From Old Implementation
1. Update all API routes to use new middleware
2. Configure environment variables
3. Update client code to include API key
4. Test rate limiting behavior

### Example Migration
```typescript
// Old
export async function GET(request: NextRequest) {
  // Direct API call
}

// New
export const GET = withRateLimit(
  withAuth(handleDomainSearch, { requireAuth: true }),
  { maxRequests: 30 }
);
```

## 🚨 Troubleshooting

### Common Issues

1. **"API key required" error**
   - Add `X-API-Key` header to requests
   - Check `.env` configuration

2. **"Too many requests" error**
   - Implement request throttling
   - Cache responses client-side

3. **"Invalid domain" error**
   - Check domain format
   - Ensure proper encoding

## 📝 Notes

- Rate limits are per IP address
- API keys should be kept secret
- Consider implementing Redis for distributed rate limiting
- Monitor API usage for suspicious patterns