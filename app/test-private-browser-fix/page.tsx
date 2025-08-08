'use client'

import { useState } from 'react'

export default function TestPrivateBrowserFix() {
  const [responses, setResponses] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
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
  
  // Method 1: Form submission with all items (works in private browsing)
  const checkoutWithForm = () => {
    addToLog('Creating checkout form with all items...')
    
    // Create form that submits all items at checkout time
    const form = document.createElement('form')
    form.method = 'POST'
    form.action = `https://www.secureserver.net/api/v1/cart/${plid}/`
    form.target = '_blank'
    
    // Add redirect parameter to go to checkout
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
    
    // Add domain item
    const domainIdInput = document.createElement('input')
    domainIdInput.type = 'hidden'
    domainIdInput.name = 'items[0][id]'
    domainIdInput.value = 'domain'
    form.appendChild(domainIdInput)
    
    const domainNameInput = document.createElement('input')
    domainNameInput.type = 'hidden'
    domainNameInput.name = 'items[0][domain]'
    domainNameInput.value = 'example789.com'
    form.appendChild(domainNameInput)
    
    // Add hosting item
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
    
    // Submit form
    document.body.appendChild(form)
    form.submit()
    document.body.removeChild(form)
    
    addToLog('Form submitted with all items')
  }
  
  // Method 2: Sequential submission (domain then hosting)
  const checkoutSequential = () => {
    addToLog('Submitting domain first, then hosting...')
    
    // First submit domain
    const domainForm = document.createElement('form')
    domainForm.method = 'POST'
    domainForm.action = `https://www.secureserver.net/api/v1/cart/${plid}/`
    domainForm.target = 'checkout_window'
    
    // Domain inputs
    const domainRedirect = document.createElement('input')
    domainRedirect.type = 'hidden'
    domainRedirect.name = 'redirect'
    domainRedirect.value = '0' // Don't redirect yet
    domainForm.appendChild(domainRedirect)
    
    const domainPlid = document.createElement('input')
    domainPlid.type = 'hidden'
    domainPlid.name = 'plid'
    domainPlid.value = plid
    domainForm.appendChild(domainPlid)
    
    const domainId = document.createElement('input')
    domainId.type = 'hidden'
    domainId.name = 'items[0][id]'
    domainId.value = 'domain'
    domainForm.appendChild(domainId)
    
    const domainName = document.createElement('input')
    domainName.type = 'hidden'
    domainName.name = 'items[0][domain]'
    domainName.value = 'example456.com'
    domainForm.appendChild(domainName)
    
    // Open window for checkout
    const checkoutWindow = window.open('', 'checkout_window')
    
    // Submit domain form
    document.body.appendChild(domainForm)
    domainForm.submit()
    document.body.removeChild(domainForm)
    
    // Wait a bit then submit hosting
    setTimeout(() => {
      addToLog('Now submitting hosting...')
      
      const hostingForm = document.createElement('form')
      hostingForm.method = 'POST'
      hostingForm.action = `https://www.secureserver.net/api/v1/cart/${plid}/`
      hostingForm.target = 'checkout_window'
      
      // Hosting inputs with redirect
      const hostingRedirect = document.createElement('input')
      hostingRedirect.type = 'hidden'
      hostingRedirect.name = 'redirect'
      hostingRedirect.value = '1' // Now redirect to checkout
      hostingForm.appendChild(hostingRedirect)
      
      const hostingPlid = document.createElement('input')
      hostingPlid.type = 'hidden'
      hostingPlid.name = 'plid'
      hostingPlid.value = plid
      hostingForm.appendChild(hostingPlid)
      
      const hostingId = document.createElement('input')
      hostingId.type = 'hidden'
      hostingId.name = 'items[0][id]'
      hostingId.value = 'cpanel-economy'
      hostingForm.appendChild(hostingId)
      
      const hostingQty = document.createElement('input')
      hostingQty.type = 'hidden'
      hostingQty.name = 'items[0][quantity]'
      hostingQty.value = '1'
      hostingForm.appendChild(hostingQty)
      
      const hostingPeriod = document.createElement('input')
      hostingPeriod.type = 'hidden'
      hostingPeriod.name = 'items[0][period]'
      hostingPeriod.value = '12'
      hostingForm.appendChild(hostingPeriod)
      
      const hostingPeriodUnit = document.createElement('input')
      hostingPeriodUnit.type = 'hidden'
      hostingPeriodUnit.name = 'items[0][periodUnit]'
      hostingPeriodUnit.value = 'MONTH'
      hostingForm.appendChild(hostingPeriodUnit)
      
      // Submit hosting form
      document.body.appendChild(hostingForm)
      hostingForm.submit()
      document.body.removeChild(hostingForm)
      
      addToLog('Both items submitted')
    }, 1000)
  }
  
  // Method 3: Direct checkout URL with query parameters
  const checkoutWithQueryParams = () => {
    addToLog('Opening checkout with query parameters...')
    
    // Build checkout URL with all items as query parameters
    const params = new URLSearchParams({
      plid: plid,
      'items[0][id]': 'domain',
      'items[0][domain]': 'example123.com',
      'items[1][id]': 'cpanel-economy',
      'items[1][quantity]': '1',
      'items[1][period]': '12',
      'items[1][periodUnit]': 'MONTH'
    })
    
    const checkoutUrl = `https://cart.secureserver.net/go/checkout?${params.toString()}`
    window.open(checkoutUrl, '_blank')
    
    addToLog('Opened checkout with query params')
  }
  
  const clearLog = () => {
    setResponses([])
  }
  
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Private Browser Fix Testing</h1>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-yellow-900 mb-2">⚠️ Private Browser Issue:</h3>
          <p className="text-sm text-yellow-800">
            In private browsing, cookies aren't persisted between API calls, so the cart appears empty at checkout.
            These methods bypass the cookie requirement by submitting all items at checkout time.
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Solutions for Private Browsing</h2>
          <div className="grid grid-cols-1 gap-4">
            <button
              onClick={checkoutWithForm}
              className="px-4 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Method 1: Form Submission (All Items Together)
            </button>
            
            <button
              onClick={checkoutSequential}
              className="px-4 py-3 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Method 2: Sequential Submission (Domain → Hosting)
            </button>
            
            <button
              onClick={checkoutWithQueryParams}
              className="px-4 py-3 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              Method 3: Direct Checkout URL
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
          <h2 className="text-xl font-semibold mb-4">Response Log</h2>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {responses.length === 0 ? (
              <p className="text-gray-500">Click a method above to test.</p>
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
      </div>
    </div>
  )
}