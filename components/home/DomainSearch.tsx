'use client'

import { useState } from 'react'
import { Search, ShoppingCart, Check, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { validateDomain } from '@/lib/utils'
import { useDomainSearch } from '@/hooks/useDomainSearch'
import { useCountry } from '@/contexts/CountryContext'

const popularExtensions = [
  '.COM', '.COM.AU', '.COM.BR', '.COM.BZ', '.COM.CO', 
  '.COM.ES', '.COM.MX', '.COM.TW', '.COMMUNITY', '.COMPANY',
  '.COMPUTER', '.IN', '.NET', '.STORE', '.WEBSITE'
]

const domainPricing = [
  { tld: '.CLUB', price: 17.99, tagline: 'JOIN THE CLUB' },
  { tld: '.COM', price: 11.99, tagline: 'ALWAYS AFFORDABLE AT', special: true },
  { tld: '.DEV', price: 17.99, tagline: 'FOR THE DEV!' },
  { tld: '.WEBSITE', price: 23.99, tagline: 'THE GENERIC ONE' },
]

export default function DomainSearch() {
  const [domainSearch, setDomainSearch] = useState('')
  const [autoSearch, setAutoSearch] = useState(true)
  const [rememberSearch, setRememberSearch] = useState(true)
  const { currency } = useCountry()
  const { search, reset, isSearching, searchResults, suggestions, error } = useDomainSearch()

  const handleDomainSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!domainSearch.trim()) {
      toast.error('Please enter a domain name')
      return
    }

    const domain = domainSearch.trim()
    
    // Allow searching for just the domain name or full domain with extension
    if (!domain.includes('.')) {
      // If no extension, search for the name and show suggestions
      await search(domain)
    } else {
      // If extension included, validate and search for exact domain
      if (!validateDomain(domain)) {
        toast.error('Please enter a valid domain name')
        return
      }
      await search(domain)
    }
  }

  const handleAddToCart = (domain: string, price?: number) => {
    toast.success(`${domain} added to cart`)
  }

  const handleCloseResults = () => {
    reset()
  }

  const formatPrice = (listPrice?: string | number, salePrice?: string | number) => {
    const price = salePrice || listPrice
    if (!price) return 'Contact us'
    
    // If price is already a formatted string (e.g., "$13.99"), return it with /y
    if (typeof price === 'string') {
      // Remove any existing /y or /year suffix and add /y
      return price.replace(/\/(y|year)$/i, '') + '/y'
    }
    
    // If price is a number, format it
    const symbol = currency === 'INR' ? '₹' : currency === 'EUR' ? '€' : '$'
    return `${symbol}${price.toFixed(2)}/y`
  }
  
  const extractPriceValue = (price?: string | number): number | undefined => {
    if (!price) return undefined
    if (typeof price === 'number') return price
    // Extract numeric value from string like "$13.99"
    const match = price.match(/[\d.]+/)
    return match ? parseFloat(match[0]) : undefined
  }

  return (
    <section className="geometric-pattern min-h-[600px] relative">{/* Restored modern blue geometric pattern background */}
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-12 tracking-tight">
            SECURE YOUR IDEAL DOMAIN AT<br />UNBEATABLE PRICES
          </h1>

          {/* Domain Search Bar */}
          <form onSubmit={handleDomainSearch} className="max-w-3xl mx-auto mb-8">
            <div className="flex">
              <input
                type="text"
                value={domainSearch}
                onChange={(e) => setDomainSearch(e.target.value)}
                placeholder="SMPLENAME.COM"
                className="flex-1 px-6 py-4 text-lg bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-l-lg"
              />
              <button
                type="submit"
                disabled={isSearching}
                className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold uppercase transition-all duration-300 rounded-r-lg min-w-[140px]"
              >
                {isSearching ? (
                  <Search className="h-5 w-5 animate-spin mx-auto" />
                ) : (
                  'SEARCH'
                )}
              </button>
            </div>
          </form>

          {/* Popular Extensions */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {['.COM', '.NET', '.STORE', '.WEBSITE', '.IN'].map((ext) => (
              <button
                key={ext}
                onClick={() => {
                  const sld = domainSearch.split('.')[0] || 'example'
                  setDomainSearch(sld + ext.toLowerCase())
                  if (autoSearch && sld) {
                    handleDomainSearch({ preventDefault: () => {} } as React.FormEvent)
                  }
                }}
                className={`px-5 py-2 font-medium transition-all duration-300 ${
                  ext === '.COM'
                    ? 'bg-purple-600 text-white hover:bg-purple-700'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {ext}
              </button>
            ))}
          </div>

          {/* Auto Search Toggle */}
          <div className="flex justify-end max-w-3xl mx-auto">
            <button 
              onClick={() => setAutoSearch(!autoSearch)}
              className={`${
                autoSearch ? 'bg-gray-600' : 'bg-gray-700'
              } text-white text-xs px-4 py-1.5 rounded-full font-medium transition-colors uppercase`}
            >
              AUTO SEARCH {autoSearch ? 'OFF' : 'ON'}
            </button>
          </div>

          {/* Search Results - Inline Display */}
          {searchResults && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-5xl mx-auto mt-8"
            >
              <div className="bg-white rounded-lg shadow-xl p-6 relative">
                {/* Remember This & Close Button */}
                <div className="absolute top-4 right-4 flex items-center gap-4">
                  <label className="flex items-center gap-2 text-sm text-gray-600">
                    <input
                      type="checkbox"
                      checked={rememberSearch}
                      onChange={(e) => setRememberSearch(e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    remember this
                  </label>
                  <button
                    onClick={handleCloseResults}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Main Search Result */}
                <div className="mb-6">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                      {searchResults.available ? (
                        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                          <Check className="h-8 w-8 text-white" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                          <X className="h-8 w-8 text-white" />
                        </div>
                      )}
                      <div>
                        <h3 className="text-2xl font-bold text-gray-800">
                          {searchResults.domain}
                        </h3>
                        <span className={`inline-block px-3 py-1 rounded text-sm font-medium ${
                          searchResults.available 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {searchResults.available ? 'Available' : 'Not Available'}
                        </span>
                      </div>
                    </div>
                    {searchResults.available && (searchResults.listPrice || searchResults.salePrice) && (
                      <div className="flex items-center gap-4">
                        <span className="text-2xl font-bold text-gray-800">
                          {formatPrice(searchResults.listPrice, searchResults.salePrice)}
                        </span>
                        <button
                          onClick={() => handleAddToCart(searchResults.domain, extractPriceValue(searchResults.salePrice || searchResults.listPrice))}
                          className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold"
                        >
                          <ShoppingCart className="h-5 w-5" />
                          ADD TO CART
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Suggestions */}
                {suggestions.length > 0 && (
                  <>
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Other suggestions:</h3>
                    <div className="flex flex-wrap gap-2">
                      {suggestions.map((suggestion) => (
                        <button
                          key={suggestion.domain}
                          onClick={() => {
                            if (suggestion.available) {
                              handleAddToCart(suggestion.domain, extractPriceValue(suggestion.salePrice || suggestion.listPrice))
                            }
                          }}
                          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            suggestion.available
                              ? 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                              : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                          }`}
                          disabled={!suggestion.available}
                        >
                          {suggestion.domain}
                          {suggestion.available && (suggestion.listPrice || suggestion.salePrice) && (
                            <span className="ml-2 text-sm text-gray-600">
                              {formatPrice(suggestion.listPrice, suggestion.salePrice)}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}

          {/* Loading State */}
          {isSearching && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="max-w-5xl mx-auto mt-8"
            >
              <div className="bg-white rounded-lg shadow-xl p-12 text-center">
                <Search className="h-12 w-12 animate-spin mx-auto text-purple-600 mb-4" />
                <p className="text-gray-600">Searching for available domains...</p>
              </div>
            </motion.div>
          )}

          {/* Error State */}
          {error && !isSearching && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="max-w-5xl mx-auto mt-8"
            >
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                {error}
              </div>
            </motion.div>
          )}

          {/* Domain Pricing Cards */}
          {!searchResults && !isSearching && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto mt-16">
              {domainPricing.map((domain, index) => (
                <motion.div
                  key={domain.tld}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 text-center border border-gray-700"
                >
                  <h3 className="text-xl font-bold text-white mb-2">
                    {domain.tld} - ${domain.price}
                  </h3>
                  <p className="text-gray-400 text-sm uppercase">
                    {domain.tagline} {domain.special && <span className="text-orange-500 font-bold">FX</span>}
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}