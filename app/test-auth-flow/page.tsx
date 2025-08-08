'use client'

import { useState } from 'react'

export default function TestAuthFlow() {
  const [responses, setResponses] = useState<Array<{time: string; message: string; data?: unknown}>>([])
  const [loading, setLoading] = useState(false)
  const [authData, setAuthData] = useState<{cust_idp?: string; info_cust_idp?: string; auth?: unknown} | null>(null)
  
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
  
  // Step 1: Initialize session and get auth tokens
  const initializeSession = async () => {
    setLoading(true)
    addToLog('Initializing session...')
    
    try {
      // First, try to get initial cart/session
      const initResponse = await fetch(`https://www.secureserver.net/api/v1/cart/${plid}/`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        credentials: 'include'
      })
      
      const initData = await initResponse.json()
      addToLog(`Initial cart response (${initResponse.status}):`, initData)
      
      // Check if we got any auth tokens in the response
      const cookies = document.cookie
      addToLog('Current cookies:', cookies)
      
      // Try to extract cust_idp from response or cookies
      if (initData.cust_idp || initData.auth) {
        setAuthData(initData)
        addToLog('Auth data found:', initData)
      }
      
    } catch (error) {
      addToLog('Session init error:', error)
    }
    
    setLoading(false)
  }
  
  // Step 2: Add items to cart and capture the session
  const addItemAndCaptureSession = async () => {
    setLoading(true)
    addToLog('Adding item to capture session...')
    
    try {
      // Add a domain to establish session
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
            domain: 'testsession.com'
          }],
          redirect: '0',
          plid: plid
        })
      })
      
      const data = await response.json()
      addToLog(`Add item response (${response.status}):`, data)
      
      // Check response headers for any auth tokens
      const headers: Record<string, string> = {}
      response.headers.forEach((value, key) => {
        headers[key] = value
      })
      addToLog('Response headers:', headers)
      
      // Check cookies again
      const cookies = document.cookie
      addToLog('Cookies after add:', cookies)
      
    } catch (error) {
      addToLog('Add item error:', error)
    }
    
    setLoading(false)
  }
  
  // Step 3: Test checkout redirect
  const testCheckoutRedirect = async () => {
    setLoading(true)
    addToLog('Testing checkout redirect...')
    
    try {
      // Try the direct checkout URL
      const checkoutUrl = `https://cart.secureserver.net/go/checkout?pl_id=${plid}`
      
      // Create a form to submit
      const form = document.createElement('form')
      form.method = 'GET'
      form.action = checkoutUrl
      form.target = '_blank'
      
      document.body.appendChild(form)
      form.submit()
      document.body.removeChild(form)
      
      addToLog('Opened checkout in new tab')
      
    } catch (error) {
      addToLog('Checkout redirect error:', error)
    }
    
    setLoading(false)
  }
  
  // Step 4: Test form-based intersite-sync (like fxdomains)
  const testFormIntersiteSync = async () => {
    setLoading(true)
    addToLog('Testing form-based intersite-sync...')
    
    try {
      // Create form like fxdomains does
      const form = document.createElement('form')
      form.method = 'POST'
      form.action = `https://www.secureserver.net/api/v1/intersite-sync`
      form.target = '_blank'
      
      // Add plid parameter
      const plidInput = document.createElement('input')
      plidInput.type = 'hidden'
      plidInput.name = 'plid'
      plidInput.value = plid
      form.appendChild(plidInput)
      
      // Add redirect parameter
      const redirectInput = document.createElement('input')
      redirectInput.type = 'hidden'
      redirectInput.name = 'redirect'
      redirectInput.value = `https://cart.secureserver.net/go/checkout?pl_id=${plid}`
      form.appendChild(redirectInput)
      
      // If we have auth data, add it
      if (authData) {
        const custIdpInput = document.createElement('input')
        custIdpInput.type = 'hidden'
        custIdpInput.name = 'cust_idp'
        custIdpInput.value = authData.cust_idp || ''
        form.appendChild(custIdpInput)
        
        const infoCustIdpInput = document.createElement('input')
        infoCustIdpInput.type = 'hidden'
        infoCustIdpInput.name = 'info_cust_idp'
        infoCustIdpInput.value = authData.info_cust_idp || ''
        form.appendChild(infoCustIdpInput)
      }
      
      document.body.appendChild(form)
      form.submit()
      document.body.removeChild(form)
      
      addToLog('Submitted intersite-sync form')
      
    } catch (error) {
      addToLog('Form intersite-sync error:', error)
    }
    
    setLoading(false)
  }
  
  // Step 5: Test direct API submission
  const testDirectSubmission = async () => {
    setLoading(true)
    addToLog('Testing direct form submission...')
    
    try {
      // Create form for direct submission
      const form = document.createElement('form')
      form.method = 'POST'
      form.action = `https://www.secureserver.net/api/v1/cart/${plid}/`
      form.target = '_blank'
      
      // Add items as form fields (not JSON)
      // Domain
      const domainIdInput = document.createElement('input')
      domainIdInput.type = 'hidden'
      domainIdInput.name = 'items[0][id]'
      domainIdInput.value = 'domain'
      form.appendChild(domainIdInput)
      
      const domainNameInput = document.createElement('input')
      domainNameInput.type = 'hidden'
      domainNameInput.name = 'items[0][domain]'
      domainNameInput.value = 'testdirect.com'
      form.appendChild(domainNameInput)
      
      // Hosting
      const hostingIdInput = document.createElement('input')
      hostingIdInput.type = 'hidden'
      hostingIdInput.name = 'items[1][id]'
      hostingIdInput.value = 'cpanel-economy'
      form.appendChild(hostingIdInput)
      
      const hostingQtyInput = document.createElement('input')
      hostingQtyInput.type = 'hidden'
      hostingQtyInput.name = 'items[1][quantity]'
      hostingQtyInput.value = '1'
      form.appendChild(hostingQtyInput)
      
      const hostingPeriodInput = document.createElement('input')
      hostingPeriodInput.type = 'hidden'
      hostingPeriodInput.name = 'items[1][period]'
      hostingPeriodInput.value = '12'
      form.appendChild(hostingPeriodInput)
      
      const hostingPeriodUnitInput = document.createElement('input')
      hostingPeriodUnitInput.type = 'hidden'
      hostingPeriodUnitInput.name = 'items[1][periodUnit]'
      hostingPeriodUnitInput.value = 'MONTH'
      form.appendChild(hostingPeriodUnitInput)
      
      // Add redirect
      const redirectInput = document.createElement('input')
      redirectInput.type = 'hidden'
      redirectInput.name = 'redirect'
      redirectInput.value = '1'
      form.appendChild(redirectInput)
      
      // Add plid
      const plidInput = document.createElement('input')
      plidInput.type = 'hidden'
      plidInput.name = 'plid'
      plidInput.value = plid
      form.appendChild(plidInput)
      
      document.body.appendChild(form)
      form.submit()
      document.body.removeChild(form)
      
      addToLog('Submitted direct form')
      
    } catch (error) {
      addToLog('Direct submission error:', error)
    }
    
    setLoading(false)
  }
  
  const clearLog = () => {
    setResponses([])
    setAuthData(null)
  }
  
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Test Authentication Flow</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Steps</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <button
              onClick={initializeSession}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              1. Initialize Session
            </button>
            
            <button
              onClick={addItemAndCaptureSession}
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              2. Add Item & Capture
            </button>
            
            <button
              onClick={testCheckoutRedirect}
              disabled={loading}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
            >
              3. Test Checkout
            </button>
            
            <button
              onClick={testFormIntersiteSync}
              disabled={loading}
              className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 disabled:opacity-50"
            >
              4. Form Intersite-sync
            </button>
            
            <button
              onClick={testDirectSubmission}
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
            >
              5. Direct Form Submit
            </button>
            
            <button
              onClick={clearLog}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Clear Log
            </button>
          </div>
        </div>
        
        {authData && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-yellow-900 mb-2">Captured Auth Data:</h3>
            <pre className="text-sm bg-white p-2 rounded overflow-x-auto">
              {JSON.stringify(authData, null, 2)}
            </pre>
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
          <h3 className="font-semibold text-blue-900 mb-2">Notes:</h3>
          <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
            <li>The intersite-sync API requires valid JWT tokens</li>
            <li>These tokens are typically generated server-side</li>
            <li>Direct form submission might be the simplest approach</li>
            <li>Test Step 5 (Direct Form Submit) for mixed cart items</li>
          </ul>
        </div>
      </div>
    </div>
  )
}