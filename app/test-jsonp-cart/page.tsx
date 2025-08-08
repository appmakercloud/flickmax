'use client'

import { useState, useEffect, useRef } from 'react'
import { useCountry } from '@/contexts/CountryContext'

// Declare global callback function for JSONP
declare global {
  interface Window {
    jsonpCallbacks: { [key: string]: (data: any) => void };
  }
}

export default function TestJSONPCart() {
  const [responses, setResponses] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const { currency, country } = useCountry()
  const plid = process.env.NEXT_PUBLIC_PLID || '590175'
  
  // Initialize global callbacks object
  useEffect(() => {
    if (!window.jsonpCallbacks) {
      window.jsonpCallbacks = {}
    }
  }, [])
  
  
  const clearResponses = () => {
    setResponses([])
  }
  
  // JSONP function to add items to cart (matching WordPress plugin approach)
  const addToCartJSONP = (items: any[], testName: string) => {
    return new Promise((resolve, reject) => {
      setLoading(true)
      const timestamp = new Date().toISOString()
      setResponses(prev => [...prev, `${timestamp}: Starting ${testName}...`])
      
      // Create unique callback name
      const callbackName = 'jsonpCallback_' + Date.now() + '_' + Math.random().toString(36).substring(7)
      
      // Build cart data (matching WordPress plugin format)
      const cartData = {
        items: items
      }
      
      // Build URL with cart data as parameter
      const params = new URLSearchParams({
        callback: callbackName,
        cart: JSON.stringify(cartData),
        plid: plid,
        currencyType: currency,
        marketId: country.marketId || 'en-US'
      })
      
      const url = `https://www.secureserver.net/api/v1/cart/${plid}?${params.toString()}`
      
      setResponses(prev => [...prev, `${new Date().toISOString()}: JSONP URL: ${url}`])
      
      // Store the callback in a way that preserves React state access
      const handleResponse = (data: any) => {
        try {
          const responseTime = new Date().toISOString()
          setResponses(prev => [...prev, `${responseTime}: Response: ${JSON.stringify(data, null, 2)}`])
          
          if (data.cartCount !== undefined) {
            setResponses(prev => [...prev, `${responseTime}: ✅ Success! Cart count: ${data.cartCount}`])
            resolve(data)
          } else if (data.error) {
            setResponses(prev => [...prev, `${responseTime}: ❌ Error: ${data.error.message || JSON.stringify(data.error)}`])
            reject(data.error)
          } else {
            setResponses(prev => [...prev, `${responseTime}: ⚠️ Unknown response format`])
            resolve(data)
          }
        } catch (err) {
          setResponses(prev => [...prev, `${new Date().toISOString()}: ❌ Error processing response: ${err}`])
          reject(err)
        } finally {
          // Cleanup
          delete (window as any)[callbackName]
          const scriptElement = document.getElementById(callbackName)
          if (scriptElement) {
            scriptElement.remove()
          }
          setLoading(false)
        }
      }
      
      // Setup callback function
      (window as any)[callbackName] = handleResponse
      
      // Create script tag for JSONP request
      const script = document.createElement('script')
      script.id = callbackName
      script.src = url
      script.onerror = () => {
        setResponses(prev => [...prev, `${new Date().toISOString()}: ❌ JSONP script loading failed`])
        delete (window as any)[callbackName]
        setLoading(false)
        reject(new Error('JSONP script loading failed'))
      }
      
      document.body.appendChild(script)
    })
  }
  
  // Test adding domain only
  const testAddDomain = async () => {
    await addToCartJSONP([
      {
        id: 'domain',
        domain: `testdomain${Date.now()}.com`,
        quantity: 1
      }
    ], 'Domain Only Test')
  }
  
  // Test adding hosting only
  const testAddHosting = async () => {
    await addToCartJSONP([
      {
        id: 'cpanel-economy',
        quantity: 1
      }
    ], 'Hosting Only Test')
  }
  
  // Test adding both together
  const testAddBoth = async () => {
    await addToCartJSONP([
      {
        id: 'domain',
        domain: `testdomain${Date.now()}.com`,
        quantity: 1
      },
      {
        id: 'cpanel-economy',
        quantity: 1
      }
    ], 'Both Domain + Hosting Test')
  }
  
  // Test sequential addition (like the plugin does)
  const testSequentialAdd = async () => {
    try {
      setResponses(prev => [...prev, `${new Date().toISOString()}: Starting sequential test...`])
      
      // Add domain first
      await addToCartJSONP([
        {
          id: 'domain',
          domain: `testdomain${Date.now()}.com`,
          quantity: 1
        }
      ], 'Step 1: Domain')
      
      // Wait a bit
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Add hosting
      await addToCartJSONP([
        {
          id: 'cpanel-economy',
          quantity: 1
        }
      ], 'Step 2: Hosting')
      
      setResponses(prev => [...prev, `${new Date().toISOString()}: ✅ Sequential test completed!`])
    } catch (error) {
      setResponses(prev => [...prev, `${new Date().toISOString()}: ❌ Sequential test failed: ${error}`])
    }
  }
  
  // Test form submission approach (like WordPress plugin with redirect=true)
  const testFormSubmission = () => {
    setResponses(prev => [...prev, `${new Date().toISOString()}: Testing form submission approach...`])
    
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
    
    // Create a form dynamically
    const form = document.createElement('form')
    form.method = 'POST'
    form.action = `https://www.secureserver.net/api/v1/cart/${plid}/?redirect=1&plid=${plid}`
    form.target = '_blank'
    
    const input = document.createElement('input')
    input.type = 'hidden'
    input.name = 'items'
    input.value = JSON.stringify(items)
    
    form.appendChild(input)
    document.body.appendChild(form)
    
    setResponses(prev => [...prev, `${new Date().toISOString()}: Submitting form to: ${form.action}`])
    setResponses(prev => [...prev, `${new Date().toISOString()}: Items: ${input.value}`])
    
    form.submit()
    document.body.removeChild(form)
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">JSONP Cart Test Page</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">WordPress Plugin Methods</h2>
          <p className="text-sm text-gray-600 mb-4">
            Testing both approaches from the GoDaddy WordPress plugin:
          </p>
          <ul className="list-disc list-inside text-sm text-gray-600 mb-4">
            <li><strong>JSONP</strong>: For AJAX requests (no page refresh)</li>
            <li><strong>Form Submit</strong>: Direct form submission (with redirect)</li>
          </ul>
          <p className="text-xs text-gray-500">
            Settings: Currency={currency}, Market={country.marketId || 'en-US'}, PLID={plid}
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <button
              onClick={testAddDomain}
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
            >
              Add Domain (JSONP)
            </button>
            
            <button
              onClick={testAddHosting}
              disabled={loading}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400"
            >
              Add Hosting (JSONP)
            </button>
            
            <button
              onClick={testAddBoth}
              disabled={loading}
              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:bg-gray-400"
            >
              Add Both (JSONP)
            </button>
            
            <button
              onClick={testSequentialAdd}
              disabled={loading}
              className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:bg-gray-400"
            >
              Sequential (JSONP)
            </button>
            
            <button
              onClick={testFormSubmission}
              disabled={loading}
              className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 disabled:bg-gray-400"
            >
              Form Submit (Both)
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
        
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded p-4">
          <h3 className="font-semibold text-blue-800 mb-2">How JSONP Works:</h3>
          <ol className="list-decimal list-inside text-sm text-blue-700 space-y-1">
            <li>Creates a script tag with callback function</li>
            <li>Adds cart data as URL parameter</li>
            <li>GoDaddy API returns JavaScript that calls our callback</li>
            <li>Works in private browsing because it&apos;s just a script tag</li>
            <li>No CORS issues since it&apos;s not an AJAX request</li>
          </ol>
        </div>
        
        <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded p-4">
          <h3 className="font-semibold text-yellow-800 mb-2">Testing Instructions:</h3>
          <ol className="list-decimal list-inside text-sm text-yellow-700 space-y-1">
            <li>Test each JSONP button to see responses</li>
            <li>Check browser console for any errors</li>
            <li>Test in both normal and private browsing</li>
            <li>The "Add Both" button is most important - tests mixed cart</li>
            <li>After successful response, check the cart at GoDaddy</li>
          </ol>
        </div>
      </div>
    </div>
  )
}