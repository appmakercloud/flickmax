'use client'

import { useState, useRef, useEffect } from 'react'
import { Search, ShoppingCart, Check, X, Sparkles, TrendingUp, Shield, Zap, Globe, Loader2, Award, Hexagon, Activity } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { validateDomain } from '@/lib/utils'
import { useDomainSearch } from '@/hooks/useDomainSearch'
import { useCountry } from '@/contexts/CountryContext'
import { useCart } from '@/contexts/CartContext'
import { PriceDisplay } from '@/components/ui/PriceDisplay'

const popularExtensions = [
  { ext: '.com', popular: true, color: 'from-blue-500 to-blue-600' },
  { ext: '.net', popular: false, color: 'from-slate-600 to-slate-700' },
  { ext: '.store', popular: false, color: 'from-slate-600 to-slate-700' },
  { ext: '.website', popular: false, color: 'from-slate-600 to-slate-700' },
  { ext: '.in', popular: true, color: 'from-teal-500 to-cyan-600' },
  { ext: '.ai', popular: true, color: 'from-amber-500 to-orange-600' },
  { ext: '.app', popular: false, color: 'from-slate-600 to-slate-700' },
  { ext: '.dev', popular: false, color: 'from-slate-600 to-slate-700' },
]

const trendingDomains = [
  'tech', 'smart', 'digital', 'cloud', 'next', 'pro', 'hub', 'lab'
]

export default function DomainSearch() {
  const [domainSearch, setDomainSearch] = useState('')
  const [autoSearch, setAutoSearch] = useState(true)
  const [inputFocused, setInputFocused] = useState(false)
  const { currency } = useCountry()
  const { search, reset, isSearching, searchResults, suggestions, error } = useDomainSearch()
  const { addDomainToCart, isLoading: isAddingToCart } = useCart()
  const searchResultsRef = useRef<HTMLDivElement>(null)

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
      await addDomainToCart(domain, productId)
    } catch (error) {
      // Error handled by useCart hook
    }
  }

  // Auto-scroll to search results when they appear
  useEffect(() => {
    if (searchResults && searchResultsRef.current) {
      // Add a small delay to ensure the element is rendered
      setTimeout(() => {
        // Get the element position and window height
        const element = searchResultsRef.current
        if (!element) return
        
        const elementRect = element.getBoundingClientRect()
        const absoluteElementTop = elementRect.top + window.pageYOffset
        const middle = absoluteElementTop - (window.innerHeight / 4) // Position results 1/4 from top of viewport
        
        window.scrollTo({
          top: middle > 0 ? middle : 0,
          behavior: 'smooth'
        })
      }, 100)
    }
  }, [searchResults])

  const handleCloseResults = () => {
    reset()
  }


  return (
    <section className={`relative overflow-hidden ${!searchResults ? 'min-h-[750px]' : ''}`}>
      {/* Modern blue gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
        <div className="absolute inset-0 bg-black/30" />
        
        {/* Animated mesh pattern */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `
              linear-gradient(to right, rgba(59, 130, 246, 0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }} />
        </div>
        
        {/* Animated gradient orbs */}
        <motion.div
          animate={{
            x: [0, 150, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -top-20 -left-20 w-[600px] h-[600px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, rgba(37, 99, 235, 0.2) 40%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 5
          }}
          className="absolute -bottom-20 -right-20 w-[500px] h-[500px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(14, 165, 233, 0.4) 0%, rgba(2, 132, 199, 0.2) 40%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />
        
        {/* Hexagon pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="hexagons" width="50" height="43.4" patternUnits="userSpaceOnUse" patternTransform="scale(2)">
                <polygon points="24.8,22 37.3,29.2 37.3,43.7 24.8,50.9 12.3,43.7 12.3,29.2" fill="none" stroke="rgba(59, 130, 246, 0.3)" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hexagons)" />
          </svg>
        </div>
      </div>
      
      <div className={`relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 ${searchResults ? 'pb-8' : ''}`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* Enhanced heading section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 backdrop-blur-sm rounded-full text-white/90 text-xs sm:text-sm font-medium mb-6 sm:mb-8 border border-blue-400/30"
          >
            <Activity className="w-3 h-3 sm:w-4 sm:h-4 text-cyan-400" />
            <span>AI-Powered Domain Intelligence</span>
            <Hexagon className="w-3 h-3 text-blue-400 hidden sm:block" />
          </motion.div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 tracking-tight leading-tight">
            Secure Your
            <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 animate-gradient">
              Digital Future
            </span>
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl text-blue-100/80 mb-8 sm:mb-12 max-w-2xl mx-auto px-4">
            Enterprise-grade security • Lightning-fast DNS • 99.99% uptime
          </p>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex items-center justify-center gap-4 sm:gap-8 mb-8 sm:mb-12 flex-wrap"
          >
            <div className="flex items-center gap-2 text-blue-200/70">
              <Shield className="w-5 h-5 text-emerald-400" />
              <span className="text-sm">256-bit SSL</span>
            </div>
            <div className="flex items-center gap-2 text-blue-200/70">
              <Award className="w-5 h-5 text-blue-400" />
              <span className="text-sm">Price Match</span>
            </div>
            <div className="flex items-center gap-2 text-blue-200/70">
              <Zap className="w-5 h-5 text-amber-400" />
              <span className="text-sm">Instant Setup</span>
            </div>
          </motion.div>

          {/* Modern search container */}
          <div className="max-w-4xl mx-auto">
            {/* Premium glassmorphism search box */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className={`relative bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-6 md:p-8 ${
                inputFocused 
                  ? 'shadow-2xl shadow-blue-500/30 border-2 border-blue-400/50' 
                  : 'shadow-xl shadow-black/20 border border-white/10'
              } transition-all duration-500`}
            >
              {/* Animated border gradient */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500 opacity-20 blur-xl -z-10 animate-pulse" />
              
              {/* Domain Search Bar */}
              <form onSubmit={handleDomainSearch} className="mb-4 sm:mb-6">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 items-center pl-6 pointer-events-none hidden sm:flex">
                    <Globe className="h-6 w-6 text-blue-400/70" />
                  </div>
                  <input
                    type="text"
                    value={domainSearch}
                    onChange={(e) => setDomainSearch(e.target.value)}
                    onFocus={() => setInputFocused(true)}
                    onBlur={() => setInputFocused(false)}
                    placeholder="Find your perfect domain name..."
                    className="w-full pl-4 sm:pl-16 pr-4 sm:pr-48 py-4 sm:py-5 md:py-6 text-base sm:text-lg bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-sm text-white placeholder-slate-400 focus:outline-none focus:from-slate-700/50 focus:to-slate-800/50 rounded-xl sm:rounded-2xl border border-slate-600/50 focus:border-blue-400/50 transition-all duration-300"
                  />
                  <button
                    type="submit"
                    disabled={isSearching}
                    className="mt-3 sm:mt-0 sm:absolute sm:right-2 sm:inset-y-2 w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-auto bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-slate-600 disabled:to-slate-700 text-white font-bold uppercase transition-all duration-300 rounded-xl sm:rounded-xl sm:min-w-[140px] flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-[1.02] disabled:scale-100"
                  >
                    {isSearching ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <>
                        <Search className="h-5 w-5" />
                        <span>SEARCH</span>
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Popular Extensions - Enhanced Pills */}
              <div className="flex flex-wrap items-center justify-center gap-2 mb-6 sm:mb-6 px-2 sm:px-0">
                <span className="text-slate-400 text-xs sm:text-sm font-medium mr-1 sm:mr-2">Popular:</span>
                {popularExtensions.map((ext) => (
                  <motion.button
                    key={ext.ext}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      const sld = domainSearch.split('.')[0] || 'example'
                      setDomainSearch(sld + ext.ext)
                      if (autoSearch && sld) {
                        handleDomainSearch({ preventDefault: () => {} } as React.FormEvent)
                      }
                    }}
                    className={`px-3.5 sm:px-5 py-2 sm:py-2.5 text-sm sm:text-base rounded-lg sm:rounded-xl font-medium transition-all duration-300 whitespace-nowrap ${
                      ext.popular
                        ? `bg-gradient-to-r ${ext.color} text-white shadow-lg hover:shadow-xl`
                        : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 border border-slate-600/50 hover:border-slate-500/50'
                    }`}
                  >
                    {ext.ext}
                  </motion.button>
                ))}
              </div>

              {/* Trending suggestions with animation */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex items-center justify-center gap-2 sm:gap-3 text-slate-400 text-xs sm:text-sm flex-wrap mb-12 sm:mb-0"
              >
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                <span>Trending:</span>
                <div className="flex gap-2">
                  {trendingDomains.slice(0, 4).map((domain, index) => (
                    <motion.button
                      key={domain}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      onClick={() => setDomainSearch(domain)}
                      className="text-blue-300 hover:text-cyan-300 transition-all duration-300 hover:underline hover:scale-105 inline-block"
                    >
                      {domain}
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* Auto Search Toggle - Premium style */}
              <div className="fixed sm:absolute bottom-4 right-4 sm:bottom-4 sm:right-4 z-20">
                <button 
                  onClick={() => setAutoSearch(!autoSearch)}
                  className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2 rounded-full font-medium transition-all text-xs sm:text-xs backdrop-blur-md ${
                    autoSearch 
                      ? 'bg-gradient-to-r from-emerald-600/20 to-green-600/20 text-emerald-300 border border-emerald-400/30' 
                      : 'bg-slate-800/50 text-slate-400 border border-slate-600/50'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full ${autoSearch ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
                  AUTO SEARCH {autoSearch ? 'ON' : 'OFF'}
                </button>
              </div>
            </motion.div>
          </div>

          {/* Search Results - Premium Card Design */}
          <AnimatePresence>
            {searchResults && (
              <motion.div
                ref={searchResultsRef}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -30, scale: 0.9 }}
                transition={{ duration: 0.4, type: "spring" }}
                className="max-w-5xl mx-auto mt-8"
              >
                <div className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8 relative border border-slate-700/30 overflow-hidden">
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-cyan-600/5 pointer-events-none" />
                  
                  {/* Close Button */}
                  <button
                    onClick={handleCloseResults}
                    className="absolute top-2 right-2 sm:top-4 sm:right-4 p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-slate-800/50 hover:bg-slate-700/50 transition-all duration-300 group border border-slate-600/50"
                  >
                    <X className="h-4 w-4 sm:h-5 sm:w-5 text-slate-400 group-hover:text-white transition-colors" />
                  </button>

                  {/* Main Search Result */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-6 sm:mb-8"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
                      <div className="flex items-center gap-4 sm:gap-6">
                        <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-2xl ${
                          searchResults.available 
                            ? 'bg-gradient-to-br from-green-500 to-emerald-500' 
                            : 'bg-gradient-to-br from-slate-700 to-slate-800'
                        }`}>
                          {searchResults.available ? (
                            <Check className="h-10 w-10 text-white" />
                          ) : (
                            <div className="relative">
                              <Globe className="h-10 w-10 text-slate-400" />
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                                <X className="h-3 w-3 text-white" />
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="text-left">
                          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 sm:mb-2 break-all">
                            {searchResults.domain}
                          </h3>
                          <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
                            searchResults.available 
                              ? 'bg-green-500/20 text-green-300 border border-green-400/30' 
                              : 'bg-slate-700/50 text-slate-300 border border-slate-600/30'
                          }`}>
                            <div className={`w-2 h-2 rounded-full ${
                              searchResults.available ? 'bg-green-400 animate-pulse' : 'bg-slate-400'
                            }`} />
                            {searchResults.available ? 'Available' : 'Not Available'}
                          </span>
                        </div>
                      </div>
                      {searchResults.available && (searchResults.listPrice || searchResults.salePrice) && (
                        <motion.div 
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 }}
                          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-6 w-full sm:w-auto"
                        >
                          <div className="text-center sm:text-right">
                            <p className="text-xs sm:text-sm text-slate-400 mb-0.5 sm:mb-1">Starting at</p>
                            <PriceDisplay 
                              listPrice={searchResults.listPrice}
                              salePrice={searchResults.salePrice}
                              currency={currency}
                              size="large"
                              theme="dark"
                              inline={true}
                              className=""
                            />
                          </div>
                          <button
                            onClick={() => {
                              handleAddToCart(searchResults.domain, String(searchResults.productId || searchResults.domain))
                            }}
                            disabled={isAddingToCart}
                            className="group relative px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-gray-500 disabled:to-gray-600 text-white rounded-xl transition-all duration-300 font-bold shadow-lg hover:shadow-xl sm:hover:scale-[1.02] disabled:scale-100 overflow-hidden text-sm sm:text-base w-full sm:w-auto"
                          >
                            <span className="relative z-10 flex items-center gap-2">
                              {isAddingToCart ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                              ) : (
                                <ShoppingCart className="h-5 w-5" />
                              )}
                              {isAddingToCart ? 'ADDING...' : 'ADD TO CART'}
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </button>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>

                  {/* Suggestions - Premium Grid */}
                  {suggestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <h3 className="text-base sm:text-lg font-semibold text-white mb-4 sm:mb-6 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
                        Alternative options:
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                        {suggestions.map((suggestion, index) => (
                          <motion.button
                            key={suggestion.domain}
                            initial={{ opacity: 0, scale: 0.9, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ delay: 0.4 + index * 0.05 }}
                            whileHover={{ scale: 1.02, y: -2 }}
                            onClick={() => {
                              if (suggestion.available) {
                                handleAddToCart(suggestion.domain, String(suggestion.productId || suggestion.domain))
                              }
                            }}
                            className={`group p-3 sm:p-4 md:p-5 rounded-lg sm:rounded-xl border transition-all duration-300 text-left flex flex-col gap-2 ${
                              suggestion.available
                                ? 'bg-gradient-to-br from-slate-800/70 to-slate-700/50 hover:from-slate-700/70 hover:to-slate-600/50 border-slate-600/30 hover:border-slate-500/50 cursor-pointer hover:shadow-lg hover:shadow-blue-500/10'
                                : 'bg-slate-900/50 border-slate-800/50 opacity-40 cursor-not-allowed'
                            }`}
                            disabled={!suggestion.available}
                          >
                            <div className="flex items-center justify-between mb-1 sm:mb-2">
                              <span className="font-semibold text-sm sm:text-base text-white group-hover:text-blue-300 transition-colors break-all">
                                {suggestion.domain}
                              </span>
                              {suggestion.available ? (
                                <Check className="h-4 w-4 text-green-400" />
                              ) : (
                                <div className="w-4 h-4 rounded-full bg-slate-700 flex items-center justify-center">
                                  <X className="h-3 w-3 text-slate-400" />
                                </div>
                              )}
                            </div>
                            {suggestion.available && (suggestion.listPrice || suggestion.salePrice) && (
                              <PriceDisplay 
                                listPrice={suggestion.listPrice}
                                salePrice={suggestion.salePrice}
                                currency={currency}
                                size="small"
                                theme="dark"
                                showDiscount={true}
                                inline={true}
                                className=""
                              />
                            )}
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Loading State - Premium */}
          <AnimatePresence>
            {isSearching && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="max-w-5xl mx-auto mt-8"
              >
                <div className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl rounded-3xl shadow-2xl p-16 text-center border border-slate-700/50">
                  <div className="relative inline-flex">
                    <div className="w-24 h-24 rounded-full border-4 border-blue-200/20 border-t-blue-500 animate-spin" />
                    <div className="absolute inset-0 m-auto w-16 h-16 rounded-full border-4 border-cyan-200/20 border-t-cyan-500 animate-spin animate-reverse" />
                    <Globe className="absolute inset-0 m-auto h-8 w-8 text-blue-400" />
                  </div>
                  <p className="text-white mt-6 text-xl font-medium">Scanning global registry...</p>
                  <p className="text-slate-400 text-sm mt-2">Checking availability across all TLDs</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error State - Premium */}
          <AnimatePresence>
            {error && !isSearching && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-5xl mx-auto mt-8"
              >
                <div className="bg-red-900/20 border border-red-500/30 rounded-2xl p-6 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-red-500/20 rounded-xl">
                      <X className="h-6 w-6 text-red-400" />
                    </div>
                    <p className="text-red-300 font-medium">{error}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <style jsx>{`
        @keyframes animate-reverse {
          to {
            transform: rotate(-360deg);
          }
        }
        .animate-reverse {
          animation: animate-reverse 2s linear infinite;
        }
        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 4s ease infinite;
        }
      `}</style>
    </section>
  )
}