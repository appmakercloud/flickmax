'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Globe, Server, Mail, Shield, Zap, HeadphonesIcon, Database, Palette, Lock, Award, Rocket, Activity, Sparkles } from 'lucide-react'

const categories = [
  { id: 'hosting-domains', name: 'Hosting & Domains', icon: Server },
  { id: 'websites-tools', name: 'Websites & Tools', icon: Palette },
]

const servicesData = {
  'hosting-domains': {
    mainProducts: [
      {
        id: 'ssl',
        title: 'SSL Certificates',
        description: 'Secure your website with industry-leading SSL certificates. Boost SEO rankings and customer trust.',
        features: ['256-bit encryption', 'Instant activation', 'Green padlock display', 'SEO boost'],
        price: '$9.99',
        period: '/year',
        cta: 'Secure Your Site',
        recommended: true,
        icon: Shield,
        badge: 'MOST POPULAR',
      },
      {
        id: 'hosting',
        title: 'Premium Web Hosting',
        description: 'Lightning-fast hosting with 99.99% uptime. Perfect for businesses that demand reliability.',
        features: ['Unlimited bandwidth', 'Free SSL included', '24/7 expert support', 'One-click installs'],
        price: '$2.99',
        period: '/month',
        cta: 'Start Hosting',
        icon: Server,
        badge: '75% OFF',
      },
      {
        id: 'domains',
        title: 'Domain Registration',
        description: 'Find and register your perfect domain name. Includes free WHOIS privacy protection.',
        features: ['500+ extensions', 'Free WHOIS privacy', 'DNS management', 'Easy transfers'],
        price: '$0.99',
        period: '/first year',
        cta: 'Search Domains',
        icon: Globe,
      },
      {
        id: 'vps',
        title: 'VPS Hosting',
        description: 'Get dedicated resources and full root access with our powerful VPS solutions.',
        features: ['Full root access', 'SSD storage', 'Scalable resources', 'Multiple OS options'],
        price: '$19.99',
        period: '/month',
        cta: 'Configure VPS',
        icon: Database,
      },
    ],
  },
  'websites-tools': {
    mainProducts: [
      {
        id: 'wordpress',
        title: 'Managed WordPress',
        description: 'AI-powered WordPress hosting with automatic updates, backups, and optimization.',
        features: ['AI setup assistant', 'Auto updates', 'Daily backups', 'Speed optimization'],
        price: '$14.99',
        period: '/month',
        cta: 'Launch WordPress',
        icon: Rocket,
        recommended: true,
        badge: 'AI POWERED',
      },
      {
        id: 'builder',
        title: 'Website Builder',
        description: 'Create stunning websites in minutes with our drag-and-drop builder. No coding required.',
        features: ['1000+ templates', 'Mobile responsive', 'SEO tools', 'E-commerce ready'],
        price: '$9.99',
        period: '/month',
        cta: 'Start Building',
        icon: Palette,
      },
      {
        id: 'email',
        title: 'Professional Email',
        description: 'Get professional email addresses with your domain. Includes spam protection.',
        features: ['Custom domain email', 'Spam protection', 'Mobile sync', 'Team collaboration'],
        price: '$3.99',
        period: '/user/month',
        cta: 'Get Email',
        icon: Mail,
      },
      {
        id: 'security',
        title: 'Website Security',
        description: 'Complete protection against malware, DDoS attacks, and other threats.',
        features: ['Malware scanning', 'DDoS protection', 'Web firewall', 'Daily monitoring'],
        price: '$19.99',
        period: '/month',
        cta: 'Protect Site',
        icon: Lock,
        badge: 'ADVANCED',
      },
    ],
  },
}

export default function ModernServices() {
  const [activeTab, setActiveTab] = useState('hosting-domains')
  const currentServices = servicesData[activeTab as keyof typeof servicesData]

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Modern gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
      </div>
      
      {/* Animated gradient orbs */}
      <motion.div
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-20 left-0 w-96 h-96 bg-blue-200 rounded-full filter blur-3xl opacity-20"
      />
      <motion.div
        animate={{
          x: [0, -100, 0],
          y: [0, 50, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute bottom-20 right-0 w-96 h-96 bg-cyan-200 rounded-full filter blur-3xl opacity-20"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600/10 to-cyan-600/10 backdrop-blur-sm rounded-full text-blue-700 text-sm font-medium mb-6 border border-blue-200/30"
          >
            <Sparkles className="w-4 h-4" />
            <span>Trusted by 5,000+ Businesses Worldwide</span>
          </motion.div>
          
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 mb-8">
            Everything You Need to
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600 mt-2">
              Grow Your Business
            </span>
          </h2>
          
          {/* Modern Tab Navigation */}
          <div className="flex justify-center">
            <div className="inline-flex p-1.5 bg-gray-100/80 backdrop-blur-sm rounded-2xl shadow-inner">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveTab(category.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    activeTab === category.id
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg transform scale-105'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <category.icon className="w-4 h-4" />
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
          >
            {/* Product Cards Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {currentServices.mainProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className="group relative"
                >
                  <div className="relative h-full bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100/50 overflow-hidden group-hover:border-blue-200/50">
                    {/* Background gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-cyan-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Badge */}
                    {product.badge && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`absolute top-4 right-4 px-3 py-1 text-xs font-bold rounded-full ${
                          product.recommended 
                            ? 'bg-gradient-to-r from-green-400 to-emerald-400 text-white'
                            : 'bg-gradient-to-r from-blue-400 to-cyan-400 text-white'
                        }`}
                      >
                        {product.badge}
                      </motion.span>
                    )}

                    {/* Content */}
                    <div className="relative z-10">
                      {/* Icon */}
                      <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100 text-blue-600 mb-4">
                        <product.icon className="h-6 w-6" />
                      </div>

                      {/* Title & Description */}
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {product.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {product.description}
                      </p>

                      {/* Features */}
                      <ul className="space-y-2 mb-6">
                        {product.features.slice(0, 3).map((feature, i) => (
                          <li key={i} className="flex items-start text-sm">
                            <Activity className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Price */}
                      <div className="mb-4">
                        <div className="flex items-baseline">
                          <span className="text-3xl font-bold text-gray-900">{product.price}</span>
                          <span className="text-gray-600 ml-1">{product.period}</span>
                        </div>
                      </div>

                      {/* CTA Button */}
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                          product.recommended
                            ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700 shadow-lg hover:shadow-xl'
                            : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                        }`}
                      >
                        {product.cta}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Trust Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              <div className="text-center">
                <Shield className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">SSL Secured</p>
                <p className="text-xs text-gray-600">256-bit encryption</p>
              </div>
              <div className="text-center">
                <Award className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">Money Back</p>
                <p className="text-xs text-gray-600">30-day guarantee</p>
              </div>
              <div className="text-center">
                <HeadphonesIcon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">24/7 Support</p>
                <p className="text-xs text-gray-600">Expert assistance</p>
              </div>
              <div className="text-center">
                <Zap className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">Instant Setup</p>
                <p className="text-xs text-gray-600">Start in minutes</p>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}