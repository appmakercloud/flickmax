'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, X, ChevronDown, ChevronRight, ShoppingCart, User, Globe, Phone, Server, Shield, Mail, TrendingUp, Layers, Code, Settings, Send } from 'lucide-react'
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
    ]
  },
  { 
    name: 'Websites',
    items: [
      { name: 'Website Builder', href: '/website-builder' },
      { name: 'WordPress', href: '/hosting/managed-wordpress' },
      { name: 'Development Services', href: '/services/development' },
    ]
  },
  {
    name: 'Hosting',
    items: [
      { name: 'Web Hosting', href: '/hosting/web-hosting' },
      { name: 'Managed WordPress', href: '/hosting/managed-wordpress' },
      { name: 'VPS Hosting', href: '/hosting/vps' },
      { name: 'Fully Managed VPS', href: '/hosting/fully-managed-vps' },
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
    ]
  },
  {
    name: 'Email',
    items: [
      { name: 'Professional Email', href: '/email/professional' },
      { name: 'Microsoft 365', href: '/email/microsoft-365' },
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

  // Handle scroll effect and header height
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    
    // Set header height for dropdown positioning
    const updateHeaderHeight = () => {
      const header = document.querySelector('header')
      if (header) {
        const height = header.offsetHeight
        document.documentElement.style.setProperty('--header-height', `${height}px`)
      }
    }
    
    updateHeaderHeight()
    window.addEventListener('resize', updateHeaderHeight)
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', updateHeaderHeight)
    }
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
        <div className="bg-white border-b border-gray-100">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-14 text-sm">
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
                <Link href="/" className="flex items-center space-x-2 group">
                  <div className="relative">
                    <div className="flex items-center space-x-2">
                      <div className="relative w-9 h-9">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl opacity-20 group-hover:opacity-30 transition-all duration-200 blur-xl" />
                        <div className="relative flex items-center justify-center w-full h-full bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl shadow-md group-hover:shadow-lg transition-all duration-200">
                          <span className="text-white font-bold text-xl">F</span>
                        </div>
                      </div>
                      <span className="text-[24px] font-bold text-gray-800 tracking-tight">Flickmax</span>
                    </div>
                  </div>
                </Link>
              </div>

              {/* Right side - Contact and User */}
              <div className="flex items-center space-x-2 sm:space-x-4 lg:space-x-6">
                {/* Phone - Hidden on mobile */}
                <a href={`tel:${country.phoneNumber.replace(/[^0-9+]/g, '')}`} className="hidden lg:flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors group">
                  <Phone className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                  <span className="text-[14px] font-medium">{country.phoneNumber}</span>
                </a>

                {/* Region Selector */}
                <HeadlessMenu as="div" className="relative">
                  <HeadlessMenu.Button className="flex items-center space-x-1.5 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-200 group">
                    <Globe className="w-4 h-4 flex-shrink-0 text-gray-400 group-hover:text-gray-600" />
                    <span className="hidden sm:inline text-[14px] font-medium">{country.name} - {country.currency}</span>
                    <span className="sm:hidden text-[14px] font-medium">{country.code}</span>
                    <ChevronDown className="w-3 h-3 text-gray-400 group-hover:text-gray-600" />
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
                <a href="https://www.secureserver.net/help?plid=590175" className="px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-200 text-[14px] font-medium">
                  Help
                </a>

                {/* Sign In Dropdown */}
                <HeadlessMenu as="div" className="relative">
                  {({ open }) => (
                    <>
                      <HeadlessMenu.Button className="flex items-center space-x-1.5 px-4 py-2 text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 rounded-lg transition-all duration-200 text-[14px] font-semibold shadow-md hover:shadow-lg transform hover:scale-105">
                        <User className="w-4 h-4 flex-shrink-0" />
                        <span className="hidden sm:inline">Sign In</span>
                        <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${open ? 'rotate-180' : ''} hidden sm:block`} />
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
                  className="relative p-2.5 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-all duration-200 group"
                  animate={isAnimating ? {
                    scale: [1, 1.2, 0.9, 1.1, 1],
                    rotate: [0, -10, 10, -10, 0],
                  } : {}}
                  transition={{ duration: 0.5 }}
                >
                  <ShoppingCart className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                  {cartItemsCount > 0 && (
                    <motion.span 
                      key={cartItemsCount}
                      initial={{ scale: 0, y: -10 }}
                      animate={{ scale: 1, y: 0 }}
                      className="absolute -top-1 -right-1 inline-flex items-center justify-center h-5 w-5 text-[11px] font-bold text-white bg-gradient-to-r from-red-500 to-rose-600 rounded-full shadow-sm"
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
        <nav className="hidden lg:block bg-gradient-to-b from-gray-50 to-white border-b border-gray-200" aria-label="Main">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Desktop Navigation */}
              <div className="flex items-center space-x-4">
                {navigation.map((item) => (
                  item.items ? (
                    <HeadlessMenu key={item.name} as="div" className="relative">
                      {({ open, close }) => (
                        <>
                          <HeadlessMenu.Button className={`
                              inline-flex items-center px-3 py-2 text-[18px] font-bold leading-[27px] rounded-xl transition-all duration-200 group relative
                              ${open 
                                ? 'text-blue-600 bg-gradient-to-r from-blue-50 to-cyan-50 shadow-sm' 
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-50/50'
                              }
                              ${open ? 'after:absolute after:bottom-[-13px] after:left-1/2 after:-translate-x-1/2 after:w-full after:h-1 after:bg-gradient-to-r after:from-blue-500 after:to-cyan-500 after:rounded-full' : ''}
                            `}>
                              {item.name}
                              <ChevronDown className={`ml-1.5 h-3.5 w-3.5 transition-transform duration-200 text-gray-400 group-hover:text-blue-500 ${
                                open ? 'rotate-180 text-blue-500' : ''
                              }`} />
                            </HeadlessMenu.Button>
                            
                            
                            <AnimatePresence>
                              {open && (
                                <motion.div
                                    initial={{ 
                                      opacity: 0, 
                                      height: 0,
                                      y: -10
                                    }}
                                    animate={{ 
                                      opacity: 1, 
                                      height: 'auto',
                                      y: 0
                                    }}
                                    exit={{ 
                                      opacity: 0,
                                      height: 0,
                                      y: -10
                                    }}
                                    transition={{ 
                                      duration: 0.4,
                                      ease: [0.16, 1, 0.3, 1],
                                      opacity: { duration: 0.3 },
                                      height: { duration: 0.4 }
                                    }}
                                    className="fixed inset-x-0 z-40 overflow-hidden"
                                    style={{ top: 'var(--header-height, 66px)' }}
                                  >
                                  <HeadlessMenu.Items static>
                                    <motion.div 
                                      initial={{ y: -20 }}
                                      animate={{ y: 0 }}
                                      transition={{ 
                                        duration: 0.5,
                                        ease: [0.16, 1, 0.3, 1]
                                      }}
                                      className="bg-white shadow-2xl">
                                  <div className="px-8 lg:px-12 py-10">
                                    {/* Section Title */}
                                    <div className="mb-8">
                                      <h2 className="text-3xl font-bold text-gray-900">{item.name}</h2>
                                      <p className="mt-2 text-base text-gray-600">
                                        {item.name === 'Domains' && 'Register, transfer, and manage your domains'}
                                        {item.name === 'Websites' && 'Build and grow your online presence'}
                                        {item.name === 'Hosting' && 'Reliable hosting solutions for every need'}
                                        {item.name === 'Security' && 'Protect your website and data'}
                                        {item.name === 'Marketing' && 'Grow your audience and business'}
                                        {item.name === 'Email' && 'Professional email solutions'}
                                      </p>
                                    </div>
                                    
                                    <motion.div 
                                      className={`grid gap-6 ${
                                        item.items.length <= 2 
                                          ? 'grid-cols-1 lg:grid-cols-2' 
                                          : item.items.length <= 3
                                          ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                                          : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                                      }`}
                                      initial="hidden"
                                      animate="visible"
                                      variants={{
                                        hidden: { opacity: 0 },
                                        visible: {
                                          opacity: 1,
                                          transition: {
                                            staggerChildren: 0.03,
                                            delayChildren: 0.1
                                          }
                                        }
                                      }}
                                    >
                                      {item.items.map((subItem, index) => (
                                        <HeadlessMenu.Item key={subItem.name}>
                                          {({ active }) => (
                                            <motion.div
                                              variants={{
                                                hidden: { 
                                                  opacity: 0, 
                                                  y: 15,
                                                  scale: 0.95
                                                },
                                                visible: { 
                                                  opacity: 1, 
                                                  y: 0,
                                                  scale: 1,
                                                  transition: {
                                                    type: "spring",
                                                    stiffness: 300,
                                                    damping: 24
                                                  }
                                                }
                                              }}
                                              whileHover={{ 
                                                y: -2,
                                                transition: { duration: 0.2 }
                                              }}
                                            >
                                              <Link
                                                  href={subItem.href}
                                                  onClick={() => {
                                                    // Close the menu when a link is clicked
                                                    close()
                                                  }}
                                                  className={`
                                                    group relative block p-6 rounded-xl transition-all duration-200 border-2
                                                    ${active 
                                                      ? 'bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-300 shadow-lg transform scale-105' 
                                                      : 'bg-white hover:bg-gradient-to-br hover:from-gray-50 hover:to-blue-50 border-gray-200 hover:border-blue-200 hover:shadow-lg hover:transform hover:scale-105'
                                                    }
                                                  `}
                                                >
                                                <div className="flex items-start space-x-4">
                                                  <div className="flex-shrink-0">
                                                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all shadow-lg ${
                                                      active ? 'bg-gradient-to-br from-blue-600 to-cyan-600 scale-110' : 'bg-gradient-to-br from-blue-500 to-cyan-500 group-hover:from-blue-600 group-hover:to-cyan-600 group-hover:scale-110'
                                                    }`}>
                                                      {/* Icons for each service */}
                                                      {subItem.name.includes('Domain') && <Globe className="w-7 h-7 text-white" />}
                                                      {subItem.name.includes('Hosting') && <Server className="w-7 h-7 text-white" />}
                                                      {subItem.name.includes('WordPress') && (
                                                        <svg className="w-7 h-7 text-white" viewBox="0 0 512 512" fill="currentColor">
                                                          <path d="M256 8C119.3 8 8 119.2 8 256c0 136.7 111.3 248 248 248s248-111.3 248-248C504 119.2 392.7 8 256 8zM33 256c0-32.3 6.9-63 19.3-90.7l106.4 291.4C84.3 420.5 33 344.2 33 256zm223 223c-21.9 0-43-3.2-63-9.1l66.9-194.4 68.5 187.8c.5 1.1 1 2.1 1.5 3.1-23.1 8.1-48 12.6-73.9 12.6zm30.7-327.5c13.4-.7 25.5-2.1 25.5-2.1 12-1.4 10.6-19.1-1.4-18.4 0 0-36.1 2.8-59.4 2.8-21.9 0-58.7-2.8-58.7-2.8-12-.7-13.4 17.7-1.4 18.4 0 0 11.4 1.4 23.4 2.1l34.7 95.2L200.6 393l-81.2-241.5c13.4-.7 25.5-2.1 25.5-2.1 12-1.4 10.6-19.1-1.4-18.4 0 0-36.1 2.8-59.4 2.8-4.2 0-9.1-.1-14.4-.3C109.6 73 178.1 33 256 33c58 0 110.9 22.2 150.6 58.5-1-.1-1.9-.2-2.9-.2-21.9 0-37.4 19.1-37.4 39.6 0 18.4 10.6 33.9 21.9 52.3 8.5 14.8 18.4 33.9 18.4 61.5 0 19.1-7.3 41.2-17 72.1l-22.2 74.3-80.7-239.6zm81.4 297.2l68.1-196.9c12.7-31.8 17-57.2 17-79.9 0-8.2-.5-15.8-1.5-22.9 17.4 31.8 27.3 68.2 27.3 107 0 82.3-44.6 154.1-110.9 192.7z"/>
                                                        </svg>
                                                      )}
                                                      {subItem.name === 'VPS Hosting' && <Server className="w-7 h-7 text-white" />}
                                                      {subItem.name === 'Fully Managed VPS' && (
                                                        <div className="relative">
                                                          <Server className="w-7 h-7 text-white" />
                                                          <Settings className="w-3 h-3 text-white absolute -top-1 -right-1" />
                                                        </div>
                                                      )}
                                                      {subItem.name.includes('SSL') && <Shield className="w-7 h-7 text-white" />}
                                                      {subItem.name.includes('Security') && <Shield className="w-7 h-7 text-white" />}
                                                      {subItem.name.includes('Backup') && <Shield className="w-7 h-7 text-white" />}
                                                      {subItem.name === 'Professional Email' && <Mail className="w-7 h-7 text-white" />}
                                                      {subItem.name === 'Microsoft 365' && <Mail className="w-7 h-7 text-white" />}
                                                      {subItem.name === 'Email Marketing' && (
                                                        <div className="relative">
                                                          <Mail className="w-7 h-7 text-white" />
                                                          <TrendingUp className="w-3 h-3 text-white absolute -top-1 -right-1" />
                                                        </div>
                                                      )}
                                                      {subItem.name.includes('SEO') && <TrendingUp className="w-7 h-7 text-white" />}
                                                      {subItem.name.includes('Builder') && <Layers className="w-7 h-7 text-white" />}
                                                      {subItem.name.includes('Development') && <Code className="w-7 h-7 text-white" />}
                                                      {!subItem.name.includes('Domain') && !subItem.name.includes('Hosting') && !subItem.name.includes('WordPress') && 
                                                       subItem.name !== 'VPS Hosting' && subItem.name !== 'Fully Managed VPS' && !subItem.name.includes('SSL') && !subItem.name.includes('Security') && 
                                                       !subItem.name.includes('Backup') && subItem.name !== 'Professional Email' && subItem.name !== 'Microsoft 365' && subItem.name !== 'Email Marketing' && 
                                                       !subItem.name.includes('SEO') && !subItem.name.includes('Builder') && !subItem.name.includes('Development') && <Globe className="w-7 h-7 text-white" />}
                                                    </div>
                                                  </div>
                                                  <div className="flex-1 min-w-0">
                                                    <h3 className={`text-base font-semibold mb-2 ${active ? 'text-blue-600' : 'text-gray-900'} group-hover:text-blue-600 transition-colors`}>
                                                      {subItem.name}
                                                    </h3>
                                                    <p className="text-sm text-gray-600 leading-relaxed">
                                                      {subItem.name === 'Domain Name Search' && 'Find and register your perfect domain name'}
                                                      {subItem.name === 'Domain Transfer' && 'Transfer your domains to Flickmax easily'}
                                                      {subItem.name === 'Web Hosting' && 'Fast, secure, and reliable web hosting'}
                                                      {subItem.name === 'Managed WordPress' && 'Optimized hosting for WordPress sites'}
                                                      {subItem.name === 'VPS Hosting' && 'Powerful virtual private servers'}
                                                      {subItem.name === 'Fully Managed VPS' && 'Let us handle your server management'}
                                                      {subItem.name === 'SSL Certificates' && 'Secure your website with SSL'}
                                                      {subItem.name === 'Website Security' && 'Complete website protection'}
                                                      {subItem.name === 'Website Backup' && 'Automatic backups for peace of mind'}
                                                      {subItem.name === 'Email Marketing' && 'Reach and engage your audience'}
                                                      {subItem.name === 'SEO Tools' && 'Improve your search rankings'}
                                                      {subItem.name === 'Professional Email' && 'Business email at your domain'}
                                                      {subItem.name === 'Microsoft 365' && 'Complete productivity suite'}
                                                      {subItem.name === 'Website Builder' && 'Create your website with ease'}
                                                      {subItem.name === 'WordPress' && 'Managed WordPress hosting'}
                                                      {subItem.name === 'Development Services' && 'Custom development solutions'}
                                                    </p>
                                                  </div>
                                                </div>
                                                
                                                {/* Arrow indicator */}
                                                <div className={`absolute right-4 top-1/2 -translate-y-1/2 transition-all ${
                                                  active ? 'translate-x-1 opacity-100' : 'translate-x-0 opacity-0 group-hover:translate-x-1 group-hover:opacity-100'
                                                }`}>
                                                  <ChevronRight className="w-5 h-5 text-blue-600" />
                                                </div>
                                              </Link>
                                            </motion.div>
                                          )}
                                        </HeadlessMenu.Item>
                                      ))}
                                    </motion.div>
                                  </div>
                                    </motion.div>
                                  </HeadlessMenu.Items>
                                </motion.div>
                              )}
                            </AnimatePresence>
                        </>
                      )}
                    </HeadlessMenu>
                  ) : (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="inline-flex items-center px-3 py-2 text-[18px] font-bold leading-[27px] text-gray-600 hover:text-gray-900 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-50/50 rounded-xl transition-all duration-200"
                    >
                      {item.name}
                    </Link>
                  )
                ))}
              </div>
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