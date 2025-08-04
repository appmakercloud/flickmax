import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

export interface AuthConfig {
  secretKey?: string
  allowedOrigins?: string[]
  requireAuth?: boolean
}

export function createAuthMiddleware(config: AuthConfig = {}) {
  const {
    secretKey = process.env.API_SECRET_KEY,
    allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
    requireAuth = process.env.NODE_ENV === 'production'
  } = config

  return async function authenticate(req: NextRequest): Promise<NextResponse | null> {
    // Check origin
    const origin = req.headers.get('origin') || req.headers.get('referer')
    if (origin && !isAllowedOrigin(origin, allowedOrigins)) {
      console.warn(`Blocked request from unauthorized origin: ${origin}`)
      return NextResponse.json(
        { error: 'Unauthorized origin' },
        { status: 403 }
      )
    }

    // Skip auth in development unless explicitly required
    if (!requireAuth && process.env.NODE_ENV !== 'production') {
      return null
    }

    // Check for API key in header
    const apiKey = req.headers.get('x-api-key')
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key required' },
        { status: 401 }
      )
    }

    // Validate API key
    if (!isValidApiKey(apiKey, secretKey)) {
      return NextResponse.json(
        { error: 'Invalid API key' },
        { status: 401 }
      )
    }

    // Check request signature if present
    const signature = req.headers.get('x-signature')
    const timestamp = req.headers.get('x-timestamp')
    if (signature && timestamp) {
      const isValid = await verifyRequestSignature(req, signature, timestamp, secretKey)
      if (!isValid) {
        return NextResponse.json(
          { error: 'Invalid request signature' },
          { status: 401 }
        )
      }
    }

    return null // Continue to handler
  }
}

function isAllowedOrigin(origin: string, allowedOrigins: string[]): boolean {
  return allowedOrigins.some(allowed => {
    if (allowed === '*') return true
    if (allowed.includes('*')) {
      // Support wildcard domains like *.example.com
      const regex = new RegExp('^' + allowed.replace(/\*/g, '.*') + '$')
      return regex.test(origin)
    }
    return origin.startsWith(allowed)
  })
}

function isValidApiKey(apiKey: string, secretKey?: string): boolean {
  if (!secretKey) {
    console.warn('API_SECRET_KEY not configured')
    return false
  }
  
  // In production, you might want to check against a database of valid API keys
  // For now, we'll do a simple comparison
  return apiKey === secretKey
}

async function verifyRequestSignature(
  req: NextRequest,
  signature: string,
  timestamp: string,
  secretKey?: string
): Promise<boolean> {
  if (!secretKey) return false

  // Check timestamp to prevent replay attacks (5 minute window)
  const requestTime = parseInt(timestamp)
  const currentTime = Date.now()
  if (Math.abs(currentTime - requestTime) > 5 * 60 * 1000) {
    return false
  }

  // Recreate signature
  const method = req.method
  const url = req.url
  const body = await req.text()
  
  const payload = `${method}:${url}:${timestamp}:${body}`
  const expectedSignature = crypto
    .createHmac('sha256', secretKey)
    .update(payload)
    .digest('hex')

  return signature === expectedSignature
}

// Middleware wrapper for API routes
export function withAuth(
  handler: (req: NextRequest) => Promise<NextResponse>,
  config?: AuthConfig
) {
  const authMiddleware = createAuthMiddleware(config)

  return async function (req: NextRequest): Promise<NextResponse> {
    // Check authentication
    const authResponse = await authMiddleware(req)
    if (authResponse) {
      return authResponse
    }

    // Process request
    return handler(req)
  }
}

// Generate API key utility
export function generateApiKey(): string {
  return crypto.randomBytes(32).toString('hex')
}

// Sign request utility for clients
export function signRequest(
  method: string,
  url: string,
  body: string,
  secretKey: string
): { signature: string; timestamp: string } {
  const timestamp = Date.now().toString()
  const payload = `${method}:${url}:${timestamp}:${body}`
  const signature = crypto
    .createHmac('sha256', secretKey)
    .update(payload)
    .digest('hex')

  return { signature, timestamp }
}