'use client'

import { motion } from 'framer-motion'
import { Globe, Phone, Shield } from 'lucide-react'
import Image from 'next/image'

const features = [
  {
    id: 'domains',
    title: '.com to .xyz — a huge selection from the largest domain registrar.',
    icon: '🌐',
    bgColor: 'bg-gradient-to-br from-amber-100 to-orange-100',
    image: '/images/domain-preview.png',
  },
  {
    id: 'security',
    title: 'Zzzz... security to help you sleep easy every night.',
    icon: '🔒',
    bgColor: 'bg-gradient-to-br from-teal-900 to-cyan-800',
    textColor: 'text-white',
    highlight: 'https://',
    image: '/images/security-preview.png',
  },
  {
    id: 'support',
    title: 'We\'re here with the help and advice you need. Call us for award-winning support.',
    icon: Phone,
    iconStyle: 'text-teal-600',
  },
  {
    id: 'stats',
    title: 'More than URLs. 21+ million trust us for their domains and more.',
    icon: Globe,
    iconStyle: 'text-blue-600',
  },
  {
    id: 'tools',
    title: 'Tools for every small business first — websites, email, marketing, and more.',
    bgColor: 'bg-gradient-to-br from-orange-50 to-pink-50',
    fullWidth: true,
    image: '/images/tools-preview.png',
  },
]

export default function TrustSection() {
  return (
    <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-4"
          >
            <h2 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">
              Why work with Flickmax?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              60,000+ domains, 5,000+ happy customers, secure hosting,
              email and 24/7 support — we help grow businesses.
            </p>
          </motion.div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Domain Selection Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative rounded-3xl bg-gradient-to-br from-amber-100 to-orange-100 p-8 h-80 overflow-hidden group hover:shadow-2xl transition-all duration-300"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-4 max-w-xs">
                .com to .xyz — a huge selection from the largest domain registrar.
              </h3>
              
              <div className="absolute bottom-4 right-4 bg-white rounded-xl p-4 shadow-lg transform rotate-3 group-hover:rotate-6 transition-transform">
                <input 
                  type="text" 
                  value=".com" 
                  className="text-xl font-bold text-gray-900 bg-transparent border-none outline-none"
                  readOnly
                />
                <div className="mt-2 w-48 h-32 bg-gray-100 rounded-lg"></div>
              </div>
            </motion.div>

            {/* Security Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative rounded-3xl bg-gradient-to-br from-teal-900 to-cyan-800 p-8 h-80 overflow-hidden group hover:shadow-2xl transition-all duration-300"
            >
              <h3 className="text-2xl font-bold text-white mb-4 max-w-xs">
                Zzzz... security to help you sleep easy every night.
              </h3>
              
              <div className="absolute bottom-4 right-4 bg-white rounded-full p-6 shadow-lg">
                <Shield className="h-12 w-12 text-teal-600" />
              </div>
              
              <div className="absolute bottom-8 left-8 text-4xl font-mono text-white/30">
                https://
              </div>
            </motion.div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Support Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Phone className="h-12 w-12 text-teal-600 mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                We&apos;re here with the help and advice you need. Call us for award-winning support.
              </h3>
            </motion.div>

            {/* Stats Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Globe className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                More than URLs. 5,000+ customers trust us for their domains and more.
              </h3>
            </motion.div>

            {/* Tools Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="relative bg-gradient-to-br from-orange-50 to-pink-50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-2 relative z-10">
                Tools for every small business first — websites, email, marketing, and more.
              </h3>
              
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-200 to-orange-200 rounded-tl-full opacity-50"></div>
            </motion.div>
          </div>
        </div>
      </section>
  )
}