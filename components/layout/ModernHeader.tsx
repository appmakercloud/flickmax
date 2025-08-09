'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, X, ChevronDown, ShoppingCart, User, Globe, Phone } from 'lucide-react'
import { Menu as HeadlessMenu, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { useCart, cartAnimationEvent } from '@/contexts/CartContext'
import CartPanel from '@/components/cart/CartPanel'
import { motion, AnimatePresence } from 'framer-motion'
import { useCountry } from '@/contexts/CountryContext'
import { countries } from '@/lib/countries'

const navigation = [
  { name: 'Home', href: '/' },
  { 
    name: 'Domains',
    items: [
      { name: 'Domain Name Search', href: '/domains/search' },
      { name: 'Domain Transfer', href: '/domains/transfer' },
      { name: 'Domain Pricing', href: '/domains/pricing' },
      { name: 'WHOIS Lookup', href: '/domains/whois' },
    ]
  },
  { 
    name: 'Websites',
    items: [
      { name: 'Website Builder', href: '/website-builder' },
      { name: 'WordPress', href: '/wordpress' },
      { name: 'Website Design Services', href: '/design-services' },
    ]
  },
  {
    name: 'Hosting',
    items: [
      { name: 'Web Hosting', href: '/hosting/web-hosting' },
      { name: 'Managed WordPress', href: '/hosting/managed-wordpress' },
      { name: 'VPS Hosting', href: '/hosting/vps' },
      { name: 'Fully Managed VPS', href: '/hosting/fully-managed-vps' },
      { name: 'Dedicated Servers', href: '/hosting/dedicated' },
    ]
  },
  {
    name: 'Security',
    items: [
      { name: 'SSL Certificates', href: '/security/ssl' },
      { name: 'Website Security', href: '/security/website' },
      { name: 'Website Backup', href: '/security/backup' },
    ]
  },
  {
    name: 'Marketing',
    items: [
      { name: 'Email Marketing', href: '/marketing/email' },
      { name: 'SEO Tools', href: '/marketing/seo' },
      { name: 'Business Email', href: '/marketing/business-email' },
    ]
  },
  {
    name: 'Email',
    items: [
      { name: 'Professional Email', href: '/email/professional' },
      { name: 'Email Marketing', href: '/email/marketing' },
      { name: 'Microsoft 365', href: '/email/microsoft365' },
    ]
  }
]

export default function ModernHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [cartPanelOpen, setCartPanelOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const { cartItemsCount } = useCart()
  const { country, setCountry } = useCountry()

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Handle cart animation
  useEffect(() => {
    const handleCartAnimation = () => {
      setIsAnimating(true)
      setTimeout(() => setIsAnimating(false), 1000)
    }

    if (cartAnimationEvent) {
      cartAnimationEvent.addEventListener('cartAnimation', handleCartAnimation)
      return () => {
        cartAnimationEvent?.removeEventListener('cartAnimation', handleCartAnimation)
      }
    }
  }, [])

  return (
    <>
      <header className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg' 
          : 'bg-white shadow-sm'
      }`}>
        {/* Top Bar */}
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-blue-100/50">
          <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-12 sm:h-10 text-sm">
              {/* Left side */}
              <div className="flex items-center space-x-3">
                {/* Mobile menu button */}
                <button
                  type="button"
                  className="lg:hidden p-1.5 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
                
                {/* Logo */}
                <Link href="/" className="flex items-center space-x-1 sm:space-x-2 group">
                  <div className="relative">
                    <div className="flex items-center space-x-1 sm:space-x-2">
                      <div className="relative w-8 h-8">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg opacity-20 group-hover:opacity-30 transition-opacity blur-md" />
                        <div className="relative flex items-center justify-center w-full h-full bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg">
                          <span className="text-white font-bold text-lg">F</span>
                        </div>
                      </div>
                      <span className="text-xl sm:text-2xl font-bold text-gray-900">Flickmax</span>
                    </div>
                  </div>
                </Link>
              </div>

              {/* Right side - Contact and User */}
              <div className="flex items-center space-x-2 sm:space-x-4 lg:space-x-6">
                {/* Phone - Hidden on mobile */}
                <a href={`tel:${country.phoneNumber.replace(/[^0-9+]/g, '')}`} className="hidden lg:flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors">
                  <Phone className="w-4 h-4" />
                  <span>{country.phoneNumber}</span>
                </a>

                {/* Region Selector */}
                <HeadlessMenu as="div" className="relative">
                  <HeadlessMenu.Button className="flex items-center space-x-1 sm:space-x-2 text-gray-700 hover:text-blue-600 transition-colors text-xs sm:text-sm">
                    <Globe className="w-4 h-4 flex-shrink-0" />
                    <span className="hidden sm:inline">{country.name} - {country.currency}</span>
                    <span className="sm:hidden">{country.code}</span>
                    <ChevronDown className="w-3 h-3" />
                  </HeadlessMenu.Button>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-150"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <HeadlessMenu.Items className="absolute right-0 z-50 mt-2 w-72 origin-top-right rounded-xl bg-white shadow-2xl ring-1 ring-black/5 focus:outline-none">
                      <div className="p-4">
                        <h3 className="text-sm font-semibold text-gray-900 mb-3">Choose your region</h3>
                        <div className="space-y-1 max-h-96 overflow-y-auto">
                          {countries.map((countryOption) => (
                            <HeadlessMenu.Item key={countryOption.code}>
                              {({ active }) => (
                                <button 
                                  onClick={() => setCountry(countryOption)}
                                  className={`w-full text-left px-3 py-2 text-sm rounded-lg flex items-center space-x-3 transition-colors ${
                                    active ? 'bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-600' : 'hover:bg-gray-50'
                                  } ${country.code === countryOption.code ? 'bg-blue-50 text-blue-600' : ''}`}
                                >
                                  <span className="text-lg">{countryOption.flag}</span>
                                  <span className="flex-1">{countryOption.name}</span>
                                  <span className="text-xs text-gray-500">{countryOption.currency}</span>
                                </button>
                              )}
                            </HeadlessMenu.Item>
                          ))}
                        </div>
                      </div>
                    </HeadlessMenu.Items>
                  </Transition>
                </HeadlessMenu>

                {/* Help */}
                <a href="https://www.secureserver.net/help?plid=590175" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors text-xs sm:text-sm">
                  <span>Help</span>
                </a>

                {/* Sign In Dropdown */}
                <HeadlessMenu as="div" className="relative">
                  {({ open }) => (
                    <>
                      <HeadlessMenu.Button className="flex items-center space-x-1 sm:space-x-2 text-gray-700 hover:text-blue-600 transition-colors text-xs sm:text-sm">
                        <User className="w-4 h-4 flex-shrink-0" />
                        <span className="hidden sm:inline">Sign In</span>
                        <ChevronDown className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''} hidden sm:block`} />
                      </HeadlessMenu.Button>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-150"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <HeadlessMenu.Items className="absolute right-0 z-50 mt-2 w-[90vw] sm:w-[500px] lg:w-[600px] origin-top-right rounded-xl bg-white shadow-2xl ring-1 ring-black/5 focus:outline-none overflow-hidden">
                          <div className="grid grid-cols-1 sm:grid-cols-2 sm:divide-x divide-y sm:divide-y-0 divide-gray-200">
                            {/* New Customer */}
                            <div className="p-6 sm:p-8 bg-gradient-to-br from-gray-50 to-white">
                              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">New Customer</h3>
                              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                                New to Flickmax? Create an account to get started today.
                              </p>
                              <a
                                href="https://sso.secureserver.net/account/create?plid=590175&prog_id=590175&realm=idp&path=%2Fproducts&app=account"
                                className="inline-flex items-center justify-center w-full px-4 py-2.5 sm:py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                              >
                                Create My Account
                              </a>
                            </div>

                            {/* Registered Users */}
                            <div className="p-6 sm:p-8">
                              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Registered Users</h3>
                              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                                Have an account? Sign in now.
                              </p>
                              <a
                                href="https://sso.secureserver.net/?plid=590175&prog_id=590175&realm=idp&path=%2Fproducts&app=account"
                                className="inline-flex items-center justify-center w-full px-4 py-2.5 sm:py-3 text-sm font-medium text-blue-600 bg-white border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-200"
                              >
                                Sign In
                              </a>
                            </div>
                          </div>
                        </HeadlessMenu.Items>
                      </Transition>
                    </>
                  )}
                </HeadlessMenu>

                {/* Cart */}
                <motion.button 
                  onClick={() => setCartPanelOpen(true)}
                  className="relative p-1 sm:p-2 text-gray-700 hover:text-blue-600 transition-colors"
                  animate={isAnimating ? {
                    scale: [1, 1.2, 0.9, 1.1, 1],
                    rotate: [0, -10, 10, -10, 0],
                  } : {}}
                  transition={{ duration: 0.5 }}
                >
                  <ShoppingCart className="h-5 w-5" />
                  {cartItemsCount > 0 && (
                    <motion.span 
                      key={cartItemsCount}
                      initial={{ scale: 0, y: -10 }}
                      animate={{ scale: 1, y: 0 }}
                      className="absolute -top-1 -right-1 inline-flex items-center justify-center h-4 w-4 sm:h-5 sm:w-5 text-[10px] sm:text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full"
                    >
                      {cartItemsCount}
                    </motion.span>
                  )}
                  {isAnimating && (
                    <motion.div
                      initial={{ scale: 1, opacity: 0.8 }}
                      animate={{ scale: 2, opacity: 0 }}
                      transition={{ duration: 0.8 }}
                      className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full"
                    />
                  )}
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Navigation - Hidden on mobile, visible in top bar */}
        <nav className="hidden lg:block mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Main">
          <div className="flex items-center justify-between h-14">
            {/* Desktop Navigation */}
            <div className="flex items-center space-x-8">
              {navigation.map((item) => (
                item.items ? (
                  <HeadlessMenu key={item.name} as="div" className="relative">
                    {({ open }) => (
                      <>
                        <HeadlessMenu.Button className={`
                          inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors
                          ${open 
                            ? 'text-blue-600 border-b-2 border-blue-600' 
                            : 'text-gray-700 hover:text-blue-600'
                          }
                        `}>
                          {item.name}
                          <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${
                            open ? 'rotate-180' : ''
                          }`} />
                        </HeadlessMenu.Button>
                        
                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-200"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-150"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <HeadlessMenu.Items className="absolute left-0 z-50 mt-2 w-64 origin-top-left rounded-xl bg-white shadow-2xl ring-1 ring-black/5 focus:outline-none">
                            <div className="py-2">
                              {item.items.map((subItem) => (
                                <HeadlessMenu.Item key={subItem.name}>
                                  {({ active }) => (
                                    <Link
                                      href={subItem.href}
                                      className={`
                                        block px-4 py-2 text-sm transition-colors
                                        ${active 
                                          ? 'bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-600' 
                                          : 'text-gray-700'
                                        }
                                      `}
                                    >
                                      {subItem.name}
                                    </Link>
                                  )}
                                </HeadlessMenu.Item>
                              ))}
                            </div>
                          </HeadlessMenu.Items>
                        </Transition>
                      </>
                    )}
                  </HeadlessMenu>
                ) : (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    {item.name}
                  </Link>
                )
              ))}
            </div>

          </div>
        </nav>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white overflow-hidden shadow-lg"
            >
              <div className="px-4 py-4 space-y-3 max-h-[calc(100vh-120px)] overflow-y-auto">
                {navigation.map((item) => (
                  <div key={item.name}>
                    {item.items ? (
                      <details className="group">
                        <summary className="flex items-center justify-between py-3 text-base font-medium text-gray-900 cursor-pointer list-none">
                          {item.name}
                          <ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180" />
                        </summary>
                        <div className="pb-2 space-y-1">
                          {item.items.map((subItem) => (
                            <Link
                              key={subItem.name}
                              href={subItem.href}
                              className="block py-2 pl-6 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {subItem.name}
                            </Link>
                          ))}
                        </div>
                      </details>
                    ) : (
                      <Link
                        href={item.href}
                        className="block py-3 text-base font-medium text-gray-900"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    )}
                  </div>
                ))}
                
                <div className="pt-4 border-t border-gray-200 space-y-3">
                  <a
                    href="https://www.secureserver.net/products?plid=590175"
                    className="block py-3 text-base font-medium text-gray-900"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My Products
                  </a>
                  <a
                    href="https://sso.secureserver.net/?plid=590175&prog_id=590175&realm=idp&path=%2Fproducts&app=account"
                    className="block w-full text-center px-4 py-3 text-sm font-medium rounded-lg text-blue-600 bg-white border-2 border-blue-600 hover:bg-blue-50 transition-all duration-200"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </a>
                  <a
                    href="https://sso.secureserver.net/account/create?plid=590175&prog_id=590175&realm=idp&path=%2Fproducts&app=account"
                    className="block w-full text-center px-4 py-3 text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Create Account
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
      
      {/* Cart Panel */}
      <CartPanel isOpen={cartPanelOpen} onClose={() => setCartPanelOpen(false)} />
    </>
  )
}