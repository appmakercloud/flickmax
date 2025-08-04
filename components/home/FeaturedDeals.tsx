'use client'

import { motion } from 'framer-motion'
import { Timer, Zap, TrendingUp, Star, ArrowRight } from 'lucide-react'
import { useState, useEffect } from 'react'

const deals = [
  {
    id: 1,
    title: 'Black Friday Special',
    description: 'Get 75% off on all hosting plans',
    discount: '75% OFF',
    originalPrice: '$11.99',
    salePrice: '$2.99',
    period: '/month',
    features: ['Free SSL', 'Free Domain', 'Unlimited Bandwidth'],
    popular: true,
    endTime: new Date(Date.now() + 48 * 60 * 60 * 1000), // 48 hours from now
  },
  {
    id: 2,
    title: 'Domain Bundle Deal',
    description: 'Register 3 domains for the price of 1',
    discount: '3 for 1',
    originalPrice: '$35.97',
    salePrice: '$11.99',
    period: '/year',
    features: ['WHOIS Privacy', 'DNS Management', 'Email Forwarding'],
    popular: false,
    endTime: new Date(Date.now() + 72 * 60 * 60 * 1000), // 72 hours from now
  },
  {
    id: 3,
    title: 'WordPress Pro',
    description: 'Managed WordPress with AI optimization',
    discount: '50% OFF',
    originalPrice: '$29.99',
    salePrice: '$14.99',
    period: '/month',
    features: ['AI Speed Boost', 'Daily Backups', 'Premium Themes'],
    popular: false,
    endTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
  },
]

const CountdownTimer = ({ endTime }: { endTime: Date }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime()
      const end = endTime.getTime()
      const distance = end - now

      if (distance < 0) {
        clearInterval(timer)
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        })
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [endTime])

  return (
    <div className="flex gap-2 text-sm">
      <div className="bg-gray-900/90 backdrop-blur-sm px-3 py-2 rounded-lg text-white shadow-md">
        <span className="font-bold text-lg">{timeLeft.days}</span>
        <span className="text-xs block opacity-75">days</span>
      </div>
      <div className="bg-gray-900/90 backdrop-blur-sm px-3 py-2 rounded-lg text-white shadow-md">
        <span className="font-bold text-lg">{timeLeft.hours}</span>
        <span className="text-xs block opacity-75">hrs</span>
      </div>
      <div className="bg-gray-900/90 backdrop-blur-sm px-3 py-2 rounded-lg text-white shadow-md">
        <span className="font-bold text-lg">{timeLeft.minutes}</span>
        <span className="text-xs block opacity-75">min</span>
      </div>
      <div className="bg-gray-900/90 backdrop-blur-sm px-3 py-2 rounded-lg text-white shadow-md">
        <span className="font-bold text-lg">{timeLeft.seconds}</span>
        <span className="text-xs block opacity-75">sec</span>
      </div>
    </div>
  )
}

export default function FeaturedDeals() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
      </div>
      
      {/* Animated elements */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute top-10 left-10 w-64 h-64 bg-gradient-to-br from-orange-300/30 to-red-300/30 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1.1, 1, 1.1],
          rotate: [360, 180, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute bottom-10 right-10 w-80 h-80 bg-gradient-to-br from-pink-300/30 to-purple-300/30 rounded-full blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600/10 to-red-600/10 backdrop-blur-sm rounded-full text-orange-700 text-sm font-medium mb-6 border border-orange-200/30"
          >
            <Zap className="w-4 h-4" />
            <span>Limited Time Offers</span>
            <Timer className="w-4 h-4 animate-pulse" />
          </motion.div>
          
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 mb-4">
            Featured
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600"> Deals</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Don't miss out on these exclusive offers - limited time only!
          </p>
        </motion.div>

        {/* Deals Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {deals.map((deal, index) => (
            <motion.div
              key={deal.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="group relative"
            >
              <div className={`relative h-full ${
                deal.popular 
                  ? 'bg-gradient-to-br from-orange-500 to-red-500 p-[2px]' 
                  : 'bg-white/70'
              } rounded-2xl overflow-hidden`}>
                <div className={`relative h-full ${
                  deal.popular ? 'bg-white' : 'bg-white/70'
                } backdrop-blur-xl rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100/50 overflow-hidden`}>
                  
                  {/* Popular badge */}
                  {deal.popular && (
                    <div className="absolute -top-1 -right-1">
                      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-4 py-2 rounded-bl-2xl rounded-tr-2xl flex items-center gap-1 animate-pulse">
                        <Star className="w-3 h-3" />
                        MOST POPULAR
                      </div>
                    </div>
                  )}

                  {/* Discount badge */}
                  <motion.div
                    animate={{ rotate: [-2, 2, -2] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="inline-block mb-4"
                  >
                    <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-2xl font-bold px-4 py-2 rounded-xl shadow-lg animate-pulse">
                      {deal.discount}
                    </span>
                  </motion.div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {deal.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {deal.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-2 mb-6">
                    {deal.features.map((feature, i) => (
                      <li key={i} className="flex items-center text-sm">
                        <TrendingUp className="w-4 h-4 text-orange-500 mr-2 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Price */}
                  <div className="mb-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-gray-500 line-through text-lg">{deal.originalPrice}</span>
                      <span className="text-3xl font-bold text-gray-900">{deal.salePrice}</span>
                      <span className="text-gray-600">{deal.period}</span>
                    </div>
                  </div>

                  {/* Countdown Timer */}
                  <div className="mb-6">
                    <p className="text-sm font-medium text-gray-700 mb-2">Offer ends in:</p>
                    <CountdownTimer endTime={deal.endTime} />
                  </div>

                  {/* CTA Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                      deal.popular
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 shadow-lg hover:shadow-xl'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    Claim Deal
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Deals CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <motion.a
            href="/deals"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 gap-2"
          >
            View All Deals
            <ArrowRight className="w-5 h-5" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}