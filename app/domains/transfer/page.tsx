'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowRight, 
  Loader2, 
  Globe, 
  Lock,
  RefreshCw,
  Server,
  HeadphonesIcon,
  CheckCircle,
  Search,
  ShoppingCart,
  Award,
  FileText,
  Mail,
  DollarSign,
  Gift,
  Rocket,
  ShieldCheck,
  Layers,
  ChevronDown,
  Phone,
  MessageCircle
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useCountry } from '@/contexts/CountryContext'
import { useCart } from '@/contexts/CartContext'
import { validateDomain } from '@/lib/utils'

// Transfer requirements by TLD
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const transferRequirements = {
  '.com': { authCode: true, unlocked: true, days60: true, emailVerification: true },
  '.net': { authCode: true, unlocked: true, days60: true, emailVerification: true },
  '.org': { authCode: true, unlocked: true, days60: true, emailVerification: true },
  '.in': { authCode: true, unlocked: true, days60: false, emailVerification: true },
  '.co': { authCode: true, unlocked: true, days60: true, emailVerification: true },
  '.io': { authCode: true, unlocked: true, days60: false, emailVerification: true },
  '.ai': { authCode: true, unlocked: true, days60: false, emailVerification: true },
  '.app': { authCode: true, unlocked: true, days60: true, emailVerification: true },
  '.dev': { authCode: true, unlocked: true, days60: true, emailVerification: true },
  '.store': { authCode: true, unlocked: true, days60: true, emailVerification: true },
}

// Transfer pricing
const transferPricing = [
  { tld: '.com', price: { usd: 10.99, inr: 899 }, popular: true },
  { tld: '.net', price: { usd: 12.99, inr: 1099 }, popular: false },
  { tld: '.org', price: { usd: 11.99, inr: 999 }, popular: false },
  { tld: '.in', price: { usd: 8.99, inr: 749 }, popular: true },
  { tld: '.co', price: { usd: 24.99, inr: 2099 }, popular: false },
  { tld: '.io', price: { usd: 44.99, inr: 3799 }, popular: false },
  { tld: '.ai', price: { usd: 89.99, inr: 7499 }, popular: false },
  { tld: '.app', price: { usd: 15.99, inr: 1349 }, popular: true },
]

// Transfer steps
const transferSteps = [
  {
    number: '01',
    icon: Lock,
    title: 'Unlock Your Domain',
    description: 'Remove transfer lock at your current registrar',
    time: '5 minutes'
  },
  {
    number: '02',
    icon: FileText,
    title: 'Get Authorization Code',
    description: 'Request transfer code from current registrar',
    time: '10 minutes'
  },
  {
    number: '03',
    icon: Search,
    title: 'Start Transfer',
    description: 'Enter your domain and auth code here',
    time: '2 minutes'
  },
  {
    number: '04',
    icon: Mail,
    title: 'Confirm Transfer',
    description: 'Approve transfer via email verification',
    time: '5-7 days'
  }
]

// Benefits
const transferBenefits = [
  {
    icon: DollarSign,
    title: 'Save up to 30%',
    description: 'Lower renewal prices compared to other registrars'
  },
  {
    icon: ShieldCheck,
    title: 'Free WHOIS Privacy',
    description: 'Protect your personal information at no extra cost'
  },
  {
    icon: Gift,
    title: 'Free 1-Year Extension',
    description: 'Get an extra year added to your domain registration'
  },
  {
    icon: HeadphonesIcon,
    title: '24/7 Expert Support',
    description: 'Round-the-clock assistance from domain experts'
  },
  {
    icon: Server,
    title: 'Free DNS Management',
    description: 'Advanced DNS controls with unlimited records'
  },
  {
    icon: Rocket,
    title: 'Instant Setup',
    description: 'Start using our services immediately after transfer'
  }
]

// FAQs
const transferFAQs = [
  {
    question: 'How long does a domain transfer take?',
    answer: 'Most domain transfers complete within 5-7 days. The exact time depends on how quickly you approve the transfer and your current registrar\'s processing time.'
  },
  {
    question: 'Will my website go down during transfer?',
    answer: 'No! Your website will remain online throughout the transfer process. Domain transfers only change the registrar, not your hosting or DNS settings.'
  },
  {
    question: 'What is an authorization code?',
    answer: 'An authorization code (also called EPP code or transfer code) is a unique password provided by your current registrar to authorize the domain transfer.'
  },
  {
    question: 'Can I transfer an expired domain?',
    answer: 'You must renew expired domains with your current registrar before transferring. Domains must be active to initiate a transfer.'
  }
]

export default function DomainTransferPage() {
  const [domainName, setDomainName] = useState('')
  const [authCode, setAuthCode] = useState('')
  const [isChecking, setIsChecking] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [transferData, setTransferData] = useState<unknown>(null)
  const [selectedDomains, setSelectedDomains] = useState<string[]>([])
  const [bulkDomains, setBulkDomains] = useState('')
  const [isBulkMode, setIsBulkMode] = useState(false)
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null)
  const { currency, country } = useCountry()
  const { addProductToCart } = useCart()
  const [addingToCart, setAddingToCart] = useState<string | null>(null)

  const handleCheckTransfer = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!domainName.trim()) {
      toast.error('Please enter a domain name')
      return
    }

    if (!validateDomain(domainName.trim())) {
      toast.error('Please enter a valid domain name')
      return
    }

    if (!authCode.trim()) {
      toast.error('Please enter your authorization code')
      return
    }

    setIsChecking(true)
    
    try {
      const response = await fetch('/api/domain/transfer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          domain: domainName.trim(),
          authCode: authCode.trim(),
          currency: currency
        })
      })

      const result = await response.json()

      if (!response.ok) {
        if (result.forRegistration) {
          toast.error('This domain is available for registration, not transfer')
        } else {
          toast.error(result.error || 'Failed to check transfer eligibility')
        }
        setIsChecking(false)
        return
      }

      if (result.success && result.data) {
        setTransferData(result.data)
        setShowResults(true)
        toast.success('Domain is eligible for transfer!')
      }
    } catch (error) {
      toast.error('Failed to check domain transfer eligibility')
      console.error('Transfer check error:', error)
    } finally {
      setIsChecking(false)
    }
  }

  const handleAddToCart = async () => {
    if (!transferData) return
    
    setAddingToCart(transferData.domain)
    
    try {
      await addProductToCart('domain-transfer-' + transferData.domain, 1, 'YEAR')
      toast.success(`${transferData.domain} transfer added to cart!`)
      
      setDomainName('')
      setAuthCode('')
      setShowResults(false)
      setTransferData(null)
    } catch (error) {
      toast.error('Failed to add to cart')
    } finally {
      setAddingToCart(null)
    }
  }

  const handleBulkTransfer = () => {
    const domains = bulkDomains.split('\n').filter(d => d.trim())
    if (domains.length === 0) {
      toast.error('Please enter at least one domain')
      return
    }
    
    const invalidDomains = domains.filter(d => !validateDomain(d.trim()))
    if (invalidDomains.length > 0) {
      toast.error(`Invalid domains: ${invalidDomains.join(', ')}`)
      return
    }
    
    setSelectedDomains(domains.map(d => d.trim()))
    toast.success(`${domains.length} domains ready for transfer`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - Clean Teal Gradient */}
      <section className="relative bg-gradient-to-br from-teal-500 via-cyan-500 to-teal-600 py-20">
        <div className="absolute inset-0 bg-black/5" />
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Transfer & Save up to<br />
              <span className="text-yellow-300">30% on Renewals</span>
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
              Switch to Flickmax and get better prices, free WHOIS privacy, and an extra year 
              added to your domain. Transfer multiple domains with our bulk transfer tool.
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm">
                <CheckCircle className="w-4 h-4" />
                Free WHOIS Privacy
              </span>
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm">
                <CheckCircle className="w-4 h-4" />
                No Hidden Fees
              </span>
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm">
                <CheckCircle className="w-4 h-4" />
                Free 1-Year Extension
              </span>
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm">
                <CheckCircle className="w-4 h-4" />
                24/7 Support
              </span>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="#transfer-form"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-white text-teal-600 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Start Transfer Now
              </a>
              <button 
                onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-transparent text-white rounded-lg font-semibold border-2 border-white/50 hover:bg-white/10 transition-colors"
              >
                View Pricing
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Transfer Form Section */}
      <section id="transfer-form" className="py-16 -mt-8 relative z-10">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Tab Navigation */}
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setIsBulkMode(false)}
                className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                  !isBulkMode 
                    ? 'text-teal-600 border-b-2 border-teal-600 bg-teal-50/50' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Globe className="w-5 h-5" />
                  Single Domain Transfer
                </div>
              </button>
              <button
                onClick={() => setIsBulkMode(true)}
                className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                  isBulkMode 
                    ? 'text-teal-600 border-b-2 border-teal-600 bg-teal-50/50' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Layers className="w-5 h-5" />
                  Bulk Transfer (Multiple Domains)
                </div>
              </button>
            </div>

            <div className="p-8">
              {!isBulkMode ? (
                // Single Domain Transfer
                <form onSubmit={handleCheckTransfer} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Domain Name
                    </label>
                    <div className="relative">
                      <Globe className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={domainName}
                        onChange={(e) => setDomainName(e.target.value)}
                        placeholder="example.com"
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Authorization Code (EPP Code)
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={authCode}
                        onChange={(e) => setAuthCode(e.target.value)}
                        placeholder="Enter your transfer code"
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      Get this code from your current domain registrar
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isChecking}
                    className="w-full bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isChecking ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Checking Transfer Eligibility...
                      </>
                    ) : (
                      <>
                        Start Transfer
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                // Bulk Transfer
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Enter Multiple Domains (one per line)
                    </label>
                    <textarea
                      value={bulkDomains}
                      onChange={(e) => setBulkDomains(e.target.value)}
                      placeholder="example1.com&#10;example2.net&#10;example3.org"
                      rows={8}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <button
                    onClick={handleBulkTransfer}
                    className="w-full bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors flex items-center justify-center gap-2"
                  >
                    Process Bulk Transfer
                    <ArrowRight className="w-5 h-5" />
                  </button>

                  {selectedDomains.length > 0 && (
                    <div className="mt-6 p-4 bg-teal-50 rounded-lg">
                      <p className="font-semibold text-teal-900 mb-2">
                        Selected Domains ({selectedDomains.length})
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {selectedDomains.map((domain, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-white rounded-md text-sm border border-teal-200"
                          >
                            {domain}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Transfer Results */}
              <AnimatePresence>
                {showResults && transferData && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-8 p-6 bg-green-50 rounded-lg border border-green-200"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="w-6 h-6 text-green-600" />
                          <h3 className="text-lg font-semibold text-green-900">
                            Transfer Available!
                          </h3>
                        </div>
                        <p className="text-green-800 mb-4">
                          {transferData.domain} is ready to transfer
                        </p>
                        <div className="space-y-2 text-sm text-green-700">
                          <p>• Transfer Price: {currency === 'INR' ? '₹' : '$'}{transferData.price}/year</p>
                          <p>• Renewal Price: {currency === 'INR' ? '₹' : '$'}{transferData.renewalPrice}/year</p>
                          <p>• Transfer Time: {transferData.transferTime}</p>
                          <p>• Includes 1 year extension</p>
                        </div>
                      </div>
                      <button
                        onClick={handleAddToCart}
                        disabled={addingToCart === transferData.domain}
                        className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                      >
                        {addingToCart === transferData.domain ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Adding...
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="w-4 h-4" />
                            Add to Cart
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-100 text-teal-700 rounded-full text-sm font-medium mb-4">
              <DollarSign className="w-4 h-4" />
              Transparent Pricing
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Simple Transfer Pricing
            </h2>
            <p className="text-xl text-gray-600">
              Transfer includes 1 year extension at these competitive rates
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {transferPricing.map((item, index) => (
              <div
                key={index}
                className="relative bg-white rounded-lg border-2 border-gray-200 p-6 text-center hover:border-teal-500 transition-colors"
              >
                {item.popular && (
                  <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-teal-500 text-white text-xs font-bold rounded-full">
                    POPULAR
                  </span>
                )}
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{item.tld}</h3>
                <div className="text-3xl font-bold text-teal-600">
                  {currency === 'INR' ? `₹${item.price.inr}` : `$${item.price.usd}`}
                </div>
                <p className="text-sm text-gray-500 mt-1">/year</p>
              </div>
            ))}
          </div>

          <p className="text-center text-gray-600 mt-8">
            All transfers include FREE WHOIS Privacy, DNS Management, and Email Forwarding
          </p>
        </div>
      </section>

      {/* Transfer Steps */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
              <RefreshCw className="w-4 h-4" />
              Simple Process
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How Domain Transfer Works
            </h2>
            <p className="text-xl text-gray-600">
              Transfer your domain in 4 simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {transferSteps.map((step, index) => (
              <div key={index} className="relative">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500 text-white rounded-full mb-4">
                    <span className="text-2xl font-bold">{step.number}</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{step.description}</p>
                  <span className="text-xs text-gray-500">{step.time}</span>
                </div>
                {index < transferSteps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gray-300 -z-10" style={{ width: 'calc(100% - 4rem)' }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-4">
              <Award className="w-4 h-4" />
              Top-Rated Provider
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Transfer to Flickmax?
            </h2>
            <p className="text-xl text-gray-600">
              Get more value and better service for your domains with our industry-leading features
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {transferBenefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white mb-4">
                  <benefit.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-medium mb-4">
              <MessageCircle className="w-4 h-4" />
              Get Answers
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to know about domain transfers
            </p>
          </div>

          <div className="space-y-4">
            {transferFAQs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium text-gray-900">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 transition-transform ${
                      expandedFAQ === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {expandedFAQ === index && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-4 text-gray-600">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-teal-500 to-cyan-600">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transfer Your Domain?
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Join thousands of satisfied customers who&apos;ve made the switch
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="px-8 py-3 bg-white text-teal-600 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Start Transfer Now
            </button>
            <a
              href={`tel:${country.phoneNumber}`}
              className="px-8 py-3 bg-transparent text-white rounded-lg font-semibold border-2 border-white/50 hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
            >
              <Phone className="w-5 h-5" />
              Call {country.phoneNumber}
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}