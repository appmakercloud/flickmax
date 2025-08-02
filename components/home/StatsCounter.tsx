'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Globe, Users, Server, Award } from 'lucide-react'

const stats = [
  {
    id: 1,
    value: 1000000,
    suffix: '+',
    label: 'Domains Registered',
    icon: Globe,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100'
  },
  {
    id: 2,
    value: 500000,
    suffix: '+',
    label: 'Happy Customers',
    icon: Users,
    color: 'text-green-600',
    bgColor: 'bg-green-100'
  },
  {
    id: 3,
    value: 99.9,
    suffix: '%',
    label: 'Uptime Guarantee',
    icon: Server,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100'
  },
  {
    id: 4,
    value: 50,
    suffix: '+',
    label: 'Industry Awards',
    icon: Award,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100'
  }
]

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (isInView) {
      const duration = 2000 // 2 seconds
      const steps = 60
      const increment = value / steps
      let current = 0

      const timer = setInterval(() => {
        current += increment
        if (current >= value) {
          setCount(value)
          clearInterval(timer)
        } else {
          setCount(current)
        }
      }, duration / steps)

      return () => clearInterval(timer)
    }
  }, [isInView, value])

  return (
    <span ref={ref} className="text-4xl font-bold text-gray-900">
      {value % 1 === 0 ? Math.floor(count) : count.toFixed(1)}{suffix}
    </span>
  )
}

export default function StatsCounter() {
  return (
    <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-black opacity-10"></div>
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-white rounded-full opacity-10 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full opacity-10 blur-3xl animate-pulse animation-delay-2000"></div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Trusted by Millions Worldwide
          </h2>
          <p className="mt-4 text-lg text-blue-100">
            Join the growing community of successful online businesses
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative group"
            >
              <div className="bg-white rounded-2xl p-6 text-center transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${stat.bgColor} mb-4`}
                >
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </motion.div>
                
                <Counter value={stat.value} suffix={stat.suffix} />
                
                <p className="mt-2 text-gray-600 font-medium">
                  {stat.label}
                </p>

                {/* Shine effect on hover */}
                <div className="absolute inset-0 rounded-2xl overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <motion.a
            href="/about"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center px-6 py-3 border-2 border-white text-base font-medium rounded-md text-white hover:bg-white hover:text-blue-600 transition-all duration-300"
          >
            Learn More About Us
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}