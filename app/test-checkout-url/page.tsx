'use client'

import { useState } from 'react'
import { useCountry } from '@/contexts/CountryContext'

export default function TestCheckoutURL() {
  const [domain, setDomain] = useState('testdomain123.com')
  const [product, setProduct] = useState('cpanel-starter')
  const { currency, country } = useCountry()
  const plid = process.env.NEXT_PUBLIC_PLID || '590175'
  
  // Generate different URL variations
  const urls = {
    domainOnly: `https://cart.secureserver.net/go/checkout/?plid=${plid}&domainToCheck=${domain}`,
    
    hostingOnly: `https://cart.secureserver.net/go/checkout/?plid=${plid}&items=${product}`,
    
    bothSimple: `https://cart.secureserver.net/go/checkout/?plid=${plid}&domainToCheck=${domain}&items=${product}`,
    
    bothWithCurrency: `https://cart.secureserver.net/go/checkout/?plid=${plid}&domainToCheck=${domain}&items=${product}&currencyType=${currency}`,
    
    bothFull: `https://cart.secureserver.net/go/checkout/?plid=${plid}&domainToCheck=${domain}&items=${product}&currencyType=${currency}&marketId=${country.marketId || 'en-US'}`,
    
    // Alternative formats
    domainAsItem: `https://cart.secureserver.net/go/checkout/?plid=${plid}&items=domain:${domain}&items=${product}`,
    
    withQuantity: `https://cart.secureserver.net/go/checkout/?plid=${plid}&domainToCheck=${domain}&items=${product}&qty=1`,
    
    // Test with redirect parameter
    withRedirect: `https://cart.secureserver.net/go/checkout/?plid=${plid}&domainToCheck=${domain}&items=${product}&redirect=true`,
    
    // Old API format for comparison
    oldApiFormat: `https://www.secureserver.net/api/v1/cart/${plid}/?redirect=true&plid=${plid}&currencyType=${currency}`,
  }
  
  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url)
    alert('URL copied to clipboard!')
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Checkout URL Test Page</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Configuration</h2>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">Domain Name</label>
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="Enter domain name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Product ID</label>
              <input
                type="text"
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="Enter product ID"
              />
            </div>
          </div>
          <p className="text-sm text-gray-600">
            Current: PLID={plid}, Currency={currency}, Market={country.marketId || 'en-US'}
          </p>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">Test URLs - Click to Test</h2>
          
          {Object.entries(urls).map(([key, url]) => (
            <div key={key} className="bg-white rounded-lg shadow p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => copyToClipboard(url)}
                    className="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600"
                  >
                    Copy
                  </button>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Test →
                  </a>
                </div>
              </div>
              <code className="text-xs text-gray-600 break-all block bg-gray-100 p-2 rounded">
                {url}
              </code>
            </div>
          ))}
        </div>
        
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="font-semibold text-yellow-800 mb-3">Testing Instructions</h3>
          <ol className="list-decimal list-inside text-sm text-yellow-700 space-y-2">
            <li>Start with "Domain Only" to verify domain checkout works</li>
            <li>Test "Hosting Only" to verify product checkout works</li>
            <li>Try "Both Simple" first - this is most likely to work</li>
            <li>If "Both Simple" fails, try the other variations</li>
            <li>Test in both normal and private browsing modes</li>
            <li>Note which URLs successfully add both items to cart</li>
            <li>Check the final checkout page to see if both items appear</li>
          </ol>
          
          <div className="mt-4 p-4 bg-yellow-100 rounded">
            <p className="text-sm font-semibold text-yellow-800 mb-2">Expected Success Indicators:</p>
            <ul className="list-disc list-inside text-sm text-yellow-700">
              <li>Domain appears in checkout with price</li>
              <li>Hosting plan appears in checkout with price</li>
              <li>Total shows sum of both items</li>
              <li>Works in both browser modes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}