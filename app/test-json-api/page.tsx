'use client'

import { useState } from 'react'

export default function TestJsonApi() {
  const [responses, setResponses] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  
  const plid = process.env.NEXT_PUBLIC_PLID || '590175'
  
  const addToLog = (message: string, data?: any) => {
    setResponses(prev => [...prev, {
      time: new Date().toISOString(),
      message,
      data
    }])
  }
  
  // Test 1: Add domain via JSON API
  const testAddDomain = async () => {
    setLoading(true)
    addToLog('Testing add domain via JSON API...')
    
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
            domain: 'testdomain123.com'
          }],
          redirect: '0',
          plid: plid,
          currencyType: 'USD',
          marketId: 'en-US'
        })
      })
      
      const data = await response.json()
      addToLog(`Domain API Response (${response.status}):`, data)
    } catch (error) {
      addToLog('Domain API Error:', error)
    }
    
    setLoading(false)
  }
  
  // Test 2: Add hosting via JSON API
  const testAddHosting = async () => {
    setLoading(true)
    addToLog('Testing add hosting via JSON API...')
    
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
          plid: plid,
          currencyType: 'USD',
          marketId: 'en-US'
        })
      })
      
      const data = await response.json()
      addToLog(`Hosting API Response (${response.status}):`, data)
    } catch (error) {
      addToLog('Hosting API Error:', error)
    }
    
    setLoading(false)
  }
  
  // Test 3: Add both domain + hosting
  const testAddBoth = async () => {
    setLoading(true)
    addToLog('Testing add domain + hosting via JSON API...')
    
    try {
      const response = await fetch(`https://www.secureserver.net/api/v1/cart/${plid}/`, {
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
              domain: 'testdomain456.com'
            },
            {
              id: 'cpanel-economy',
              quantity: 1,
              period: 12,
              periodUnit: 'MONTH'
            }
          ],
          redirect: '0',
          plid: plid,
          currencyType: 'USD',
          marketId: 'en-US'
        })
      })
      
      const data = await response.json()
      addToLog(`Both Items API Response (${response.status}):`, data)
    } catch (error) {
      addToLog('Both Items API Error:', error)
    }
    
    setLoading(false)
  }
  
  // Test 4: Test intersite-sync
  const testIntersiteSync = async () => {
    setLoading(true)
    addToLog('Testing intersite-sync API...')
    
    try {
      const checkoutUrl = `https://cart.secureserver.net/go/checkout?pl_id=${plid}`
      const response = await fetch(`https://www.secureserver.net/api/v1/intersite-sync?plid=${plid}&redirect=${encodeURIComponent(checkoutUrl)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          cust_idp: 'test',
          info_cust_idp: 'test'
        })
      })
      
      const data = await response.text()
      addToLog(`Intersite-sync Response (${response.status}):`, data)
    } catch (error) {
      addToLog('Intersite-sync Error:', error)
    }
    
    setLoading(false)
  }
  
  // Test 5: Check cart status
  const checkCartStatus = async () => {
    setLoading(true)
    addToLog('Checking cart status...')
    
    try {
      const response = await fetch(`https://www.secureserver.net/api/v1/cart/${plid}/`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        credentials: 'include'
      })
      
      const data = await response.json()
      addToLog(`Cart Status Response (${response.status}):`, data)
    } catch (error) {
      addToLog('Cart Status Error:', error)
    }
    
    setLoading(false)
  }
  
  const clearLog = () => {
    setResponses([])
  }
  
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Test JSON API Methods</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
              onClick={testAddBoth}
              disabled={loading}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
            >
              Add Both
            </button>
            
            <button
              onClick={testIntersiteSync}
              disabled={loading}
              className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 disabled:opacity-50"
            >
              Test Intersite-sync
            </button>
            
            <button
              onClick={checkCartStatus}
              disabled={loading}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50"
            >
              Check Cart
            </button>
            
            <button
              onClick={clearLog}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Clear Log
            </button>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">API Responses</h2>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {responses.length === 0 ? (
              <p className="text-gray-500">No responses yet. Click a test button above.</p>
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
          <h3 className="font-semibold text-blue-900 mb-2">Test Instructions:</h3>
          <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
            <li>Test in both normal and private browsing modes</li>
            <li>Check console for any CORS errors</li>
            <li>Verify cookies are being set</li>
            <li>Test adding items individually first, then together</li>
          </ul>
        </div>
      </div>
    </div>
  )
}