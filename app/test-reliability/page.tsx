'use client'

import { useState } from 'react'
import { useDomainSearch } from '@/hooks/useDomainSearch'

export default function TestReliabilityPage() {
  const [query, setQuery] = useState('')
  const { search, isSearching, searchResults, suggestions, error, reset } = useDomainSearch()

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    await search(query)
  }

  const simulateAPIFailure = async () => {
    // Search for a domain that might trigger different scenarios
    await search('test-domain-' + Date.now())
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Domain Search Reliability Test</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Domain Search</h2>
          
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Domain Query
              </label>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="example.com"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isSearching}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
              >
                {isSearching ? 'Searching...' : 'Search Domain'}
              </button>
              
              <button
                type="button"
                onClick={simulateAPIFailure}
                disabled={isSearching}
                className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-gray-400"
              >
                Test Random Domain
              </button>
              
              <button
                type="button"
                onClick={reset}
                className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                Reset
              </button>
            </div>
          </form>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <h3 className="text-red-800 font-semibold mb-2">Error</h3>
            <p className="text-red-700">{error}</p>
            <p className="text-sm text-red-600 mt-2">
              This error is now properly handled without fallback mock data.
            </p>
          </div>
        )}

        {/* Search Results */}
        {searchResults && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Search Results</h3>
            
            <div className="space-y-4">
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
          </div>
        )}

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Suggestions</h3>
            
            <div className="grid grid-cols-2 gap-4">
              {suggestions.map((suggestion, index) => (
                <div key={index} className="border rounded-lg p-3">
                  <p className="font-medium">{suggestion.domain}</p>
                  <p className={`text-sm ${suggestion.available ? 'text-green-600' : 'text-red-600'}`}>
                    {suggestion.available ? 'Available' : 'Not Available'}
                  </p>
                  {suggestion.listPrice && (
                    <p className="text-sm text-gray-600 mt-1">
                      {suggestion.listPrice}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reliability Info */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2">Reliability Improvements</h3>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li>✅ Removed fallback mock data - no more misleading results</li>
            <li>✅ Added retry mechanism with exponential backoff (3 retries)</li>
            <li>✅ Improved error messages for different failure scenarios</li>
            <li>✅ Proper error handling in frontend components</li>
            <li>✅ Validates API responses before using them</li>
          </ul>
        </div>
      </div>
    </div>
  )
}