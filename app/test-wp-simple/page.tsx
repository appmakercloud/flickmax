'use client'

import { useState, useEffect } from 'react'
import { useCountry } from '@/contexts/CountryContext'

// Simple cookie utilities
const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
  return match ? match[2] : null
}

const setCookie = (name: string, value: string, days: number = 7) => {
  if (typeof document === 'undefined') return
  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString()
  document.cookie = `${name}=${value}; expires=${expires}; path=/`
}

export default function TestWPSimple() {
  const [responses, setResponses] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const { currency, country } = useCountry()
  const plid = process.env.NEXT_PUBLIC_PLID || '590175'
  const [shopperId, setShopperId] = useState<string>('')
  
  // Initialize shopper ID
  useEffect(() => {
    const cookieName = `ShopperId${plid}`
    let sid = getCookie(cookieName)
    
    if (!sid) {
      sid = `guest_${Date.now()}_${Math.random().toString(36).substring(7)}`
      setCookie(cookieName, sid)
    }
    
    setShopperId(sid)
    setResponses([`${new Date().toISOString()}: Shopper ID: ${sid}`])
  }, [plid])
  
  const log = (message: string) => {
    console.log(message)
    setResponses(prev => [...prev, `${new Date().toISOString()}: ${message}`])
  }
  
  const clearLog = () => {
    setResponses([])
  }
  
  // JSONP cart add with shopper ID
  const addToCart = async (items: any[], testName: string) => {
    setLoading(true)
    log(`Starting ${testName}...`)
    
    try {
      const callbackName = 'cb' + Date.now()
      
      // Build cart data
      const cartData = {
        items: items
      }
      
      // Try passing shopper ID as parameter
      const params = new URLSearchParams({
        callback: callbackName,
        cart: JSON.stringify(cartData),
        plid: plid,
        sid: shopperId // Add shopper ID to URL
      })
      
      const url = `https://www.secureserver.net/api/v1/cart/${plid}?${params.toString()}`
      
      log(`URL: ${url}`)
      
      return new Promise((resolve, reject) => {
        // Setup callback
        (window as any)[callbackName] = (data: any) => {
          log(`Response: ${JSON.stringify(data, null, 2)}`)
          
          if (data.error) {
            log(`❌ Error: ${data.error.message}`)
            reject(data.error)
          } else if (data.cartCount !== undefined) {
            log(`✅ Success! Cart count: ${data.cartCount}`)
            
            // Update shopper ID if returned
            if (data.shopperId) {
              setCookie(`ShopperId${plid}`, data.shopperId)
              setShopperId(data.shopperId)
              log(`Updated shopper ID: ${data.shopperId}`)
            }
            
            resolve(data)
          } else {
            log(`⚠️ Unknown response`)
            resolve(data)
          }
          
          // Cleanup
          delete (window as any)[callbackName]
          document.getElementById(callbackName)?.remove()
          setLoading(false)
        }
        
        // Create script
        const script = document.createElement('script')
        script.id = callbackName
        script.src = url
        script.onerror = () => {
          log('❌ Script failed to load')
          delete (window as any)[callbackName]
          setLoading(false)
          reject(new Error('Script failed'))
        }
        
        document.body.appendChild(script)
      })
    } catch (error) {
      log(`❌ Error: ${error}`)
      setLoading(false)
      throw error
    }
  }
  
  // Test single domain add with shopper ID in cookie
  const testDomainWithSID = async () => {
    // Set a test cookie that GoDaddy might recognize
    document.cookie = `visitor=vid=guest123; path=/; domain=.secureserver.net`
    
    await addToCart([
      {
        id: 'domain',
        domain: `test${Date.now()}.com`,
        quantity: 1
      }
    ], 'Domain with SID Cookie')
  }
  
  // Test hosting add
  const testHosting = async () => {
    await addToCart([
      {
        id: 'cpanel-economy',
        quantity: 1
      }
    ], 'Hosting Only')
  }
  
  // Test both together
  const testBoth = async () => {
    await addToCart([
      {
        id: 'domain',
        domain: `test${Date.now()}.com`,
        quantity: 1
      },
      {
        id: 'cpanel-economy',
        quantity: 1
      }
    ], 'Both Items')
  }
  
  // Test with explicit session parameters
  const testWithSession = async () => {
    const items = [{
      id: 'domain',
      domain: `test${Date.now()}.com`,
      quantity: 1
    }]
    
    // Try different parameter combinations
    const params = new URLSearchParams({
      items: JSON.stringify(items),
      plid: plid,
      sid: shopperId,
      visitor: 'guest123',
      redirect: '0'
    })
    
    const url = `https://www.secureserver.net/api/v1/cart/${plid}?${params.toString()}`
    log(`Opening URL: ${url}`)
    window.open(url, '_blank')
  }
  
  // Direct checkout with both items
  const directCheckout = () => {
    log('Attempting direct checkout...')
    
    const items = [
      {
        id: 'domain',
        domain: `test${Date.now()}.com`,
        quantity: 1
      },
      {
        id: 'cpanel-economy',
        quantity: 1
      }
    ]
    
    // Method 1: URL parameters
    const params = new URLSearchParams({
      domainToCheck: `test${Date.now()}.com`,
      items: 'cpanel-economy',
      plid: plid
    })
    
    const checkoutUrl = `https://cart.secureserver.net/go/checkout/?${params.toString()}`
    log(`Checkout URL: ${checkoutUrl}`)
    window.open(checkoutUrl, '_blank')
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Simplified WordPress Plugin Test</h1>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-700">Shopper ID: {shopperId}</p>
          <p className="text-sm text-blue-700">PLID: {plid}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Tests</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <button
              onClick={testDomainWithSID}
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
            >
              Domain + SID
            </button>
            
            <button
              onClick={testHosting}
              disabled={loading}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400"
            >
              Hosting
            </button>
            
            <button
              onClick={testBoth}
              disabled={loading}
              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:bg-gray-400"
            >
              Both Items
            </button>
            
            <button
              onClick={testWithSession}
              disabled={loading}
              className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:bg-gray-400"
            >
              URL + Session
            </button>
            
            <button
              onClick={directCheckout}
              disabled={loading}
              className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 disabled:bg-gray-400"
            >
              Direct Checkout
            </button>
            
            <button
              onClick={clearLog}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Clear
            </button>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Log</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm overflow-x-auto max-h-96 overflow-y-auto">
            {responses.map((response, index) => (
              <div key={index} className="mb-2 whitespace-pre-wrap">
                {response}
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded p-4">
          <h3 className="font-semibold text-yellow-800 mb-2">What we're testing:</h3>
          <ol className="list-decimal list-inside text-sm text-yellow-700 space-y-1">
            <li>Passing shopper ID as URL parameter</li>
            <li>Setting visitor cookies</li>
            <li>Direct checkout URL approach</li>
            <li>Different parameter combinations</li>
          </ol>
        </div>
      </div>
    </div>
  )
}