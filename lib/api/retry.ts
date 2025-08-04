export interface RetryOptions {
  maxRetries?: number
  initialDelay?: number
  maxDelay?: number
  backoffMultiplier?: number
  shouldRetry?: (error: unknown) => boolean
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxRetries = 3,
    initialDelay = 1000,
    maxDelay = 10000,
    backoffMultiplier = 2,
    shouldRetry = (error) => {
      // Retry on network errors and 5xx status codes
      if (error instanceof TypeError && error.message.includes('fetch')) {
        return true
      }
      const err = error as Error & { status?: number; code?: string }
      if (err.status && err.status >= 500 && err.status < 600) {
        return true
      }
      if (err.code === 'ECONNRESET' || err.code === 'ETIMEDOUT') {
        return true
      }
      return false
    }
  } = options

  let lastError: unknown
  let delay = initialDelay

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error
      
      // Check if we should retry
      if (attempt === maxRetries || !shouldRetry(error)) {
        throw error
      }

      // Log retry attempt
      console.log(`Retry attempt ${attempt + 1} of ${maxRetries} after ${delay}ms`)

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay))

      // Calculate next delay with exponential backoff
      delay = Math.min(delay * backoffMultiplier, maxDelay)
    }
  }

  throw lastError
}

export function createRetryFetch(options: RetryOptions = {}) {
  return async (url: string | URL, init?: RequestInit): Promise<Response> => {
    return withRetry(async () => {
      const response = await fetch(url, init)
      
      // Throw error for 5xx responses to trigger retry
      if (response.status >= 500) {
        const error = new Error(`HTTP ${response.status}: ${response.statusText}`) as Error & { status?: number }
        error.status = response.status
        throw error
      }
      
      return response
    }, options)
  }
}