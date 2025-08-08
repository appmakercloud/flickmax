'use client'

import { useState } from 'react'

export default function TestFxDomainsFlow() {
  const [responses, setResponses] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [custIdp, setCustIdp] = useState<string>('')
  const [infoCustIdp, setInfoCustIdp] = useState<string>('')
  
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
  
  // Step 1: Add item to cart via our backend (which should set cookies)
  const addToCartViaBackend = async () => {
    setLoading(true)
    addToLog('Adding domain to cart via backend API...')
    
    try {
      // This should be your backend API that communicates with GoDaddy
      // For now, let's test direct API call
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
            domain: 'testdomain789.com'
          }],
          redirect: '0',
          plid: plid
        })
      })
      
      const data = await response.json()
      addToLog(`Cart API Response (${response.status}):`, data)
      
      // Check for cookies
      const cookies = document.cookie
      addToLog('Cookies after add:', cookies)
      
      // Extract cust_idp and info_cust_idp from cookies
      const custIdpMatch = cookies.match(/cust_idp=([^;]+)/)
      const infoCustIdpMatch = cookies.match(/info_cust_idp=([^;]+)/)
      
      if (custIdpMatch) {
        setCustIdp(custIdpMatch[1])
        addToLog('Found cust_idp:', custIdpMatch[1])
      }
      
      if (infoCustIdpMatch) {
        setInfoCustIdp(decodeURIComponent(infoCustIdpMatch[1]))
        addToLog('Found info_cust_idp:', decodeURIComponent(infoCustIdpMatch[1]))
      }
      
    } catch (error) {
      addToLog('Backend cart error:', error)
    }
    
    setLoading(false)
  }
  
  // Step 2: Use form submission with intersite-sync (exactly like fxdomains)
  const checkoutWithIntersiteSync = () => {
    addToLog('Submitting checkout form with intersite-sync...')
    
    if (!custIdp || !infoCustIdp) {
      addToLog('Missing authentication tokens! Add item to cart first.')
      return
    }
    
    // Create form exactly like fxdomains
    const form = document.createElement('form')
    form.method = 'POST'
    form.action = 'https://www.secureserver.net/api/v1/intersite-sync'
    form.target = '_blank'
    
    // Add query parameters to action URL
    const checkoutUrl = `https://cart.secureserver.net/go/checkout?plid=${plid}`
    form.action = `https://www.secureserver.net/api/v1/intersite-sync?plid=${plid}&redirect=${encodeURIComponent(checkoutUrl)}`
    
    // Add form data
    const custIdpInput = document.createElement('input')
    custIdpInput.type = 'hidden'
    custIdpInput.name = 'cust_idp'
    custIdpInput.value = custIdp
    form.appendChild(custIdpInput)
    
    const infoCustIdpInput = document.createElement('input')
    infoCustIdpInput.type = 'hidden'
    infoCustIdpInput.name = 'info_cust_idp'
    infoCustIdpInput.value = infoCustIdp
    form.appendChild(infoCustIdpInput)
    
    // Submit form
    document.body.appendChild(form)
    form.submit()
    document.body.removeChild(form)
    
    addToLog('Form submitted to intersite-sync')
  }
  
  // Step 3: Alternative - Direct checkout (no intersite-sync)
  const directCheckout = () => {
    addToLog('Opening direct checkout...')
    
    const checkoutUrl = `https://cart.secureserver.net/go/checkout?plid=${plid}`
    window.open(checkoutUrl, '_blank')
  }
  
  // Step 4: Test mixed cart submission
  const testMixedCart = async () => {
    setLoading(true)
    addToLog('Testing mixed cart (domain + hosting)...')
    
    try {
      // First add domain
      const domainResponse = await fetch(`https://www.secureserver.net/api/v1/cart/${plid}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          items: [{
            id: 'domain',
            domain: 'mixedtest.com'
          }],
          redirect: '0',
          plid: plid
        })
      })
      
      const domainData = await domainResponse.json()
      addToLog(`Domain added (${domainResponse.status}):`, domainData)
      
      // Wait a bit
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Then add hosting
      const hostingResponse = await fetch(`https://www.secureserver.net/api/v1/cart/${plid}/`, {
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
      
      const hostingData = await hostingResponse.json()
      addToLog(`Hosting added (${hostingResponse.status}):`, hostingData)
      
      // Update tokens
      const cookies = document.cookie
      const custIdpMatch = cookies.match(/cust_idp=([^;]+)/)
      const infoCustIdpMatch = cookies.match(/info_cust_idp=([^;]+)/)
      
      if (custIdpMatch) {
        setCustIdp(custIdpMatch[1])
      }
      if (infoCustIdpMatch) {
        setInfoCustIdp(decodeURIComponent(infoCustIdpMatch[1]))
      }
      
    } catch (error) {
      addToLog('Mixed cart error:', error)
    }
    
    setLoading(false)
  }
  
  const clearLog = () => {
    setResponses([])
    setCustIdp('')
    setInfoCustIdp('')
  }
  
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Test FXDomains Flow</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={addToCartViaBackend}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              1. Add Domain to Cart
            </button>
            
            <button
              onClick={checkoutWithIntersiteSync}
              disabled={loading || !custIdp}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              2. Checkout (Intersite-sync)
            </button>
            
            <button
              onClick={directCheckout}
              disabled={loading}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
            >
              3. Direct Checkout
            </button>
            
            <button
              onClick={testMixedCart}
              disabled={loading}
              className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 disabled:opacity-50"
            >
              4. Test Mixed Cart
            </button>
            
            <button
              onClick={clearLog}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 col-span-2"
            >
              Clear Log
            </button>
          </div>
        </div>
        
        {(custIdp || infoCustIdp) && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-green-900 mb-2">Authentication Tokens:</h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium">cust_idp:</span>
                <pre className="mt-1 p-2 bg-white rounded text-xs overflow-x-auto">
                  {custIdp || 'Not found'}
                </pre>
              </div>
              <div>
                <span className="font-medium">info_cust_idp:</span>
                <pre className="mt-1 p-2 bg-white rounded text-xs overflow-x-auto">
                  {infoCustIdp || 'Not found'}
                </pre>
              </div>
            </div>
          </div>
        )}
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Response Log</h2>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {responses.length === 0 ? (
              <p className="text-gray-500">No responses yet. Start with Step 1.</p>
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
          <h3 className="font-semibold text-blue-900 mb-2">How FXDomains Works:</h3>
          <ol className="list-decimal list-inside text-sm text-blue-800 space-y-1">
            <li>User adds items via their backend API (www1.fxdomains.com)</li>
            <li>Backend communicates with GoDaddy and returns JWT tokens in cookies</li>
            <li>On checkout, they POST these tokens to intersite-sync API</li>
            <li>Intersite-sync sets cookies on secureserver.net domain</li>
            <li>User is redirected to checkout with proper authentication</li>
          </ol>
          <p className="mt-3 text-sm text-blue-800">
            <strong>Key insight:</strong> The JWT tokens are generated by their backend, not by browser API calls.
          </p>
        </div>
      </div>
    </div>
  )
}