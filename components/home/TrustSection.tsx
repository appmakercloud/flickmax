'use client'

import { motion, useInView } from 'framer-motion'
import { Globe, Shield, Users, Server, Award, CheckCircle, TrendingUp, HeadphonesIcon } from 'lucide-react'
import { useRef, useState, useEffect } from 'react'

const stats = [
  { 
    id: 'domains',
    value: 60000, 
    suffix: '+', 
    label: 'Domains Registered',
    icon: Globe,
    color: 'from-blue-500 to-cyan-500'
  },
  { 
    id: 'customers',
    value: 5000, 
    suffix: '+', 
    label: 'Happy Customers',
    icon: Users,
    color: 'from-purple-500 to-pink-500'
  },
  { 
    id: 'uptime',
    value: 99.99, 
    suffix: '%', 
    label: 'Uptime Guaranteed',
    icon: Server,
    color: 'from-green-500 to-emerald-500'
  },
  { 
    id: 'support',
    value: 24, 
    suffix: '/7', 
    label: 'Expert Support',
    icon: HeadphonesIcon,
    color: 'from-orange-500 to-red-500'
  },
]

const features = [
  {
    id: 'security',
    title: 'Enterprise-Grade Security',
    description: 'Sleep easy with our advanced security features including SSL certificates, DDoS protection, and daily backups.',
    icon: Shield,
    highlights: ['256-bit SSL', 'DDoS Protection', 'Daily Backups', 'Malware Scanning'],
  },
  {
    id: 'performance',
    title: 'Lightning-Fast Performance',
    description: 'Experience blazing-fast load times with our optimized servers and global CDN network.',
    icon: TrendingUp,
    highlights: ['Global CDN', 'SSD Storage', 'HTTP/3 Support', 'Edge Caching'],
  },
  {
    id: 'support',
    title: 'Award-Winning Support',
    description: 'Get help from our expert team anytime. We\'re here 24/7 via phone, chat, and email.',
    icon: Award,
    highlights: ['24/7 Availability', 'Expert Team', 'Live Chat', 'Phone Support'],
  },
]

const AnimatedCounter = ({ value, suffix }: { value: number, suffix: string }) => {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  
  useEffect(() => {
    if (isInView) {
      const duration = 2000
      const steps = 60
      const stepValue = value / steps
      let current = 0
      
      const timer = setInterval(() => {
        current += stepValue
        if (current >= value) {
          setCount(value)
          clearInterval(timer)
        } else {
          setCount(Math.floor(current))
        }
      }, duration / steps)
      
      return () => clearInterval(timer)
    }
  }, [isInView, value])
  
  return (
    <span ref={ref} className="tabular-nums">
      {count.toLocaleString()}{suffix}
    </span>
  )
}

export default function TrustSection() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Modern gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-gray-100 to-slate-100">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]" />
      </div>
      
      {/* Animated elements */}
      <motion.div
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 50,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-300/10 to-cyan-300/10 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          rotate: [360, 0],
        }}
        transition={{
          duration: 40,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-purple-300/10 to-pink-300/10 rounded-full blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600/10 to-cyan-600/10 backdrop-blur-sm rounded-full text-blue-700 text-sm font-medium mb-6 border border-blue-200/30"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Trusted by Businesses Worldwide</span>
          </motion.div>
          
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 mb-4">
            Why Choose
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600"> Flickmax?</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Join thousands of satisfied customers who trust us with their online presence. 
            Experience the difference with our premium services.
          </p>
        </motion.div>

        {/* Animated Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative group"
            >
              <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100/50 text-center hover:border-blue-200/50">
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${stat.color} text-white mb-4`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="group relative"
            >
              <div className="relative h-full bg-white/70 backdrop-blur-xl rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100/50 overflow-hidden">
                {/* Background gradient on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-cyan-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Content */}
                <div className="relative z-10">
                  <div className="inline-flex p-4 rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100 text-blue-600 mb-6">
                    <feature.icon className="h-8 w-8" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {feature.description}
                  </p>
                  
                  <ul className="space-y-3">
                    {feature.highlights.map((highlight, i) => (
                      <li key={i} className="flex items-center text-sm">
                        <CheckCircle className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <p className="text-sm text-gray-600 mb-6">Certified and Accredited by</p>
          <div className="flex flex-wrap items-center justify-center gap-8">
            <div className="flex items-center gap-2 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-xl shadow-md">
              <Shield className="w-5 h-5 text-green-600" />
              <span className="font-semibold text-gray-800">SSL Certified</span>
            </div>
            <div className="flex items-center gap-2 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-xl shadow-md">
              <Award className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-gray-800">ICANN Accredited</span>
            </div>
            <div className="flex items-center gap-2 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-xl shadow-md">
              <CheckCircle className="w-5 h-5 text-purple-600" />
              <span className="font-semibold text-gray-800">PCI Compliant</span>
            </div>
            <div className="flex items-center gap-2 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-xl shadow-md">
              <Globe className="w-5 h-5 text-orange-600" />
              <span className="font-semibold text-gray-800">Global CDN</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}