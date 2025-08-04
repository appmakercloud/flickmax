'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Shield, Zap, HeadphonesIcon, Clock, Gift, Sparkles, Activity, Hexagon } from 'lucide-react'
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
      <div className="py-24 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 relative">
        {/* Background decoration */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black/30" />
          
          {/* Animated mesh pattern */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 opacity-20" style={{
              backgroundImage: `
                linear-gradient(to right, rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px'
            }} />
          </div>
          
          {/* Animated gradient orbs */}
          <motion.div
            animate={{
              x: [0, 150, 0],
              y: [0, -50, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute -top-20 -left-20 w-[600px] h-[600px] rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, rgba(37, 99, 235, 0.2) 40%, transparent 70%)',
              filter: 'blur(40px)',
            }}
          />
          <motion.div
            animate={{
              x: [0, -100, 0],
              y: [0, 100, 0],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 5
            }}
            className="absolute -bottom-20 -right-20 w-[500px] h-[500px] rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(14, 165, 233, 0.4) 0%, rgba(2, 132, 199, 0.2) 40%, transparent 70%)',
              filter: 'blur(40px)',
            }}
          />
        </div>

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
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-6 border border-blue-400/30"
            >
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>Launch Your Website Today</span>
              <Hexagon className="w-3 h-3 text-blue-400" />
            </motion.div>
            
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-blue-100/80 max-w-3xl mx-auto">
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
              <div className="inline-flex p-4 rounded-full bg-gradient-to-br from-blue-600/20 to-cyan-600/20 backdrop-blur-sm mb-4 border border-blue-400/30">
                <Shield className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">30-Day Guarantee</h3>
              <p className="text-blue-100/80">
                Try risk-free with our money-back guarantee
              </p>
            </div>
            
            <div className="text-center text-white">
              <div className="inline-flex p-4 rounded-full bg-gradient-to-br from-blue-600/20 to-cyan-600/20 backdrop-blur-sm mb-4 border border-blue-400/30">
                <Zap className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Instant Setup</h3>
              <p className="text-blue-100/80">
                Your hosting account is ready in seconds
              </p>
            </div>
            
            <div className="text-center text-white">
              <div className="inline-flex p-4 rounded-full bg-gradient-to-br from-blue-600/20 to-cyan-600/20 backdrop-blur-sm mb-4 border border-blue-400/30">
                <HeadphonesIcon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
              <p className="text-blue-100/80">
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
              className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/30"
            >
              <span className="relative z-10">Get Started Now</span>
              <ArrowRight className="relative z-10 w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-cyan-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Limited Time Offer Banner */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 relative overflow-hidden border-t border-blue-800/30"
      >
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black/30" />
          
          {/* Hexagon pattern overlay */}
          <div className="absolute inset-0 opacity-10">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="hexagons-cta" width="50" height="43.4" patternUnits="userSpaceOnUse" patternTransform="scale(2)">
                  <polygon points="24.8,22 37.3,29.2 37.3,43.7 24.8,50.9 12.3,43.7 12.3,29.2" fill="none" stroke="rgba(59, 130, 246, 0.3)" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#hexagons-cta)" />
            </svg>
          </div>
          
          <motion.div
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute -top-20 -left-20 w-[500px] h-[500px] rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, rgba(37, 99, 235, 0.2) 40%, transparent 70%)',
              filter: 'blur(40px)',
            }}
          />
          <motion.div
            animate={{
              x: [0, -100, 0],
              y: [0, 50, 0],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute -bottom-20 -right-20 w-[500px] h-[500px] rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(14, 165, 233, 0.4) 0%, rgba(2, 132, 199, 0.2) 40%, transparent 70%)',
              filter: 'blur(40px)',
            }}
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
                <div className="bg-gradient-to-r from-amber-400 to-yellow-400 text-gray-900 px-6 py-3 rounded-full font-bold text-sm inline-flex items-center gap-2 shadow-lg animate-pulse">
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
                className="text-lg sm:text-xl text-blue-100/80 mb-8 max-w-3xl mx-auto"
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
                      className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 backdrop-blur-sm rounded-xl p-4 sm:p-6 min-w-[80px] sm:min-w-[100px] border border-blue-400/30 shadow-lg"
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
                  className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-gray-900 bg-gradient-to-r from-amber-400 to-yellow-400 rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/30"
                >
                  <Gift className="relative z-10 w-6 h-6 mr-2 group-hover:rotate-12 transition-transform" />
                  <span className="relative z-10">Claim This Offer</span>
                  <ArrowRight className="relative z-10 w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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