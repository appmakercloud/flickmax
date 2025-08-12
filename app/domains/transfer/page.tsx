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
  const [quickTransferDomain, setQuickTransferDomain] = useState('')
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

  const handleQuickTransfer = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!quickTransferDomain.trim()) {
      toast.error('Please enter a domain name')
      return
    }

    const domain = quickTransferDomain.trim().toLowerCase()
    
    // Basic domain validation
    if (!validateDomain(domain)) {
      toast.error('Please enter a valid domain name')
      return
    }

    // Redirect to GoDaddy's transfer interface
    const transferUrl = `https://dcc.secureserver.net/domains/transfer-in/${encodeURIComponent(domain)}?plid=590175&prog_id=590175`
    window.location.href = transferUrl
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Blue Gradient */}
      <section className="relative bg-gradient-to-br from-blue-600 to-cyan-500 py-24">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 to-cyan-500/90" />
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
          }} />
        </div>
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Transfer & Save up to<br />
              <span className="text-yellow-300">30% on Renewals</span>
            </h1>
            <p className="text-xl text-white/95 mb-8 max-w-3xl mx-auto">
              Switch to Flickmax and get better prices, free WHOIS privacy, and an extra year 
              added to your domain. Transfer multiple domains with our bulk transfer tool.
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap justify-center gap-3 mb-10">
              <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium border border-white/20 hover:bg-white/25 transition-colors">
                <CheckCircle className="w-4 h-4" />
                Free WHOIS Privacy
              </span>
              <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium border border-white/20 hover:bg-white/25 transition-colors">
                <CheckCircle className="w-4 h-4" />
                No Hidden Fees
              </span>
              <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium border border-white/20 hover:bg-white/25 transition-colors">
                <CheckCircle className="w-4 h-4" />
                Free 1-Year Extension
              </span>
              <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium border border-white/20 hover:bg-white/25 transition-colors">
                <CheckCircle className="w-4 h-4" />
                24/7 Support
              </span>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="#quick-transfer"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-blue-600 rounded-full font-semibold hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 duration-200"
              >
                Start Transfer Now
              </a>
              <button 
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-transparent text-white rounded-full font-semibold border-2 border-white/40 hover:bg-white/10 hover:border-white/60 transition-all duration-200"
              >
                View Pricing
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Transfer Input Section */}
      <section id="quick-transfer" className="py-8 -mt-20 relative z-10">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-8 md:p-10">
              <form onSubmit={handleQuickTransfer} className="flex flex-col md:flex-row gap-3">
                <input
                  type="text"
                  value={quickTransferDomain}
                  onChange={(e) => setQuickTransferDomain(e.target.value)}
                  placeholder="Enter domain to transfer"
                  className="flex-1 px-6 py-4 text-lg border-2 border-gray-200 rounded-lg md:rounded-l-lg md:rounded-r-none focus:outline-none focus:border-cyan-500 transition-all placeholder-gray-400 bg-gray-50/50"
                />
                <button
                  type="submit"
                  className="px-10 py-4 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-semibold text-lg rounded-lg md:rounded-l-none md:rounded-r-lg transition-all duration-200 shadow-lg hover:shadow-xl whitespace-nowrap transform hover:scale-105"
                >
                  Transfer
                </button>
              </form>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-gray-600">
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-cyan-500" />
                  <span>Free WHOIS Privacy</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-cyan-500" />
                  <span>1 Year Extension Included</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-cyan-500" />
                  <span>No Hidden Fees</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-cyan-500" />
                  <span>Quick 5-7 Day Transfer</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Transfer Steps */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-600 rounded-full text-sm font-semibold mb-4 border border-blue-100">
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
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-cyan-500 text-white rounded-full mb-4 shadow-xl relative">
                    <span className="text-3xl font-bold">{step.number}</span>
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 opacity-20 blur-xl" />
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{step.description}</p>
                  <span className="text-xs font-medium text-cyan-600">{step.time}</span>
                </div>
                {index < transferSteps.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-full w-full h-1 bg-gradient-to-r from-blue-200 via-cyan-200 to-blue-200 -z-10 opacity-50" style={{ width: 'calc(100% - 5rem)' }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-600 rounded-full text-sm font-semibold mb-4 border border-blue-100">
              <Award className="w-4 h-4" />
              Top-Rated Provider
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Transfer to Flickmax?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get more value and better service for your domains with our industry-leading features
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {transferBenefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group bg-white rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 border border-gray-100"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform">
                  <benefit.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-600 rounded-full text-sm font-semibold mb-4 border border-blue-100">
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
                className="bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-cyan-200 transition-colors mb-4"
              >
                <button
                  onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 transition-all"
                >
                  <span className="font-semibold text-gray-900 text-lg">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-cyan-600 transition-transform duration-300 ${
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
                      <div className="px-6 pb-5 text-gray-600 leading-relaxed">
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
      <section className="py-24 bg-gradient-to-br from-blue-600 to-cyan-500">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Ready to Transfer Your Domain?
            </h2>
            <p className="text-xl mb-10 text-white/95 max-w-2xl mx-auto">
              Join thousands of satisfied customers who&apos;ve made the switch
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => document.getElementById('quick-transfer')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-10 py-4 bg-white text-blue-600 rounded-full font-semibold hover:bg-gray-50 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:scale-105"
              >
                Start Transfer Now
              </button>
              <a
                href={`tel:${country.phoneNumber}`}
                className="px-10 py-4 bg-transparent text-white rounded-full font-semibold border-2 border-white/40 hover:bg-white/10 hover:border-white/60 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Phone className="w-5 h-5" />
                Call {country.phoneNumber}
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}