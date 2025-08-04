'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Quote, Star, ChevronLeft, ChevronRight, Building2, CheckCircle } from 'lucide-react'

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'CEO',
    company: 'TechStartup Inc.',
    content: 'Flickmax has been instrumental in our online success. Their hosting is blazing fast and the support team is always there when we need them. Our website load times improved by 60%!',
    rating: 5,
    image: 'https://i.pravatar.cc/150?img=1',
    companyLogo: '/logos/techstartup.png',
    verified: true,
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Lead Developer',
    company: 'DevHub Solutions',
    content: 'The best hosting provider I\'ve worked with. Domain management is seamless and the uptime is incredible. Highly recommend for any serious developer!',
    rating: 5,
    image: 'https://i.pravatar.cc/150?img=2',
    companyLogo: '/logos/devhub.png',
    verified: true,
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    role: 'Founder',
    company: 'ShopEasy Commerce',
    content: 'Moving to Flickmax was the best decision for my online store. Sales increased by 30% due to faster load times and better SEO rankings!',
    rating: 5,
    image: 'https://i.pravatar.cc/150?img=3',
    companyLogo: '/logos/shopeasy.png',
    verified: true,
  },
  {
    id: 4,
    name: 'David Kim',
    role: 'Marketing Director',
    company: 'Growth Marketing Co.',
    content: 'Professional email hosting that actually works! No more spam issues and the interface is super intuitive. Perfect for our team collaboration.',
    rating: 5,
    image: 'https://i.pravatar.cc/150?img=4',
    companyLogo: '/logos/growthmarketing.png',
    verified: true,
  },
  {
    id: 5,
    name: 'Lisa Thompson',
    role: 'CTO',
    company: 'CloudTech Systems',
    content: 'The VPS hosting is exceptional. Full root access, scalable resources, and excellent performance. Their technical support team really knows their stuff!',
    rating: 5,
    image: 'https://i.pravatar.cc/150?img=5',
    companyLogo: '/logos/cloudtech.png',
    verified: true,
  },
  {
    id: 6,
    name: 'James Wilson',
    role: 'Product Manager',
    company: 'InnovateLab',
    content: 'We\'ve been using Flickmax for 3 years now. The reliability and customer service are unmatched. They\'ve helped us scale from startup to enterprise smoothly.',
    rating: 5,
    image: 'https://i.pravatar.cc/150?img=6',
    companyLogo: '/logos/innovatelab.png',
    verified: true,
  },
]

export default function Testimonials() {
  const [currentPage, setCurrentPage] = useState(0)
  const testimonialsPerPage = 3
  const totalPages = Math.ceil(testimonials.length / testimonialsPerPage)

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages)
  }

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages)
  }

  const currentTestimonials = testimonials.slice(
    currentPage * testimonialsPerPage,
    (currentPage + 1) * testimonialsPerPage
  )

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Modern gradient background */}
      <div className="absolute inset-0 bg-white">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-cyan-50/30" />
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
      </div>
      
      {/* Animated gradient orbs */}
      <motion.div
        animate={{
          x: [0, 50, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full filter blur-3xl opacity-10"
      />
      <motion.div
        animate={{
          x: [0, -50, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-200 rounded-full filter blur-3xl opacity-10"
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
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600/10 to-cyan-600/10 backdrop-blur-sm rounded-full text-blue-700 text-sm font-medium mb-6 border border-blue-200/30"
          >
            <Star className="w-4 h-4" />
            <span>Customer Success Stories</span>
          </motion.div>
          
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 mb-4">
            Trusted by
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600"> Thousands</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            See what our customers have to say about their experience with Flickmax
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="grid md:grid-cols-3 gap-6"
            >
              {currentTestimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className="group relative"
                >
                  <div className="relative h-full bg-white/70 backdrop-blur-xl rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100/50 overflow-hidden hover:border-blue-200/50">
                    {/* Background gradient on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-cyan-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Quote icon */}
                    <Quote className="absolute top-6 right-6 h-8 w-8 text-blue-200" />
                    
                    {/* Content */}
                    <div className="relative z-10">
                      {/* Author info */}
                      <div className="flex items-center mb-6">
                        <div className="relative w-14 h-14 rounded-full overflow-hidden mr-4 ring-2 ring-blue-100">
                          <Image
                            src={testimonial.image}
                            alt={testimonial.name}
                            fill
                            className="object-cover"
                            loading="lazy"
                          />
                          {testimonial.verified && (
                            <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-0.5">
                              <CheckCircle className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {testimonial.name}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {testimonial.role}
                          </p>
                          <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                            <Building2 className="w-3 h-3" />
                            {testimonial.company}
                          </p>
                        </div>
                      </div>

                      {/* Rating */}
                      <div className="flex items-center mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                        ))}
                      </div>

                      {/* Testimonial content */}
                      <p className="text-gray-700 leading-relaxed italic">
                        "{testimonial.content}"
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-center mt-8 gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={prevPage}
              className="p-2 rounded-xl bg-white/80 backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100"
            >
              <ChevronLeft className="h-5 w-5 text-gray-700" />
            </motion.button>

            {/* Page indicators */}
            <div className="flex gap-2">
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentPage
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 w-8'
                      : 'bg-gray-300 hover:bg-gray-400 w-2'
                  }`}
                />
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={nextPage}
              className="p-2 rounded-xl bg-white/80 backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100"
            >
              <ChevronRight className="h-5 w-5 text-gray-700" />
            </motion.button>
          </div>
        </div>

        {/* Case Study CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <p className="text-gray-600 mb-4">
            Want to see detailed case studies?
          </p>
          <motion.a
            href="/case-studies"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            View Success Stories
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}