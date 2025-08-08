'use client'

import { useState } from 'react'
import { useCountry } from '@/contexts/CountryContext'

export default function TestCartAPI() {
  const [responses, setResponses] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const { currency, country } = useCountry()
  const plid = process.env.NEXT_PUBLIC_PLID || '590175'
  
  const addResponse = (message: string) => {
    setResponses(prev => [...prev, `${new Date().toISOString()}: ${message}`])
  }
  
  const clearResponses = () => {
    setResponses([])
  }
  
  // Test adding domain only
  const testAddDomain = async () => {
    setLoading(true)
    addResponse('Starting domain addition test...')
    
    try {
      const response = await fetch(`https://www.secureserver.net/api/v1/cart/${plid}?redirect=false`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          items: [
            {
              id: 'domain',
              domain: `flickmaxtest${Date.now()}.com`
            }
          ],
          currencyType: currency,
          marketId: country.marketId || 'en-US',
          redirect: false
        })
      })
      
      const data = await response.json()
      addResponse(`Domain API Response: ${JSON.stringify(data, null, 2)}`)
      
      if (data.cartCount) {
        addResponse(`✅ Success! Cart count: ${data.cartCount}`)
      } else if (data.error) {
        addResponse(`❌ Error: ${data.error.message || JSON.stringify(data.error)}`)
      }
    } catch (error) {
      addResponse(`❌ Error: ${error}`)
    } finally {
      setLoading(false)
    }
  }
  
  // Test adding hosting only
  const testAddHosting = async () => {
    setLoading(true)
    addResponse('Starting hosting addition test...')
    
    try {
      const response = await fetch(`https://www.secureserver.net/api/v1/cart/${plid}?redirect=false`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          items: [
            {
              id: 'cpanel-starter'
            }
          ],
          currencyType: currency,
          marketId: country.marketId || 'en-US',
          redirect: false
        })
      })
      
      const data = await response.json()
      addResponse(`Hosting API Response: ${JSON.stringify(data, null, 2)}`)
      
      if (data.cartCount) {
        addResponse(`✅ Success! Cart count: ${data.cartCount}`)
      } else if (data.error) {
        addResponse(`❌ Error: ${data.error.message || JSON.stringify(data.error)}`)
      }
    } catch (error) {
      addResponse(`❌ Error: ${error}`)
    } finally {
      setLoading(false)
    }
  }
  
  // Test adding both sequentially
  const testAddBothSequentially = async () => {
    setLoading(true)
    addResponse('Starting sequential addition test...')
    
    try {
      // Step 1: Add domain
      addResponse('Step 1: Adding domain...')
      const domainResponse = await fetch(`https://www.secureserver.net/api/v1/cart/${plid}?redirect=false`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          items: [
            {
              id: 'domain',
              domain: `flickmaxtest${Date.now()}.com`
            }
          ],
          currencyType: currency,
          marketId: country.marketId || 'en-US',
          redirect: false
        })
      })
      
      const domainData = await domainResponse.json()
      addResponse(`Domain Response: ${JSON.stringify(domainData, null, 2)}`)
      
      if (domainData.error) {
        addResponse(`❌ Domain addition failed: ${domainData.error.message}`)
        return
      }
      
      // Wait a bit to ensure session is established
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Step 2: Add hosting
      addResponse('Step 2: Adding hosting to same cart...')
      const hostingResponse = await fetch(`https://www.secureserver.net/api/v1/cart/${plid}?redirect=false`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          items: [
            {
              id: 'cpanel-starter'
            }
          ],
          currencyType: currency,
          marketId: country.marketId || 'en-US',
          redirect: false
        })
      })
      
      const hostingData = await hostingResponse.json()
      addResponse(`Hosting Response: ${JSON.stringify(hostingData, null, 2)}`)
      
      if (hostingData.cartCount) {
        addResponse(`✅ Success! Final cart count: ${hostingData.cartCount}`)
        addResponse(`Checkout URL: ${hostingData.nextStepUrl || 'https://cart.secureserver.net/?plid=' + plid}`)
      }
    } catch (error) {
      addResponse(`❌ Error: ${error}`)
    } finally {
      setLoading(false)
    }
  }
  
  // Test adding both in single call
  const testAddBothTogether = async () => {
    setLoading(true)
    addResponse('Starting combined addition test...')
    
    try {
      const response = await fetch(`https://www.secureserver.net/api/v1/cart/${plid}?redirect=false`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          items: [
            {
              id: 'domain',
              domain: `flickmaxtest${Date.now()}.com`
            },
            {
              id: 'cpanel-starter'
            }
          ],
          currencyType: currency,
          marketId: country.marketId || 'en-US',
          redirect: false
        })
      })
      
      const data = await response.json()
      addResponse(`Combined API Response: ${JSON.stringify(data, null, 2)}`)
      
      if (data.cartCount) {
        addResponse(`✅ Success! Cart count: ${data.cartCount}`)
      } else if (data.error) {
        addResponse(`❌ Error: ${data.error.message || JSON.stringify(data.error)}`)
      }
    } catch (error) {
      addResponse(`❌ Error: ${error}`)
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Cart API Test Page</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Controls</h2>
          <p className="text-sm text-gray-600 mb-4">
            Current settings: Currency={currency}, Market={country.marketId || 'en-US'}, PLID={plid}
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={testAddDomain}
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
            >
              Add Domain Only
            </button>
            
            <button
              onClick={testAddHosting}
              disabled={loading}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400"
            >
              Add Hosting Only
            </button>
            
            <button
              onClick={testAddBothSequentially}
              disabled={loading}
              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:bg-gray-400"
            >
              Add Both (Sequential)
            </button>
            
            <button
              onClick={testAddBothTogether}
              disabled={loading}
              className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:bg-gray-400"
            >
              Add Both (Together)
            </button>
          </div>
          
          <button
            onClick={clearResponses}
            className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Clear Responses
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">API Responses</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm overflow-x-auto">
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
          <h3 className="font-semibold text-yellow-800 mb-2">Testing Instructions:</h3>
          <ol className="list-decimal list-inside text-sm text-yellow-700 space-y-1">
            <li>Test each button in order</li>
            <li>Check if cookies are being set (inspect DevTools &gt; Application &gt; Cookies)</li>
            <li>Test in both normal and incognito/private browsing modes</li>
            <li>Note which approaches work and which fail</li>
            <li>The "Sequential" approach adds domain first, waits, then adds hosting</li>
          </ol>
        </div>
      </div>
    </div>
  )
}