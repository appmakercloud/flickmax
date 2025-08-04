'use client'

import { motion } from 'framer-motion'
import { Star, Quote, Award, Shield, BadgeCheck, TrendingUp, Headphones } from 'lucide-react'

const testimonials = [
  {
    name: "Sarah Johnson",
    company: "TechStartup Inc.",
    rating: 5,
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    text: "Flickmax hosting has been a game-changer for our startup. The speed and reliability are unmatched, and their support team is always there when we need them."
  },
  {
    name: "Michael Chen",
    company: "E-commerce Pro",
    rating: 5,
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
    text: "We migrated from our previous host and saw a 40% improvement in page load times. Our sales have increased significantly thanks to the better performance."
  },
  {
    name: "Emily Rodriguez",
    company: "Digital Agency",
    rating: 5,
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
    text: "Managing multiple client websites is a breeze with Flickmax. The cPanel interface is intuitive, and the unlimited SSL certificates save us time and money."
  }
]

const trustBadges = [
  { name: "SSL Secured", icon: Shield },
  { name: "99.9% Uptime", icon: TrendingUp },
  { name: "Money Back Guarantee", icon: BadgeCheck },
  { name: "24/7 Support", icon: Headphones }
]

export default function SocialProof() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Modern gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-gray-100 to-slate-100">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
      </div>
      
      {/* Animated gradient orbs */}
      <motion.div
        animate={{
          x: [0, -50, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-40 right-0 w-80 h-80 bg-blue-200 rounded-full filter blur-3xl opacity-10"
      />
      <motion.div
        animate={{
          x: [0, 50, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute bottom-40 left-0 w-80 h-80 bg-cyan-200 rounded-full filter blur-3xl opacity-10"
      />
      
      <div className="relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 backdrop-blur-sm rounded-full text-amber-700 text-sm font-medium mb-6 border border-amber-200/30"
          >
            <Star className="w-4 h-4 fill-current" />
            <span>Rated 4.9/5 by our customers</span>
          </motion.div>
          
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 mb-4">
            What Our
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600"> Customers Say</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Don&apos;t just take our word for it. Here&apos;s what real businesses have to say about Flickmax hosting.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 relative border border-gray-100/50 overflow-hidden group hover:border-blue-200/50"
            >
              {/* Background gradient on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-cyan-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Quote Icon */}
              <Quote className="absolute top-6 right-6 w-8 h-8 text-blue-200 z-10" />
              
              {/* Rating */}
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="text-gray-700 mb-6 leading-relaxed">
                &ldquo;{testimonial.text}&rdquo;
              </p>

              {/* Author Info */}
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold mr-4 shadow-lg">
                  {testimonial.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.company}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-gray-100/50"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {trustBadges.map((badge, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600/10 to-cyan-600/10 backdrop-blur-sm rounded-2xl mb-3 border border-blue-200/30"
                >
                  <badge.icon className="w-8 h-8 text-blue-500" />
                </motion.div>
                <div className="font-semibold text-gray-900">{badge.name}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Awards Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Awards & Recognition</h3>
          <div className="flex flex-wrap justify-center items-center gap-8">
            {[1, 2, 3, 4].map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-100"
              >
                <Award className="w-5 h-5 text-blue-500" />
                <span className="text-sm font-medium text-gray-700">
                  {index === 0 && "Best Hosting 2024"}
                  {index === 1 && "Top Support Team"}
                  {index === 2 && "Fastest Servers"}
                  {index === 3 && "Customer Choice"}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
        </div>
      </div>
    </section>
  )
}