'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { validateDomain } from '@/lib/utils'

const domainExtensions = ['.com', '.net', '.org', '.io', '.co', '.dev', '.app', '.store']

export default function HeroSection() {
  const [domainSearch, setDomainSearch] = useState('')
  const [isSearching, setIsSearching] = useState(false)

  const handleDomainSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!domainSearch.trim()) {
      toast.error('Please enter a domain name')
      return
    }

    const domainName = domainSearch.replace(/\.[^/.]+$/, '') // Remove extension if provided
    
    if (!validateDomain(`${domainName}.com`)) {
      toast.error('Please enter a valid domain name')
      return
    }

    setIsSearching(true)
    
    // Simulate domain search
    setTimeout(() => {
      setIsSearching(false)
      toast.success(`Checking availability for ${domainName}...`)
      // In real app, redirect to search results
    }, 1500)
  }

  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
      {/* Animated blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>
      
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-gray-900">
            Everything you need to
            <span className="block text-blue-600">succeed online</span>
          </h1>
          
          <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Get a domain. Build a website. Grow your business. We make it easy to create a 
            powerful online presence.
          </p>

          {/* Domain Search */}
          <div className="mt-10 max-w-2xl mx-auto">
            <form onSubmit={handleDomainSearch} className="relative">
              <div className="relative rounded-lg shadow-xl">
                <input
                  type="text"
                  value={domainSearch}
                  onChange={(e) => setDomainSearch(e.target.value)}
                  placeholder="Search for your perfect domain name"
                  className="block w-full rounded-lg border-0 px-4 py-4 pr-14 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                />
                <button
                  type="submit"
                  disabled={isSearching}
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                >
                  <Search className={`h-5 w-5 text-gray-400 ${isSearching ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </form>

            {/* Domain Extensions */}
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {domainExtensions.map((ext) => (
                <button
                  key={ext}
                  onClick={() => setDomainSearch(domainSearch.replace(/\.[^/.]+$/, '') + ext)}
                  className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  {ext}
                </button>
              ))}
            </div>
          </div>

          {/* CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="/domains"
              className="inline-flex items-center justify-center rounded-md bg-blue-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-blue-700"
            >
              Find Your Domain
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="/hosting"
              className="inline-flex items-center justify-center rounded-md bg-white px-6 py-3 text-base font-medium text-blue-600 shadow-sm ring-1 ring-inset ring-blue-600 hover:bg-blue-50"
            >
              View Hosting Plans
            </motion.a>
          </div>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-16 grid grid-cols-2 gap-8 md:grid-cols-4"
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">99.9%</div>
            <div className="mt-1 text-sm text-gray-600">Uptime Guarantee</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">24/7</div>
            <div className="mt-1 text-sm text-gray-600">Expert Support</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">30-Day</div>
            <div className="mt-1 text-sm text-gray-600">Money Back</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">Free</div>
            <div className="mt-1 text-sm text-gray-600">SSL Certificate</div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}