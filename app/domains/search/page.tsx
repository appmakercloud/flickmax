'use client'

import { useState, useRef, useEffect, Suspense } from 'react'
import { Search, ShoppingCart, Check, X, Info, Shield, TrendingUp, Loader2, Star, Zap, Award, Globe, Lock, ArrowRight, Sparkles, AtSign, Mail, Server, Cloud, Activity } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { validateDomain } from '@/lib/utils'
import { useDomainSearch } from '@/hooks/useDomainSearch'
import { useDomainBundle } from '@/hooks/useDomainBundle'
import { useCountry } from '@/contexts/CountryContext'
import { useCart } from '@/contexts/CartContext'
import { PriceDisplay } from '@/components/ui/PriceDisplay'

const popularDomains = [
  '.com', '.net', '.org', '.co', '.io', '.ai', '.app', '.dev'
]

function DomainSearchPageContent() {
  const [domainSearch, setDomainSearch] = useState('')
  const [selectedBundleDomains, setSelectedBundleDomains] = useState<string[]>([])
  const [showBundleInfo, setShowBundleInfo] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 })
  const { currency, locale } = useCountry()
  const { search, reset, isSearching, searchResults, suggestions, error } = useDomainSearch()
  const { bundleData, loading: bundleLoading } = useDomainBundle(searchResults?.domain || '', currency)
  const { addDomainToCart, isLoading: isAddingToCart } = useCart()
  const searchResultsRef = useRef<HTMLDivElement>(null)
  const [addingDomains, setAddingDomains] = useState<Set<string>>(new Set())

  // Format currency helper
  const formatCurrency = (amount: number | string, curr: string = 'USD') => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount
    const symbol = curr === 'INR' ? '₹' : curr === 'EUR' ? '€' : curr === 'GBP' ? '£' : '$'
    return `${symbol}${numAmount.toFixed(2)}`
  }

  // Track mouse position for interactive background
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100
      const y = (e.clientY / window.innerHeight) * 100
      setMousePosition({ x, y })
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const handleDomainSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!domainSearch.trim()) {
      toast.error('Please enter a domain name')
      return
    }

    const domain = domainSearch.trim()
    
    if (!domain.includes('.')) {
      await search(domain)
    } else {
      if (!validateDomain(domain)) {
        toast.error('Please enter a valid domain name')
        return
      }
      await search(domain)
    }
  }

  const handleAddToCart = async (domain: string, productId: string) => {
    try {
      setAddingDomains(prev => new Set(prev).add(domain))
      await addDomainToCart(domain, productId)
    } catch (error) {
      // Error handled by useCart hook
    } finally {
      setAddingDomains(prev => {
        const newSet = new Set(prev)
        newSet.delete(domain)
        return newSet
      })
    }
  }

  const handleBundleToggle = (domain: string) => {
    setSelectedBundleDomains(prev => {
      if (prev.includes(domain)) {
        return prev.filter(d => d !== domain)
      } else {
        return [...prev, domain]
      }
    })
  }

  const handleAddBundleToCart = async () => {
    if (selectedBundleDomains.length === 0 || !bundleData) return
    
    try {
      setAddingDomains(new Set(selectedBundleDomains))
      
      // Add each selected bundle domain to cart
      // Since bundle API doesn't return productIds, we need to search for each domain
      for (const domainName of selectedBundleDomains) {
        try {
          // Search for the domain to get its productId
          const { searchDomainExact } = await import('@/lib/api/domain')
          const searchResult = await searchDomainExact(domainName, currency || 'USD', locale)
          
          if (searchResult.exactMatchDomain && searchResult.exactMatchDomain.productId) {
            await addDomainToCart(domainName, String(searchResult.exactMatchDomain.productId))
          } else {
            console.warn(`Could not find product ID for ${domainName}`)
          }
        } catch (err) {
          console.error(`Failed to add ${domainName} to cart:`, err)
        }
      }
      
      // Clear selections after successful add
      setSelectedBundleDomains([])
      toast.success(`Added ${selectedBundleDomains.length} domains to cart!`)
    } catch (error) {
      toast.error('Failed to add bundle to cart')
    } finally {
      setAddingDomains(new Set())
    }
  }

  const calculateBundlePrice = () => {
    if (!bundleData) return '0.00'
    
    // If we have selected domains, calculate their total
    if (selectedBundleDomains.length > 0) {
      const selectedTotal = bundleData.domains
        .filter(d => selectedBundleDomains.includes(d.domain))
        .reduce((sum, d) => {
          const price = d.price?.sale || d.price?.list || 0
          return sum + Number(price)
        }, 0)
      return Number(selectedTotal).toFixed(2)
    }
    
    // Otherwise show total bundle price
    const totalPrice = bundleData.totalPrice.sale || bundleData.totalPrice.list || 0
    return Number(totalPrice).toFixed(2)
  }

  const getBundleSavings = () => {
    if (!bundleData || selectedBundleDomains.length === 0) return '0'
    
    const selectedDomains = bundleData.domains.filter(d => selectedBundleDomains.includes(d.domain))
    const listTotal = selectedDomains.reduce((sum, d) => sum + Number(d.price?.list || 0), 0)
    const saleTotal = selectedDomains.reduce((sum, d) => sum + Number(d.price?.sale || d.price?.list || 0), 0)
    
    const savings = listTotal - saleTotal
    return Number(savings).toFixed(2)
  }

  const handleQuickExtension = (extension: string) => {
    const sld = domainSearch.split('.')[0] || 'example'
    setDomainSearch(sld + extension)
  }

  // Auto-scroll to search results when they appear
  useEffect(() => {
    if (searchResults && searchResultsRef.current) {
      setTimeout(() => {
        const element = searchResultsRef.current
        if (!element) return
        
        const elementRect = element.getBoundingClientRect()
        const absoluteElementTop = elementRect.top + window.pageYOffset
        const middle = absoluteElementTop - (window.innerHeight / 3)
        
        window.scrollTo({
          top: middle > 0 ? middle : 0,
          behavior: 'smooth'
        })
      }, 100)
    }
  }, [searchResults])

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Hero Section with Light Gradient Background */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-cyan-50 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(59, 130, 246, 0.08), transparent 50%)`,
            }}
          />
          {/* Grid Pattern */}
          <div className="absolute inset-0 opacity-[0.03]">
            <div 
              className="absolute inset-0"
              style={{
                backgroundImage: `linear-gradient(to right, #3b82f6 1px, transparent 1px), linear-gradient(to bottom, #3b82f6 1px, transparent 1px)`,
                backgroundSize: '50px 50px'
              }}
            />
          </div>
        </div>

        {/* Floating Domain Icons */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[Globe, Server, Cloud, Shield, AtSign].map((Icon, i) => (
            <motion.div
              key={i}
              className="absolute"
              initial={{ 
                x: `${20 + i * 15}%`,
                y: -100,
                opacity: 0.3
              }}
              animate={{
                y: '120vh',
                rotate: 360,
                opacity: [0.3, 0.5, 0.3]
              }}
              transition={{
                duration: 25 + i * 3,
                repeat: Infinity,
                delay: i * 2,
                ease: "linear"
              }}
            >
              <Icon className="w-8 h-8 text-blue-300/40" />
            </motion.div>
          ))}
        </div>

        {/* Gradient Orbs */}
        <div className="absolute top-20 -left-20 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 -right-20 w-96 h-96 bg-cyan-200/30 rounded-full blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          {/* Page Header with Animation */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8 sm:mb-12"
          >
            {/* Trust Badge */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring' }}
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6 border border-blue-200/50"
            >
              <Activity className="w-3 h-3 sm:w-4 sm:h-4" />
              AI-Powered Domain Intelligence
            </motion.div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-3 sm:mb-4">
              Find Your Perfect 
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
                Domain
              </span>
            </h1>
            <p className="text-gray-600 text-base sm:text-lg lg:text-xl max-w-2xl mx-auto px-4 sm:px-0">
              Search millions of domains and get instant availability
            </p>
          </motion.div>

          {/* Search Bar with Enhanced Design */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-4xl mx-auto mb-8"
          >
            <form onSubmit={handleDomainSearch} className="relative">
              <div className="relative group">
                {/* Subtle glow effect on hover */}
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl opacity-0 group-hover:opacity-20 blur-lg transition-all duration-300" />
                
                <div className="relative rounded-xl shadow-xl bg-white border border-gray-100 overflow-hidden">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center">
                    <div className="flex-1 flex items-center px-4 sm:px-0">
                      <Search className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 ml-3 sm:ml-5" />
                      <input
                        type="text"
                        value={domainSearch}
                        onChange={(e) => setDomainSearch(e.target.value)}
                        placeholder="example56789.com"
                        className="w-full px-3 sm:px-4 py-4 sm:py-5 text-base sm:text-lg text-gray-900 placeholder-gray-400 focus:outline-none font-medium"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSearching}
                      className="px-6 sm:px-8 py-4 sm:py-5 bg-gray-900 hover:bg-gray-800 text-white font-semibold transition-all duration-200 disabled:opacity-50 text-sm sm:text-base"
                    >
                      {isSearching ? (
                        <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                      ) : (
                        <span className="sm:hidden">Search</span>
                      )}
                      <span className="hidden sm:inline">Search Domains</span>
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </motion.div>

          {/* Quick Extension Selector */}
          {!searchResults && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="max-w-4xl mx-auto mb-8 sm:mb-12"
            >
              <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
                <span className="text-xs sm:text-sm text-gray-500 mr-1 sm:mr-2">Popular:</span>
                {popularDomains.map((ext) => (
                  <motion.button
                    key={ext}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleQuickExtension(ext)}
                    className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 hover:text-blue-600 border border-gray-200 hover:border-blue-300 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    {ext}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Search Results Section */}
      <section className="py-8 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatePresence>
            {searchResults && (
              <motion.div
                ref={searchResultsRef}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {/* Main Results Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                  {/* Exact Match Card */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 sm:p-6 hover:shadow-xl transition-shadow"
                  >
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      Exact Match
                    </div>
                    
                    <div className="mb-4 sm:mb-6">
                      <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">
                        <span className="text-gray-900">
                          {searchResults.domain.substring(0, searchResults.domain.indexOf('.'))}
                        </span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
                          {searchResults.domain.substring(searchResults.domain.indexOf('.'))}
                        </span>
                      </h2>
                      
                      {searchResults.available ? (
                        <>
                          <div className="mb-3 sm:mb-4">
                            <PriceDisplay
                              listPrice={searchResults.listPrice}
                              salePrice={searchResults.salePrice}
                              currency={currency}
                              size="large"
                              showDiscount={true}
                              theme="gradient"
                            />
                          </div>
                          
                          <button
                            onClick={() => handleAddToCart(searchResults.domain, String(searchResults.productId))}
                            disabled={addingDomains.has(searchResults.domain)}
                            className="w-full py-3 sm:py-3.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-sm sm:text-base"
                          >
                            {addingDomains.has(searchResults.domain) ? (
                              <span className="flex items-center justify-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Adding...
                              </span>
                            ) : (
                              'Make It Yours'
                            )}
                          </button>
                        </>
                      ) : (
                        <div className="py-8 text-center">
                          <X className="w-12 h-12 text-red-400 mx-auto mb-3" />
                          <p className="text-red-600 font-semibold">Domain Not Available</p>
                          <p className="text-sm text-gray-500 mt-2">Try searching for alternatives below</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-start gap-2 text-sm text-gray-600 bg-blue-50 rounded-lg p-3">
                      <Info className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-600" />
                      <div className="flex-1">
                        {searchResults.valuation?.Reasons && searchResults.valuation.Reasons.length > 0 ? (
                          <>
                            <p className="font-semibold text-gray-900 mb-1">Why it's great:</p>
                            <ul className="space-y-1">
                              {searchResults.valuation.Reasons
                                .filter(reason => !reason.dev_only)
                                .slice(0, 2)
                                .map((reason, idx) => (
                                  <li key={idx} className="flex items-start gap-1">
                                    <span className="text-blue-600">•</span>
                                    <span className="text-xs">
                                      {reason.Type === 'valuable_keyword' && reason.AvgSoldPriceDisplay ? (
                                        <>
                                          <span className="font-semibold">"{reason.Keyword}"</span> is a high value keyword with average sale price of{' '}
                                          <span className="font-semibold text-gray-900">{reason.AvgSoldPriceDisplay}</span>
                                        </>
                                      ) : (
                                        reason.Text
                                      )}
                                    </span>
                                  </li>
                                ))}
                            </ul>
                            {searchResults.valuation.Prices?.GoValueDisplay && (
                              <p className="text-xs mt-2 text-gray-700">
                                Estimated value: <span className="font-bold text-blue-600">{searchResults.valuation.Prices.GoValueDisplay}</span>
                              </p>
                            )}
                          </>
                        ) : (
                          <p>
                            Why it's great: <span className="font-semibold">"{searchResults.domain.split('.')[0]}"</span> is a premium domain name 
                            perfect for your business.
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>

                  {/* Bundle & Save Card */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 sm:p-6 hover:shadow-xl transition-shadow relative"
                  >
                    {/* Discount Badge */}
                    {bundleData && bundleData.domains.length > 0 && (
                      <div className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-bold shadow-lg animate-pulse">
                        Save {Math.round((bundleData.domains.reduce((sum, d) => sum + Number(d.price?.list || 0), 0) - 
                          bundleData.domains.reduce((sum, d) => sum + Number(d.price?.sale || d.price?.list || 0), 0)) / 
                          bundleData.domains.reduce((sum, d) => sum + Number(d.price?.list || 0), 0) * 100) || 0}%
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="inline-flex items-center gap-2 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-600 px-4 py-1.5 rounded-full uppercase tracking-wider shadow-md">
                        <Zap className="w-3 h-3" />
                        Bundle & Save
                      </div>
                    </div>
                    
                    <div className="mb-4 sm:mb-6">
                      <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
                        <span className="text-gray-900">
                          {searchResults.domain.substring(0, searchResults.domain.indexOf('.'))}
                        </span>
                      </h2>
                      
                      {bundleLoading ? (
                        <div className="flex items-center justify-center py-8">
                          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                        </div>
                      ) : bundleData && bundleData.domains.length > 0 ? (
                        <>
                          <div className="grid grid-cols-2 gap-2 mb-4">
                            {bundleData.domains.slice(0, 4).map((bundleDomain) => (
                              <button
                                key={bundleDomain.domain}
                                onClick={() => handleBundleToggle(bundleDomain.domain)}
                                disabled={!bundleDomain.available}
                                className={`py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg border-2 font-semibold transition-all duration-200 ${
                                  selectedBundleDomains.includes(bundleDomain.domain)
                                    ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 shadow-md transform scale-[1.02]'
                                    : bundleDomain.available
                                    ? 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                                    : 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed'
                                }`}
                              >
                                <div className="flex flex-col items-center">
                                  <span className="text-xs sm:text-sm">.{bundleDomain.domain.split('.').pop()}</span>
                                  {!bundleDomain.available && (
                                    <span className="text-[10px] sm:text-xs mt-0.5 sm:mt-1">Taken</span>
                                  )}
                                </div>
                              </button>
                            ))}
                          </div>
                          
                          <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
                            <div className="flex flex-col gap-1">
                              {selectedBundleDomains.length > 0 ? (
                                <>
                                  <div className="flex items-center gap-2">
                                    {bundleData && Number(getBundleSavings()) > 0 && (
                                      <>
                                        <span className="text-lg text-gray-500 line-through">
                                          {formatCurrency(
                                            bundleData.domains
                                              .filter(d => selectedBundleDomains.includes(d.domain))
                                              .reduce((sum, d) => sum + Number(d.price?.list || d.price?.sale || 0), 0),
                                            currency
                                          )}
                                        </span>
                                        <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-semibold">
                                          {Math.round((Number(getBundleSavings()) / 
                                            bundleData.domains
                                              .filter(d => selectedBundleDomains.includes(d.domain))
                                              .reduce((sum, d) => sum + Number(d.price?.list || 0), 0)) * 100) || 0}% OFF
                                        </span>
                                      </>
                                    )}
                                  </div>
                                  <div className="flex items-baseline gap-2">
                                    <span className="text-3xl font-bold text-blue-600">
                                      {formatCurrency(calculateBundlePrice(), currency)}
                                    </span>
                                    <span className="text-sm text-gray-500">
                                      for first year
                                      <button
                                        onClick={() => setShowBundleInfo(!showBundleInfo)}
                                        className="ml-1 text-blue-600 hover:text-blue-700"
                                      >
                                        <Info className="w-3 h-3 inline" />
                                      </button>
                                    </span>
                                  </div>
                                  {Number(getBundleSavings()) > 0 && (
                                    <p className="text-sm text-green-600 font-bold mt-2 flex items-center gap-1">
                                      <Check className="w-4 h-4" />
                                      You save {formatCurrency(getBundleSavings(), currency)} with this bundle!
                                    </p>
                                  )}
                                </>
                              ) : (
                                <>
                                  {bundleData && bundleData.domains.length > 0 ? (
                                    <>
                                      <div className="flex items-center gap-2">
                                        <span className="text-lg text-gray-500 line-through">
                                          {formatCurrency(
                                            bundleData.domains.reduce((sum, d) => sum + Number(d.price?.list || 0), 0),
                                            currency
                                          )}
                                        </span>
                                        <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-semibold">
                                          {Math.round((bundleData.domains.reduce((sum, d) => sum + Number(d.price?.list || 0), 0) - 
                                            bundleData.domains.reduce((sum, d) => sum + Number(d.price?.sale || d.price?.list || 0), 0)) / 
                                            bundleData.domains.reduce((sum, d) => sum + Number(d.price?.list || 0), 0) * 100) || 0}% OFF
                                        </span>
                                      </div>
                                      <div className="flex items-baseline gap-2">
                                        <span className="text-3xl font-bold text-blue-600">
                                          {formatCurrency(
                                            bundleData.domains.reduce((sum, d) => sum + Number(d.price?.sale || d.price?.list || 0), 0),
                                            currency
                                          )}
                                        </span>
                                        <span className="text-sm text-gray-500">
                                          for all {bundleData.domains.length} domains
                                        </span>
                                      </div>
                                      {bundleData.domains.reduce((sum, d) => sum + Number(d.price?.list || 0), 0) - 
                                       bundleData.domains.reduce((sum, d) => sum + Number(d.price?.sale || d.price?.list || 0), 0) > 0 && (
                                        <p className="text-sm text-green-600 font-bold mt-2 flex items-center gap-1">
                                          <Check className="w-4 h-4" />
                                          You save {formatCurrency(
                                            bundleData.domains.reduce((sum, d) => sum + Number(d.price?.list || 0), 0) - 
                                            bundleData.domains.reduce((sum, d) => sum + Number(d.price?.sale || d.price?.list || 0), 0),
                                            currency
                                          )} with this bundle!
                                        </p>
                                      )}
                                    </>
                                  ) : (
                                    <>
                                      <div className="flex items-baseline gap-2">
                                        <span className="text-3xl font-bold text-blue-600">
                                          {formatCurrency(calculateBundlePrice(), currency)}
                                        </span>
                                        <span className="text-sm text-gray-500">
                                          for all domains
                                        </span>
                                      </div>
                                      <p className="text-xs text-gray-600 mt-1">
                                        Loading bundle prices...
                                      </p>
                                    </>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                          
                          <button
                            onClick={handleAddBundleToCart}
                            disabled={selectedBundleDomains.length === 0 || addingDomains.size > 0}
                            className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {addingDomains.size > 0 ? (
                              <span className="flex items-center justify-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Adding to Cart...
                              </span>
                            ) : selectedBundleDomains.length > 0 
                              ? `Add ${selectedBundleDomains.length} Domain${selectedBundleDomains.length > 1 ? 's' : ''} to Cart`
                              : 'Select Domains to Continue'
                            }
                          </button>
                        </>
                      ) : (
                        // Fallback UI when no bundle data
                        <div className="text-center py-6">
                          <p className="text-gray-500 mb-4">Bundle options unavailable</p>
                          <button
                            className="w-full py-3.5 bg-gray-400 text-white font-semibold rounded-lg cursor-not-allowed opacity-50"
                            disabled
                          >
                            Bundle Unavailable
                          </button>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-start gap-2 text-sm text-gray-600 bg-cyan-50 rounded-lg p-3">
                      <Info className="w-4 h-4 mt-0.5 flex-shrink-0 text-cyan-600" />
                      <p>
                        Why it's great: Protect your business from copycats by
                        registering these popular endings: <span className="font-semibold text-gray-900">
                          {bundleData ? bundleData.domains.slice(0, 4).map(d => d.domain.split('.').pop()?.toUpperCase()).join(', ') : 'ORG, XYZ, INFO, NET'}
                        </span>.
                      </p>
                    </div>
                  </motion.div>
                </div>

                {/* Privacy Protection Notice */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-gradient-to-r from-blue-50 via-white to-cyan-50 border border-blue-200 rounded-xl p-5 mb-8 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <Shield className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-700 font-medium">
                        Domains include free Privacy Protection forever.
                        <button className="ml-1 text-blue-600 hover:text-blue-700 underline">
                          Learn more
                        </button>
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Alternative Suggestions */}
                {suggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
                  >
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                          <Globe className="w-5 h-5 text-blue-600" />
                          More domain options
                        </h3>
                        <span className="text-sm text-gray-500">
                          {suggestions.length} alternatives found
                        </span>
                      </div>
                    </div>
                    
                    <div className="divide-y divide-gray-100">
                      {suggestions.map((suggestion, index) => (
                        <motion.div
                          key={suggestion.domain}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + Math.min(index * 0.03, 0.5) }}
                          className="flex items-center justify-between py-3 sm:py-4 px-4 sm:px-6 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-cyan-50/50 transition-all duration-200"
                        >
                          <div className="flex items-center gap-2 sm:gap-4">
                            <div>
                              <h4 className="text-base sm:text-lg font-semibold">
                                <span className="text-gray-900">
                                  {suggestion.domain.substring(0, suggestion.domain.indexOf('.'))}
                                </span>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
                                  {suggestion.domain.substring(suggestion.domain.indexOf('.'))}
                                </span>
                              </h4>
                              {suggestion.domain.includes('.in') && (
                                <span className="inline-flex items-center gap-1 text-xs text-gray-500 mt-1">
                                  <Info className="w-3 h-3" />
                                  Restrictions apply
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 sm:gap-4">
                            <div className="text-right">
                              {suggestion.listPrice && suggestion.salePrice && suggestion.listPrice !== suggestion.salePrice ? (
                                <div className="flex items-baseline gap-2">
                                  <span className="text-sm text-gray-500 line-through">
                                    {formatCurrency(suggestion.listPrice, currency)}
                                  </span>
                                  <span className="text-lg font-bold text-green-600">
                                    {formatCurrency(suggestion.salePrice, currency)}
                                  </span>
                                  <span className="text-sm text-gray-500">/yr</span>
                                </div>
                              ) : (
                                <div className="flex items-baseline gap-1">
                                  <span className="text-lg font-bold text-gray-900">
                                    {formatCurrency(suggestion.salePrice || suggestion.listPrice, currency)}
                                  </span>
                                  <span className="text-sm text-gray-500">/yr</span>
                                </div>
                              )}
                            </div>
                            
                            {suggestion.available ? (
                              <button
                                onClick={() => handleAddToCart(suggestion.domain, String(suggestion.productId))}
                                disabled={addingDomains.has(suggestion.domain)}
                                className="p-2 sm:p-3 rounded-lg border-2 border-gray-200 hover:border-blue-400 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 transition-all duration-200 group"
                                title="Add to cart"
                              >
                                {addingDomains.has(suggestion.domain) ? (
                                  <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 animate-spin" />
                                ) : (
                                  <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 group-hover:text-blue-600 transition-colors" />
                                )}
                              </button>
                            ) : (
                              <div className="px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm text-gray-400 font-medium">
                                Taken
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Loading State */}
          <AnimatePresence>
            {isSearching && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex justify-center py-20"
              >
                <div className="bg-white rounded-xl shadow-xl p-12 text-center border border-gray-100">
                  <div className="relative inline-flex items-center justify-center w-20 h-20 mb-6">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-200 to-cyan-200 rounded-full animate-pulse" />
                    <div className="relative w-14 h-14 rounded-full border-4 border-white border-t-blue-600 animate-spin" />
                  </div>
                  <p className="text-xl font-bold text-gray-900 mb-2">Searching domains...</p>
                  <p className="text-sm text-gray-500">Checking availability across all extensions</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error State */}
          <AnimatePresence>
            {error && !isSearching && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-md mx-auto"
              >
                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-red-100 rounded-lg">
                      <X className="h-6 w-6 text-red-600" />
                    </div>
                    <div>
                      <p className="text-red-900 font-semibold">Error occurred</p>
                      <p className="text-red-700 text-sm mt-1">{error}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Features Section */}
      {!searchResults && !isSearching && (
        <section className="py-12 sm:py-16 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center mb-8 sm:mb-12"
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">Why Choose FlickMax?</h2>
              <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto px-4 sm:px-0">
                Get more than just a domain. Enjoy premium features and world-class support.
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: Shield,
                  title: 'Privacy Protection',
                  description: 'Keep your personal information safe with free WHOIS privacy forever',
                  gradient: 'from-blue-500 to-cyan-500'
                },
                {
                  icon: TrendingUp,
                  title: 'Domain Investment',
                  description: 'Premium domains with high resale value based on market trends',
                  gradient: 'from-cyan-500 to-blue-500'
                },
                {
                  icon: Zap,
                  title: 'Instant Setup',
                  description: 'Your domain is ready to use immediately with free DNS management',
                  gradient: 'from-blue-600 to-cyan-600'
                }
              ].map((feature, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="group p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl hover:shadow-lg transition-all border border-blue-100"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className={`p-3 bg-gradient-to-r ${feature.gradient} rounded-lg shadow-md mb-4`}>
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600 text-sm">{feature.description}</p>
                    <div className="mt-4 flex items-center justify-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

export default function DomainSearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
        <p className="text-gray-600">Loading domain search...</p>
      </div>
    </div>}>
      <DomainSearchPageContent />
    </Suspense>
  )
}