'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSSLProducts, SSLProduct } from '@/hooks/useSSLProducts'
import { useCountry } from '@/contexts/CountryContext'
import { formatCurrency } from '@/lib/countries'
import { useCart } from '@/contexts/CartContext'
import toast from 'react-hot-toast'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { 
  Shield, 
  Lock, 
  CheckCircle, 
  Zap, 
  Globe, 
  Server,
  Award,
  TrendingUp,
  Users,
  Building,
  Sparkles,
  ChevronRight,
  Star,
  ShieldCheck,
  Clock,
  Headphones,
  CreditCard,
  ArrowRight,
  Check,
  X,
  Info,
  AlertCircle,
  Cpu,
  Settings,
  RefreshCw,
  FileCheck,
  ChevronDown,
  ChevronUp,
  BadgeCheck,
  UserCheck,
  ShoppingCart,
  HelpCircle,
  Phone,
  MessageSquare,
  Heart,
  Trophy,
  Crown,
  Rocket,
  Target,
  Activity,
  Wifi,
  Package,
  Filter,
  ToggleLeft,
  ToggleRight,
  Layers
} from 'lucide-react'

export default function SSLCertificatesPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [addingToCart, setAddingToCart] = useState<string | null>(null)
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [showManaged, setShowManaged] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'single' | 'multi' | 'wildcard'>('all')
  const [compareProducts, setCompareProducts] = useState<string[]>([])
  const [showComparison, setShowComparison] = useState(false)
  const [showAllProducts, setShowAllProducts] = useState(false)
  
  const { products: apiProducts, loading, error } = useSSLProducts('all')
  const { currency, locale } = useCountry()
  const { addProductToCart } = useCart()

  // Map icon names to actual icon components
  const iconMap: { [key: string]: any } = {
    'Shield': Shield,
    'ShieldCheck': ShieldCheck,
    'Globe': Globe,
    'Award': Award,
    'Crown': Crown,
    'Settings': Settings,
    'Users': Users
  }

  // Filter products based on selected options
  const filteredProducts = apiProducts.filter(product => {
    const categoryMatch = selectedCategory === 'all' || product.category === selectedCategory
    const managedMatch = showManaged || !product.isManaged
    return categoryMatch && managedMatch
  })
  
  // Reset show all when filters change
  useEffect(() => {
    setShowAllProducts(false)
  }, [selectedCategory, showManaged])

  // Determine how many products to show initially based on screen size
  const getInitialProductCount = () => {
    if (typeof window === 'undefined') return 4
    if (window.innerWidth >= 1280) return 4 // Desktop (xl)
    if (window.innerWidth >= 768) return 3  // Tablet (md)
    return 2 // Mobile
  }

  const [initialProductCount, setInitialProductCount] = useState(4)

  useEffect(() => {
    const handleResize = () => {
      setInitialProductCount(getInitialProductCount())
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Use filtered products or fallback
  const allSslPlans = filteredProducts.length > 0 ? filteredProducts : [
    {
      id: 'ssl-standard',
      name: 'Basic SSL',
      type: 'Domain Validation (DV)',
      price: { yearly: 69.99, currency: 'USD' },
      originalPrice: { yearly: 99.99, currency: 'USD' },
      features: [
        'Domain validation',
        'Strong SHA-2 & 2048-bit encryption',
        'Padlock in address bar',
        'Protects 1 website',
        'SEO ranking boost',
        '30-day money-back guarantee',
        'Issued in minutes',
        '24/7 security support'
      ],
      badge: null,
      gradient: 'from-blue-500 to-cyan-500',
      popular: false,
      icon: 'Shield',
      warranty: '$10,000',
      validation: '5 minutes',
      browsers: '99.9%',
      isManaged: false,
      category: 'single' as const
    }
  ]
  
  // Limit products shown based on showAllProducts state
  const sslPlans = showAllProducts ? allSslPlans : allSslPlans.slice(0, initialProductCount)

  const features = [
    {
      icon: Lock,
      title: 'Bank-Level Encryption',
      description: 'SHA-2 & 2048-bit encryption protects sensitive data'
    },
    {
      icon: Zap,
      title: 'Instant Activation',
      description: 'Get protected in minutes with automated validation'
    },
    {
      icon: TrendingUp,
      title: 'SEO Boost',
      description: 'Google favors HTTPS sites in search rankings'
    },
    {
      icon: Shield,
      title: 'Trust & Credibility',
      description: 'Show customers your site is safe and verified'
    },
    {
      icon: Headphones,
      title: '24/7 Support',
      description: 'Expert help whenever you need it'
    },
    {
      icon: Award,
      title: 'Warranty Protection',
      description: 'Up to $1.5M warranty on all certificates'
    }
  ]

  const handleAddToCart = async (productId: string) => {
    try {
      setAddingToCart(productId)
      await addProductToCart(productId, 12, 'MONTH')
      toast.success('SSL Certificate added to cart!')
    } catch (error) {
      console.error('Error adding to cart:', error)
      toast.error('Failed to add to cart')
    } finally {
      setAddingToCart(null)
    }
  }

  const toggleCompare = (productId: string) => {
    if (compareProducts.includes(productId)) {
      setCompareProducts(compareProducts.filter(id => id !== productId))
    } else if (compareProducts.length < 3) {
      setCompareProducts([...compareProducts, productId])
    } else {
      toast.error('You can compare up to 3 products')
    }
  }

  const getComparedProducts = () => {
    return sslPlans.filter(plan => compareProducts.includes(plan.id))
  }

  const faqs = [
    {
      question: 'What is an SSL Certificate?',
      answer: 'An SSL Certificate encrypts data transmitted between a website and its visitors, ensuring sensitive information like passwords and credit card numbers remain private and secure.'
    },
    {
      question: 'Do I really need an SSL Certificate?',
      answer: 'Yes! SSL is essential for any website. Google marks non-SSL sites as "Not Secure" and ranks HTTPS sites higher in search results. It\'s required for accepting payments and handling sensitive data.'
    },
    {
      question: 'What\'s the difference between DV, OV, and EV SSL?',
      answer: 'DV (Domain Validation) verifies domain ownership only. OV (Organization Validation) verifies your organization\'s identity. EV (Extended Validation) provides the highest level of validation with a green address bar displaying your company name.'
    },
    {
      question: 'What is a Wildcard SSL Certificate?',
      answer: 'A Wildcard SSL secures your main domain and unlimited subdomains with a single certificate. For example, it protects example.com, www.example.com, blog.example.com, shop.example.com, etc.'
    },
    {
      question: 'What\'s the difference between Managed and DIY SSL?',
      answer: 'With DIY SSL, you handle installation, configuration, and renewal yourself. With Managed SSL, our experts handle everything for you - installation, configuration, renewal, and ongoing support.'
    },
    {
      question: 'Can I upgrade my SSL Certificate later?',
      answer: 'Yes! You can upgrade to a higher validation level or wildcard certificate anytime. We\'ll credit the unused portion of your current certificate toward the upgrade.'
    }
  ]

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-cyan-50 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            {/* Trust Badge */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring' }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-6"
            >
              <Shield className="w-4 h-4" />
              Industry-Leading SSL Certificates
            </motion.div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-4">
              SSL Certificates
            </h1>
            <p className="text-xl sm:text-2xl md:text-3xl font-bold mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
                That Protect & Convert
              </span>
            </p>
            
            <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Choose from 7 SSL certificates including managed options where we handle everything for you
            </p>


            {/* Trust Indicators */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 max-w-2xl mx-auto">
              {[
                { icon: Lock, text: '256-bit Encryption' },
                { icon: Clock, text: 'Instant Setup' },
                { icon: Trophy, text: '$1.5M Warranty' },
                { icon: Headphones, text: '24/7 Support' }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex flex-col items-center p-3 bg-white rounded-lg shadow-sm"
                >
                  <item.icon className="w-5 h-5 text-blue-600 mb-1" />
                  <span className="text-xs font-medium text-gray-700">{item.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Section with Filters */}
      <section id="pricing" className="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 mb-4">
              All SSL Certificates
            </h2>
            <p className="text-base sm:text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
              Compare all 7 SSL certificates and choose the perfect one for your needs
            </p>

            {/* Filter Controls */}
            <div className="bg-white rounded-xl shadow-md p-4 mb-8">
              <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                {/* Category Filter */}
                <div className="flex flex-wrap justify-center gap-2">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      selectedCategory === 'all'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    All Certificates
                  </button>
                  <button
                    onClick={() => setSelectedCategory('single')}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      selectedCategory === 'single'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Single Site
                  </button>
                  <button
                    onClick={() => setSelectedCategory('multi')}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      selectedCategory === 'multi'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Multiple Sites
                  </button>
                  <button
                    onClick={() => setSelectedCategory('wildcard')}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      selectedCategory === 'wildcard'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Wildcard
                  </button>
                </div>

                {/* Managed Toggle */}
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-700">Show Managed Options</span>
                  <button
                    onClick={() => setShowManaged(!showManaged)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      showManaged ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        showManaged ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                  {showManaged && (
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full font-medium">
                      We Handle Everything
                    </span>
                  )}
                </div>
              </div>

              {/* Compare Button */}
              {compareProducts.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 pt-4 border-t"
                >
                  <button
                    onClick={() => setShowComparison(true)}
                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    Compare Selected ({compareProducts.length})
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* SSL Plans Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <div className={`grid gap-6 ${
              showAllProducts 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
            }`}>
              <AnimatePresence mode="popLayout">
                {sslPlans.map((plan, index) => {
                  const IconComponent = iconMap[plan.icon] || Shield
                  const isSelected = selectedPlan === plan.id
                  const isComparing = compareProducts.includes(plan.id)
                  
                  return (
                    <motion.div
                      key={plan.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      onHoverStart={() => setSelectedPlan(plan.id)}
                      onHoverEnd={() => setSelectedPlan(null)}
                      className={`relative bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 ${
                        plan.popular ? 'ring-2 ring-blue-500' : ''
                      } ${isComparing ? 'ring-2 ring-green-500' : ''}`}
                    >
                      {/* Managed Badge */}
                      {plan.isManaged && (
                        <div className="absolute -top-3 -right-3 z-10">
                          <span className="px-3 py-1 text-xs font-bold text-white rounded-full shadow-lg bg-gradient-to-r from-emerald-600 to-teal-600 flex items-center gap-1">
                            <Settings className="w-3 h-3" />
                            MANAGED
                          </span>
                        </div>
                      )}

                      {/* Popular Badge */}
                      {plan.badge && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                          <span className={`px-3 py-1 text-xs font-bold text-white rounded-full shadow-lg bg-gradient-to-r ${
                            plan.badge === 'MOST POPULAR' ? 'from-blue-600 to-cyan-600' :
                            plan.badge === 'BEST VALUE' ? 'from-green-600 to-emerald-600' :
                            plan.badge === 'HASSLE-FREE' ? 'from-emerald-600 to-teal-600' :
                            'from-purple-600 to-pink-600'
                          }`}>
                            {plan.badge}
                          </span>
                        </div>
                      )}

                      <div className="p-6">
                        {/* Compare Checkbox */}
                        <div className="absolute top-4 right-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleCompare(plan.id)
                            }}
                            className={`p-2 rounded-lg transition-all ${
                              isComparing
                                ? 'bg-green-100 text-green-700'
                                : 'bg-gray-100 text-gray-400 hover:text-gray-700'
                            }`}
                            title="Compare this product"
                          >
                            <Layers className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Header */}
                        <div className="text-center mb-4">
                          <div className={`inline-flex p-3 rounded-full bg-gradient-to-br ${plan.gradient} mb-3`}>
                            <IconComponent className="w-8 h-8 text-white" />
                          </div>
                          <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                          <p className="text-sm text-gray-600">{plan.type}</p>
                          {plan.isManaged && (
                            <p className="text-xs text-emerald-600 font-medium mt-1">Full Service Included</p>
                          )}
                        </div>

                        {/* Price */}
                        <div className="text-center mb-6">
                          <div className="flex items-baseline justify-center gap-1">
                            <span className="text-3xl font-bold text-gray-900">
                              {formatCurrency(plan.price.yearly, plan.price.currency || currency, locale)}
                            </span>
                            <span className="text-gray-500 text-sm">/year</span>
                          </div>
                          {plan.originalPrice && plan.originalPrice.yearly > plan.price.yearly && (
                            <div className="mt-1">
                              <span className="text-sm text-gray-500 line-through">
                                {formatCurrency(plan.originalPrice.yearly, plan.price.currency || currency, locale)}
                              </span>
                              <span className="ml-2 text-xs text-green-600 font-semibold">
                                Save {Math.round(((plan.originalPrice.yearly - plan.price.yearly) / plan.originalPrice.yearly) * 100)}%
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-3 gap-2 mb-4 pb-4 border-b">
                          <div className="text-center">
                            <p className="text-xs text-gray-500">Warranty</p>
                            <p className="text-xs font-bold text-gray-900">{plan.warranty}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-gray-500">Setup</p>
                            <p className="text-xs font-bold text-gray-900">{plan.validation}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-gray-500">Support</p>
                            <p className="text-xs font-bold text-gray-900">24/7</p>
                          </div>
                        </div>

                        {/* Features */}
                        <div className="space-y-2 mb-6">
                          {plan.features.slice(0, 5).map((feature, idx) => (
                            <div key={idx} className="flex items-start gap-2">
                              <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span className="text-xs text-gray-700">{feature}</span>
                            </div>
                          ))}
                          {plan.features.length > 5 && (
                            <AnimatePresence>
                              {isSelected && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="space-y-2"
                                >
                                  {plan.features.slice(5).map((feature, idx) => (
                                    <div key={idx} className="flex items-start gap-2">
                                      <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                      <span className="text-xs text-gray-700">{feature}</span>
                                    </div>
                                  ))}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          )}
                        </div>

                        {/* CTA Button */}
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleAddToCart(plan.id)}
                          disabled={addingToCart === plan.id}
                          className={`w-full py-3 rounded-lg font-semibold transition-all ${
                            plan.popular || plan.isManaged
                              ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg hover:shadow-xl'
                              : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                          } ${addingToCart === plan.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          {addingToCart === plan.id ? (
                            <span className="flex items-center justify-center gap-2">
                              <LoadingSpinner size="sm" />
                              Adding...
                            </span>
                          ) : (
                            'Get Started'
                          )}
                        </motion.button>
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          )}
          
          {/* Show More Button */}
          {!showAllProducts && allSslPlans.length > initialProductCount && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center mt-8 gap-2"
            >
              <p className="text-sm text-gray-600">
                Showing {sslPlans.length} of {allSslPlans.length} SSL Certificates
              </p>
              <button
                onClick={() => setShowAllProducts(true)}
                className="group flex items-center gap-2 px-8 py-3 bg-white border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition-all shadow-md hover:shadow-lg"
              >
                <span>Show All {allSslPlans.length} Certificates</span>
                <ChevronDown className="w-5 h-5 group-hover:animate-bounce" />
              </button>
            </motion.div>
          )}
          
          {/* Show Less Button */}
          {showAllProducts && allSslPlans.length > initialProductCount && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-center mt-8"
            >
              <button
                onClick={() => {
                  setShowAllProducts(false)
                  // Scroll to pricing section
                  document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="group flex items-center gap-2 px-8 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-all"
              >
                <span>Show Less</span>
                <ChevronUp className="w-5 h-5" />
              </button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Comparison Modal */}
      <AnimatePresence>
        {showComparison && compareProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowComparison(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Compare SSL Certificates</h3>
                <button
                  onClick={() => setShowComparison(false)}
                  className="p-2 rounded-lg hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {getComparedProducts().map(plan => {
                    const IconComponent = iconMap[plan.icon] || Shield
                    return (
                      <div key={plan.id} className="border rounded-lg p-4">
                        <div className="text-center mb-4">
                          <div className={`inline-flex p-3 rounded-full bg-gradient-to-br ${plan.gradient} mb-3`}>
                            <IconComponent className="w-8 h-8 text-white" />
                          </div>
                          <h4 className="font-bold text-gray-900">{plan.name}</h4>
                          <p className="text-sm text-gray-600">{plan.type}</p>
                          {plan.isManaged && (
                            <span className="inline-block mt-2 px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full">
                              Managed Service
                            </span>
                          )}
                        </div>
                        
                        <div className="text-center mb-4">
                          <span className="text-2xl font-bold text-gray-900">
                            {formatCurrency(plan.price.yearly, plan.price.currency || currency, locale)}
                          </span>
                          <span className="text-gray-500 text-sm">/year</span>
                        </div>
                        
                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Warranty</span>
                            <span className="font-medium">{plan.warranty}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Setup Time</span>
                            <span className="font-medium">{plan.validation}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Sites</span>
                            <span className="font-medium">
                              {plan.category === 'single' ? '1 Site' :
                               plan.category === 'multi' ? '5 Sites' :
                               'Unlimited Subdomains'}
                            </span>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => {
                            handleAddToCart(plan.id)
                            setShowComparison(false)
                          }}
                          className="w-full py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
                        >
                          Choose This Plan
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Every SSL Certificate Includes Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-blue-50 via-white to-cyan-50 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(59, 130, 246, 0.3) 1px, transparent 1px)',
            backgroundSize: '32px 32px'
          }} />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 rounded-full text-sm font-medium mb-4"
            >
              <CheckCircle className="w-4 h-4" />
              All-Inclusive Features
            </motion.div>
            
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 mb-4">
              Every SSL Certificate Plan Includes
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
              No matter which plan you choose, you get all these essential features to protect and grow your online presence
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Better Google Rankings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity" />
              
              <div className="relative">
                <div className="inline-flex p-3 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl mb-4 shadow-lg">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Better Google Rankings</h3>
                <p className="text-gray-600">Show up higher in search results when you have an SSL certificate.</p>
              </div>
            </motion.div>

            {/* Industry-standard Encryption */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity" />
              
              <div className="relative">
                <div className="inline-flex p-3 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl mb-4 shadow-lg">
                  <Lock className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Industry-Standard Encryption</h3>
                <p className="text-gray-600">Strong SHA-2 and 2048-bit end-to-end encryption for maximum security.</p>
              </div>
            </motion.div>

            {/* Trust Indicator */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity" />
              
              <div className="relative">
                <div className="inline-flex p-3 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl mb-4 shadow-lg">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Trust Indicator</h3>
                <p className="text-gray-600">Your search bar displays the padlock icon, providing peace of mind to visitors.</p>
              </div>
            </motion.div>

            {/* Trust Seal */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-100 to-yellow-100 rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity" />
              
              <div className="relative">
                <div className="inline-flex p-3 bg-gradient-to-br from-orange-600 to-yellow-600 rounded-xl mb-4 shadow-lg">
                  <BadgeCheck className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Trust Seal</h3>
                <p className="text-gray-600">Display a site seal that verifies your customers' data is safe and secure.</p>
              </div>
            </motion.div>

            {/* Money-Back Guarantee */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-100 to-rose-100 rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity" />
              
              <div className="relative">
                <div className="inline-flex p-3 bg-gradient-to-br from-red-600 to-rose-600 rounded-xl mb-4 shadow-lg">
                  <RefreshCw className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">30-Day Money-Back Guarantee</h3>
                <p className="text-gray-600">Buy without worries as you find the plan that works best for your needs.</p>
              </div>
            </motion.div>

            {/* 24/7 Support */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity" />
              
              <div className="relative">
                <div className="inline-flex p-3 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-xl mb-4 shadow-lg">
                  <Headphones className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">24/7 Expert Support</h3>
                <p className="text-gray-600">Get help whenever you need it from our security experts, day or night.</p>
              </div>
            </motion.div>
          </div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.7 }}
            className="text-center mt-12"
          >
            <div className="inline-flex flex-col sm:flex-row gap-4 items-center">
              <div className="flex items-center gap-2 text-gray-600">
                <Check className="w-5 h-5 text-green-500" />
                <span className="text-sm">No hidden fees</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Check className="w-5 h-5 text-green-500" />
                <span className="text-sm">Instant activation</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Check className="w-5 h-5 text-green-500" />
                <span className="text-sm">Free installation support</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 mb-4">
              Why Choose Our SSL?
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Get more than just encryption - get peace of mind with industry-leading features
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 bg-gray-50 rounded-xl hover:bg-white hover:shadow-lg transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">{feature.title}</h3>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-base sm:text-lg text-gray-600">
              Everything you need to know about SSL certificates
            </p>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900">{faq.question}</span>
                  <motion.div
                    animate={{ rotate: expandedFaq === index ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {expandedFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-6 pb-4">
                        <p className="text-gray-600">{faq.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-blue-600 to-cyan-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-4">
              Secure Your Website Today
            </h2>
            <p className="text-base sm:text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of websites protected by our SSL certificates. 
              Get instant protection with our 30-day money-back guarantee.
            </p>
            <motion.a
              href="#pricing"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-lg font-bold shadow-xl hover:shadow-2xl transition-all"
            >
              Get SSL Certificate Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </motion.a>
            
            <div className="mt-8 flex flex-wrap justify-center gap-6">
              <div className="flex items-center gap-2 text-white/90">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm">30-Day Money Back</span>
              </div>
              <div className="flex items-center gap-2 text-white/90">
                <Shield className="w-5 h-5" />
                <span className="text-sm">Free Installation</span>
              </div>
              <div className="flex items-center gap-2 text-white/90">
                <Headphones className="w-5 h-5" />
                <span className="text-sm">24/7 Support</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}