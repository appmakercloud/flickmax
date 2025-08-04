'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, HelpCircle, MessageCircle, Book, CreditCard, Sparkles } from 'lucide-react'

const categoryIcons = {
  General: HelpCircle,
  Features: MessageCircle,
  Technical: Book,
  Billing: CreditCard
}

const faqs = [
  {
    category: 'General',
    questions: [
      {
        q: 'What is web hosting?',
        a: 'Web hosting is a service that allows you to publish your website on the internet. When you purchase hosting, you\'re essentially renting space on a server where your website files are stored and made accessible to visitors worldwide.'
      },
      {
        q: 'Do I need technical knowledge to use Flickmax hosting?',
        a: 'Not at all! Our hosting platform is designed for users of all skill levels. We provide an intuitive control panel, one-click installations for popular applications like WordPress, and 24/7 support to help you every step of the way.'
      },
      {
        q: 'Can I host multiple websites on one account?',
        a: 'Yes! Our Business and Pro plans support unlimited websites. You can host as many domains as you need under a single account, making it cost-effective for managing multiple projects.'
      }
    ]
  },
  {
    category: 'Features',
    questions: [
      {
        q: 'What is included with the free domain?',
        a: 'All our hosting plans include a free domain name for the first year. You can choose from popular extensions like .com, .net, .org, and more. After the first year, standard renewal rates apply.'
      },
      {
        q: 'How does the 99.9% uptime guarantee work?',
        a: 'We guarantee that your website will be available 99.9% of the time. If we fail to meet this guarantee in any given month, you\'re eligible for credits on your account. Our enterprise-grade infrastructure ensures maximum reliability.'
      },
      {
        q: 'What kind of support do you offer?',
        a: 'We provide 24/7 customer support via live chat, phone, and email. Our expert support team can help with everything from basic questions to complex technical issues. Business and Pro plans receive priority support.'
      }
    ]
  },
  {
    category: 'Technical',
    questions: [
      {
        q: 'Can I upgrade or downgrade my plan later?',
        a: 'Absolutely! You can upgrade or downgrade your hosting plan at any time from your account dashboard. Changes take effect immediately, and we\'ll prorate any price differences.'
      },
      {
        q: 'Do you provide SSL certificates?',
        a: 'Yes, all hosting plans include free SSL certificates for all your domains. We automatically install and renew Let\'s Encrypt SSL certificates to keep your sites secure.'
      },
      {
        q: 'How do backups work?',
        a: 'Our Business and Pro plans include automatic daily backups. We keep multiple restore points, so you can easily roll back your website if needed. Pro plans feature real-time backups for maximum data protection.'
      }
    ]
  },
  {
    category: 'Billing',
    questions: [
      {
        q: 'What payment methods do you accept?',
        a: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for annual plans. All payments are processed securely.'
      },
      {
        q: 'Is there a money-back guarantee?',
        a: 'Yes! We offer a 30-day money-back guarantee on all hosting plans. If you\'re not completely satisfied, you can cancel within 30 days for a full refund (excluding domain registration fees).'
      },
      {
        q: 'Are there any hidden fees?',
        a: 'No hidden fees! The price you see is what you pay. Domain renewals, additional services, and add-ons are clearly priced and optional.'
      }
    ]
  }
]

export default function HostingFAQ() {
  const [openItems, setOpenItems] = useState<string[]>([])
  const [activeCategory, setActiveCategory] = useState('General')

  const toggleItem = (id: string) => {
    setOpenItems(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  const activeFaqs = faqs.find(cat => cat.category === activeCategory)?.questions || []

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Modern gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
      </div>
      
      {/* Animated gradient orbs */}
      <motion.div
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-20 left-0 w-96 h-96 bg-blue-200 rounded-full filter blur-3xl opacity-20"
      />
      <motion.div
        animate={{
          x: [0, -100, 0],
          y: [0, 50, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute bottom-20 right-0 w-96 h-96 bg-cyan-200 rounded-full filter blur-3xl opacity-20"
      />
      
      <div className="relative">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600/10 to-cyan-600/10 backdrop-blur-sm rounded-full text-blue-700 text-sm font-medium mb-6 border border-blue-200/30"
          >
            <Sparkles className="w-4 h-4" />
            <span>Got Questions? We&apos;ve Got Answers</span>
          </motion.div>
          
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 mb-4">
            Frequently Asked
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600"> Questions</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about our hosting services
          </p>
        </motion.div>

        {/* Category Tabs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-3 mb-10"
        >
          {faqs.map((category, index) => {
            const Icon = categoryIcons[category.category as keyof typeof categoryIcons]
            return (
              <motion.button
                key={category.category}
                onClick={() => setActiveCategory(category.category)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                  activeCategory === category.category
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
                    : 'bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white/90 border border-gray-200/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {category.category}
              </motion.button>
            )
          })}
        </motion.div>

        {/* FAQ Items */}
        <div className="space-y-4">
          <AnimatePresence mode="wait">
            {activeFaqs.map((faq, index) => {
              const itemId = `${activeCategory}-${index}`
              return (
                <motion.div
                  key={itemId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="group"
                >
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100/50 overflow-hidden group"
                  >
                    <button
                      onClick={() => toggleItem(itemId)}
                      className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gradient-to-r hover:from-gray-50 hover:to-white transition-all duration-200"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 pr-4 flex-1">
                        {faq.q}
                      </h3>
                      <motion.div
                        animate={{ rotate: openItems.includes(itemId) ? 45 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex-shrink-0"
                      >
                        <div className={`p-2 rounded-full transition-colors duration-200 ${
                          openItems.includes(itemId) 
                            ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white' 
                            : 'bg-gray-100 text-gray-400 group-hover:bg-blue-100 group-hover:text-blue-600'
                        }`}>
                          {openItems.includes(itemId) ? (
                            <Plus className="h-4 w-4 rotate-45" />
                          ) : (
                            <Plus className="h-4 w-4" />
                          )}
                        </div>
                      </motion.div>
                    </button>
                    
                    <AnimatePresence>
                      {openItems.includes(itemId) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-5 pt-2">
                            <div className="border-t border-gray-100 pt-4">
                              <p className="text-gray-600 leading-relaxed">
                                {faq.a}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

        {/* Contact Support */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden border border-blue-800/30">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.3'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
              }} />
            </div>
            
            <div className="relative z-10">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.5, type: "spring" }}
                viewport={{ once: true }}
                className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600/20 to-cyan-600/20 backdrop-blur-sm rounded-full mb-4 border border-blue-400/30"
              >
                <MessageCircle className="w-8 h-8 text-white" />
              </motion.div>
              
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                Still have questions?
              </h3>
              <p className="text-blue-100 mb-8 text-lg">
                Our expert support team is available 24/7 to help you
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="/contact"
                  className="inline-flex items-center justify-center px-8 py-3 rounded-xl bg-white text-blue-600 font-semibold hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Live Chat
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="/help"
                  className="inline-flex items-center justify-center px-8 py-3 rounded-xl border-2 border-white/50 text-white font-semibold hover:bg-white/10 transition-colors backdrop-blur-sm"
                >
                  <Book className="w-5 h-5 mr-2" />
                  Help Center
                </motion.a>
              </div>
            </div>
          </div>
        </motion.div>
        </div>
      </div>
    </section>
  )
}