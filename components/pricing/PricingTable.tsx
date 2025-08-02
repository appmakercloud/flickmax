'use client'

import { useState } from 'react'
import { Check, X } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

const pricingPlans = {
  hosting: [
    {
      name: 'Starter',
      price: { monthly: 2.99, yearly: 2.49 },
      description: 'Perfect for personal websites',
      features: [
        { name: '1 Website', included: true },
        { name: '10 GB Storage', included: true },
        { name: 'Free SSL Certificate', included: true },
        { name: 'Free Domain (1st year)', included: true },
        { name: 'Email Accounts', included: false },
        { name: 'Daily Backups', included: false },
      ],
      cta: 'Get Started',
      popular: false,
    },
    {
      name: 'Business',
      price: { monthly: 9.99, yearly: 7.99 },
      description: 'Best for growing businesses',
      features: [
        { name: 'Unlimited Websites', included: true },
        { name: '100 GB Storage', included: true },
        { name: 'Free SSL Certificate', included: true },
        { name: 'Free Domain (1st year)', included: true },
        { name: '10 Email Accounts', included: true },
        { name: 'Daily Backups', included: true },
      ],
      cta: 'Get Started',
      popular: true,
    },
    {
      name: 'Enterprise',
      price: { monthly: 19.99, yearly: 15.99 },
      description: 'Maximum power for agencies',
      features: [
        { name: 'Unlimited Websites', included: true },
        { name: 'Unlimited Storage', included: true },
        { name: 'Free SSL Certificate', included: true },
        { name: 'Free Domain (1st year)', included: true },
        { name: 'Unlimited Email', included: true },
        { name: 'Real-time Backups', included: true },
      ],
      cta: 'Get Started',
      popular: false,
    },
  ],
}

export default function PricingTable({ category = 'hosting' }: { category?: keyof typeof pricingPlans }) {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly')
  const plans = pricingPlans[category] || pricingPlans.hosting

  return (
    <section className="py-16 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Choose the perfect plan for your needs. Always flexible to scale.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="mt-8 flex justify-center">
          <div className="relative flex rounded-lg bg-gray-100 p-1">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={cn(
                'relative rounded-md py-2 px-6 text-sm font-medium transition-all',
                billingPeriod === 'monthly'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod('yearly')}
              className={cn(
                'relative rounded-md py-2 px-6 text-sm font-medium transition-all',
                billingPeriod === 'yearly'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              )}
            >
              Yearly
              <span className="ml-2 inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                'relative rounded-2xl border bg-white p-8 shadow-sm',
                plan.popular ? 'border-blue-600 shadow-xl' : 'border-gray-200'
              )}
            >
              {plan.popular && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-4 py-1 text-sm font-medium text-white">
                  Most Popular
                </span>
              )}
              
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                <p className="mt-2 text-sm text-gray-600">{plan.description}</p>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900">
                    ${plan.price[billingPeriod]}
                  </span>
                  <span className="text-gray-600">/month</span>
                </div>
              </div>

              <ul className="mt-8 space-y-4">
                {plan.features.map((feature) => (
                  <li key={feature.name} className="flex items-start">
                    {feature.included ? (
                      <Check className="h-5 w-5 text-green-500 shrink-0" />
                    ) : (
                      <X className="h-5 w-5 text-gray-300 shrink-0" />
                    )}
                    <span className={cn(
                      'ml-3 text-sm',
                      feature.included ? 'text-gray-700' : 'text-gray-400'
                    )}>
                      {feature.name}
                    </span>
                  </li>
                ))}
              </ul>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  'mt-8 w-full rounded-md px-4 py-2 text-sm font-semibold transition-colors',
                  plan.popular
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                )}
              >
                {plan.cta}
              </motion.button>
            </motion.div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-600">
            All plans include 24/7 customer support, 99.9% uptime guarantee, and 30-day money-back guarantee.
          </p>
        </div>
      </div>
    </section>
  )
}