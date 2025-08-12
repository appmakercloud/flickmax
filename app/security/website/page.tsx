'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useWebsiteSecurityProducts } from '@/hooks/useWebsiteSecurityProducts'
import { useCountry } from '@/contexts/CountryContext'
import { formatCurrency } from '@/lib/countries'
import { useCart } from '@/contexts/CartContext'
import toast from 'react-hot-toast'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { PricingTableSkeleton } from '@/components/ui/PricingSkeleton'
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
  Layers,
  Eye,
  AlertTriangle,
  Database,
  Cloud,
  Fingerprint,
  Key,
  Bug,
  Scan,
  ShieldOff,
  ShieldAlert,
  FileSearch,
  HardDrive,
  Download,
  Upload
} from 'lucide-react'

export default function WebsiteSecurityPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [addingToCart, setAddingToCart] = useState<string | null>(null)
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('yearly')
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  
  const { products: apiProducts, loading, error } = useWebsiteSecurityProducts()
  const { currency, locale } = useCountry()
  const { addProductToCart } = useCart()

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Map icon names to actual icon components
  const iconMap: { [key: string]: any } = {
    'Shield': Shield,
    'ShieldCheck': ShieldCheck,
    'Award': Award
  }

  // Use API products or fallback
  const securityPlans = apiProducts.length > 0 ? apiProducts : []

  const features = [
    {
      icon: Bug,
      title: 'Malware Detection & Removal',
      description: 'Advanced scanning technology detects and removes malicious code'
    },
    {
      icon: ShieldAlert,
      title: 'Web Application Firewall',
      description: 'Blocks hackers and malicious traffic before they reach your site'
    },
    {
      icon: Scan,
      title: 'Continuous Monitoring',
      description: 'Round-the-clock monitoring for threats and vulnerabilities'
    },
    {
      icon: Database,
      title: 'Automatic Backups',
      description: 'Regular backups ensure you never lose your data'
    },
    {
      icon: Zap,
      title: 'DDoS Protection',
      description: 'Protects against distributed denial of service attacks'
    },
    {
      icon: Lock,
      title: 'SSL Certificate Included',
      description: 'Free SSL certificate with all security plans'
    }
  ]

  const threats = [
    { name: 'Malware Infections', percentage: 68, color: 'from-red-500 to-orange-500' },
    { name: 'DDoS Attacks', percentage: 54, color: 'from-orange-500 to-yellow-500' },
    { name: 'SQL Injections', percentage: 42, color: 'from-yellow-500 to-green-500' },
    { name: 'XSS Attacks', percentage: 38, color: 'from-green-500 to-blue-500' }
  ]

  const handleAddToCart = async (productId: string) => {
    try {
      setAddingToCart(productId)
      
      // Website security is typically sold per year
      const period = billingPeriod === 'yearly' ? 12 : 1
      await addProductToCart(productId, period, 'MONTH')
      
      toast.success('Website Security added to cart!')
    } catch (error) {
      console.error('Error adding to cart:', error)
      toast.error('Failed to add to cart')
    } finally {
      setAddingToCart(null)
    }
  }

  const comparisonTable = [
    { feature: 'Websites Protected', standard: '1', advanced: '1', premium: '1' },
    { feature: 'Firewall Protection', standard: true, advanced: true, premium: true },
    { feature: 'SSL Certificate', standard: true, advanced: true, premium: true },
    { feature: 'Malware Scanning', standard: 'Daily', advanced: '12-hour', premium: 'Real-time' },
    { feature: 'Site Cleanups', standard: '1/year', advanced: 'Unlimited', premium: 'Unlimited + Priority' },
    { feature: 'DDoS Protection', standard: false, advanced: true, premium: true },
    { feature: 'CDN Speed Boost', standard: false, advanced: true, premium: true },
    { feature: 'Backup Storage', standard: 'None', advanced: '25 GB', premium: '200 GB' },
    { feature: 'Support', standard: 'Email', advanced: 'Priority', premium: '24/7 Phone' },
    { feature: 'Response Time', standard: '48 hours', advanced: '24 hours', premium: '1 hour' }
  ]

  const faqs = [
    {
      question: 'What is Website Security?',
      answer: 'Website Security is a comprehensive solution that protects your site from hackers, malware, and other online threats. It includes a firewall, malware scanning, automatic cleanup, and more.'
    },
    {
      question: 'Do I need Website Security if I already have SSL?',
      answer: 'Yes! While SSL encrypts data transmission, Website Security provides complete protection including firewall, malware scanning, DDoS protection, and automatic cleanups. SSL alone cannot protect against hacking attempts or malware.'
    },
    {
      question: 'How quickly can threats be detected and removed?',
      answer: 'Detection speed depends on your plan. Standard plans scan daily, Advanced scans every 12 hours, and Premium offers real-time monitoring. Once detected, threats are removed immediately with automatic cleanup.'
    },
    {
      question: 'What happens if my site gets hacked?',
      answer: 'Our security experts will clean and restore your site. Standard plans include 1 cleanup per year, while Advanced and Premium plans offer unlimited cleanups. Premium customers get priority service.'
    },
    {
      question: 'Is the firewall compatible with all websites?',
      answer: 'Yes, our Web Application Firewall (WAF) works with all websites regardless of platform - WordPress, Joomla, custom HTML, e-commerce sites, and more.'
    },
    {
      question: 'Can I upgrade my plan later?',
      answer: 'Absolutely! You can upgrade your security plan anytime to get additional features like more frequent scanning, unlimited cleanups, or larger backup storage.'
    }
  ]

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-cyan-50 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(59, 130, 246, 0.1), transparent 50%)`,
            }}
          />
          <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        </div>

        {/* Floating Security Icons */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              initial={{ 
                x: `${20 + i * 15}%`,
                y: -100
              }}
              animate={{
                y: '120vh',
                rotate: 360
              }}
              transition={{
                duration: 20 + i * 3,
                repeat: Infinity,
                delay: i * 2,
                ease: "linear"
              }}
            >
              <Shield className="w-8 h-8 text-blue-200/30" />
            </motion.div>
          ))}
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 relative">
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
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-medium mb-6"
            >
              <AlertTriangle className="w-4 h-4" />
              30,000+ Websites Attacked Daily
            </motion.div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-4">
              Website Security
            </h1>
            <p className="text-xl sm:text-2xl md:text-3xl font-bold mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
                Complete Protection for Your Site
              </span>
            </p>
            
            <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Protect your site from hackers, malware, and threats with our comprehensive security solution
            </p>

            {/* Threat Statistics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 max-w-3xl mx-auto">
              {threats.map((threat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-lg p-3 shadow-md"
                >
                  <div className="text-2xl font-bold text-gray-900">{threat.percentage}%</div>
                  <div className="text-xs text-gray-600">{threat.name}</div>
                  <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${threat.percentage}%` }}
                      transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                      className={`h-full bg-gradient-to-r ${threat.color}`}
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA Button */}
            <motion.a
              href="#pricing"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              Secure Your Website Now
              <ArrowRight className="ml-2 w-4 h-4" />
            </motion.a>
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
              Complete Security Features
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to protect your website from modern threats
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
                className="group p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl hover:shadow-lg transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg shadow-md">
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

      {/* Pricing Section */}
      <section id="pricing" className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-blue-50 via-white to-cyan-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 mb-4">
              Choose Your Protection Plan
            </h2>
            <p className="text-base sm:text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
              All plans include firewall, SSL certificate, and expert support
            </p>

            {/* Billing Toggle */}
            <div className="inline-flex items-center bg-white p-1 rounded-xl shadow-md mb-8">
              <button
                onClick={() => setBillingPeriod('monthly')}
                className={`px-6 py-2 rounded-lg font-medium transition-all ${
                  billingPeriod === 'monthly' 
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingPeriod('yearly')}
                className={`px-6 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  billingPeriod === 'yearly' 
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Yearly
                <span className="px-2 py-0.5 bg-gradient-to-r from-green-400 to-emerald-400 text-white text-xs rounded-full">
                  Save 20%
                </span>
              </button>
            </div>
          </motion.div>

          {/* Security Plans Grid */}
          {loading ? (
            <PricingTableSkeleton columns={3} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {securityPlans.map((plan, index) => {
                const IconComponent = iconMap[plan.icon] || Shield
                const isSelected = selectedPlan === plan.id
                
                return (
                  <motion.div
                    key={plan.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    onHoverStart={() => setSelectedPlan(plan.id)}
                    onHoverEnd={() => setSelectedPlan(null)}
                    className={`relative bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2 ${
                      plan.popular ? 'ring-2 ring-blue-500' : ''
                    }`}
                  >
                    {/* Badge */}
                    {plan.badge && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                        <span className={`px-3 py-1 text-xs font-bold text-white rounded-full shadow-lg bg-gradient-to-r ${
                          plan.badge === 'MOST POPULAR' ? 'from-blue-600 to-cyan-600' :
                          plan.badge === 'BEST VALUE' ? 'from-purple-600 to-pink-600' :
                          'from-green-600 to-emerald-600'
                        }`}>
                          {plan.badge}
                        </span>
                      </div>
                    )}

                    <div className="p-6">
                      {/* Header */}
                      <div className="text-center mb-4">
                        <div className={`inline-flex p-3 rounded-full bg-gradient-to-br ${plan.gradient} mb-3`}>
                          <IconComponent className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                        <p className="text-sm text-gray-600">{plan.type}</p>
                      </div>

                      {/* Price */}
                      <div className="text-center mb-6">
                        <div className="flex items-baseline justify-center gap-1">
                          <span className="text-3xl font-bold text-gray-900">
                            {formatCurrency(
                              billingPeriod === 'monthly' ? plan.price.monthly : plan.price.yearly,
                              plan.price.currency || currency,
                              locale
                            )}
                          </span>
                          <span className="text-gray-500 text-sm">
                            /{billingPeriod === 'monthly' ? 'month' : 'year'}
                          </span>
                        </div>
                        {plan.originalPrice && plan.originalPrice.yearly > plan.price.yearly && (
                          <div className="mt-1">
                            <span className="text-sm text-gray-500 line-through">
                              {formatCurrency(
                                billingPeriod === 'monthly' ? plan.originalPrice.monthly : plan.originalPrice.yearly,
                                plan.price.currency || currency,
                                locale
                              )}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Quick Stats */}
                      <div className="grid grid-cols-3 gap-2 mb-4 pb-4 border-b">
                        <div className="text-center">
                          <p className="text-xs text-gray-500">Scan</p>
                          <p className="text-xs font-bold text-gray-900">{plan.scanFrequency}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-500">Cleanup</p>
                          <p className="text-xs font-bold text-gray-900">{plan.cleanup}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-500">Support</p>
                          <p className="text-xs font-bold text-gray-900">{plan.support}</p>
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
                          plan.popular 
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
                          'Get Protected Now'
                        )}
                      </motion.button>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 mb-4">
              Compare Security Plans
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Find the perfect security solution for your website
            </p>
          </motion.div>

          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-xl shadow-lg overflow-hidden">
              <thead className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                <tr>
                  <th className="px-4 py-4 text-left text-sm font-bold">Features</th>
                  <th className="px-4 py-4 text-center text-sm font-bold">Standard</th>
                  <th className="px-4 py-4 text-center text-sm font-bold">Advanced</th>
                  <th className="px-4 py-4 text-center text-sm font-bold">Premium</th>
                </tr>
              </thead>
              <tbody>
                {comparisonTable.map((row, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{row.feature}</td>
                    <td className="px-4 py-3 text-center">
                      {typeof row.standard === 'boolean' ? (
                        row.standard ? (
                          <Check className="w-5 h-5 text-green-500 mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-gray-300 mx-auto" />
                        )
                      ) : (
                        <span className="text-sm text-gray-700">{row.standard}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {typeof row.advanced === 'boolean' ? (
                        row.advanced ? (
                          <Check className="w-5 h-5 text-green-500 mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-gray-300 mx-auto" />
                        )
                      ) : (
                        <span className="text-sm text-gray-700">{row.advanced}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {typeof row.premium === 'boolean' ? (
                        row.premium ? (
                          <Check className="w-5 h-5 text-green-500 mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-gray-300 mx-auto" />
                        )
                      ) : (
                        <span className="text-sm text-gray-700">{row.premium}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
              Everything you need to know about website security
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
              Don't Wait Until It's Too Late
            </h2>
            <p className="text-base sm:text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Every day without protection is a risk. Secure your website now with our comprehensive security solution.
            </p>
            <motion.a
              href="#pricing"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-lg font-bold shadow-xl hover:shadow-2xl transition-all"
            >
              Protect My Website Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </motion.a>
            
            <div className="mt-8 flex flex-wrap justify-center gap-6">
              <div className="flex items-center gap-2 text-white/90">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm">30-Day Money Back</span>
              </div>
              <div className="flex items-center gap-2 text-white/90">
                <Shield className="w-5 h-5" />
                <span className="text-sm">Instant Protection</span>
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