'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useWebsiteBackupProducts } from '@/hooks/useWebsiteBackupProducts'
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
  Upload,
  Save,
  FolderOpen,
  Archive,
  Copy,
  History,
  Timer,
  Calendar,
  CloudDownload,
  CloudUpload,
  RotateCcw,
  FolderSync
} from 'lucide-react'

export default function WebsiteBackupPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [addingToCart, setAddingToCart] = useState<string | null>(null)
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('yearly')
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  
  const { products: apiProducts, loading, error } = useWebsiteBackupProducts()
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
    'HardDrive': HardDrive,
    'Database': Database,
    'Cloud': Cloud
  }

  // Use API products or fallback
  const backupPlans = apiProducts.length > 0 ? apiProducts : []

  const features = [
    {
      icon: Save,
      title: 'Automatic Daily Backups',
      description: 'Set it and forget it - your site is backed up automatically every day'
    },
    {
      icon: RotateCcw,
      title: 'One-Click Restore',
      description: 'Restore your entire site or specific files with a single click'
    },
    {
      icon: Shield,
      title: 'Malware Scanning',
      description: 'Built-in daily malware scanning keeps your backups clean'
    },
    {
      icon: Cloud,
      title: 'Secure Cloud Storage',
      description: 'Your data is encrypted and stored in secure cloud infrastructure'
    },
    {
      icon: History,
      title: 'Version History',
      description: 'Access multiple backup versions to restore from any point in time'
    },
    {
      icon: Download,
      title: 'Local Downloads',
      description: 'Download your backups to local storage for extra peace of mind'
    }
  ]

  const statistics = [
    { name: 'Data Loss Prevention', percentage: 99.9, color: 'from-green-500 to-emerald-500' },
    { name: 'Recovery Success Rate', percentage: 100, color: 'from-blue-500 to-cyan-500' },
    { name: 'Uptime Guarantee', percentage: 99.99, color: 'from-purple-500 to-pink-500' },
    { name: 'Customer Satisfaction', percentage: 98, color: 'from-orange-500 to-red-500' }
  ]

  const handleAddToCart = async (productId: string) => {
    try {
      setAddingToCart(productId)
      
      // Website backup is typically sold per year
      const period = billingPeriod === 'yearly' ? 12 : 1
      await addProductToCart(productId, period, 'MONTH')
      
      toast.success('Website Backup added to cart!')
    } catch (error) {
      console.error('Error adding to cart:', error)
      toast.error('Failed to add to cart')
    } finally {
      setAddingToCart(null)
    }
  }

  const comparisonTable = [
    { feature: 'Storage Space', starter: '5 GB', professional: '25 GB', business: '50 GB' },
    { feature: 'Websites Protected', starter: '1', professional: '1', business: '1' },
    { feature: 'Backup Frequency', starter: 'Daily', professional: 'Daily', business: 'Daily' },
    { feature: 'Malware Scanning', starter: true, professional: true, business: true },
    { feature: 'One-Click Restore', starter: true, professional: true, business: true },
    { feature: 'Version History', starter: '30 days', professional: '90 days', business: '1 year' },
    { feature: 'Local Downloads', starter: true, professional: true, business: true },
    { feature: 'Database Backups', starter: true, professional: true, business: true },
    { feature: 'Support Level', starter: 'Email', professional: 'Priority', business: '24/7 Phone' },
    { feature: 'Setup Assistance', starter: false, professional: true, business: true }
  ]

  const faqs = [
    {
      question: 'How often are backups performed?',
      answer: 'All our backup plans perform automatic daily backups of your website. This ensures you always have a recent copy of your data available for restoration.'
    },
    {
      question: 'Can I restore individual files or just the entire site?',
      answer: 'You have complete flexibility! You can restore your entire website, individual files, specific folders, or even just your database. Our one-click restore feature makes it simple to recover exactly what you need.'
    },
    {
      question: 'How long are my backups retained?',
      answer: 'Retention periods vary by plan: Starter retains backups for 30 days, Professional for 90 days, and Business for a full year. This gives you multiple restore points to choose from.'
    },
    {
      question: 'Is my backup data secure?',
      answer: 'Absolutely! All backups are encrypted during transfer and storage using industry-standard encryption. Your data is stored in secure cloud infrastructure with redundancy to prevent data loss.'
    },
    {
      question: 'Can I download my backups locally?',
      answer: 'Yes! All plans include the ability to download your backups to local storage. This gives you an extra layer of protection and control over your data.'
    },
    {
      question: 'What happens if my site gets hacked?',
      answer: 'Our backup service includes daily malware scanning. If your site is compromised, you can quickly restore from a clean backup taken before the infection, minimizing downtime and data loss.'
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

        {/* Floating Backup Icons */}
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
              <Save className="w-8 h-8 text-blue-200/30" />
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
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6"
            >
              <Database className="w-4 h-4" />
              60% of Businesses Never Recover from Data Loss
            </motion.div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-4">
              Website Backup
            </h1>
            <p className="text-xl sm:text-2xl md:text-3xl font-bold mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
                Never Lose Your Data Again
              </span>
            </p>
            
            <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Automatic daily backups with one-click restore keep your website safe from data loss, hacks, and accidents
            </p>

            {/* Statistics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 max-w-3xl mx-auto">
              {statistics.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-lg p-3 shadow-md"
                >
                  <div className="text-2xl font-bold text-gray-900">{stat.percentage}%</div>
                  <div className="text-xs text-gray-600">{stat.name}</div>
                  <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${stat.percentage}%` }}
                      transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                      className={`h-full bg-gradient-to-r ${stat.color}`}
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
              Start Backing Up Now
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
              Complete Backup Solution
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to protect your website data and ensure business continuity
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
              Choose Your Backup Plan
            </h2>
            <p className="text-base sm:text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
              All plans include automatic backups, malware scanning, and one-click restore
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

          {/* Backup Plans Grid */}
          {loading ? (
            <PricingTableSkeleton columns={3} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {backupPlans.map((plan, index) => {
                const IconComponent = iconMap[plan.icon] || HardDrive
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
                          plan.badge === 'BEST VALUE' ? 'from-indigo-600 to-blue-600' :
                          'from-cyan-600 to-blue-600'
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
                        {plan.description && (
                          <p className="text-xs text-blue-600 mt-1 font-medium">Best for {plan.description}</p>
                        )}
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
                          <p className="text-xs text-gray-500">Storage</p>
                          <p className="text-xs font-bold text-gray-900">{plan.storageSize}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-500">Retention</p>
                          <p className="text-xs font-bold text-gray-900">{plan.retention}</p>
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
                          'Start Backing Up'
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
              Compare Backup Plans
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Find the perfect backup solution for your website
            </p>
          </motion.div>

          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-xl shadow-lg overflow-hidden">
              <thead className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                <tr>
                  <th className="px-4 py-4 text-left text-sm font-bold">Features</th>
                  <th className="px-4 py-4 text-center text-sm font-bold">Starter</th>
                  <th className="px-4 py-4 text-center text-sm font-bold">Professional</th>
                  <th className="px-4 py-4 text-center text-sm font-bold">Business</th>
                </tr>
              </thead>
              <tbody>
                {comparisonTable.map((row, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{row.feature}</td>
                    <td className="px-4 py-3 text-center">
                      {typeof row.starter === 'boolean' ? (
                        row.starter ? (
                          <Check className="w-5 h-5 text-green-500 mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-gray-300 mx-auto" />
                        )
                      ) : (
                        <span className="text-sm text-gray-700">{row.starter}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {typeof row.professional === 'boolean' ? (
                        row.professional ? (
                          <Check className="w-5 h-5 text-green-500 mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-gray-300 mx-auto" />
                        )
                      ) : (
                        <span className="text-sm text-gray-700">{row.professional}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {typeof row.business === 'boolean' ? (
                        row.business ? (
                          <Check className="w-5 h-5 text-green-500 mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-gray-300 mx-auto" />
                        )
                      ) : (
                        <span className="text-sm text-gray-700">{row.business}</span>
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
              Everything you need to know about website backups
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
              Protect Your Hard Work Today
            </h2>
            <p className="text-base sm:text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Don't wait until disaster strikes. Start backing up your website now and sleep soundly knowing your data is safe.
            </p>
            <motion.a
              href="#pricing"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-lg font-bold shadow-xl hover:shadow-2xl transition-all"
            >
              Get Started with Backups
              <ArrowRight className="ml-2 w-5 h-5" />
            </motion.a>
            
            <div className="mt-8 flex flex-wrap justify-center gap-6">
              <div className="flex items-center gap-2 text-white/90">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm">30-Day Money Back</span>
              </div>
              <div className="flex items-center gap-2 text-white/90">
                <Shield className="w-5 h-5" />
                <span className="text-sm">Secure Storage</span>
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