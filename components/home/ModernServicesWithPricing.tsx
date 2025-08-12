'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Globe, Server, Mail, Shield, Zap, HeadphonesIcon, Database, Palette, Lock, Award, Rocket, Activity, Sparkles } from 'lucide-react'
import { useCountry } from '@/contexts/CountryContext'
import { formatCurrency } from '@/lib/countries'
import { useRouter } from 'next/navigation'

const categories = [
  { id: 'hosting-domains', name: 'Hosting & Domains', icon: Server },
  { id: 'websites-tools', name: 'Websites & Tools', icon: Palette },
]

interface ProductPrice {
  amount: number
  currency: string
  period: string
}

interface Product {
  id: string
  title: string
  description: string
  features: string[]
  price: ProductPrice | null
  cta: string
  href: string
  icon: any
  badge?: string
  recommended?: boolean
  loading?: boolean
}

export default function ModernServicesWithPricing() {
  const [activeTab, setActiveTab] = useState('hosting-domains')
  const { currency, country } = useCountry()
  const router = useRouter()
  const [products, setProducts] = useState<Record<string, Product[]>>({
    'hosting-domains': [],
    'websites-tools': []
  })
  const [loading, setLoading] = useState(true)

  // Fetch real pricing data
  useEffect(() => {
    const fetchPricing = async () => {
      setLoading(true)
      
      try {
        // Fetch SSL pricing
        const sslResponse = await fetch(`/api/products/ssl?currency=${currency}&market=${country.marketId}`)
        const sslResult = await sslResponse.json()
        console.log('SSL API Response:', sslResult)
        const sslPrice = sslResult.data?.products?.[0]?.price?.yearly || 9.99

        // Fetch Hosting pricing (fallback to hardcoded since no API endpoint exists)
        const hostingPrice = 2.99 // Hardcoded as no web-hosting API endpoint exists

        // Fetch VPS pricing  
        const vpsResponse = await fetch(`/api/products/vps-hosting?currency=${currency}&market=${country.marketId}`)
        const vpsResult = await vpsResponse.json()
        console.log('VPS API Response:', vpsResult)
        const vpsPrice = vpsResult.plans?.standard?.[0]?.monthlyPrice || 19.99

        // Fetch WordPress pricing
        const wpResponse = await fetch(`/api/products/wordpress-hosting?currency=${currency}&market=${country.marketId}`)
        const wpResult = await wpResponse.json()
        console.log('WordPress API Response:', wpResult)
        const wpPrice = wpResult.plans?.[0]?.monthlyPrice || 14.99

        // Fetch Website Builder pricing
        const builderResponse = await fetch(`/api/products/website-builder?currency=${currency}&market=${country.marketId}`)
        const builderResult = await builderResponse.json()
        console.log('Website Builder API Response:', builderResult)
        const builderPrice = builderResult.plans?.[0]?.monthlyPrice || 9.99

        // Fetch Email pricing
        const emailResponse = await fetch(`/api/products/professional-email?currency=${currency}&market=${country.marketId}`)
        const emailResult = await emailResponse.json()
        console.log('Email API Response:', emailResult)
        const emailPrice = emailResult.data?.products?.[0]?.price?.monthly || 3.99

        // Fetch Security pricing
        const securityResponse = await fetch(`/api/products/website-security?currency=${currency}&market=${country.marketId}`)
        const securityResult = await securityResponse.json()
        console.log('Security API Response:', securityResult)
        const securityPrice = securityResult.data?.products?.[0]?.price?.monthly || 19.99

        console.log('Extracted Prices:', {
          ssl: sslPrice,
          hosting: hostingPrice,
          vps: vpsPrice,
          wordpress: wpPrice,
          builder: builderPrice,
          email: emailPrice,
          security: securityPrice
        })

        // Update products with real pricing
        setProducts({
          'hosting-domains': [
            {
              id: 'ssl',
              title: 'SSL Certificates',
              description: 'Secure your website with industry-leading SSL certificates. Boost SEO rankings and customer trust.',
              features: ['256-bit encryption', 'Instant activation', 'Green padlock display', 'SEO boost'],
              price: sslPrice ? {
                amount: sslPrice,
                currency: currency,
                period: '/year'
              } : null,
              cta: 'Secure Your Site',
              href: '/security/ssl',
              recommended: true,
              icon: Shield,
              badge: 'MOST POPULAR',
            },
            {
              id: 'hosting',
              title: 'Premium Web Hosting',
              description: 'Lightning-fast hosting with 99.99% uptime. Perfect for businesses that demand reliability.',
              features: ['Unlimited bandwidth', 'Free SSL included', '24/7 expert support', 'One-click installs'],
              price: hostingPrice ? {
                amount: hostingPrice,
                currency: currency,
                period: '/month'
              } : null,
              cta: 'Start Hosting',
              href: '/hosting/web-hosting',
              icon: Server,
              badge: '75% OFF',
            },
            {
              id: 'domains',
              title: 'Domain Registration',
              description: 'Find and register your perfect domain name. Includes free WHOIS privacy protection.',
              features: ['500+ extensions', 'Free WHOIS privacy', 'DNS management', 'Easy transfers'],
              price: {
                amount: 0.99,
                currency: currency,
                period: '/first year'
              },
              cta: 'Search Domains',
              href: '/domains/search',
              icon: Globe,
            },
            {
              id: 'vps',
              title: 'VPS Hosting',
              description: 'Get dedicated resources and full root access with our powerful VPS solutions.',
              features: ['Full root access', 'SSD storage', 'Scalable resources', 'Multiple OS options'],
              price: vpsPrice ? {
                amount: vpsPrice,
                currency: currency,
                period: '/month'
              } : null,
              cta: 'Configure VPS',
              href: '/hosting/vps',
              icon: Database,
            },
          ],
          'websites-tools': [
            {
              id: 'wordpress',
              title: 'Managed WordPress',
              description: 'AI-powered WordPress hosting with automatic updates, backups, and optimization.',
              features: ['AI setup assistant', 'Auto updates', 'Daily backups', 'Speed optimization'],
              price: wpPrice ? {
                amount: wpPrice,
                currency: currency,
                period: '/month'
              } : null,
              cta: 'Launch WordPress',
              href: '/hosting/managed-wordpress',
              icon: Rocket,
              recommended: true,
              badge: 'AI POWERED',
            },
            {
              id: 'builder',
              title: 'Website Builder',
              description: 'Create stunning websites in minutes with our drag-and-drop builder. No coding required.',
              features: ['1000+ templates', 'Mobile responsive', 'SEO tools', 'E-commerce ready'],
              price: builderPrice ? {
                amount: builderPrice,
                currency: currency,
                period: '/month'
              } : null,
              cta: 'Start Building',
              href: '/website-builder',
              icon: Palette,
            },
            {
              id: 'email',
              title: 'Professional Email',
              description: 'Get professional email addresses with your domain. Includes spam protection.',
              features: ['Custom domain email', 'Spam protection', 'Mobile sync', 'Team collaboration'],
              price: emailPrice ? {
                amount: emailPrice,
                currency: currency,
                period: '/user/month'
              } : null,
              cta: 'Get Email',
              href: '/email/professional',
              icon: Mail,
            },
            {
              id: 'security',
              title: 'Website Security',
              description: 'Complete protection against malware, DDoS attacks, and other threats.',
              features: ['Malware scanning', 'DDoS protection', 'Web firewall', 'Daily monitoring'],
              price: securityPrice ? {
                amount: securityPrice,
                currency: currency,
                period: '/month'
              } : null,
              cta: 'Protect Site',
              href: '/security/website',
              icon: Lock,
              badge: 'ADVANCED',
            },
          ]
        })
      } catch (error) {
        console.error('Error fetching pricing:', error)
        // Fallback to default pricing if API fails
        setProducts({
          'hosting-domains': [
            {
              id: 'ssl',
              title: 'SSL Certificates',
              description: 'Secure your website with industry-leading SSL certificates. Boost SEO rankings and customer trust.',
              features: ['256-bit encryption', 'Instant activation', 'Green padlock display', 'SEO boost'],
              price: { amount: 9.99, currency: 'USD', period: '/year' },
              cta: 'Secure Your Site',
              href: '/security/ssl',
              recommended: true,
              icon: Shield,
              badge: 'MOST POPULAR',
            },
            {
              id: 'hosting',
              title: 'Premium Web Hosting',
              description: 'Lightning-fast hosting with 99.99% uptime. Perfect for businesses that demand reliability.',
              features: ['Unlimited bandwidth', 'Free SSL included', '24/7 expert support', 'One-click installs'],
              price: { amount: 2.99, currency: 'USD', period: '/month' },
              cta: 'Start Hosting',
              href: '/hosting/web-hosting',
              icon: Server,
              badge: '75% OFF',
            },
            {
              id: 'domains',
              title: 'Domain Registration',
              description: 'Find and register your perfect domain name. Includes free WHOIS privacy protection.',
              features: ['500+ extensions', 'Free WHOIS privacy', 'DNS management', 'Easy transfers'],
              price: { amount: 0.99, currency: 'USD', period: '/first year' },
              cta: 'Search Domains',
              href: '/domains/search',
              icon: Globe,
            },
            {
              id: 'vps',
              title: 'VPS Hosting',
              description: 'Get dedicated resources and full root access with our powerful VPS solutions.',
              features: ['Full root access', 'SSD storage', 'Scalable resources', 'Multiple OS options'],
              price: { amount: 19.99, currency: 'USD', period: '/month' },
              cta: 'Configure VPS',
              href: '/hosting/vps',
              icon: Database,
            },
          ],
          'websites-tools': [
            {
              id: 'wordpress',
              title: 'Managed WordPress',
              description: 'AI-powered WordPress hosting with automatic updates, backups, and optimization.',
              features: ['AI setup assistant', 'Auto updates', 'Daily backups', 'Speed optimization'],
              price: { amount: 14.99, currency: 'USD', period: '/month' },
              cta: 'Launch WordPress',
              href: '/hosting/managed-wordpress',
              icon: Rocket,
              recommended: true,
              badge: 'AI POWERED',
            },
            {
              id: 'builder',
              title: 'Website Builder',
              description: 'Create stunning websites in minutes with our drag-and-drop builder. No coding required.',
              features: ['1000+ templates', 'Mobile responsive', 'SEO tools', 'E-commerce ready'],
              price: { amount: 9.99, currency: 'USD', period: '/month' },
              cta: 'Start Building',
              href: '/website-builder',
              icon: Palette,
            },
            {
              id: 'email',
              title: 'Professional Email',
              description: 'Get professional email addresses with your domain. Includes spam protection.',
              features: ['Custom domain email', 'Spam protection', 'Mobile sync', 'Team collaboration'],
              price: { amount: 3.99, currency: 'USD', period: '/user/month' },
              cta: 'Get Email',
              href: '/email/professional',
              icon: Mail,
            },
            {
              id: 'security',
              title: 'Website Security',
              description: 'Complete protection against malware, DDoS attacks, and other threats.',
              features: ['Malware scanning', 'DDoS protection', 'Web firewall', 'Daily monitoring'],
              price: { amount: 19.99, currency: 'USD', period: '/month' },
              cta: 'Protect Site',
              href: '/security/website',
              icon: Lock,
              badge: 'ADVANCED',
            },
          ]
        })
      } finally {
        setLoading(false)
      }
    }

    fetchPricing()
  }, [currency, country.marketId])

  const currentServices = products[activeTab as keyof typeof products] || []

  const formatPrice = (price: ProductPrice | null) => {
    if (!price) return 'Loading...'
    return formatCurrency(price.amount, price.currency)
  }

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
              {currentServices.map((product, index) => (
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
                          {loading ? (
                            <div className="h-8 w-24 bg-gray-200 animate-pulse rounded" />
                          ) : (
                            <>
                              <span className="text-3xl font-bold text-gray-900">
                                {formatPrice(product.price)}
                              </span>
                              <span className="text-gray-600 ml-1">{product.price?.period}</span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* CTA Button */}
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => router.push(product.href)}
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