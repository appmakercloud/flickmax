'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useMicrosoft365Products } from '@/hooks/useMicrosoft365Products'
import { useCountry } from '@/contexts/CountryContext'
import { formatCurrency } from '@/lib/countries'
import { useCart } from '@/contexts/CartContext'
import toast from 'react-hot-toast'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { PricingTableSkeleton } from '@/components/ui/PricingSkeleton'
import { 
  Mail, 
  Users, 
  Shield, 
  Calendar,
  Smartphone,
  Globe,
  Lock,
  CheckCircle,
  Zap,
  Server,
  Award,
  Building,
  ChevronRight,
  Star,
  Clock,
  Headphones,
  ArrowRight,
  Check,
  X,
  ChevronDown,
  Phone,
  Briefcase,
  Crown,
  FileText,
  Video,
  Cloud,
  Download,
  Monitor,
  Laptop,
  Package,
  RefreshCw,
  HelpCircle,
  BarChart3,
  MessageSquare,
  FolderOpen,
  Share2,
  PresentationIcon,
  TableIcon,
  Layers,
  Database,
  MailPlus,
  ShoppingCart
} from 'lucide-react'

// Import Users as TeamIcon to avoid conflict
const TeamIcon = Users
const MailPlusIcon = MailPlus

export default function Microsoft365Page() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [addingToCart, setAddingToCart] = useState<string | null>(null)
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('yearly')
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  
  const { products: apiProducts, loading, error } = useMicrosoft365Products()
  const { currency, locale, country } = useCountry()
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
    'Mail': Mail,
    'MailPlus': MailPlusIcon,
    'Briefcase': Briefcase,
    'Crown': Crown
  }

  // Use API products or fallback
  const microsoft365Plans = apiProducts.length > 0 ? apiProducts : []

  const features = [
    {
      icon: Shield,
      title: '7-Day Money Back',
      description: 'Try risk-free and get a full refund if not satisfied'
    },
    {
      icon: Server,
      title: '99.9% Uptime',
      description: 'Your email stays online with Microsoft reliability'
    },
    {
      icon: Mail,
      title: 'Professional Email',
      description: 'Use your own domain like you@yourcompany.com'
    },
    {
      icon: Smartphone,
      title: 'Works Everywhere',
      description: 'Access email and files on any device, anytime'
    }
  ]

  const handleAddToCart = async (productId: string) => {
    try {
      setAddingToCart(productId)
      
      // Microsoft 365 is typically sold per month
      const period = billingPeriod === 'yearly' ? 12 : 1
      await addProductToCart(productId, period, 'MONTH')
      
      toast.success('Microsoft 365 added to cart!')
    } catch (error) {
      console.error('Error adding to cart:', error)
      toast.error('Failed to add to cart')
    } finally {
      setAddingToCart(null)
    }
  }

  const comparisonTable = [
    { feature: 'Storage Space', essentials: '10 GB', plus: '50 GB', business: '1 TB + 50 GB', professional: '1 TB + 50 GB' },
    { feature: 'Professional Email', essentials: true, plus: true, business: true, professional: true },
    { feature: 'Sync Across All Devices', essentials: true, plus: true, business: true, professional: true },
    { feature: 'Office Web Apps', essentials: false, plus: false, business: true, professional: true },
    { feature: 'Office Desktop Apps', essentials: false, plus: false, business: false, professional: true },
    { feature: 'Install on 5 Devices', essentials: false, plus: false, business: false, professional: true },
    { feature: 'Video Meetings', essentials: false, plus: false, business: true, professional: true },
    { feature: 'Team Collaboration', essentials: false, plus: false, business: true, professional: true },
    { feature: '24/7 Support', essentials: true, plus: true, business: true, professional: true }
  ]

  const faqs = [
    {
      question: 'What is Microsoft 365?',
      answer: 'Microsoft 365 gives you professional email, plus popular Office apps like Word, Excel, and PowerPoint. You can work from anywhere with cloud storage and team collaboration tools.'
    },
    {
      question: 'What happened to Office 365?',
      answer: 'Office 365 is now called Microsoft 365. Same great features, same price - just a new name. If you already have Office 365, it automatically became Microsoft 365.'
    },
    {
      question: 'Why buy from Flickmax instead of Microsoft?',
      answer: 'We make it simple! Get everything set up with your domain, plus our 24/7 support team helps you every step of the way. Same Microsoft tools, better customer service.'
    },
    {
      question: 'Can I share with my team?',
      answer: 'With Business Professional, you get 5 device installs per user. For teams, each person needs their own account to keep files and emails private and secure.'
    },
    {
      question: 'Will it work with my existing Office?',
      answer: 'Yes! Microsoft 365 works alongside any Office version you have. Plus, cloud storage lets you access files from any device with automatic saving.'
    },
    {
      question: 'What devices are supported?',
      answer: 'Works on Windows 10/11, Mac (latest 3 versions), iPhone, iPad, and Android. Web apps work in any modern browser on any device.'
    },
    {
      question: 'Is this for large companies?',
      answer: `Our plans work best for teams under 300 people. You can mix and match plans as needed. Questions? Call us at ${country.phoneNumber} - we're here 24/7!`
    },
    {
      question: 'What is "the cloud"?',
      answer: 'The cloud means your files are saved online (not just on your computer). Access them anywhere, never lose work if your computer breaks, and easily share with others.'
    },
    {
      question: 'Does it work on Mac and iPad?',
      answer: 'Absolutely! All plans work on Mac. Business Professional includes full Office apps for Mac and iPad. Web apps work on any device.'
    },
    {
      question: 'Can multiple people edit the same file?',
      answer: 'Yes! With Business plans, your team can work on the same document together in real-time. See changes instantly without emailing files back and forth.'
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

        {/* Floating Icons */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[FileText, Mail, Video, Cloud, Briefcase].map((Icon, i) => (
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
              <Icon className="w-8 h-8 text-blue-200/30" />
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
              <Award className="w-4 h-4" />
              Trusted by millions of businesses worldwide
            </motion.div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-4">
              Microsoft 365 for Business
            </h1>
            <p className="text-xl sm:text-2xl md:text-3xl font-bold mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
                Professional Email + Office Apps That Work Everywhere
              </span>
            </p>
            
            <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Get the tools you know and love - Word, Excel, PowerPoint, and Outlook - plus secure cloud storage and video meetings
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              <span className="px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 shadow-sm">
                ✉️ Professional Email
              </span>
              <span className="px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 shadow-sm">
                📊 Excel & Word
              </span>
              <span className="px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 shadow-sm">
                🎥 Video Meetings
              </span>
              <span className="px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 shadow-sm">
                ☁️ 1TB Storage
              </span>
            </div>

            {/* CTA Button */}
            <motion.a
              href="#pricing"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              See Plans & Pricing
              <ArrowRight className="ml-2 w-4 h-4" />
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* All Plans Include Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 mb-4">
              All Plans Include
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to run your business professionally
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl hover:shadow-lg transition-all"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg shadow-md mb-4">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
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
              Choose Your Microsoft 365 Plan
            </h2>
            <p className="text-base sm:text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
              Start with email, upgrade to full Office anytime
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

          {/* Plans Grid */}
          {loading ? (
            <PricingTableSkeleton columns={3} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {microsoft365Plans.map((plan, index) => {
                const IconComponent = iconMap[plan.icon] || Mail
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
                        <span className={`px-4 py-1.5 text-xs font-bold text-white rounded-full shadow-lg bg-gradient-to-r ${
                          plan.badge === 'MOST POPULAR' ? 'from-blue-600 to-cyan-600' :
                          plan.badge === 'BEST VALUE' ? 'from-indigo-600 to-purple-600' :
                          'from-cyan-600 to-blue-600'
                        }`}>
                          {plan.badge}
                        </span>
                      </div>
                    )}

                    <div className="p-6">
                      {/* Header */}
                      <div className="text-center mb-4">
                        <div className={`inline-flex p-3 rounded-2xl bg-gradient-to-br ${plan.gradient} mb-3 shadow-lg`}>
                          <IconComponent className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{plan.name}</h3>
                        <p className="text-sm text-gray-600">{plan.type}</p>
                        {plan.simpleDescription && (
                          <p className="text-xs text-blue-600 mt-1 font-medium">{plan.simpleDescription}</p>
                        )}
                      </div>

                      {/* Price */}
                      <div className="text-center mb-6 bg-gradient-to-br from-gray-50 to-white rounded-xl p-4">
                        {plan.originalPrice && plan.originalPrice.monthly > plan.price.monthly && (
                          <div className="text-sm text-gray-500 line-through mb-1">
                            {formatCurrency(
                              billingPeriod === 'monthly' ? plan.originalPrice.monthly : plan.originalPrice.yearly,
                              plan.price.currency || currency,
                              locale
                            )}
                          </div>
                        )}
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
                        {plan.originalPrice && plan.originalPrice.monthly > plan.price.monthly && (
                          <div className="mt-2">
                            <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                              Save {Math.round(((plan.originalPrice.monthly - plan.price.monthly) / plan.originalPrice.monthly) * 100)}%
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Quick Stats */}
                      <div className="space-y-2 mb-4 pb-4 border-b">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-500">Storage</span>
                          <span className="font-medium text-gray-900">{plan.storage}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-500">Apps</span>
                          <span className="font-medium text-gray-900">{plan.apps}</span>
                        </div>
                        {plan.meetings && (
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-500">Meetings</span>
                            <span className="font-medium text-gray-900">
                              {typeof plan.meetings === 'string' ? '✓' : '—'}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Features - Show All */}
                      <div className="mb-6">
                        <h4 className="text-xs font-bold text-gray-700 mb-3 flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                          What's Included
                        </h4>
                        <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                          {plan.features.map((feature, idx) => (
                            <div key={idx} className="flex items-start gap-2 hover:bg-gray-50 rounded p-1 transition-colors">
                              <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span className="text-xs text-gray-700 leading-relaxed">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* CTA Button */}
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleAddToCart(plan.id)}
                        disabled={addingToCart === plan.id}
                        className={`w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
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
                          <>
                            <ShoppingCart className="w-4 h-4" />
                            Select This Plan
                          </>
                        )}
                      </motion.button>
                      
                      {/* Money Back Guarantee */}
                      <div className="mt-3 text-center">
                        <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
                          <Shield className="w-3 h-3" />
                          7-day money-back guarantee
                        </p>
                      </div>
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 mb-4">
              Compare All Features
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Find the perfect plan for your needs
            </p>
          </motion.div>

          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-xl shadow-lg overflow-hidden">
              <thead className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                <tr>
                  <th className="px-4 py-4 text-left text-sm font-bold">Features</th>
                  <th className="px-4 py-4 text-center text-sm font-bold">Email Essentials</th>
                  <th className="px-4 py-4 text-center text-sm font-bold">Email Plus</th>
                  <th className="px-4 py-4 text-center text-sm font-bold">Business Essentials</th>
                  <th className="px-4 py-4 text-center text-sm font-bold">Business Professional</th>
                </tr>
              </thead>
              <tbody>
                {comparisonTable.map((row, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{row.feature}</td>
                    <td className="px-4 py-3 text-center">
                      {typeof row.essentials === 'boolean' ? (
                        row.essentials ? (
                          <Check className="w-5 h-5 text-green-500 mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-gray-300 mx-auto" />
                        )
                      ) : (
                        <span className="text-sm text-gray-700">{row.essentials}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {typeof row.plus === 'boolean' ? (
                        row.plus ? (
                          <Check className="w-5 h-5 text-green-500 mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-gray-300 mx-auto" />
                        )
                      ) : (
                        <span className="text-sm text-gray-700">{row.plus}</span>
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
              Common Questions
            </h2>
            <p className="text-base sm:text-lg text-gray-600">
              Simple answers to help you get started
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
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-blue-600 to-cyan-600 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <motion.div
            animate={{ 
              x: [0, 100, 0],
              y: [0, -50, 0]
            }}
            transition={{ 
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"
          />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {/* Main CTA Content */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join millions using Microsoft 365 to work smarter, not harder
            </p>
            
            {/* CTA Button */}
            <motion.a
              href="#pricing"
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center px-10 py-4 bg-white text-blue-600 rounded-xl font-bold shadow-xl hover:shadow-2xl transition-all text-lg"
            >
              Choose Your Plan
              <ArrowRight className="ml-2 w-5 h-5" />
            </motion.a>
            
            {/* Trust Indicators */}
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20"
              >
                <div className="flex items-center justify-center gap-2 text-white">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                  <div className="text-left">
                    <p className="text-sm font-medium">7-Day</p>
                    <p className="text-xs text-white/80">Money Back Guarantee</p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20"
              >
                <div className="flex items-center justify-center gap-2 text-white">
                  <Shield className="w-6 h-6 text-cyan-400" />
                  <div className="text-left">
                    <p className="text-sm font-medium">Microsoft</p>
                    <p className="text-xs text-white/80">Security & Reliability</p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20"
              >
                <div className="flex items-center justify-center gap-2 text-white">
                  <Headphones className="w-6 h-6 text-yellow-400" />
                  <div className="text-left">
                    <p className="text-sm font-medium">24/7 Expert</p>
                    <p className="text-xs text-white/80">Customer Support</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Dynamic Helpline Section */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="mt-8 inline-flex items-center gap-2 sm:gap-4 bg-white/10 backdrop-blur-sm px-4 sm:px-6 py-3 rounded-full border border-white/20"
            >
              <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-white animate-pulse flex-shrink-0" />
              <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
                <span className="text-white/80 text-xs sm:text-sm">Questions? Call</span>
                <div className="flex items-center gap-1 sm:gap-2 font-bold text-white">
                  <span className="text-lg sm:text-xl">{country.flag}</span>
                  <a href={`tel:${country.phoneNumber.replace(/[^0-9+]/g, '')}`} className="hover:underline text-sm sm:text-base">
                    {country.phoneNumber}
                  </a>
                </div>
                <span className="text-white/60 text-xs hidden sm:inline">• 24/7 Support</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}