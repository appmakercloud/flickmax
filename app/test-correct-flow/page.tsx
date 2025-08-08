'use client'

import { useState } from 'react'

export default function TestCorrectFlow() {
  const [responses, setResponses] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [cookies, setCookies] = useState<string>('')
  
  const plid = process.env.NEXT_PUBLIC_PLID || '590175'
  
  const addToLog = (message: string, data?: any) => {
    const entry = {
      time: new Date().toISOString(),
      message,
      data
    }
    setResponses(prev => [...prev, entry])
    console.log(message, data)
  }
  
  // Step 1: Add domain directly to GoDaddy (browser-side)
  const testAddDomainDirect = async () => {
    setLoading(true)
    addToLog('Adding domain directly to GoDaddy cart...')
    
    try {
      const response = await fetch(`https://www.secureserver.net/api/v1/cart/${plid}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          items: [{
            id: 'domain',
            domain: 'testdomain456.com'
          }],
          redirect: '0',
          plid: plid
        })
      })
      
      addToLog(`GoDaddy Response Status: ${response.status} ${response.statusText}`)
      
      const data = await response.json()
      addToLog('GoDaddy Response data:', data)
      
      // Check cookies
      const browserCookies = document.cookie
      setCookies(browserCookies)
      addToLog('Browser cookies after add:', browserCookies)
      
    } catch (error) {
      addToLog('GoDaddy API error:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        error: error
      })
    }
    
    setLoading(false)
  }
  
  // Step 2: Add hosting directly to GoDaddy (browser-side)
  const testAddHostingDirect = async () => {
    setLoading(true)
    addToLog('Adding hosting directly to GoDaddy cart...')
    
    try {
      const response = await fetch(`https://www.secureserver.net/api/v1/cart/${plid}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          items: [{
            id: 'cpanel-economy',
            quantity: 1,
            period: 12,
            periodUnit: 'MONTH'
          }],
          redirect: '0',
          plid: plid
        })
      })
      
      addToLog(`GoDaddy Response Status: ${response.status} ${response.statusText}`)
      
      const data = await response.json()
      addToLog('GoDaddy Response data:', data)
      
      // Check cookies
      const browserCookies = document.cookie
      setCookies(browserCookies)
      addToLog('Browser cookies after add:', browserCookies)
      
    } catch (error) {
      addToLog('GoDaddy API error:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        error: error
      })
    }
    
    setLoading(false)
  }
  
  // Step 3: Get JWT tokens from backend
  const testGetJWTTokens = async () => {
    setLoading(true)
    addToLog('Getting JWT tokens from backend...')
    
    try {
      const response = await fetch(`https://host.flickmax.com/api/v1/cart/auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          plid: plid
        })
      })
      
      addToLog(`Backend Auth Response Status: ${response.status} ${response.statusText}`)
      
      if (!response.ok) {
        const errorText = await response.text()
        addToLog('Auth error response:', errorText)
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }
      
      const data = await response.json()
      addToLog('Auth Response data:', data)
      
      if (data.custIdp && data.infoCustIdp) {
        addToLog('✅ Got JWT tokens successfully!')
        return data
      } else {
        addToLog('❌ No JWT tokens in response')
      }
      
    } catch (error) {
      addToLog('Backend auth error:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        error: error
      })
    }
    
    setLoading(false)
  }
  
  // Step 4: Complete checkout with intersite-sync
  const testCheckoutFlow = async () => {
    setLoading(true)
    addToLog('Testing complete checkout flow...')
    
    try {
      // First get JWT tokens
      const authData = await testGetJWTTokens()
      
      if (authData && authData.custIdp && authData.infoCustIdp) {
        addToLog('Creating intersite-sync form...')
        
        // Create form for intersite-sync
        const form = document.createElement('form')
        form.method = 'POST'
        form.action = 'https://www.secureserver.net/api/v1/intersite-sync'
        form.target = '_blank'
        
        const checkoutUrl = `https://cart.secureserver.net/go/checkout?plid=${plid}`
        form.action = `https://www.secureserver.net/api/v1/intersite-sync?plid=${plid}&redirect=${encodeURIComponent(checkoutUrl)}`
        
        // Add authentication tokens
        const custIdpInput = document.createElement('input')
        custIdpInput.type = 'hidden'
        custIdpInput.name = 'cust_idp'
        custIdpInput.value = authData.custIdp
        form.appendChild(custIdpInput)
        
        const infoCustIdpInput = document.createElement('input')
        infoCustIdpInput.type = 'hidden'
        infoCustIdpInput.name = 'info_cust_idp'
        infoCustIdpInput.value = authData.infoCustIdp
        form.appendChild(infoCustIdpInput)
        
        // Submit form
        document.body.appendChild(form)
        form.submit()
        document.body.removeChild(form)
        
        addToLog('✅ Form submitted to intersite-sync')
      } else {
        addToLog('Falling back to direct checkout...')
        window.open(`https://cart.secureserver.net/go/checkout?plid=${plid}`, '_blank')
      }
      
    } catch (error) {
      addToLog('Checkout error:', error)
    }
    
    setLoading(false)
  }
  
  // Direct checkout without JWT
  const testDirectCheckout = () => {
    addToLog('Opening direct checkout (no JWT)...')
    window.open(`https://cart.secureserver.net/go/checkout?plid=${plid}`, '_blank')
  }
  
  const clearLog = () => {
    setResponses([])
    setCookies('')
  }
  
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Test Correct Flow (Like FXDomains)</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Step-by-Step Testing</h2>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={testAddDomainDirect}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              1. Add Domain (Direct to GoDaddy)
            </button>
            
            <button
              onClick={testAddHostingDirect}
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              2. Add Hosting (Direct to GoDaddy)
            </button>
            
            <button
              onClick={testGetJWTTokens}
              disabled={loading}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
            >
              3. Get JWT Tokens (Backend)
            </button>
            
            <button
              onClick={testCheckoutFlow}
              disabled={loading}
              className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 disabled:opacity-50"
            >
              4. Complete Checkout Flow
            </button>
            
            <button
              onClick={testDirectCheckout}
              disabled={loading}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Direct Checkout (No JWT)
            </button>
            
            <button
              onClick={clearLog}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Clear Log
            </button>
          </div>
        </div>
        
        {cookies && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-green-900 mb-2">Browser Cookies:</h3>
            <pre className="text-xs bg-white p-2 rounded overflow-x-auto">
              {cookies}
            </pre>
          </div>
        )}
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Response Log</h2>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {responses.length === 0 ? (
              <p className="text-gray-500">No responses yet. Start with step 1.</p>
            ) : (
              responses.map((response, index) => (
                <div key={index} className="border-b pb-4">
                  <div className="text-xs text-gray-500">{response.time}</div>
                  <div className="font-medium text-gray-900">{response.message}</div>
                  {response.data && (
                    <pre className="mt-2 text-sm bg-gray-100 p-2 rounded overflow-x-auto">
                      {typeof response.data === 'string' 
                        ? response.data 
                        : JSON.stringify(response.data, null, 2)}
                    </pre>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
        
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">Correct Flow (Like FXDomains):</h3>
          <ol className="list-decimal list-inside text-sm text-blue-800 space-y-1">
            <li>Add items directly to GoDaddy cart from browser (sets cookies)</li>
            <li>On checkout, call backend API to get JWT tokens</li>
            <li>Backend generates/retrieves JWT tokens for authentication</li>
            <li>Use intersite-sync with JWT tokens to sync cookies</li>
            <li>Redirect to GoDaddy checkout with proper authentication</li>
          </ol>
          <p className="mt-3 text-sm text-blue-800">
            <strong>Key difference:</strong> Backend is only used for JWT token generation, not for adding items to cart.
          </p>
        </div>
      </div>
    </div>
  )
}