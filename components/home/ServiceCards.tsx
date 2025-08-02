'use client'

import { Globe, Server, Mail, Shield, Zap, HeadphonesIcon } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

const services = [
  {
    title: 'Domain Names',
    description: 'Register your perfect domain name from just $0.99/year',
    icon: Globe,
    href: '/domains',
    color: 'bg-blue-500',
    features: ['Free WHOIS Privacy', 'DNS Management', 'Domain Forwarding']
  },
  {
    title: 'Web Hosting',
    description: 'Fast, secure hosting starting at $2.99/month',
    icon: Server,
    href: '/hosting',
    color: 'bg-green-500',
    features: ['99.9% Uptime', 'Free SSL Certificate', '24/7 Support']
  },
  {
    title: 'Professional Email',
    description: 'Business email that matches your domain',
    icon: Mail,
    href: '/email',
    color: 'bg-purple-500',
    features: ['Custom Email Address', '30GB Storage', 'Mobile Access']
  },
  {
    title: 'SSL Certificates',
    description: 'Secure your website and boost SEO rankings',
    icon: Shield,
    href: '/ssl',
    color: 'bg-red-500',
    features: ['256-bit Encryption', 'Trust Badge', 'SEO Benefits']
  },
  {
    title: 'Website Builder',
    description: 'Create a stunning website in minutes',
    icon: Zap,
    href: '/website-builder',
    color: 'bg-yellow-500',
    features: ['Drag & Drop Editor', '100+ Templates', 'Mobile Responsive']
  },
  {
    title: '24/7 Support',
    description: 'Expert help whenever you need it',
    icon: HeadphonesIcon,
    href: '/support',
    color: 'bg-indigo-500',
    features: ['Live Chat', 'Phone Support', 'Knowledge Base']
  }
]

export default function ServiceCards() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need for online success
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Choose from our wide range of products and services
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group relative rounded-2xl bg-white p-6 shadow-sm hover:shadow-xl transition-all duration-300 shine-effect"
            >
              <div>
                <span className={`inline-flex rounded-lg ${service.color} p-3 text-white`}>
                  <service.icon className="h-6 w-6" aria-hidden="true" />
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  <Link href={service.href} className="focus:outline-none">
                    <span className="absolute inset-0" aria-hidden="true" />
                    {service.title}
                  </Link>
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  {service.description}
                </p>
                <ul className="mt-4 space-y-2">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center text-sm text-gray-500">
                      <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-6">
                <Link
                  href={service.href}
                  className="text-sm font-medium text-blue-600 group-hover:text-blue-500"
                >
                  Learn more →
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}