'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Globe, Server, Mail, Shield, Zap, HeadphonesIcon, Database, Palette, ShoppingCart, Lock, Wifi, CreditCard } from 'lucide-react'
import Image from 'next/image'

const categories = [
  { id: 'hosting-ssl', name: 'Hosting & SSL' },
  { id: 'websites-wordpress', name: 'Websites & WordPress' },
  { id: 'sell-online', name: 'Sell Online' },
]

const servicesData = {
  'hosting-ssl': {
    mainProducts: [
      {
        id: 'ssl',
        title: 'SSL Certificates',
        description: 'Help keep sensitive data secure on your site and boost search ranking with an SSL Certificate.',
        features: ['Data is encrypted', 'Connection is secure', 'Certificate is valid'],
        cta: 'Secure Your Data',
        recommended: true,
        icon: Shield,
        promoText: 'Boost SEO rankings',
        bgGradient: 'from-teal-50 to-cyan-50',
        iconBg: 'bg-teal-100',
        iconColor: 'text-teal-600',
        decorativeCircle: 'bg-teal-200',
      },
      {
        id: 'hosting',
        title: 'Web Hosting',
        description: 'Get superior performance, fast load times and 99.9% uptime guaranteed.***',
        features: ['Lightning fast servers', '24/7 support', 'Free SSL included'],
        cta: 'View Plans and Pricing',
        icon: Server,
        promoText: 'Starting at $2.99/mo',
        bgGradient: 'from-pink-50 to-rose-50',
        iconBg: 'bg-pink-100',
        iconColor: 'text-pink-600',
        decorativeCircle: 'bg-pink-200',
        badge: '40% faster',
      },
    ],
    smallCards: [
      {
        id: 'domains',
        icon: Globe,
        title: 'Domain Names',
        description: 'Register your perfect domain name from just $0.99/year',
        features: ['Free WHOIS Privacy', 'DNS Management', 'Domain Forwarding'],
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-600',
      },
      {
        id: 'vps',
        icon: Server,
        title: 'VPS Hosting',
        description: 'Full root access with scalable performance',
        features: ['Root access', 'SSD storage', 'Scalable resources'],
        iconBg: 'bg-green-100',
        iconColor: 'text-green-600',
      },
      {
        id: 'security',
        icon: Shield,
        title: 'Website Security',
        description: 'Protect your website from threats',
        features: ['Malware scanning', 'DDoS protection', 'Web firewall'],
        iconBg: 'bg-red-100',
        iconColor: 'text-red-600',
      },
    ],
  },
  'websites-wordpress': {
    mainProducts: [
      {
        id: 'wordpress',
        title: 'Hosting for WordPress',
        description: 'Let AI quickly build your fully-managed site, worry-free.',
        features: ['AI-powered setup', 'Automatic updates', 'Enhanced security'],
        cta: 'Explore Plans',
        icon: Database,
        promoText: 'AI-powered setup',
        recommended: true,
        bgGradient: 'from-purple-50 to-indigo-50',
        iconBg: 'bg-purple-100',
        iconColor: 'text-purple-600',
        decorativeCircle: 'bg-purple-200',
      },
      {
        id: 'builder',
        title: 'Website Builder',
        description: 'Create a stunning website in minutes with our drag-and-drop builder.',
        features: ['100+ templates', 'Mobile responsive', 'SEO tools included'],
        cta: 'Start Building',
        icon: Palette,
        promoText: 'No coding required',
        badge: 'Easy to use',
        bgGradient: 'from-yellow-50 to-amber-50',
        iconBg: 'bg-yellow-100',
        iconColor: 'text-yellow-600',
        decorativeCircle: 'bg-yellow-200',
      },
    ],
    smallCards: [
      {
        id: 'design',
        icon: Palette,
        title: 'Website Design Service',
        description: 'Get a custom website designed by professionals',
        features: ['Custom design', 'Mobile optimized', '5 pages included'],
        iconBg: 'bg-purple-100',
        iconColor: 'text-purple-600',
      },
      {
        id: 'optimization',
        icon: Zap,
        title: 'Website Optimization',
        description: 'Speed up your website performance',
        features: ['Page speed boost', 'Image optimization', 'Cache setup'],
        iconBg: 'bg-yellow-100',
        iconColor: 'text-yellow-600',
      },
      {
        id: 'backup',
        icon: Database,
        title: 'Website Backup',
        description: 'Never lose your website data',
        features: ['Daily backups', 'One-click restore', '30-day retention'],
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-600',
      },
    ],
  },
  'sell-online': {
    mainProducts: [
      {
        id: 'ecommerce',
        title: 'Online Store',
        description: 'Everything you need to create a successful online store.',
        features: ['Payment processing', 'Inventory management', 'Shipping integration'],
        cta: 'Start Selling',
        icon: ShoppingCart,
        promoText: 'Sell everywhere',
        badge: 'All-in-one',
        bgGradient: 'from-green-50 to-emerald-50',
        iconBg: 'bg-green-100',
        iconColor: 'text-green-600',
        decorativeCircle: 'bg-green-200',
      },
      {
        id: 'marketplace',
        title: 'Marketplace Integration',
        description: 'Sell on Amazon, eBay, and more from one dashboard.',
        features: ['Multi-channel selling', 'Inventory sync', 'Order management'],
        cta: 'Learn More',
        icon: Zap,
        promoText: 'Expand your reach',
        recommended: true,
        bgGradient: 'from-orange-50 to-red-50',
        iconBg: 'bg-orange-100',
        iconColor: 'text-orange-600',
        decorativeCircle: 'bg-orange-200',
      },
    ],
    smallCards: [
      {
        id: 'cart',
        icon: ShoppingCart,
        title: 'Shopping Cart',
        description: 'Secure checkout for your customers',
        features: ['PCI compliant', 'Multiple payment options', 'Guest checkout'],
        iconBg: 'bg-green-100',
        iconColor: 'text-green-600',
      },
      {
        id: 'email',
        icon: Mail,
        title: 'Email Marketing',
        description: 'Reach customers with targeted campaigns',
        features: ['Email templates', 'Automation', 'Analytics'],
        iconBg: 'bg-purple-100',
        iconColor: 'text-purple-600',
      },
      {
        id: 'support',
        icon: HeadphonesIcon,
        title: 'Customer Support Tools',
        description: 'Provide excellent customer service',
        features: ['Live chat', 'Ticketing system', 'Knowledge base'],
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-600',
      },
    ],
  },
}

export default function ModernServices() {
  const [activeTab, setActiveTab] = useState('hosting-ssl')
  const currentServices = servicesData[activeTab as keyof typeof servicesData]

  return (
    <section className="py-20 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 mb-8">
            Explore Flickmax Products
          </h2>
          
          {/* Tab Navigation */}
          <div className="flex justify-center">
            <div className="inline-flex rounded-full bg-gray-100 p-1.5 shadow-inner">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveTab(category.id)}
                  className={`px-8 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                    activeTab === category.id
                      ? 'bg-gray-900 text-white shadow-md transform scale-105'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-12"
          >
            {/* Main Product Cards */}
            <div className="grid md:grid-cols-2 gap-8">
              {currentServices.mainProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative group"
                >
                  <div className={`relative rounded-3xl p-8 h-full overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 ${
                    product.id === 'ssl' ? 'bg-gradient-to-br from-teal-50 to-cyan-50' :
                    product.id === 'hosting' ? 'bg-gradient-to-br from-pink-50 to-rose-50' :
                    product.id === 'wordpress' ? 'bg-gradient-to-br from-purple-50 to-indigo-50' :
                    product.id === 'builder' ? 'bg-gradient-to-br from-yellow-50 to-amber-50' :
                    product.id === 'ecommerce' ? 'bg-gradient-to-br from-green-50 to-emerald-50' :
                    product.id === 'marketplace' ? 'bg-gradient-to-br from-orange-50 to-red-50' :
                    'bg-gray-50'
                  }`}>
                    {/* Badges */}
                    {product.recommended && (
                      <span className="absolute top-6 left-6 bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                        RECOMMENDED
                      </span>
                    )}
                    
                    {product.badge && (
                      <span className="absolute top-6 right-6 bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                        {product.badge}
                      </span>
                    )}

                    {/* Decorative Circle */}
                    <div className={`absolute -bottom-20 -right-20 w-64 h-64 rounded-full opacity-20 blur-3xl ${
                      product.id === 'ssl' ? 'bg-teal-200' :
                      product.id === 'hosting' ? 'bg-pink-200' :
                      product.id === 'wordpress' ? 'bg-purple-200' :
                      product.id === 'builder' ? 'bg-yellow-200' :
                      product.id === 'ecommerce' ? 'bg-green-200' :
                      product.id === 'marketplace' ? 'bg-orange-200' :
                      'bg-gray-200'
                    }`}></div>

                    {/* Content */}
                    <div className="relative z-10 mt-10">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-2">
                            {product.title}
                          </h3>
                          {product.promoText && (
                            <p className="text-sm font-medium text-gray-600">
                              {product.promoText}
                            </p>
                          )}
                        </div>
                        {product.icon && (
                          <div className={`inline-flex p-3 rounded-xl ${
                            product.id === 'ssl' ? 'bg-teal-100' :
                            product.id === 'hosting' ? 'bg-pink-100' :
                            product.id === 'wordpress' ? 'bg-purple-100' :
                            product.id === 'builder' ? 'bg-yellow-100' :
                            product.id === 'ecommerce' ? 'bg-green-100' :
                            product.id === 'marketplace' ? 'bg-orange-100' :
                            'bg-gray-100'
                          }`}>
                            <product.icon className={`h-6 w-6 ${
                              product.id === 'ssl' ? 'text-teal-600' :
                              product.id === 'hosting' ? 'text-pink-600' :
                              product.id === 'wordpress' ? 'text-purple-600' :
                              product.id === 'builder' ? 'text-yellow-600' :
                              product.id === 'ecommerce' ? 'text-green-600' :
                              product.id === 'marketplace' ? 'text-orange-600' :
                              'text-gray-600'
                            }`} />
                          </div>
                        )}
                      </div>
                      <p className="text-gray-700 mb-6 leading-relaxed">
                        {product.description}
                      </p>
                      
                      <ul className="space-y-3 mb-8">
                        {product.features.map((feature, i) => (
                          <li key={i} className="flex items-start">
                            <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-gray-700">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-gray-900 text-white font-semibold py-3 px-8 rounded-full hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl"
                      >
                        {product.cta}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Small Service Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              {currentServices.smallCards.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                  className={`rounded-2xl p-6 shadow-md hover:shadow-2xl transition-all duration-300 ${
                    service.id === 'domains' ? 'bg-blue-50' :
                    service.id === 'vps' ? 'bg-green-50' :
                    service.id === 'security' ? 'bg-red-50' :
                    service.id === 'design' ? 'bg-purple-50' :
                    service.id === 'optimization' ? 'bg-yellow-50' :
                    service.id === 'backup' ? 'bg-blue-50' :
                    service.id === 'cart' ? 'bg-green-50' :
                    service.id === 'email' ? 'bg-purple-50' :
                    service.id === 'support' ? 'bg-blue-50' :
                    'bg-gray-50'
                  }`}
                >
                  <div className={`inline-flex p-4 rounded-xl mb-4 ${
                    service.id === 'domains' ? 'bg-blue-100' :
                    service.id === 'vps' ? 'bg-green-100' :
                    service.id === 'security' ? 'bg-red-100' :
                    service.id === 'design' ? 'bg-purple-100' :
                    service.id === 'optimization' ? 'bg-yellow-100' :
                    service.id === 'backup' ? 'bg-blue-100' :
                    service.id === 'cart' ? 'bg-green-100' :
                    service.id === 'email' ? 'bg-purple-100' :
                    service.id === 'support' ? 'bg-blue-100' :
                    'bg-gray-100'
                  }`}>
                    <service.icon className={`h-6 w-6 ${
                      service.id === 'domains' ? 'text-blue-600' :
                      service.id === 'vps' ? 'text-green-600' :
                      service.id === 'security' ? 'text-red-600' :
                      service.id === 'design' ? 'text-purple-600' :
                      service.id === 'optimization' ? 'text-yellow-600' :
                      service.id === 'backup' ? 'text-blue-600' :
                      service.id === 'cart' ? 'text-green-600' :
                      service.id === 'email' ? 'text-purple-600' :
                      service.id === 'support' ? 'text-blue-600' :
                      'text-gray-600'
                    }`} />
                  </div>
                  
                  <h4 className="text-xl font-bold text-gray-900 mb-3">
                    {service.title}
                  </h4>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {service.description}
                  </p>
                  
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-start text-sm">
                        <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <a
                    href="#"
                    className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-semibold group"
                  >
                    Learn more
                    <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}