'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Shield, Zap, HeadphonesIcon, Clock, Gift, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { useCountry } from '@/contexts/CountryContext'

export default function HostingCTA() {
  const { phoneNumber, country } = useCountry()
  
  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({
    days: 3,
    hours: 14,
    minutes: 27,
    seconds: 45
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { days, hours, minutes, seconds } = prev
        
        seconds--
        if (seconds < 0) {
          seconds = 59
          minutes--
          if (minutes < 0) {
            minutes = 59
            hours--
            if (hours < 0) {
              hours = 23
              days--
              if (days < 0) {
                // Reset the countdown
                return { days: 3, hours: 14, minutes: 27, seconds: 45 }
              }
            }
          }
        }
        
        return { days, hours, minutes, seconds }
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatNumber = (num: number) => num.toString().padStart(2, '0')

  return (
    <section className="relative overflow-hidden">
      {/* Main CTA Section */}
      <div className="py-20 bg-gradient-to-br from-blue-600 to-indigo-700 relative">
        {/* Background decoration */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full filter blur-3xl opacity-10"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full filter blur-3xl opacity-10"></div>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Join thousands of satisfied customers who trust Flickmax for their web hosting needs. 
              Get started in minutes with our easy setup process.
            </p>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8 mb-12"
          >
            <div className="text-center text-white">
              <div className="inline-flex p-4 rounded-full bg-white/20 mb-4">
                <Shield className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">30-Day Guarantee</h3>
              <p className="text-blue-100">
                Try risk-free with our money-back guarantee
              </p>
            </div>
            
            <div className="text-center text-white">
              <div className="inline-flex p-4 rounded-full bg-white/20 mb-4">
                <Zap className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Instant Setup</h3>
              <p className="text-blue-100">
                Your hosting account is ready in seconds
              </p>
            </div>
            
            <div className="text-center text-white">
              <div className="inline-flex p-4 rounded-full bg-white/20 mb-4">
                <HeadphonesIcon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
              <p className="text-blue-100">
                Expert help whenever you need it
              </p>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Link
              href="#plans"
              className="inline-flex items-center px-8 py-4 rounded-lg bg-white text-blue-600 font-bold text-lg hover:bg-gray-100 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
            >
              Get Started Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Limited Time Offer Banner */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 relative overflow-hidden"
      >
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-indigo-600/20 to-blue-700/20 animate-gradient-x"></div>
          <motion.div
            animate={{
              x: [0, 100, 0],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            className="absolute -top-20 -left-20 w-96 h-96 bg-cyan-400 rounded-full filter blur-3xl"
          />
          <motion.div
            animate={{
              x: [0, -100, 0],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            className="absolute -bottom-20 -right-20 w-96 h-96 bg-blue-400 rounded-full filter blur-3xl"
          />
        </div>

        <div className="relative z-10 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              {/* Top section with call info */}
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mb-8"
              >
                <p className="text-white/90 text-lg mb-2">Questions? Call us at</p>
                <a 
                  href={`tel:${phoneNumber.replace(/\s/g, '')}`}
                  className="text-white text-2xl sm:text-3xl font-bold hover:text-yellow-300 transition-colors inline-flex items-center gap-2"
                >
                  <HeadphonesIcon className="w-8 h-8" />
                  {phoneNumber}
                </a>
                <p className="text-sm text-white/70 mt-1">{country.name}</p>
              </motion.div>

              {/* Limited Time Badge */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  duration: 0.5, 
                  delay: 0.3,
                  type: "spring",
                  stiffness: 200
                }}
                className="inline-block mb-6"
              >
                <div className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-full font-bold text-sm inline-flex items-center gap-2 shadow-lg">
                  <Sparkles className="w-5 h-5" />
                  <Clock className="w-5 h-5 animate-pulse" />
                  LIMITED TIME OFFER
                  <Sparkles className="w-5 h-5" />
                </div>
              </motion.div>

              {/* Main Offer Text */}
              <motion.h3
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4"
              >
                Save 75% on Web Hosting
              </motion.h3>
              
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="text-xl sm:text-2xl text-white/90 mb-8 max-w-3xl mx-auto"
              >
                Plus get a FREE domain, SSL certificate, and professional email for your first year
              </motion.p>

              {/* Countdown Timer */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex justify-center gap-4 sm:gap-8 mb-8"
              >
                {Object.entries(timeLeft).map(([unit, value], index) => (
                  <div key={unit} className="text-center">
                    <motion.div
                      initial={{ y: 20 }}
                      animate={{ y: 0 }}
                      transition={{ 
                        duration: 0.5, 
                        delay: 0.7 + index * 0.1,
                        type: "spring"
                      }}
                      className="bg-white/20 backdrop-blur-sm rounded-xl p-4 sm:p-6 min-w-[80px] sm:min-w-[100px] border border-white/30"
                    >
                      <div className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white">
                        {formatNumber(value)}
                      </div>
                      <div className="text-sm sm:text-base text-white/80 capitalize mt-1">
                        {unit}
                      </div>
                    </motion.div>
                  </div>
                ))}
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              >
                <Link
                  href="#plans"
                  className="group inline-flex items-center px-8 py-4 rounded-xl bg-yellow-400 text-gray-900 font-bold text-lg hover:bg-yellow-300 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
                >
                  <Gift className="w-6 h-6 mr-2 group-hover:rotate-12 transition-transform" />
                  Claim This Offer
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                
                <Link
                  href="#features"
                  className="inline-flex items-center px-8 py-4 rounded-xl border-2 border-white/50 text-white font-semibold text-lg hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
                >
                  Learn More
                </Link>
              </motion.div>

              {/* Small print */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 1 }}
                className="text-sm text-white/70 mt-6 max-w-2xl mx-auto"
              >
                *Offer valid for new customers only. Renewal at regular rates. Free domain available for .com, .net, .org extensions.
              </motion.p>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}