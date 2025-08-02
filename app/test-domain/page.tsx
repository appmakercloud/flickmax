'use client'

import { useState } from 'react'
import { useDomainSearch } from '@/hooks/useDomainSearch'
import { useCountry } from '@/contexts/CountryContext'

export default function TestDomainPage() {
  const [domain, setDomain] = useState('')
  const { country, currency } = useCountry()
  const { search, isSearching, searchResults, suggestions, error, reset } = useDomainSearch()

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    await search(domain)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Domain Search Test</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <p className="mb-4">Current Country: {country.name} ({country.flag})</p>
          <p className="mb-4">Currency: {currency}</p>
        </div>

        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-4">
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="Enter domain name (e.g., example or example.com)"
              className="flex-1 px-4 py-2 border rounded-lg"
            />
            <button
              type="submit"
              disabled={isSearching}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isSearching ? 'Searching...' : 'Search'}
            </button>
            <button
              type="button"
              onClick={reset}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Reset
            </button>
          </div>
        </form>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {searchResults && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Search Result</h2>
            <div className="space-y-2">
              <p>Domain: {searchResults.domain}</p>
              <p>Available: {searchResults.available ? 'Yes' : 'No'}</p>
              {searchResults.listPrice && <p>List Price: {currency} {searchResults.listPrice}</p>}
              {searchResults.salePrice && <p>Sale Price: {currency} {searchResults.salePrice}</p>}
            </div>
          </div>
        )}

        {suggestions.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Suggestions</h2>
            <div className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded">
                  <p>Domain: {suggestion.domain}</p>
                  <p>Available: {suggestion.available ? 'Yes' : 'No'}</p>
                  {suggestion.listPrice && <p>List Price: {suggestion.currency} {suggestion.listPrice}</p>}
                  {suggestion.salePrice && <p>Sale Price: {suggestion.currency} {suggestion.salePrice}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}