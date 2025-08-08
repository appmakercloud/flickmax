'use client'

import { useState } from 'react'

export default function TestFxDomainsExact() {
  const [responses, setResponses] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [tokens, setTokens] = useState<{custIdp?: string, infoCustIdp?: string}>({})
  
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
  
  // Step 1: Add domain via backend (with existing tokens if any)
  const addDomainViaBackend = async () => {
    setLoading(true)
    addToLog('Adding domain via backend API...')
    
    try {
      const response = await fetch('/api/cart/add-item', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: [{
            id: 'domain',
            domain: 'testexample123.com'
          }],
          existingTokens: tokens // Pass existing tokens to maintain session
        })
      })
      
      const data = await response.json()
      addToLog('Backend response:', data)
      
      if (data.tokens && (data.tokens.custIdp || data.tokens.infoCustIdp)) {
        setTokens(data.tokens)
        addToLog('Received new tokens:', data.tokens)
      } else {
        addToLog('No new tokens returned - keeping existing tokens')
      }
      
    } catch (error) {
      addToLog('Error:', error)
    }
    
    setLoading(false)
  }
  
  // Step 2: Add hosting via backend (with existing tokens to maintain session)
  const addHostingViaBackend = async () => {
    setLoading(true)
    addToLog('Adding hosting via backend API (with existing session)...')
    
    try {
      const response = await fetch('/api/cart/add-item', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: [{
            id: 'cpanel-economy',
            quantity: 1,
            period: 12,
            periodUnit: 'MONTH'
          }],
          existingTokens: tokens // Pass existing tokens to maintain session
        })
      })
      
      const data = await response.json()
      addToLog('Backend response:', data)
      
      if (data.tokens && (data.tokens.custIdp || data.tokens.infoCustIdp)) {
        // Only update tokens if new ones are provided
        setTokens(data.tokens)
        addToLog('Updated tokens:', data.tokens)
      } else {
        addToLog('No new tokens returned - keeping existing session tokens')
      }
      
    } catch (error) {
      addToLog('Error:', error)
    }
    
    setLoading(false)
  }
  
  // Step 3: Generate JWT tokens
  const generateJWTTokens = async () => {
    setLoading(true)
    addToLog('Generating JWT tokens...')
    
    try {
      const response = await fetch('/api/cart/generate-tokens', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cartId: tokens.cartId || 'test-cart-id',
          sessionId: 'test-session-id'
        })
      })
      
      const data = await response.json()
      addToLog('Token response:', data)
      
      if (data.tokens) {
        setTokens(data.tokens)
        addToLog('Generated JWT tokens:', data.tokens)
      }
      
    } catch (error) {
      addToLog('Error:', error)
    }
    
    setLoading(false)
  }
  
  // Step 4: Checkout with intersite-sync (using real tokens)
  const checkoutWithTokens = () => {
    addToLog('Starting checkout with intersite-sync...')
    
    if (!tokens.custIdp || !tokens.infoCustIdp) {
      addToLog('ERROR: Missing tokens! Add items via backend first.')
      return
    }
    
    // Check if these are real GoDaddy tokens (not the fake generated ones)
    if (!tokens.custIdp.includes('alg') && !tokens.infoCustIdp.includes('%22')) {
      addToLog('ERROR: These appear to be fake tokens. Use the real tokens from adding items!')
      return
    }
    
    // Create form exactly like fxdomains
    const form = document.createElement('form')
    form.method = 'POST'
    form.action = 'https://www.secureserver.net/api/v1/intersite-sync'
    form.target = '_blank'
    
    // Add query parameters
    const checkoutUrl = `https://cart.secureserver.net/go/checkout?plid=${plid}`
    form.action = `https://www.secureserver.net/api/v1/intersite-sync?plid=${plid}&redirect=${encodeURIComponent(checkoutUrl)}`
    
    // Add tokens
    const custIdpInput = document.createElement('input')
    custIdpInput.type = 'hidden'
    custIdpInput.name = 'cust_idp'
    custIdpInput.value = tokens.custIdp
    form.appendChild(custIdpInput)
    
    const infoCustIdpInput = document.createElement('input')
    infoCustIdpInput.type = 'hidden'
    infoCustIdpInput.name = 'info_cust_idp'
    infoCustIdpInput.value = tokens.infoCustIdp
    form.appendChild(infoCustIdpInput)
    
    // Log form data
    addToLog('Submitting form with REAL GoDaddy tokens:', {
      action: form.action,
      cust_idp: tokens.custIdp.substring(0, 50) + '...',
      info_cust_idp: tokens.infoCustIdp.substring(0, 50) + '...'
    })
    
    // Submit form
    document.body.appendChild(form)
    form.submit()
    document.body.removeChild(form)
  }
  
  // Test complete flow
  const testCompleteFlow = async () => {
    addToLog('=== Starting Complete Flow ===')
    
    // Add domain
    await addDomainViaBackend()
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Add hosting
    await addHostingViaBackend()
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // DO NOT generate fake tokens - use the real ones from GoDaddy!
    addToLog('Using real GoDaddy tokens from backend responses...')
    
    // Checkout with real tokens
    checkoutWithTokens()
  }
  
  const clearLog = () => {
    setResponses([])
    setTokens({})
    localStorage.removeItem('cart_tokens')
    addToLog('Cleared all data and tokens')
  }
  
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">FXDomains Exact Implementation</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Step by Step Testing</h2>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={addDomainViaBackend}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              1. Add Domain (Backend)
            </button>
            
            <button
              onClick={addHostingViaBackend}
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              2. Add Hosting (Backend)
            </button>
            
            <button
              onClick={generateJWTTokens}
              disabled={loading}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
            >
              3. Generate JWT Tokens
            </button>
            
            <button
              onClick={checkoutWithTokens}
              disabled={loading || !tokens.custIdp}
              className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 disabled:opacity-50"
            >
              4. Checkout with Tokens
            </button>
            
            <button
              onClick={testCompleteFlow}
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 col-span-2"
            >
              Test Complete Flow
            </button>
            
            <button
              onClick={clearLog}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 col-span-2"
            >
              Clear Log
            </button>
          </div>
        </div>
        
        {(tokens.custIdp || tokens.infoCustIdp) && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-green-900 mb-2">Current Tokens:</h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium">cust_idp:</span>
                <pre className="mt-1 p-2 bg-white rounded text-xs overflow-x-auto">
                  {tokens.custIdp ? tokens.custIdp.substring(0, 100) + '...' : 'Not set'}
                </pre>
              </div>
              <div>
                <span className="font-medium">info_cust_idp:</span>
                <pre className="mt-1 p-2 bg-white rounded text-xs overflow-x-auto">
                  {tokens.infoCustIdp ? tokens.infoCustIdp.substring(0, 100) + '...' : 'Not set'}
                </pre>
              </div>
            </div>
          </div>
        )}
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Response Log</h2>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {responses.length === 0 ? (
              <p className="text-gray-500">No responses yet.</p>
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
          <h3 className="font-semibold text-blue-900 mb-2">How It Works:</h3>
          <ol className="list-decimal list-inside text-sm text-blue-800 space-y-1">
            <li>First item creates new session → Returns JWT tokens</li>
            <li>Additional items MUST pass existing tokens → Same session</li>
            <li>Backend includes tokens as cookies → Maintains cart</li>
            <li>Checkout uses intersite-sync with JWT tokens</li>
          </ol>
          <div className="mt-3 p-3 bg-yellow-100 border border-yellow-300 rounded">
            <p className="text-sm text-yellow-800 font-medium">
              ⚠️ Important: Always click "Clear Log" before starting a new test to reset tokens!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}