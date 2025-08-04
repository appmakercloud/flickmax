'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Rocket, X } from 'lucide-react'

export default function FloatingCTA() {
  const [isVisible, setIsVisible] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Show floating CTA after scrolling 500px
      const scrolled = window.scrollY > 500
      setIsVisible(scrolled)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleGetStarted = () => {
    // Scroll to domain search section
    const domainSection = document.querySelector('section')
    if (domainSection) {
      domainSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className={`fixed z-50 ${
            isMinimized 
              ? 'bottom-4 right-4' 
              : 'bottom-8 right-8'
          }`}
        >
          {isMinimized ? (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMinimized(false)}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300"
            >
              <Rocket className="w-6 h-6" />
            </motion.button>
          ) : (
            <motion.div
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              className="relative"
            >
              <button
                onClick={() => setIsMinimized(true)}
                className="absolute -top-2 -right-2 bg-gray-800 text-white p-1 rounded-full hover:bg-gray-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-4 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center gap-3 font-semibold"
              >
                <Rocket className="w-5 h-5" />
                <span>Get Started Now</span>
              </motion.button>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-blue-600 to-cyan-600 blur-xl opacity-50"></div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}