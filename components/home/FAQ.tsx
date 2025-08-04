'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus, Search, HelpCircle, MessageCircle, ThumbsUp, ThumbsDown, CreditCard, Server, HeadphonesIcon, Shield } from 'lucide-react'

const faqs = [
  {
    id: 1,
    question: 'How quickly can I get my website online?',
    answer: 'With our one-click installer and pre-configured templates, you can have your website up and running in less than 5 minutes! Our intuitive website builder makes it easy for anyone to create a professional website without any coding knowledge.',
    category: 'general',
    helpful: { yes: 124, no: 3 }
  },
  {
    id: 2,
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers. All payments are processed securely with 256-bit SSL encryption.',
    category: 'billing',
    helpful: { yes: 89, no: 2 }
  },
  {
    id: 3,
    question: 'Do you offer a money-back guarantee?',
    answer: 'Yes! We offer a 30-day money-back guarantee on all our hosting plans. If you\'re not completely satisfied with our service, we\'ll refund your payment, no questions asked.',
    category: 'billing',
    helpful: { yes: 156, no: 5 }
  },
  {
    id: 4,
    question: 'Can I upgrade my plan later?',
    answer: 'Absolutely! You can upgrade or downgrade your plan at any time from your account dashboard. Changes take effect immediately, and we\'ll prorate any payments.',
    category: 'general',
    helpful: { yes: 98, no: 1 }
  },
  {
    id: 5,
    question: 'Is technical support included?',
    answer: 'Yes, 24/7 technical support is included with all plans. Our expert support team is available via live chat, phone, and email to help you with any issues.',
    category: 'support',
    helpful: { yes: 201, no: 4 }
  },
  {
    id: 6,
    question: 'How do I transfer my existing website?',
    answer: 'We offer free website migration for all new customers. Our migration experts will handle the entire process for you, ensuring zero downtime during the transfer.',
    category: 'technical',
    helpful: { yes: 143, no: 6 }
  },
  {
    id: 7,
    question: 'What security features are included?',
    answer: 'All plans include free SSL certificates, DDoS protection, daily malware scanning, automatic backups, and a web application firewall to keep your website secure.',
    category: 'security',
    helpful: { yes: 178, no: 2 }
  },
  {
    id: 8,
    question: 'Can I host multiple websites?',
    answer: 'Yes! Our shared hosting plans support multiple websites. The number of websites depends on your plan - Starter (1 site), Pro (5 sites), Business (unlimited sites).',
    category: 'technical',
    helpful: { yes: 112, no: 3 }
  },
  {
    id: 9,
    question: 'Do you provide email hosting?',
    answer: 'Yes, all our plans include professional email hosting with your domain. You get spam protection, webmail access, and support for email clients like Outlook.',
    category: 'general',
    helpful: { yes: 95, no: 1 }
  },
  {
    id: 10,
    question: 'What is your uptime guarantee?',
    answer: 'We guarantee 99.99% uptime for all our hosting services. If we fail to meet this guarantee, you\'ll receive service credits according to our SLA.',
    category: 'technical',
    helpful: { yes: 167, no: 4 }
  }
]

const categories = [
  { id: 'all', name: 'All Questions', icon: HelpCircle },
  { id: 'general', name: 'General', icon: MessageCircle },
  { id: 'billing', name: 'Billing', icon: CreditCard },
  { id: 'technical', name: 'Technical', icon: Server },
  { id: 'support', name: 'Support', icon: HeadphonesIcon },
  { id: 'security', name: 'Security', icon: Shield }
]

export default function FAQ() {
  const [openItems, setOpenItems] = useState<number[]>([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [helpfulVotes, setHelpfulVotes] = useState<{[key: number]: 'yes' | 'no' | null}>({})

  const toggleItem = (id: number) => {
    setOpenItems(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  const handleHelpfulVote = (faqId: number, vote: 'yes' | 'no') => {
    setHelpfulVotes(prev => ({ ...prev, [faqId]: vote }))
  }

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId)
    // Smooth scroll to FAQ items
    setTimeout(() => {
      const faqSection = document.getElementById('faq-items')
      if (faqSection) {
        faqSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 100)
  }

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Modern gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-slate-50 to-gray-50">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]" />
      </div>
      
      {/* Animated elements */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-cyan-400/10 rounded-2xl blur-2xl"
      />
      
      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
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
            <HelpCircle className="w-4 h-4" />
            <span>Help Center</span>
          </motion.div>
          
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 mb-4">
            Frequently Asked
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600"> Questions</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about our services
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for answers..."
              className="w-full pl-12 pr-4 py-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:shadow-lg transition-all duration-300 text-gray-900 placeholder-gray-500"
            />
          </div>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-3 mb-10"
        >
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleCategoryChange(category.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
                    : 'bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white hover:shadow-md border border-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                {category.name}
              </motion.button>
            )
          })}
        </motion.div>

        {/* FAQ Items */}
        <div id="faq-items" className="space-y-4 scroll-mt-8">
          <AnimatePresence>
            {filteredFaqs.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-12"
              >
                <p className="text-gray-600">No questions found. Try a different search term.</p>
              </motion.div>
            ) : (
              filteredFaqs.map((faq, index) => (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="group"
                >
                  <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100/50 overflow-hidden hover:border-blue-200/50">
                    <button
                      onClick={() => toggleItem(faq.id)}
                      className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50/50 transition-colors duration-200"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 pr-4">
                        {faq.question}
                      </h3>
                      <motion.div
                        animate={{ rotate: openItems.includes(faq.id) ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex-shrink-0 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-full p-1"
                      >
                        {openItems.includes(faq.id) ? (
                          <Minus className="h-4 w-4" />
                        ) : (
                          <Plus className="h-4 w-4" />
                        )}
                      </motion.div>
                    </button>
                    
                    <AnimatePresence>
                      {openItems.includes(faq.id) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-5">
                            <p className="text-gray-700 leading-relaxed mb-4">
                              {faq.answer}
                            </p>
                            
                            {/* Helpful feedback */}
                            <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                              <span className="text-sm text-gray-600">Was this helpful?</span>
                              <div className="flex items-center gap-2">
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => handleHelpfulVote(faq.id, 'yes')}
                                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm transition-all duration-300 ${
                                    helpfulVotes[faq.id] === 'yes'
                                      ? 'bg-green-100 text-green-700 border border-green-200'
                                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                  }`}
                                >
                                  <ThumbsUp className="w-4 h-4" />
                                  <span>{faq.helpful.yes + (helpfulVotes[faq.id] === 'yes' ? 1 : 0)}</span>
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => handleHelpfulVote(faq.id, 'no')}
                                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm transition-all duration-300 ${
                                    helpfulVotes[faq.id] === 'no'
                                      ? 'bg-red-100 text-red-700 border border-red-200'
                                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                  }`}
                                >
                                  <ThumbsDown className="w-4 h-4" />
                                  <span>{faq.helpful.no + (helpfulVotes[faq.id] === 'no' ? 1 : 0)}</span>
                                </motion.button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              Still have questions?
            </h3>
            <p className="mb-6 text-blue-100">
              Our support team is here to help you 24/7
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="/contact"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center px-6 py-3 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-all duration-300"
              >
                Contact Support
              </motion.a>
              <motion.a
                href="/docs"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-white/30 transition-all duration-300"
              >
                Browse Documentation
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}