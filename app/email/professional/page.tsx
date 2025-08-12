'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useProfessionalEmailProducts } from '@/hooks/useProfessionalEmailProducts'
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
  TrendingUp,
  Building,
  Sparkles,
  ChevronRight,
  Star,
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
  CalendarDays,
  CloudDownload,
  CloudUpload,
  RotateCcw,
  FolderSync,
  Inbox,
  Send,
  Share2,
  UserPlus,
  TeamIcon,
  Briefcase,
  Building2,
  AtSign,
  Link,
  Paperclip,
  Search,
  Bell,
  Video,
  Mic,
  Volume2,
  Edit,
  Trash2
} from 'lucide-react'

// Import Users as TeamIcon to avoid conflict
const TeamIcon = Users

export default function ProfessionalEmailPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [addingToCart, setAddingToCart] = useState<string | null>(null)
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('yearly')
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [emailDomain, setEmailDomain] = useState('yourbusiness.com')
  
  const { products: apiProducts, loading, error } = useProfessionalEmailProducts()
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
    'Users': TeamIcon
  }

  // Use API products or fallback
  const emailPlans = apiProducts.length > 0 ? apiProducts : []

  const features = [
    {
      icon: Shield,
      title: 'World-Class Security',
      description: 'Advanced spam filtering and threat protection keep your inbox safe'
    },
    {
      icon: CalendarDays,
      title: 'Online Calendars',
      description: 'Manage your schedule and quickly book meetings with integrated calendar'
    },
    {
      icon: Smartphone,
      title: 'Works with Any Email App',
      description: 'Compatible with Outlook, Apple Mail, Gmail app, and more'
    },
    {
      icon: Globe,
      title: 'Mobile-Friendly Webmail',
      description: 'Access your email from anywhere with our responsive web interface'
    }
  ]

  const statistics = [
    { name: 'Uptime Guarantee', percentage: 99.9, icon: Clock, color: 'from-green-500 to-emerald-500' },
    { name: 'Spam Blocked', percentage: 99.7, icon: Shield, color: 'from-blue-500 to-cyan-500' },
    { name: 'Customer Satisfaction', percentage: 98, icon: Heart, color: 'from-purple-500 to-pink-500' },
    { name: 'Mobile Compatible', percentage: 100, icon: Smartphone, color: 'from-orange-500 to-red-500' }
  ]

  const handleAddToCart = async (productId: string) => {
    try {
      setAddingToCart(productId)
      
      // Professional email is typically sold per month
      const period = billingPeriod === 'yearly' ? 12 : 1
      await addProductToCart(productId, period, 'MONTH')
      
      toast.success('Professional Email added to cart!')
    } catch (error) {
      console.error('Error adding to cart:', error)
      toast.error('Failed to add to cart')
    } finally {
      setAddingToCart(null)
    }
  }

  const comparisonTable = [
    { feature: 'Storage Space', individual: '10 GB', team: '25 GB' },
    { feature: 'Email Addresses', individual: '1', team: 'Multiple' },
    { feature: 'Custom Domain', individual: true, team: true },
    { feature: 'Mobile Access', individual: true, team: true },
    { feature: 'Calendar', individual: 'Personal', team: 'Shared' },
    { feature: 'Contacts', individual: 'Personal', team: 'Shared' },
    { feature: 'Tasks', individual: 'Personal', team: 'Team Tasks' },
    { feature: 'Spam Protection', individual: true, team: true },
    { feature: '24/7 Support', individual: true, team: true }
  ]

  const faqs = [
    {
      question: 'Can I use my existing domain?',
      answer: 'Yes! You can use any domain you own with Professional Email. If you don\'t have a domain yet, you can purchase one and easily connect it to your email service.'
    },
    {
      question: 'Will it work with my current email app?',
      answer: 'Absolutely! Professional Email works with all major email clients including Outlook, Apple Mail, Thunderbird, and mobile apps on iOS and Android. We provide easy setup instructions for each.'
    },
    {
      question: 'Can I migrate my existing emails?',
      answer: 'Yes, we provide migration tools and support to help you transfer your existing emails, contacts, and calendar events from your current email provider.'
    },
    {
      question: 'How many email addresses can I create?',
      answer: 'With the Individual plan, you get one email address. The Team plan allows you to create multiple email addresses for your team members, with each user getting their own login and mailbox.'
    },
    {
      question: 'Is my data secure?',
      answer: 'Your data is protected with enterprise-grade security including SSL/TLS encryption, advanced spam filtering, virus protection, and regular backups. We maintain 99.9% uptime guarantee.'
    },
    {
      question: 'Can I upgrade my plan later?',
      answer: 'Yes! You can upgrade from Individual to Team plan anytime. Your data, settings, and email address will remain intact during the upgrade.'
    }
  ]

  // Email preview animation
  const emailExamples = [
    'john@yourbusiness.com',
    'sales@yourbusiness.com',
    'support@yourbusiness.com',
    'info@yourbusiness.com'
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

        {/* Floating Email Icons */}
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
              <Mail className="w-8 h-8 text-blue-200/30" />
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
              <AtSign className="w-4 h-4" />
              Build Trust with Professional Email
            </motion.div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-4">
              Professional Email
            </h1>
            <p className="text-xl sm:text-2xl md:text-3xl font-bold mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
                Make Your Business Look Its Best
              </span>
            </p>
            
            <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Earn your customers' trust with a professional email address that matches your business name
            </p>

            {/* Email Examples Animation */}
            <div className="mb-8 max-w-xl mx-auto">
              <div className="bg-white rounded-lg shadow-lg p-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-6 h-6 text-blue-600" />
                  <div className="flex-1 text-left">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={emailExamples[Math.floor(Date.now() / 3000) % emailExamples.length]}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-lg font-semibold text-gray-900"
                      >
                        {emailExamples[Math.floor(Date.now() / 3000) % emailExamples.length]}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                  <Badge className="px-3 py-1 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-full text-xs font-bold">
                    Professional
                  </Badge>
                </div>
              </div>
            </div>

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
                  <stat.icon className="w-5 h-5 text-blue-600 mx-auto mb-1" />
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
              Get Professional Email Now
              <ArrowRight className="ml-2 w-4 h-4" />
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* Every Plan Includes Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 mb-4">
              Every Professional Email Plan Includes
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need for professional communication
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
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 mb-4">
              Choose Your Email Plan
            </h2>
            <p className="text-base sm:text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
              Professional email that grows with your business
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

          {/* Email Plans Grid */}
          {loading ? (
            <PricingTableSkeleton columns={3} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
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
                    className={`relative bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2 ${
                      plan.popular ? 'ring-2 ring-blue-500' : ''
                    }`}
                  >
                    {/* Badge */}
                    {plan.badge && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                        <span className={`px-3 py-1 text-xs font-bold text-white rounded-full shadow-lg bg-gradient-to-r ${
                          plan.badge === 'MOST POPULAR' ? 'from-blue-600 to-cyan-600' :
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
                          <p className="text-xs text-blue-600 mt-1 font-medium">{plan.description}</p>
                        )}
                      </div>

                      {/* Price */}
                      <div className="text-center mb-6">
                        <div className="flex items-baseline justify-center gap-1">
                          {plan.originalPrice && plan.originalPrice.monthly > plan.price.monthly && (
                            <span className="text-sm text-gray-500 line-through">
                              {formatCurrency(
                                billingPeriod === 'monthly' ? plan.originalPrice.monthly : plan.originalPrice.yearly,
                                plan.price.currency || currency,
                                locale
                              )}
                            </span>
                          )}
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
                      </div>

                      {/* Quick Stats */}
                      <div className="grid grid-cols-3 gap-2 mb-4 pb-4 border-b">
                        <div className="text-center">
                          <p className="text-xs text-gray-500">Storage</p>
                          <p className="text-xs font-bold text-gray-900">{plan.storage}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-500">Users</p>
                          <p className="text-xs font-bold text-gray-900">{plan.users}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-500">Support</p>
                          <p className="text-xs font-bold text-gray-900">{plan.support}</p>
                        </div>
                      </div>

                      {/* Features */}
                      <div className="space-y-2 mb-6">
                        {plan.features.map((feature, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-xs text-gray-700">{feature}</span>
                          </div>
                        ))}
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
                          'Get Started'
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

      {/* Why Choose Professional Email Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 mb-4">
              Why Professional Email Transforms Your Business
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
              Join thousands of businesses that have elevated their brand with domain-based email
            </p>
          </motion.div>

          <div className="space-y-8">
            {/* Benefit 1 - Simple & Cost-Effective */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="group"
            >
              <div className="relative flex flex-col lg:flex-row items-center gap-8 p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-t-2xl" />
                
                <motion.div 
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className="flex-shrink-0"
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-10 h-10 text-blue-600" />
                  </div>
                </motion.div>
                
                <div className="flex-1 text-center lg:text-left">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Simple, Secure & Mobile-First Design
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Our upgraded Professional Email makes business communication effortless. Sync across all devices, 
                    manage folders intuitively, and promote your brand with every email—all while keeping costs low. 
                    It's enterprise-grade email without the enterprise price tag.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3 justify-center lg:justify-start">
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                      Cost-Effective
                    </span>
                    <span className="px-3 py-1 bg-cyan-50 text-cyan-700 rounded-full text-sm font-medium">
                      Multi-Device Sync
                    </span>
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium">
                      Easy Management
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Benefit 2 - Build Trust */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="group"
            >
              <div className="relative flex flex-col lg:flex-row-reverse items-center gap-8 p-8 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl shadow-lg hover:shadow-xl transition-all">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-cyan-400/10 rounded-full blur-3xl" />
                
                <motion.div 
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring" }}
                  className="flex-shrink-0 relative"
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Trophy className="w-10 h-10 text-white" />
                  </div>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center"
                  >
                    <span className="text-white text-xs font-bold">9x</span>
                  </motion.div>
                </motion.div>
                
                <div className="flex-1 text-center lg:text-left">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Build Instant Customer Trust
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Customers are <span className="font-bold text-blue-600">9x more likely</span> to choose businesses with professional email addresses. 
                    Every email from you@yourdomain.com reinforces your brand. Create unlimited addresses like 
                    sales@, support@, or info@ to serve customers better and appear more established.
                  </p>
                  <div className="mt-4 flex items-center gap-4 justify-center lg:justify-start">
                    <div className="flex -space-x-2">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">@</div>
                      <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center text-white text-xs font-bold">@</div>
                      <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white text-xs font-bold">@</div>
                    </div>
                    <span className="text-sm text-gray-600">Multiple email addresses included</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Benefit 3 - Universal Sync */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="group"
            >
              <div className="relative flex flex-col lg:flex-row items-center gap-8 p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all overflow-hidden">
                <motion.div
                  animate={{ 
                    rotate: [0, 360],
                  }}
                  transition={{ 
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="absolute -right-10 -top-10 w-40 h-40 bg-gradient-to-br from-blue-200/20 to-cyan-200/20 rounded-full"
                />
                
                <div className="flex-shrink-0 relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-xl flex items-center justify-center">
                    <RefreshCw className="w-10 h-10 text-indigo-600" />
                  </div>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 border-2 border-dashed border-blue-300 rounded-xl"
                  />
                </div>
                
                <div className="flex-1 text-center lg:text-left relative">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Perfect Sync Across All Devices
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Works seamlessly with Outlook, Apple Mail, and all major email apps. Your emails, contacts, 
                    and appointments stay perfectly synchronized across your laptop, smartphone, and tablet. 
                    Access everything you need, wherever you are, with real-time updates.
                  </p>
                  <div className="mt-4 grid grid-cols-4 gap-3 max-w-xs mx-auto lg:mx-0">
                    <motion.div whileHover={{ y: -5 }} className="flex flex-col items-center">
                      <Smartphone className="w-6 h-6 text-blue-600 mb-1" />
                      <span className="text-xs text-gray-600">Phone</span>
                    </motion.div>
                    <motion.div whileHover={{ y: -5 }} className="flex flex-col items-center">
                      <div className="w-6 h-6 text-cyan-600 mb-1">💻</div>
                      <span className="text-xs text-gray-600">Laptop</span>
                    </motion.div>
                    <motion.div whileHover={{ y: -5 }} className="flex flex-col items-center">
                      <div className="w-6 h-6 text-indigo-600 mb-1">📱</div>
                      <span className="text-xs text-gray-600">Tablet</span>
                    </motion.div>
                    <motion.div whileHover={{ y: -5 }} className="flex flex-col items-center">
                      <div className="w-6 h-6 text-blue-600 mb-1">⌚</div>
                      <span className="text-xs text-gray-600">Watch</span>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Benefit 4 - Shared Calendar */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="group"
            >
              <div className="relative flex flex-col lg:flex-row-reverse items-center gap-8 p-8 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl shadow-lg hover:shadow-xl transition-all">
                <motion.div 
                  whileHover={{ rotateY: 180 }}
                  transition={{ duration: 0.6 }}
                  className="flex-shrink-0"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                    <CalendarDays className="w-10 h-10 text-white" />
                  </div>
                </motion.div>
                
                <div className="flex-1 text-center lg:text-left">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Stay Connected with Smart Calendars
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Never miss a meeting with shared calendars that sync across your team. Schedule appointments, 
                    import events from other apps, send invites, and get smart reminders on all devices. 
                    Keep everyone in the loop with collaborative scheduling that just works.
                  </p>
                  <div className="mt-4 flex items-center gap-6 justify-center lg:justify-start">
                    <div className="flex items-center gap-2">
                      <Bell className="w-5 h-5 text-blue-600" />
                      <span className="text-sm text-gray-600">Smart Reminders</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-cyan-600" />
                      <span className="text-sm text-gray-600">Team Sharing</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Benefit 5 - Ample Storage */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="group"
            >
              <div className="relative flex flex-col lg:flex-row items-center gap-8 p-8 bg-gradient-to-br from-white via-blue-50/50 to-cyan-50/50 rounded-2xl shadow-lg hover:shadow-xl transition-all">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-cyan-600/5 rounded-2xl" />
                
                <motion.div 
                  animate={{ 
                    scale: [1, 1.05, 1],
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                  }}
                  className="flex-shrink-0 relative"
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Database className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    25GB+
                  </div>
                </motion.div>
                
                <div className="flex-1 text-center lg:text-left relative">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Never Run Out of Space
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Growing businesses need growing storage. With generous space for emails, contacts, and calendars, 
                    you'll never have to delete important messages. Keep your entire business history at your fingertips 
                    with room to grow as your business expands.
                  </p>
                  <div className="mt-4">
                    <div className="flex items-center gap-3 justify-center lg:justify-start">
                      <div className="flex-1 max-w-xs bg-gray-200 rounded-full h-3 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: "75%" }}
                          transition={{ duration: 1, delay: 0.5 }}
                          className="h-full bg-gradient-to-r from-blue-600 to-cyan-600"
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-700">Plenty of room</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
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
              Compare Email Plans
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Find the perfect email solution for your needs
            </p>
          </motion.div>

          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-xl shadow-lg overflow-hidden">
              <thead className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                <tr>
                  <th className="px-4 py-4 text-left text-sm font-bold">Features</th>
                  <th className="px-4 py-4 text-center text-sm font-bold">Individual</th>
                  <th className="px-4 py-4 text-center text-sm font-bold">Team</th>
                </tr>
              </thead>
              <tbody>
                {comparisonTable.map((row, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{row.feature}</td>
                    <td className="px-4 py-3 text-center">
                      {typeof row.individual === 'boolean' ? (
                        row.individual ? (
                          <Check className="w-5 h-5 text-green-500 mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-gray-300 mx-auto" />
                        )
                      ) : (
                        <span className="text-sm text-gray-700">{row.individual}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {typeof row.team === 'boolean' ? (
                        row.team ? (
                          <Check className="w-5 h-5 text-green-500 mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-gray-300 mx-auto" />
                        )
                      ) : (
                        <span className="text-sm text-gray-700">{row.team}</span>
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
              Everything you need to know about Professional Email
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
          <motion.div
            animate={{ 
              x: [0, -100, 0],
              y: [0, 50, 0]
            }}
            transition={{ 
              duration: 25,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-400/5 rounded-full blur-3xl"
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
              Start Building Trust Today
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Give your business the professional image it deserves with email that matches your domain.
            </p>
            
            {/* CTA Button */}
            <motion.a
              href="#pricing"
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center px-10 py-4 bg-white text-blue-600 rounded-xl font-bold shadow-xl hover:shadow-2xl transition-all text-lg"
            >
              Get Professional Email Now
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
                    <p className="text-sm font-medium">Enterprise</p>
                    <p className="text-xs text-white/80">Security & Privacy</p>
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
                <span className="text-white/80 text-xs sm:text-sm">Need Help? Call</span>
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

// Badge component for email preview
function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <span className={className}>
      {children}
    </span>
  )
}