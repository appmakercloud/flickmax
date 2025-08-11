'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSEOProducts } from '@/hooks/useSEOProducts'
import { useCountry } from '@/contexts/CountryContext'
import { formatCurrency } from '@/lib/countries'
import { useCart } from '@/contexts/CartContext'
import toast from 'react-hot-toast'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { 
  Search,
  TrendingUp,
  BarChart3,
  Target,
  Zap,
  Award,
  ChevronRight,
  Star,
  Clock,
  Headphones,
  ArrowRight,
  Check,
  ChevronDown,
  Phone,
  Globe,
  MousePointer,
  Eye,
  Users,
  Shield,
  CheckCircle,
  Sparkles,
  LineChart,
  Activity,
  Compass,
  Map,
  FileSearch,
  PieChart,
  Gauge,
  Bot,
  Brain,
  Rocket,
  Trophy,
  Megaphone,
  ShoppingCart,
  ArrowUpRight,
  Lightbulb,
  Link,
  Hash,
  FileText,
  Code,
  Layers,
  Database,
  Settings,
  Filter,
  BarChart,
  DollarSign,
  HelpCircle
} from 'lucide-react'

export default function SEOPage() {
  const [selectedFeature, setSelectedFeature] = useState<number | null>(null)
  const [addingToCart, setAddingToCart] = useState<string | null>(null)
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly')
  
  const { products: apiProducts, loading, error, metadata } = useSEOProducts()
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

  // Use API product
  const seoProduct = apiProducts.length > 0 ? apiProducts[0] : null

  const features = [
    {
      icon: Search,
      title: 'Keyword Research',
      description: 'Discover high-impact keywords your customers are searching for',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: TrendingUp,
      title: 'Rank Tracking',
      description: 'Monitor your website\'s position on Google, Yahoo & Bing',
      color: 'from-cyan-500 to-blue-600'
    },
    {
      icon: FileSearch,
      title: 'Site Analysis',
      description: 'Get actionable insights to optimize your website structure',
      color: 'from-blue-600 to-indigo-600'
    },
    {
      icon: Map,
      title: 'Sitemap Builder',
      description: 'Create and submit sitemaps to help search engines crawl your site',
      color: 'from-indigo-600 to-purple-600'
    },
    {
      icon: BarChart3,
      title: 'Competitor Analysis',
      description: 'See how you stack up against your competition',
      color: 'from-purple-600 to-pink-600'
    },
    {
      icon: Lightbulb,
      title: 'Content Suggestions',
      description: 'Get AI-powered recommendations for content optimization',
      color: 'from-pink-600 to-rose-600'
    }
  ]

  const benefits = [
    {
      icon: TrendingUp,
      value: '87%',
      label: 'Average Traffic Increase',
      description: 'Within 6 months'
    },
    {
      icon: Target,
      value: '#1',
      label: 'Page Rankings',
      description: 'Achievable results'
    },
    {
      icon: Users,
      value: '3x',
      label: 'More Leads',
      description: 'Organic growth'
    },
    {
      icon: DollarSign,
      value: '250%',
      label: 'ROI Average',
      description: 'Return on investment'
    }
  ]

  const processSteps = [
    {
      number: '01',
      title: 'Analyze Your Site',
      description: 'Our tool scans your website to identify SEO opportunities',
      icon: FileSearch
    },
    {
      number: '02',
      title: 'Get Recommendations',
      description: 'Receive personalized, actionable SEO improvements',
      icon: Lightbulb
    },
    {
      number: '03',
      title: 'Implement Changes',
      description: 'Follow step-by-step instructions to optimize your site',
      icon: Settings
    },
    {
      number: '04',
      title: 'Track Progress',
      description: 'Monitor your rankings and traffic growth over time',
      icon: LineChart
    }
  ]

  const seoMetrics = [
    { label: 'Keywords Tracked', value: 'Unlimited' },
    { label: 'Competitor Sites', value: '5' },
    { label: 'Site Audits', value: 'Weekly' },
    { label: 'Ranking Reports', value: 'Daily' },
    { label: 'Backlink Analysis', value: 'Included' },
    { label: 'Local SEO', value: 'Included' }
  ]

  const faqs = [
    {
      question: 'How quickly will I see results?',
      answer: 'Most users start seeing improvements in rankings within 2-4 weeks. Significant traffic increases typically occur within 2-3 months of consistent optimization. The exact timeline depends on your competition and how well you implement the recommendations.'
    },
    {
      question: 'Do I need technical knowledge to use this?',
      answer: 'Not at all! Our SEO tool is designed for beginners. You\'ll get simple, step-by-step instructions with screenshots and examples. No coding or technical expertise required - if you can edit your website, you can improve your SEO.'
    },
    {
      question: 'What search engines does this work for?',
      answer: 'Our tool optimizes your site for all major search engines including Google, Yahoo, and Bing. While Google typically drives 90% of search traffic, we ensure your site performs well across all platforms.'
    },
    {
      question: 'Can I track my competitors?',
      answer: 'Yes! You can monitor up to 5 competitor websites. See their rankings, keywords they\'re targeting, and get insights on how to outrank them. This competitive intelligence is crucial for developing winning SEO strategies.'
    },
    {
      question: 'Will this help with local search?',
      answer: 'Absolutely! Our tool includes local SEO features to help you rank in "near me" searches and Google Maps. Perfect for businesses serving specific geographic areas. We\'ll help you optimize for local directories and citations.'
    },
    {
      question: 'How many keywords can I track?',
      answer: 'You can track unlimited keywords! Monitor your most important search terms, track long-tail keywords, and discover new opportunities. Our tool suggests relevant keywords based on your industry and competition.'
    },
    {
      question: 'Is this safe for my website?',
      answer: 'Yes, 100% safe. We only recommend white-hat SEO techniques that comply with search engine guidelines. No risky tactics or shortcuts that could harm your rankings. Everything is above-board and sustainable.'
    },
    {
      question: 'What if I need help?',
      answer: 'You get 24/7 customer support! Our SEO experts are available via phone, chat, and email to answer questions and provide guidance. Plus, you\'ll have access to video tutorials and a comprehensive knowledge base.'
    }
  ]

  const handleAddToCart = async (productId: string) => {
    try {
      setAddingToCart(productId)
      
      // SEO is typically billed monthly
      const period = billingPeriod === 'yearly' ? 12 : 1
      await addProductToCart(productId, period, 'MONTH')
      
      toast.success('SEO tool added to cart!')
    } catch (error) {
      console.error('Error adding to cart:', error)
      toast.error('Failed to add to cart')
    } finally {
      setAddingToCart(null)
    }
  }

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
          {[Search, TrendingUp, Target, BarChart3, Trophy].map((Icon, i) => (
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
              <Rocket className="w-4 h-4" />
              Rank #1 on Google with AI-Powered SEO
            </motion.div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-4">
              Search Engine Optimization
            </h1>
            <p className="text-xl sm:text-2xl md:text-3xl font-bold mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
                Get Found. Get Traffic. Get Customers.
              </span>
            </p>
            
            <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              {metadata.description || 'Our SEO tool analyzes your website and gives you step-by-step instructions on how you can optimize for Google®, Yahoo® and Bing®.'}
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
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all text-lg"
            >
              Start Ranking Higher
              <ArrowRight className="ml-2 w-5 h-5" />
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
              Everything You Need to Dominate Search Results
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Powerful SEO tools that make ranking easy and effective
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onHoverStart={() => setSelectedFeature(index)}
                onHoverEnd={() => setSelectedFeature(null)}
                className="group relative p-6 bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 hover:shadow-xl transition-all"
              >
                <motion.div 
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${feature.color} shadow-md mb-4`}
                >
                  <feature.icon className="w-6 h-6 text-white" />
                </motion.div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
                
                {selectedFeature === index && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2 right-2"
                  >
                    <Sparkles className="w-5 h-5 text-yellow-500" />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Four simple steps to SEO success
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div className="text-center">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-cyan-600 text-white rounded-2xl shadow-lg mb-4"
                  >
                    <span className="text-2xl font-bold">{step.number}</span>
                  </motion.div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>
                {index < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-full w-full">
                    <ArrowRight className="w-6 h-6 text-blue-300 -ml-3" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-base sm:text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
              One powerful tool, one simple price. Start ranking higher today.
            </p>

            {/* Billing Toggle */}
            <div className="inline-flex items-center bg-gray-100 p-1 rounded-xl shadow-inner mb-8">
              <button
                onClick={() => setBillingPeriod('monthly')}
                className={`px-6 py-2 rounded-lg font-medium transition-all ${
                  billingPeriod === 'monthly' 
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingPeriod('yearly')}
                className={`px-6 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  billingPeriod === 'yearly' 
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md' 
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

          {/* Pricing Card */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <LoadingSpinner size="lg" />
            </div>
          ) : seoProduct ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative max-w-2xl mx-auto"
            >
              {/* Popular Badge */}
              <motion.div 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="absolute -top-4 left-1/2 -translate-x-1/2 z-10"
              >
                <span className="px-4 py-2 text-xs font-bold text-white rounded-full shadow-lg bg-gradient-to-r from-blue-600 to-cyan-600">
                  MOST POPULAR CHOICE
                </span>
              </motion.div>

              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-blue-500">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-8 text-center text-white">
                  <motion.div 
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex p-4 rounded-2xl bg-white/20 backdrop-blur-sm mb-4"
                  >
                    <Search className="w-12 h-12 text-white" />
                  </motion.div>
                  <h3 className="text-3xl font-bold mb-2">{seoProduct.name}</h3>
                  <p className="text-white/90">{seoProduct.description}</p>
                </div>

                {/* Pricing */}
                <div className="p-8">
                  <div className="text-center mb-8">
                    <div className="flex items-baseline justify-center gap-2">
                      <span className="text-5xl font-bold text-gray-900">
                        {formatCurrency(
                          billingPeriod === 'yearly' 
                            ? seoProduct.price.monthly * 12 * 0.8 // 20% discount
                            : seoProduct.price.monthly,
                          seoProduct.price.currency || currency,
                          locale
                        )}
                      </span>
                      <span className="text-gray-500">
                        /{billingPeriod === 'yearly' ? 'year' : 'month'}
                      </span>
                    </div>
                    {billingPeriod === 'yearly' && (
                      <p className="text-sm text-gray-500 mt-2">
                        That's only {formatCurrency(seoProduct.price.monthly * 0.8, seoProduct.price.currency || currency, locale)}/month
                      </p>
                    )}
                    {seoProduct.originalPrice.monthly > seoProduct.price.monthly && (
                      <p className="text-sm text-gray-400 line-through mt-1">
                        Regular price: {formatCurrency(seoProduct.originalPrice.monthly, seoProduct.originalPrice.currency || currency, locale)}/month
                      </p>
                    )}
                  </div>

                  {/* Features */}
                  <div className="space-y-4 mb-8">
                    <h4 className="font-bold text-gray-900 text-center">Everything Included:</h4>
                    {seoProduct.features.map((feature, idx) => (
                      <motion.div 
                        key={idx} 
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.05 }}
                        className="flex items-start gap-3"
                      >
                        <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-8 p-4 bg-gray-50 rounded-lg">
                    {seoMetrics.map((metric, idx) => (
                      <div key={idx} className="text-center">
                        <div className="text-lg font-bold text-gray-900">{metric.value}</div>
                        <div className="text-xs text-gray-600">{metric.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAddToCart(seoProduct.id)}
                    disabled={addingToCart === seoProduct.id}
                    className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg hover:shadow-xl text-lg ${
                      addingToCart === seoProduct.id ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {addingToCart === seoProduct.id ? (
                      <span className="flex items-center justify-center gap-2">
                        <LoadingSpinner size="sm" />
                        Adding...
                      </span>
                    ) : (
                      <>
                        <ShoppingCart className="w-5 h-5" />
                        Get Started Now
                      </>
                    )}
                  </motion.button>
                  
                  {/* Guarantees */}
                  <div className="mt-6 grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <Shield className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                      <p className="text-xs text-gray-500">30-Day<br/>Guarantee</p>
                    </div>
                    <div className="text-center">
                      <Clock className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                      <p className="text-xs text-gray-500">Cancel<br/>Anytime</p>
                    </div>
                    <div className="text-center">
                      <Headphones className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                      <p className="text-xs text-gray-500">24/7<br/>Support</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-500">No products available</p>
            </div>
          )}
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
              Everything you need to know about our SEO tool
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
            className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"
          />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4">
              Ready to Dominate Search Results?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-white/90 mb-8 max-w-3xl mx-auto">
              Join thousands of businesses ranking #1 on Google with our proven SEO tool
            </p>
            
            {/* CTA Button */}
            <motion.a
              href="#pricing"
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center px-10 py-4 bg-white text-blue-600 rounded-xl font-bold shadow-xl hover:shadow-2xl transition-all text-lg"
            >
              Start Your SEO Journey
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
                  <Trophy className="w-6 h-6 text-yellow-400" />
                  <div className="text-left">
                    <p className="text-sm font-medium">#1 Results</p>
                    <p className="text-xs text-white/80">Proven Rankings</p>
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
                  <Users className="w-6 h-6 text-cyan-400" />
                  <div className="text-left">
                    <p className="text-sm font-medium">50,000+</p>
                    <p className="text-xs text-white/80">Happy Customers</p>
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
                  <Star className="w-6 h-6 text-orange-400" />
                  <div className="text-left">
                    <p className="text-sm font-medium">4.9/5 Stars</p>
                    <p className="text-xs text-white/80">Customer Rating</p>
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