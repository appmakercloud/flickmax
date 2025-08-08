'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useCountry } from '@/contexts/CountryContext'

// Cookie management utilities
const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null
  return null
}

const setCookie = (name: string, value: string, days: number = 7) => {
  const expires = new Date()
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;domain=.secureserver.net`
}

export default function TestWPPluginMethod() {
  const [responses, setResponses] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const { currency, country } = useCountry()
  const plid = process.env.NEXT_PUBLIC_PLID || '590175'
  const [shopperId, setShopperId] = useState<string | null>(null)
  const [cartCount, setCartCount] = useState(0)
  const mountedRef = useRef(true)
  
  const addLog = useCallback((message: string) => {
    if (mountedRef.current) {
      setResponses(prev => [...prev, `${new Date().toISOString()}: ${message}`])
    }
  }, [])
  
  const clearResponses = () => {
    setResponses([])
  }
  
  // Initialize shopper ID and call GUI API
  useEffect(() => {
    const initializeSession = async () => {
      const cookieName = `ShopperId${plid}`
      let sid = getCookie(cookieName)
      
      if (!sid) {
        // Generate new shopper ID if not exists
        sid = `guest_${Date.now()}_${Math.random().toString(36).substring(7)}`
        setCookie(cookieName, sid)
        console.log('Created new shopper ID:', sid)
        if (mountedRef.current) {
          setResponses(prev => [...prev, `${new Date().toISOString()}: Created new shopper ID: ${sid}`])
        }
      } else {
        console.log('Found existing shopper ID:', sid)
        if (mountedRef.current) {
          setResponses(prev => [...prev, `${new Date().toISOString()}: Found existing shopper ID: ${sid}`])
        }
      }
      
      if (mountedRef.current) {
        setShopperId(sid)
      }
      
      // Call GUI API to establish session
      const callbackName = 'guiCallback_' + Date.now()
      
      if (mountedRef.current) {
        setResponses(prev => [...prev, `${new Date().toISOString()}: Calling GUI API to establish session...`])
      }
      
      (window as any)[callbackName] = (data: any) => {
        console.log('GUI API Response:', data)
        if (mountedRef.current) {
          setResponses(prev => [...prev, `${new Date().toISOString()}: GUI API Response: ${JSON.stringify(data, null, 2)}`])
          
          if (data.carttotal !== undefined) {
            setCartCount(data.carttotal)
            setResponses(prev => [...prev, `${new Date().toISOString()}: Current cart count from GUI: ${data.carttotal}`])
          }
        }
        
        // Cleanup
        delete (window as any)[callbackName]
        const script = document.getElementById(callbackName)
        if (script) script.remove()
      }
      
      const params = new URLSearchParams({
        callback: callbackName,
        plid: plid,
        sid: sid
      })
      
      const script = document.createElement('script')
      script.id = callbackName
      script.src = `https://www.secureserver.net/api/v1/gui?${params.toString()}`
      script.onerror = () => {
        console.error('GUI API call failed')
        if (mountedRef.current) {
          setResponses(prev => [...prev, `${new Date().toISOString()}: GUI API call failed`])
        }
        delete (window as any)[callbackName]
      }
      
      document.body.appendChild(script)
    }
    
    initializeSession()
    
    return () => {
      mountedRef.current = false
    }
  }, [plid])
  
  // WordPress plugin style JSONP cart add
  const addToCartWPStyle = (items: any[], testName: string) => {
    return new Promise((resolve, reject) => {
      if (!shopperId) {
        addLog('❌ No shopper ID available')
        reject(new Error('No shopper ID'))
        return
      }
      
      setLoading(true)
      addLog(`Starting ${testName}...`)
      
      const callbackName = 'jQuery' + Date.now() + '_' + Math.random().toString(36).substring(7)
      
      // Build cart data exactly like WordPress plugin
      const cartData = {
        items: items
      }
      
      // Build URL with parameters
      const cartParam = '&cart=' + JSON.stringify(cartData)
      const url = `https://www.secureserver.net/api/v1/cart/${plid}?callback=${callbackName}${cartParam}`
      
      addLog(`JSONP URL: ${url}`)
      addLog(`Using Shopper ID: ${shopperId}`)
      
      // Setup callback
      (window as any)[callbackName] = (data: any) => {
        try {
          addLog(`Response: ${JSON.stringify(data, null, 2)}`)
          
          if (data.error) {
            addLog(`❌ Error: ${data.error.message}`)
            reject(data.error)
          } else {
            if (data.cartCount !== undefined) {
              setCartCount(data.cartCount)
              addLog(`✅ Success! Cart count: ${data.cartCount}`)
              
              // Update cookie if new shopper ID returned
              if (data.shopperId) {
                setCookie(`ShopperId${plid}`, data.shopperId)
                setShopperId(data.shopperId)
                addLog(`Updated shopper ID: ${data.shopperId}`)
              }
            }
            resolve(data)
          }
        } finally {
          // Cleanup
          delete (window as any)[callbackName]
          const script = document.getElementById(callbackName)
          if (script) script.remove()
          setLoading(false)
        }
      }
      
      // Create script tag
      const script = document.createElement('script')
      script.id = callbackName
      script.src = url
      
      // Add cookies to script request
      script.setAttribute('crossorigin', 'anonymous')
      script.setAttribute('credentials', 'include')
      
      script.onerror = () => {
        addLog('❌ JSONP request failed')
        delete (window as any)[callbackName]
        setLoading(false)
        reject(new Error('JSONP failed'))
      }
      
      document.body.appendChild(script)
    })
  }
  
  // Test functions
  const testAddDomain = async () => {
    await addToCartWPStyle([
      {
        id: 'domain',
        domain: `testdomain${Date.now()}.com`,
        quantity: 1
      }
    ], 'WordPress Plugin Style - Domain Only')
  }
  
  const testAddHosting = async () => {
    await addToCartWPStyle([
      {
        id: 'cpanel-economy',
        quantity: 1
      }
    ], 'WordPress Plugin Style - Hosting Only')
  }
  
  const testAddBoth = async () => {
    await addToCartWPStyle([
      {
        id: 'domain',
        domain: `testdomain${Date.now()}.com`,
        quantity: 1
      },
      {
        id: 'cpanel-economy',
        quantity: 1
      }
    ], 'WordPress Plugin Style - Both Items')
  }
  
  const testSequential = async () => {
    try {
      addLog('Starting WordPress plugin style sequential test...')
      
      // Add domain
      await addToCartWPStyle([
        {
          id: 'domain',
          domain: `testdomain${Date.now()}.com`,
          quantity: 1
        }
      ], 'Step 1: Domain')
      
      // Wait a bit
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Add hosting
      await addToCartWPStyle([
        {
          id: 'cpanel-economy',
          quantity: 1
        }
      ], 'Step 2: Hosting')
      
      addLog('✅ Sequential test completed!')
    } catch (error) {
      addLog(`❌ Sequential test failed: ${error}`)
    }
  }
  
  // Form submission with ISC parameter (like WP plugin)
  const testFormWithISC = () => {
    addLog('Testing WordPress plugin form submission with ISC...')
    
    const items = [
      {
        id: 'domain',
        domain: `testdomain${Date.now()}.com`,
        quantity: 1
      },
      {
        id: 'cpanel-economy',
        quantity: 1
      }
    ]
    
    // Create form like WordPress plugin
    const form = document.createElement('form')
    form.method = 'POST'
    form.action = `https://www.secureserver.net/api/v1/cart/${plid}/`
    form.target = '_blank'
    
    // Add redirect parameter
    const redirectInput = document.createElement('input')
    redirectInput.type = 'hidden'
    redirectInput.name = 'redirect'
    redirectInput.value = '1'
    form.appendChild(redirectInput)
    
    // Add plid parameter
    const plidInput = document.createElement('input')
    plidInput.type = 'hidden'
    plidInput.name = 'plid'
    plidInput.value = plid
    form.appendChild(plidInput)
    
    // Add ISC parameter (internal source code - for tracking)
    const iscInput = document.createElement('input')
    iscInput.type = 'hidden'
    iscInput.name = 'isc'
    iscInput.value = 'wpreseller'
    form.appendChild(iscInput)
    
    // Add items
    const itemsInput = document.createElement('input')
    itemsInput.type = 'hidden'
    itemsInput.name = 'items'
    itemsInput.value = JSON.stringify(items)
    form.appendChild(itemsInput)
    
    // Add shopper ID if available
    if (shopperId) {
      const sidInput = document.createElement('input')
      sidInput.type = 'hidden'
      sidInput.name = 'sid'
      sidInput.value = shopperId
      form.appendChild(sidInput)
    }
    
    document.body.appendChild(form)
    addLog(`Submitting form with shopper ID: ${shopperId}`)
    form.submit()
    document.body.removeChild(form)
  }
  
  // Refresh GUI API to get latest cart count
  const refreshCartCount = () => {
    if (!shopperId) {
      addLog('No shopper ID available')
      return
    }
    
    const callbackName = 'guiCallback_' + Date.now()
    
    addLog('Refreshing cart count from GUI API...')
    
    (window as any)[callbackName] = (data: any) => {
      addLog(`GUI API Response: ${JSON.stringify(data, null, 2)}`)
      
      if (data.carttotal !== undefined) {
        setCartCount(data.carttotal)
        addLog(`Updated cart count: ${data.carttotal}`)
      }
      
      // Cleanup
      delete (window as any)[callbackName]
      const script = document.getElementById(callbackName)
      if (script) script.remove()
    }
    
    const params = new URLSearchParams({
      callback: callbackName,
      plid: plid,
      sid: shopperId
    })
    
    const script = document.createElement('script')
    script.id = callbackName
    script.src = `https://www.secureserver.net/api/v1/gui?${params.toString()}`
    script.onerror = () => {
      addLog('GUI API refresh failed')
      delete (window as any)[callbackName]
    }
    
    document.body.appendChild(script)
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">WordPress Plugin Method Test</h1>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-800 mb-2">Session Info:</h3>
          <p className="text-sm text-blue-700">Shopper ID: {shopperId || 'Not set'}</p>
          <p className="text-sm text-blue-700">Cart Count: {cartCount}</p>
          <p className="text-sm text-blue-700">PLID: {plid}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">WordPress Plugin Style Tests</h2>
          <p className="text-sm text-gray-600 mb-4">
            These tests replicate the exact method used by the GoDaddy WordPress plugin,
            including ShopperId cookie management and GUI API integration.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <button
              onClick={testAddDomain}
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
            >
              Add Domain
            </button>
            
            <button
              onClick={testAddHosting}
              disabled={loading}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400"
            >
              Add Hosting
            </button>
            
            <button
              onClick={testAddBoth}
              disabled={loading}
              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:bg-gray-400"
            >
              Add Both
            </button>
            
            <button
              onClick={testSequential}
              disabled={loading}
              className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:bg-gray-400"
            >
              Sequential Add
            </button>
            
            <button
              onClick={testFormWithISC}
              disabled={loading}
              className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 disabled:bg-gray-400"
            >
              Form + ISC
            </button>
            
            <button
              onClick={refreshCartCount}
              disabled={loading}
              className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 disabled:bg-gray-400"
            >
              Refresh Count
            </button>
            
            <button
              onClick={clearResponses}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Clear
            </button>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Responses</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm overflow-x-auto max-h-96 overflow-y-auto">
            {responses.length === 0 ? (
              <p className="text-gray-500">No responses yet. Click a button above to test.</p>
            ) : (
              responses.map((response, index) => (
                <div key={index} className="mb-2 whitespace-pre-wrap">
                  {response}
                </div>
              ))
            )}
          </div>
        </div>
        
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded p-4">
          <h3 className="font-semibold text-yellow-800 mb-2">Key Differences from Previous Tests:</h3>
          <ol className="list-decimal list-inside text-sm text-yellow-700 space-y-1">
            <li>Manages ShopperId cookie explicitly (like WP plugin)</li>
            <li>Calls GUI API to establish/verify session</li>
            <li>Includes ISC parameter for tracking</li>
            <li>Sets cookie domain to .secureserver.net</li>
            <li>Attempts to maintain session across requests</li>
          </ol>
        </div>
      </div>
    </div>
  )
}