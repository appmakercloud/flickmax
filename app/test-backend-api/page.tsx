'use client'

import { useState } from 'react'

export default function TestBackendAPI() {
  const [responses, setResponses] = useState<Array<{time: string; message: string; data?: unknown}>>([])
  const [loading, setLoading] = useState(false)
  const [cookies, setCookies] = useState<string>('')
  
  const plid = process.env.NEXT_PUBLIC_PLID || '590175'
  
  const addToLog = (message: string, data?: unknown) => {
    const entry = {
      time: new Date().toISOString(),
      message,
      data
    }
    setResponses(prev => [...prev, entry])
    console.log(message, data)
  }
  
  // Test adding domain via backend API
  const testAddDomain = async () => {
    setLoading(true)
    addToLog('Testing add domain via backend API...')
    
    try {
      const response = await fetch(`https://host.flickmax.com/api/v1/cart/${plid}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          items: [{
            id: 'domain',
            domain: 'testdomain123.com'
          }]
        })
      })
      
      addToLog(`Backend API Response Status: ${response.status} ${response.statusText}`)
      
      if (!response.ok) {
        const errorText = await response.text()
        addToLog('Error response body:', errorText)
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }
      
      const data = await response.json()
      addToLog('Backend API Response data:', data)
      
      // Check cookies
      const browserCookies = document.cookie
      setCookies(browserCookies)
      addToLog('Browser cookies after add:', browserCookies)
      
    } catch (error) {
      addToLog('Backend API error:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        error: error
      })
    }
    
    setLoading(false)
  }
  
  // Test adding hosting via backend API
  const testAddHosting = async () => {
    setLoading(true)
    addToLog('Testing add hosting via backend API...')
    
    try {
      const response = await fetch(`https://host.flickmax.com/api/v1/cart/${plid}`, {
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
          }]
        })
      })
      
      addToLog(`Backend API Response Status: ${response.status} ${response.statusText}`)
      
      if (!response.ok) {
        const errorText = await response.text()
        addToLog('Error response body:', errorText)
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }
      
      const data = await response.json()
      addToLog('Backend API Response data:', data)
      
      // Check cookies
      const browserCookies = document.cookie
      setCookies(browserCookies)
      addToLog('Browser cookies after add:', browserCookies)
      
    } catch (error) {
      addToLog('Backend API error:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        error: error
      })
    }
    
    setLoading(false)
  }
  
  // Test checkout via backend API
  const testCheckout = async () => {
    setLoading(true)
    addToLog('Testing checkout via backend API...')
    
    try {
      const response = await fetch(`https://host.flickmax.com/api/v1/cart/${plid}/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include'
      })
      
      addToLog(`Checkout API Response Status: ${response.status} ${response.statusText}`)
      
      if (!response.ok) {
        const errorText = await response.text()
        addToLog('Error response body:', errorText)
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }
      
      const data = await response.json()
      addToLog('Checkout API Response data:', data)
      
      if (data.custIdp && data.infoCustIdp) {
        addToLog('Got JWT tokens! Creating intersite-sync form...')
        
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
        custIdpInput.value = data.custIdp
        form.appendChild(custIdpInput)
        
        const infoCustIdpInput = document.createElement('input')
        infoCustIdpInput.type = 'hidden'
        infoCustIdpInput.name = 'info_cust_idp'
        infoCustIdpInput.value = data.infoCustIdp
        form.appendChild(infoCustIdpInput)
        
        // Submit form
        document.body.appendChild(form)
        form.submit()
        document.body.removeChild(form)
        
        addToLog('Form submitted to intersite-sync')
      } else {
        addToLog('No JWT tokens in response!')
      }
      
    } catch (error) {
      addToLog('Checkout API error:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        error: error
      })
    }
    
    setLoading(false)
  }
  
  // Test mixed cart (domain + hosting)
  const testMixedCart = async () => {
    setLoading(true)
    addToLog('Testing mixed cart via backend API...')
    
    try {
      // Add domain first
      addToLog('Adding domain...')
      const domainResponse = await fetch(`https://host.flickmax.com/api/v1/cart/${plid}`, {
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
          }]
        })
      })
      
      addToLog(`Domain response status: ${domainResponse.status} ${domainResponse.statusText}`)
      
      if (!domainResponse.ok) {
        const errorText = await domainResponse.text()
        addToLog('Domain error response:', errorText)
        throw new Error(`Domain HTTP ${domainResponse.status}: ${errorText}`)
      }
      
      const domainData = await domainResponse.json()
      addToLog('Domain response data:', domainData)
      
      // Wait a moment
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Add hosting
      addToLog('Adding hosting...')
      const hostingResponse = await fetch(`https://host.flickmax.com/api/v1/cart/${plid}`, {
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
          }]
        })
      })
      
      addToLog(`Hosting response status: ${hostingResponse.status} ${hostingResponse.statusText}`)
      
      if (!hostingResponse.ok) {
        const errorText = await hostingResponse.text()
        addToLog('Hosting error response:', errorText)
        throw new Error(`Hosting HTTP ${hostingResponse.status}: ${errorText}`)
      }
      
      const hostingData = await hostingResponse.json()
      addToLog('Hosting response data:', hostingData)
      
      // Check final cookies
      const browserCookies = document.cookie
      setCookies(browserCookies)
      addToLog('Final browser cookies:', browserCookies)
      
    } catch (error) {
      addToLog('Mixed cart error:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        error: error
      })
    }
    
    setLoading(false)
  }
  
  const clearLog = () => {
    setResponses([])
    setCookies('')
  }
  
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Test Backend API (host.flickmax.com)</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={testAddDomain}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              Add Domain
            </button>
            
            <button
              onClick={testAddHosting}
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              Add Hosting
            </button>
            
            <button
              onClick={testMixedCart}
              disabled={loading}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
            >
              Test Mixed Cart
            </button>
            
            <button
              onClick={testCheckout}
              disabled={loading}
              className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 disabled:opacity-50"
            >
              Test Checkout
            </button>
            
            <button
              onClick={clearLog}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 col-span-2"
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
              <p className="text-gray-500">No responses yet. Click a test button above.</p>
            ) : (
              responses.map((response, index) => (
                <div key={index} className="border-b pb-4">
                  <div className="text-xs text-gray-500">{response.time}</div>
                  <div className="font-medium text-gray-900">{response.message}</div>
                  {response.data ? (
                    <pre className="mt-2 text-sm bg-gray-100 p-2 rounded overflow-x-auto">
                      {String(typeof response.data === 'string' 
                        ? response.data 
                        : JSON.stringify(response.data, null, 2))}
                    </pre>
                  ) : null}
                </div>
              ))
            )}
          </div>
        </div>
        
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">Implementation Notes:</h3>
          <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
            <li>Using your backend API at host.flickmax.com/api/v1/cart</li>
            <li>Backend should handle GoDaddy API communication and return JWT tokens</li>
            <li>Checkout endpoint should return cust_idp and info_cust_idp tokens</li>
            <li>These tokens are used with intersite-sync to set cookies on GoDaddy domain</li>
            <li>Credentials: 'include' is essential for cookie handling</li>
          </ul>
        </div>
      </div>
    </div>
  )
}