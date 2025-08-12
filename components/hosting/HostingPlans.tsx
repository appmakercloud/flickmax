'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useHostingPlans } from '@/hooks/useHostingProducts'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import ErrorMessage from '@/components/ui/ErrorMessage'
import { PricingTableSkeleton } from '@/components/ui/PricingSkeleton'

// Fallback plans for when API is unavailable
const fallbackPlans = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Perfect for personal websites and blogs',
    price: {
      monthly: 5.99,
      yearly: 2.99,
      currency: 'USD'
    },
    features: [
      '1 Website',
      '10 GB SSD Storage',
      'Unmetered Bandwidth',
      'Free Domain (1st year)',
      'Free SSL Certificate',
      'Free Business Email (1st year)',
      'WordPress 1-Click Install',
      '24/7 Support',
      '30-Day Money Back'
    ],
    recommended: false,
    limits: {
      websites: 1,
      storage: '10 GB',
      bandwidth: 'Unmetered',
      databases: 1,
      email: 1,
      domains: 1
    }
  },
  {
    id: 'business',
    name: 'Business',
    description: 'Best for growing businesses and online stores',
    price: {
      monthly: 11.99,
      yearly: 7.99,
      currency: 'USD'
    },
    features: [
      'Unlimited Websites',
      '100 GB SSD Storage',
      'Unmetered Bandwidth',
      'Free Domain (1st year)',
      'Free SSL Certificate',
      'Free Business Email (1st year)',
      'WordPress 1-Click Install',
      '24/7 Priority Support',
      '30-Day Money Back',
      'Daily Automatic Backups',
      'Free Website Builder',
      'Basic SEO Tools',
      'Free CDN',
      'Staging Environment'
    ],
    recommended: true,
    badge: 'MOST POPULAR',
    limits: {
      websites: 'unlimited',
      storage: '100 GB',
      bandwidth: 'Unmetered',
      databases: 'unlimited',
      email: 'unlimited',
      domains: 1
    }
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'Maximum power for high-traffic sites',
    price: {
      monthly: 19.99,
      yearly: 13.99,
      currency: 'USD'
    },
    features: [
      'Unlimited Websites',
      'Unlimited SSD Storage',
      'Unmetered Bandwidth',
      'Free Domain (1st year)',
      'Free SSL Certificate',
      'Free Business Email (1st year)',
      'WordPress 1-Click Install',
      '24/7 VIP Support',
      '30-Day Money Back',
      'Real-time Backups',
      'Free Website Builder',
      'Advanced SEO Tools',
      'Premium CDN',
      'Multiple Staging Environments',
      'Priority Processing',
      'Advanced Security Suite',
      'White-label Hosting'
    ],
    recommended: false,
    limits: {
      websites: 'unlimited',
      storage: 'Unlimited',
      bandwidth: 'Unmetered',
      databases: 'unlimited',
      email: 'unlimited',
      domains: 1
    }
  }
]

export default function HostingPlans() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('yearly')
  const { plans: apiPlans, loading, error, refetch } = useHostingPlans()

  // Use API plans if available, otherwise use fallback
  const plans = apiPlans.length > 0 ? apiPlans : fallbackPlans

  if (loading) {
    return (
      <section id="plans" className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Choose Your Perfect Hosting Plan
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              All plans include free domain, SSL certificate, and 24/7 support. 
              Upgrade or downgrade anytime.
            </p>
          </div>
          <PricingTableSkeleton columns={3} />
        </div>
      </section>
    )
  }

  if (error && apiPlans.length === 0) {
    return (
      <section id="plans" className="py-20 bg-gray-50">
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
                  Save up to 75%
                </span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={cn(
                'relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300',
                plan.recommended && 'ring-2 ring-blue-600 transform scale-105'
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

              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-6">{plan.description}</p>

                <div className="mb-8">
                  <div className="flex items-baseline">
                    <span className="text-5xl font-bold text-gray-900">
                      ${plan.price[billingPeriod]}
                    </span>
                    <span className="text-gray-600 ml-2">/month</span>
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

                <div className="mt-8 space-y-4">
                  <h4 className="font-semibold text-gray-900">Everything in this plan:</h4>
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
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