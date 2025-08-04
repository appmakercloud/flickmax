'use client'

import { useState } from 'react'
import { useDomainSearch } from '@/hooks/useDomainSearch'

export default function TestGoDaddyAuthPage() {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<string[]>([])
  const { search, isSearching, searchResults, suggestions, error, reset } = useDomainSearch()

  const addStatus = (message: string) => {
    setStatus(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`])
  }

  const handleTestAuth = async () => {
    addStatus('Starting GoDaddy API authentication test...')
    
    try {
      // Test with a simple domain search
      addStatus('Testing domain search for "test.com"...')
      await search('test.com')
      
      if (searchResults) {
        addStatus('✅ Authentication successful!')
        addStatus(`Found domain: ${searchResults.domain} - Available: ${searchResults.available}`)
      }
    } catch (err) {
      addStatus(`❌ Authentication failed: ${err instanceof Error ? err.message : 'Unknown error'}`)
    }
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    addStatus(`Searching for domain: ${query}`)
    await search(query)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">GoDaddy API Authentication Test</h1>
        
        {/* Status Box */}
        <div className="bg-black text-green-400 rounded-lg p-4 mb-6 font-mono text-sm h-64 overflow-y-auto">
          <div className="whitespace-pre-wrap">
            {status.length === 0 ? 'Ready to test GoDaddy API authentication...' : status.join('\n')}
          </div>
        </div>

        {/* Test Authentication Button */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Authentication</h2>
          <button
            onClick={handleTestAuth}
            disabled={isSearching}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
          >
            {isSearching ? 'Testing...' : 'Test GoDaddy API Authentication'}
          </button>
        </div>

        {/* Domain Search Test */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Domain Search Test</h2>
          
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Domain Name
              </label>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="example.com"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <button
              type="submit"
              disabled={isSearching}
              className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-400"
            >
              {isSearching ? 'Searching...' : 'Search Domain'}
            </button>
          </form>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <h3 className="text-red-800 font-semibold mb-2">Error</h3>
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Search Results */}
        {searchResults && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Search Results</h3>
            
            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{searchResults.domain}</p>
                  <p className={`text-sm ${searchResults.available ? 'text-green-600' : 'text-red-600'}`}>
                    {searchResults.available ? 'Available' : 'Not Available'}
                  </p>
                </div>
                {searchResults.listPrice && (
                  <p className="text-lg font-semibold">
                    {searchResults.listPrice}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* API Configuration Info */}
        <div className="bg-yellow-50 rounded-lg p-6 mt-8">
          <h3 className="text-lg font-semibold mb-2">⚠️ Important Security Notice</h3>
          <p className="text-sm text-gray-700 mb-4">
            Never share your GoDaddy API credentials publicly. If you've accidentally exposed them:
          </p>
          <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
            <li>Log into your GoDaddy account immediately</li>
            <li>Revoke the current API keys</li>
            <li>Generate new API credentials</li>
            <li>Update your .env.local file with the new credentials</li>
          </ol>
          
          <div className="mt-4 p-3 bg-yellow-100 rounded">
            <p className="text-sm font-mono">
              PLID: {process.env.NEXT_PUBLIC_GODADDY_PLID || '590175'}<br/>
              API Base URL: https://www.secureserver.net/api/v1
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}