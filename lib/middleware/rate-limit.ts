import { NextRequest, NextResponse } from 'next/server'

interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

// In-memory store for rate limiting (consider using Redis for production)
const rateLimitStore: RateLimitStore = {}

export interface RateLimitConfig {
  windowMs?: number
  maxRequests?: number
  skipSuccessfulRequests?: boolean
  skipFailedRequests?: boolean
  keyGenerator?: (req: NextRequest) => string
  handler?: (req: NextRequest) => NextResponse
}

export function createRateLimiter(config: RateLimitConfig = {}) {
  const {
    windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000'), // 1 minute default
    maxRequests = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
    keyGenerator = (req: NextRequest) => {
      // Use IP address as key, fallback to a default
      const ip = req.headers.get('x-forwarded-for') || 
                 req.headers.get('x-real-ip') || 
                 'unknown'
      return ip.split(',')[0].trim()
    },
    handler = () => {
      return NextResponse.json(
        {
          error: 'Too many requests',
          message: 'Please try again later',
          retryAfter: windowMs / 1000
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(windowMs / 1000),
            'X-RateLimit-Limit': String(maxRequests),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(new Date(Date.now() + windowMs).getTime())
          }
        }
      )
    }
  } = config

  return async function rateLimit(req: NextRequest): Promise<NextResponse | null> {
    const key = keyGenerator(req)
    const now = Date.now()

    // Clean up expired entries
    cleanupExpiredEntries(now)

    // Get or create rate limit entry
    let entry = rateLimitStore[key]
    if (!entry || now > entry.resetTime) {
      entry = {
        count: 0,
        resetTime: now + windowMs
      }
      rateLimitStore[key] = entry
    }

    // Increment count
    entry.count++

    // Check if limit exceeded
    if (entry.count > maxRequests) {
      console.log(`Rate limit exceeded for ${key}: ${entry.count}/${maxRequests}`)
      return handler(req)
    }

    // Add rate limit headers to help clients
    // Headers will be added in the response

    // Return null to continue processing, but we'll add headers in the route
    return null
  }
}

function cleanupExpiredEntries(now: number) {
  // Clean up expired entries to prevent memory leak
  const keysToDelete: string[] = []
  
  for (const [key, entry] of Object.entries(rateLimitStore)) {
    if (now > entry.resetTime) {
      keysToDelete.push(key)
    }
  }
  
  keysToDelete.forEach(key => delete rateLimitStore[key])
}

// Create a middleware wrapper for API routes
export function withRateLimit(
  handler: (req: NextRequest) => Promise<NextResponse>,
  config?: RateLimitConfig
) {
  const rateLimiter = createRateLimiter(config)

  return async function (req: NextRequest): Promise<NextResponse> {
    // Check rate limit
    const rateLimitResponse = await rateLimiter(req)
    if (rateLimitResponse) {
      return rateLimitResponse
    }

    // Process request
    try {
      const response = await handler(req)
      
      // Add rate limit headers to successful responses
      const key = (config?.keyGenerator || ((req) => {
        const ip = req.headers.get('x-forwarded-for') || 
                   req.headers.get('x-real-ip') || 
                   'unknown'
        return ip.split(',')[0].trim()
      }))(req)
      
      const entry = rateLimitStore[key]
      if (entry) {
        const remaining = Math.max(0, (config?.maxRequests || 100) - entry.count)
        response.headers.set('X-RateLimit-Limit', String(config?.maxRequests || 100))
        response.headers.set('X-RateLimit-Remaining', String(remaining))
        response.headers.set('X-RateLimit-Reset', String(entry.resetTime))
      }
      
      return response
    } catch (error) {
      // Handle errors
      console.error('Request handler error:', error)
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }
  }
}

// Export default rate limiter
export const defaultRateLimiter = createRateLimiter()