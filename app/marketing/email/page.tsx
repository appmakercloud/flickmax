'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useEmailMarketingProducts } from '@/hooks/useEmailMarketingProducts'
import { useCountry } from '@/contexts/CountryContext'
import { formatCurrency } from '@/lib/countries'
import { useCart } from '@/contexts/CartContext'
import toast from 'react-hot-toast'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { 
  Mail, 
  Users, 
  Shield, 
  Smartphone,
  Globe,
  CheckCircle,
  Zap,
  Award,
  ChevronRight,
  Star,
  Clock,
  Headphones,
  ArrowRight,
  Check,
  X,
  ChevronDown,
  Phone,
  Crown,
  FileText,
  Cloud,
  Package,
  HelpCircle,
  BarChart3,
  MessageSquare,
  Layers,
  Database,
  ShoppingCart,
  TrendingUp,
  Rocket,
  Send,
  Target,
  MousePointer,
  Eye,
  Inbox,
  Heart,
  Filter,
  BookOpen,
  Sparkles,
  LayoutTemplate,
  PieChart,
  UserPlus,
  RefreshCw,
  Timer,
  Activity,
  Bell,
  Gift,
  Repeat,
  Calendar,
  Link,
  Facebook,
  Instagram,
  Share2,
  Megaphone,
  BrainCircuit,
  LineChart
} from 'lucide-react'

export default function EmailMarketingPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [addingToCart, setAddingToCart] = useState<string | null>(null)
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('yearly')
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  
  const { products: apiProducts, loading, error } = useEmailMarketingProducts()
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
    'Rocket': Rocket,
    'TrendingUp': TrendingUp,
    'Crown': Crown,
    'Mail': Mail
  }

  // Use API products
  const emailPlans = apiProducts.length > 0 ? apiProducts : []

  const features = [
    {
      icon: Target,
      title: 'Smart Targeting',
      description: 'Reach the right audience at the right time with segmentation'
    },
    {
      icon: BrainCircuit,
      title: 'AI-Powered Insights',
      description: 'Get data-driven recommendations to improve your campaigns'
    },
    {
      icon: LayoutTemplate,
      title: 'Beautiful Templates',
      description: 'Choose from hundreds of professional, mobile-responsive designs'
    },
    {
      icon: LineChart,
      title: 'Real-Time Analytics',
      description: 'Track opens, clicks, and conversions as they happen'
    }
  ]

  const benefits = [
    {
      icon: MousePointer,
      value: '23%',
      label: 'Average Click Rate',
      description: 'Industry-leading engagement'
    },
    {
      icon: Eye,
      value: '42%',
      label: 'Open Rate',
      description: 'Get your emails noticed'
    },
    {
      icon: TrendingUp,
      value: '3.5x',
      label: 'ROI Increase',
      description: 'Better returns on investment'
    },
    {
      icon: Users,
      value: '98%',
      label: 'Deliverability',
      description: 'Reach more inboxes'
    }
  ]

  const handleAddToCart = async (productId: string) => {
    try {
      setAddingToCart(productId)
      
      // Email marketing is typically sold per year
      const period = billingPeriod === 'yearly' ? 12 : 1
      await addProductToCart(productId, period, 'MONTH')
      
      toast.success('Email Marketing added to cart!')
    } catch (error) {
      console.error('Error adding to cart:', error)
      toast.error('Failed to add to cart')
    } finally {
      setAddingToCart(null)
    }
  }

  const comparisonTable = [
    { feature: 'Contacts Included', beginner: '500', upRunning: '2,500', pro: '5,000' },
    { feature: 'Emails per Month', beginner: '5,000', upRunning: '25,000', pro: '50,000' },
    { feature: 'Signup Forms', beginner: '1', upRunning: 'Unlimited', pro: 'Unlimited' },
    { feature: 'Image Storage', beginner: 'Basic', upRunning: 'Unlimited', pro: 'Unlimited' },
    { feature: 'Welcome Emails', beginner: false, upRunning: true, pro: true },
    { feature: 'Automation', beginner: false, upRunning: true, pro: true },
    { feature: 'Blog to Email', beginner: false, upRunning: true, pro: true },
    { feature: 'Hot Leads List', beginner: false, upRunning: true, pro: true },
    { feature: 'Event Emails', beginner: false, upRunning: false, pro: true },
    { feature: 'Advanced Analytics', beginner: false, upRunning: false, pro: true },
    { feature: 'Facebook Integration', beginner: true, upRunning: true, pro: true },
    { feature: '24/7 Support', beginner: true, upRunning: true, pro: true }
  ]

  const faqs = [
    {
      question: 'How many emails can I send?',
      answer: 'It depends on your plan: Beginner gets 5,000 emails/month, Up & Running gets 25,000/month, and Pro gets 50,000/month. You can always upgrade if you need more!'
    },
    {
      question: 'Can I import my existing contacts?',
      answer: 'Yes! You can easily import contacts from CSV files, other email services, or your CRM. We\'ll help you clean and organize your list during import.'
    },
    {
      question: 'Do you provide email templates?',
      answer: 'Absolutely! We have hundreds of beautiful, mobile-responsive templates for every occasion - newsletters, promotions, announcements, and more. All customizable with your brand colors and logo.'
    },
    {
      question: 'Can I automate my email campaigns?',
      answer: 'Yes, with Up & Running and Pro plans! Set up welcome emails, birthday wishes, abandoned cart reminders, and complex drip campaigns that run automatically.'
    },
    {
      question: 'How do I track my results?',
      answer: 'Our real-time dashboard shows opens, clicks, unsubscribes, and conversions. Pro plan includes advanced analytics like heat maps, device tracking, and ROI calculations.'
    },
    {
      question: 'Will my emails reach the inbox?',
      answer: 'We maintain a 98% deliverability rate with authentication, spam testing, and reputation monitoring. We\'ll help you follow best practices to avoid spam folders.'
    },
    {
      question: 'Can I integrate with my website?',
      answer: 'Yes! We integrate with WordPress, Shopify, Facebook, Instagram, and most popular platforms. Add signup forms, sync customers, and trigger emails based on website activity.'
    },
    {
      question: 'What happens if I exceed my limits?',
      answer: 'No worries! You can add more contacts or emails anytime. We\'ll notify you when you\'re close to limits and help you choose the best upgrade option.'
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
          {[Mail, Send, Target, Heart, Bell].map((Icon, i) => (
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
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 rounded-full text-sm font-medium mb-6"
            >
              <Megaphone className="w-4 h-4" />
              Grow Your Business with Email Marketing
            </motion.div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-4">
              Email Marketing That Works
            </h1>
            <p className="text-xl sm:text-2xl md:text-3xl font-bold mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
                Connect, Engage, and Convert Your Audience
              </span>
            </p>
            
            <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Create beautiful emails, automate campaigns, and watch your business grow with our powerful yet simple email marketing platform
            </p>

            {/* Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl p-4 shadow-md"
                >
                  <benefit.icon className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{benefit.value}</div>
                  <div className="text-xs font-medium text-gray-700">{benefit.label}</div>
                  <div className="text-xs text-gray-500 mt-1">{benefit.description}</div>
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
              Start Free Trial
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
              Everything You Need to Succeed
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Powerful features that make email marketing easy and effective
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
                  <motion.div 
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className="p-3 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg shadow-md mb-4"
                  >
                    <feature.icon className="w-6 h-6 text-white" />
                  </motion.div>
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
              Choose Your Email Marketing Plan
            </h2>
            <p className="text-base sm:text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
              Start small, scale as you grow. All plans include our powerful features.
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
            <div className="flex justify-center items-center py-20">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {emailPlans.map((plan, index) => {
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
                    className={`relative bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all transform ${
                      isSelected ? 'scale-105 -translate-y-2' : ''
                    } ${plan.popular ? 'ring-2 ring-blue-500' : ''}`}
                  >
                    {/* Badge */}
                    {plan.badge && (
                      <motion.div 
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="absolute -top-4 left-1/2 -translate-x-1/2 z-10"
                      >
                        <span className={`px-4 py-2 text-xs font-bold text-white rounded-full shadow-lg bg-gradient-to-r ${
                          plan.badge === 'MOST POPULAR' ? 'from-blue-600 to-cyan-600' :
                          plan.badge === 'BEST VALUE' ? 'from-indigo-600 to-purple-600' :
                          'from-cyan-600 to-blue-600'
                        }`}>
                          {plan.badge}
                        </span>
                      </motion.div>
                    )}

                    <div className="p-8">
                      {/* Header */}
                      <div className="text-center mb-6">
                        <motion.div 
                          whileHover={{ rotate: [0, -10, 10, 0] }}
                          transition={{ duration: 0.5 }}
                          className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${plan.gradient} mb-4 shadow-lg`}
                        >
                          <IconComponent className="w-10 h-10 text-white" />
                        </motion.div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                        <p className="text-sm text-gray-600 mb-1">{plan.type}</p>
                        <p className="text-xs text-blue-600 font-medium">{plan.description}</p>
                      </div>

                      {/* Price */}
                      <div className="text-center mb-6 p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl">
                        <div className="flex items-baseline justify-center gap-1">
                          <span className="text-4xl font-bold text-gray-900">
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
                        {billingPeriod === 'yearly' && (
                          <p className="text-xs text-gray-500 mt-2">
                            That's only {formatCurrency(plan.price.yearly / 12, plan.price.currency || currency, locale)}/month
                          </p>
                        )}
                      </div>

                      {/* Key Features */}
                      <div className="space-y-3 mb-6 pb-6 border-b">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            <Users className="w-4 h-4 inline mr-1" />
                            Contacts
                          </span>
                          <span className="font-bold text-gray-900">{plan.contacts}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            <Send className="w-4 h-4 inline mr-1" />
                            Emails
                          </span>
                          <span className="font-bold text-gray-900">{plan.emails}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            <LayoutTemplate className="w-4 h-4 inline mr-1" />
                            Forms
                          </span>
                          <span className="font-bold text-gray-900">{plan.forms}</span>
                        </div>
                        {plan.automation && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">
                              <RefreshCw className="w-4 h-4 inline mr-1" />
                              Automation
                            </span>
                            <Check className="w-4 h-4 text-green-500" />
                          </div>
                        )}
                      </div>

                      {/* All Features */}
                      <div className="mb-6">
                        <h4 className="text-xs font-bold text-gray-700 mb-3">All Features:</h4>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {plan.features.map((feature, idx) => (
                            <div key={idx} className="flex items-start gap-2">
                              <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span className="text-xs text-gray-700">{feature}</span>
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
                            Get Started
                          </>
                        )}
                      </motion.button>
                      
                      {/* Guarantee */}
                      <div className="mt-3 text-center">
                        <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
                          <Shield className="w-3 h-3" />
                          30-day money-back guarantee
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
              Compare Plans
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Find the perfect plan for your email marketing needs
            </p>
          </motion.div>

          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-xl shadow-lg overflow-hidden">
              <thead className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                <tr>
                  <th className="px-4 py-4 text-left text-sm font-bold">Features</th>
                  <th className="px-4 py-4 text-center text-sm font-bold">Beginner</th>
                  <th className="px-4 py-4 text-center text-sm font-bold">Up & Running</th>
                  <th className="px-4 py-4 text-center text-sm font-bold">Pro</th>
                </tr>
              </thead>
              <tbody>
                {comparisonTable.map((row, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{row.feature}</td>
                    <td className="px-4 py-3 text-center">
                      {typeof row.beginner === 'boolean' ? (
                        row.beginner ? (
                          <Check className="w-5 h-5 text-green-500 mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-gray-300 mx-auto" />
                        )
                      ) : (
                        <span className="text-sm text-gray-700">{row.beginner}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {typeof row.upRunning === 'boolean' ? (
                        row.upRunning ? (
                          <Check className="w-5 h-5 text-green-500 mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-gray-300 mx-auto" />
                        )
                      ) : (
                        <span className="text-sm text-gray-700">{row.upRunning}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {typeof row.pro === 'boolean' ? (
                        row.pro ? (
                          <Check className="w-5 h-5 text-green-500 mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-gray-300 mx-auto" />
                        )
                      ) : (
                        <span className="text-sm text-gray-700">{row.pro}</span>
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
              Everything you need to know about email marketing
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
        {/* Animated Background */}
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
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4">
              Ready to Grow Your Business?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of businesses using our email marketing to connect with customers
            </p>
            
            {/* CTA Button */}
            <motion.a
              href="#pricing"
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center px-10 py-4 bg-white text-blue-600 rounded-xl font-bold shadow-xl hover:shadow-2xl transition-all text-lg"
            >
              Start Your Free Trial
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
                    <p className="text-sm font-medium">30-Day</p>
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
                    <p className="text-sm font-medium">GDPR</p>
                    <p className="text-xs text-white/80">Compliant & Secure</p>
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