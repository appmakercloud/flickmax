'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCPanelPlans } from '@/hooks/useCPanelPlans'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import ErrorMessage from '@/components/ui/ErrorMessage'

// Fallback plans for when API is unavailable
const fallbackPlans = [
  {
    id: 'cpanel-starter',
    name: 'cPanel Starter',
    description: "cPanel that's easy, reliable and lightning-fast",
    price: {
      monthly: 3.99,
      yearly: 3.19,
      currency: 'USD'
    },
    features: [
      'Full cPanel Access',
      '1 website',
      '1 database',
      '10 GB storage',
      'Unmetered Bandwidth',
      'Free Domain (1st year)',
      'Free SSL Certificate',
      '24/7 Support',
      'Daily Backups',
      '99.9% Uptime Guarantee'
    ],
    recommended: false,
    limits: {
      websites: 1,
      storage: '10 GB',
      bandwidth: 'Unmetered',
      databases: 1,
      email: 5
    }
  },
  {
    id: 'cpanel-economy',
    name: 'cPanel Economy',
    description: "cPanel Hosting that's easy, reliable and lightning-fast",
    price: {
      monthly: 9.99,
      yearly: 7.99,
      currency: 'USD'
    },
    features: [
      'Full cPanel Access',
      '1 website',
      '10 databases',
      '25 GB storage',
      'Unmetered Bandwidth',
      'Free Domain (1st year)',
      'Free SSL Certificate',
      '24/7 Support',
      'Daily Backups',
      '99.9% Uptime Guarantee',
      'Email Accounts',
      'phpMyAdmin'
    ],
    recommended: false,
    limits: {
      websites: 1,
      storage: '25 GB',
      bandwidth: 'Unmetered',
      databases: 10,
      email: 100
    }
  },
  {
    id: 'cpanel-deluxe',
    name: 'cPanel Deluxe',
    description: "cPanel Hosting that's easy, reliable and lightning-fast",
    price: {
      monthly: 14.99,
      yearly: 11.99,
      currency: 'USD'
    },
    features: [
      'Full cPanel Access',
      '10 websites',
      '25 databases',
      '50 GB storage',
      'Free, unlimited SSL for all your websites',
      'Unmetered Bandwidth',
      'Free Domain (1st year)',
      '24/7 Priority Support',
      'Daily Backups',
      '99.9% Uptime Guarantee',
      'Unlimited Email Accounts',
      'SSH Access',
      'Git Version Control'
    ],
    recommended: true,
    badge: 'BEST VALUE',
    limits: {
      websites: 10,
      storage: '50 GB',
      bandwidth: 'Unmetered',
      databases: 25,
      email: 'unlimited'
    }
  },
  {
    id: 'cpanel-ultimate',
    name: 'cPanel Ultimate',
    description: "cPanel Hosting that's easy, reliable and lightning-fast",
    price: {
      monthly: 18.99,
      yearly: 15.19,
      currency: 'USD'
    },
    features: [
      'Full cPanel Access',
      '25 websites',
      '50 databases',
      '75 GB storage',
      'Free, unlimited SSL for all your websites',
      'Unmetered Bandwidth',
      'Free Domain (1st year)',
      '24/7 VIP Support',
      'Real-time Backups',
      '99.9% Uptime Guarantee',
      'Unlimited Email Accounts',
      'SSH & Root Access',
      'Advanced Developer Tools',
      'Premium DNS',
      'Enhanced Security Suite'
    ],
    recommended: false,
    limits: {
      websites: 25,
      storage: '75 GB',
      bandwidth: 'Unmetered',
      databases: 50,
      email: 'unlimited'
    }
  }
]

export default function CPanelPlans() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('yearly')
  const { plans: apiPlans, loading, error, refetch } = useCPanelPlans()

  // Use API plans if available and have valid pricing
  const plans = React.useMemo(() => {
    if (loading) return fallbackPlans
    
    // If we have API plans with valid pricing, use them
    if (apiPlans.length > 0 && apiPlans.some(plan => plan.price.monthly > 0)) {
      return apiPlans
    }
    
    // Otherwise use fallback plans
    return fallbackPlans
  }, [apiPlans, loading])

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center py-20">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-gray-600">Loading cPanel hosting plans...</p>
          </div>
        </div>
      </section>
    )
  }

  if (error && apiPlans.length === 0) {
    return (
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ErrorMessage error={error} retry={refetch} />
        </div>
      </section>
    )
  }

  return (
    <section id="plans" className="py-20 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Choose Your Perfect Hosting Plan
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            All plans include free domain, SSL certificate, and 24/7 support. 
            Upgrade or downgrade anytime.
          </p>

          {/* Billing Toggle */}
          <div className="flex justify-center">
            <div className="bg-gray-200 p-1 rounded-lg inline-flex">
              <button
                onClick={() => setBillingPeriod('monthly')}
                className={cn(
                  'px-6 py-2 rounded-md text-sm font-medium transition-all duration-200',
                  billingPeriod === 'monthly'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                )}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingPeriod('yearly')}
                className={cn(
                  'px-6 py-2 rounded-md text-sm font-medium transition-all duration-200',
                  billingPeriod === 'yearly'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                )}
              >
                Yearly
                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                  Save up to 40%
                </span>
              </button>
            </div>
          </div>
        </motion.div>


        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={cn(
                'relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border',
                plan.recommended && 'ring-2 ring-blue-600 border-blue-600'
              )}
            >
              {(plan.recommended || plan.badge) && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-blue-600 text-white text-sm font-bold px-4 py-1 rounded-full inline-flex items-center">
                    <Star className="w-4 h-4 mr-1 fill-current" />
                    {plan.badge || 'MOST POPULAR'}
                  </span>
                </div>
              )}

              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{plan.description}</p>

                <div className="mb-6">
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold text-gray-900">
                      ${billingPeriod === 'yearly' ? plan.price.yearly : plan.price.monthly}
                    </span>
                    <span className="text-gray-600 ml-1 text-sm">/month</span>
                  </div>
                  {billingPeriod === 'yearly' && (
                    <p className="text-sm text-gray-500 mt-2">
                      Billed annually. Regular price ${plan.price.monthly}/mo
                    </p>
                  )}
                </div>

                <button className={cn(
                  'w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200',
                  plan.recommended
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-900 text-white hover:bg-gray-800'
                )}>
                  Get Started
                </button>

                <div className="mt-6 space-y-3">
                  <h4 className="font-semibold text-gray-900 text-sm">Everything included:</h4>
                  <ul className="space-y-2">
                    {plan.features.slice(0, 8).map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 text-xs">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Resource Limits */}
                {plan.limits && (
                  <div className="mt-6 pt-6 border-t">
                    <h4 className="font-semibold text-gray-900 mb-3">Resources:</h4>
                    <div className="space-y-2 text-sm">
                      {plan.limits.websites && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Websites</span>
                          <span className="font-medium text-gray-900">
                            {typeof plan.limits.websites === 'number' ? plan.limits.websites : 'Unlimited'}
                          </span>
                        </div>
                      )}
                      {plan.limits.storage && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Storage</span>
                          <span className="font-medium text-gray-900">{plan.limits.storage}</span>
                        </div>
                      )}
                      {plan.limits.databases && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Databases</span>
                          <span className="font-medium text-gray-900">
                            {typeof plan.limits.databases === 'number' ? plan.limits.databases : 'Unlimited'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <p className="text-gray-600">
            All prices shown in USD. Prices exclude applicable taxes.
            <br />
            <span className="font-semibold">Need a custom plan?</span>{' '}
            <a href="/contact" className="text-blue-600 hover:text-blue-700 font-semibold">
              Contact our sales team
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  )
}