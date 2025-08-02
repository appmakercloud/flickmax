'use client'

import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

const popularDomains = [
  { tld: '.com', price: 9.99, originalPrice: 14.99, popular: true },
  { tld: '.net', price: 11.99, originalPrice: 16.99, popular: false },
  { tld: '.org', price: 12.99, originalPrice: 17.99, popular: false },
  { tld: '.io', price: 39.99, originalPrice: 49.99, popular: true },
  { tld: '.dev', price: 14.99, originalPrice: 19.99, popular: true },
  { tld: '.ai', price: 69.99, originalPrice: 89.99, popular: true },
  { tld: '.app', price: 16.99, originalPrice: 21.99, popular: false },
  { tld: '.store', price: 4.99, originalPrice: 29.99, sale: true },
]

export default function DomainShowcase() {
  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-400 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-400 rounded-full filter blur-3xl opacity-20 animate-pulse animation-delay-2000"></div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Popular Domain Extensions
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Register your perfect domain name at unbeatable prices
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {popularDomains.map((domain, index) => (
            <motion.div
              key={domain.tld}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ 
                scale: 1.05,
                boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'
              }}
              className="relative bg-white rounded-xl p-6 text-center shadow-lg border border-gray-100 overflow-hidden group"
            >
              {/* Popular badge */}
              {domain.popular && (
                <div className="absolute top-2 right-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Popular
                  </span>
                </div>
              )}

              {/* Sale badge */}
              {domain.sale && (
                <div className="absolute top-2 right-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 animate-pulse">
                    SALE
                  </span>
                </div>
              )}

              <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                {domain.tld}
              </h3>

              <div className="mb-4">
                <span className="text-3xl font-bold text-blue-600">
                  ${domain.price}
                </span>
                <span className="text-sm text-gray-500">/year</span>
              </div>

              {domain.originalPrice > domain.price && (
                <p className="text-sm text-gray-500 line-through">
                  ${domain.originalPrice}
                </p>
              )}

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-4 w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium py-2 px-4 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-md"
              >
                Register
              </motion.button>

              {/* Hover effect overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </motion.div>
          ))}
        </div>

        {/* Special offer banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="relative z-10">
            <h3 className="text-2xl font-bold mb-2">
              Limited Time Offer!
            </h3>
            <p className="text-lg mb-4">
              Get 30% off on all domain registrations with code: FLICKMAX30
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-blue-600 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors duration-300 shadow-lg"
            >
              Claim Offer Now
            </motion.button>
          </div>

          {/* Animated circles */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white rounded-full opacity-10 animate-pulse"></div>
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white rounded-full opacity-10 animate-pulse animation-delay-2000"></div>
        </motion.div>
      </div>
    </section>
  )
}