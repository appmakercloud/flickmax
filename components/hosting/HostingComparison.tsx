'use client'

import { motion } from 'framer-motion'
import { Check, X } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

const standardFeatures = [
  { 
    name: 'Performance Type',
    'cpanel-starter': 'Standard',
    'cpanel-economy': 'Standard',
    'cpanel-deluxe': 'Standard',
    'cpanel-ultimate': 'Standard'
  },
  { 
    name: 'Websites',
    'cpanel-starter': '1',
    'cpanel-economy': '1',
    'cpanel-deluxe': '10',
    'cpanel-ultimate': '25'
  },
  { 
    name: 'Storage',
    'cpanel-starter': '10 GB NVMe',
    'cpanel-economy': '25 GB NVMe',
    'cpanel-deluxe': '50 GB NVMe',
    'cpanel-ultimate': '75 GB NVMe'
  },
  { 
    name: 'Databases',
    'cpanel-starter': '1',
    'cpanel-economy': '10',
    'cpanel-deluxe': '25',
    'cpanel-ultimate': '50'
  },
  { 
    name: 'Bandwidth',
    'cpanel-starter': 'Unmetered',
    'cpanel-economy': 'Unmetered',
    'cpanel-deluxe': 'Unmetered',
    'cpanel-ultimate': 'Unmetered'
  },
  { 
    name: 'Free Domain',
    'cpanel-starter': true,
    'cpanel-economy': true,
    'cpanel-deluxe': true,
    'cpanel-ultimate': true
  },
  { 
    name: 'SSL Certificate',
    'cpanel-starter': '1 year free',
    'cpanel-economy': '1 year free',
    'cpanel-deluxe': 'Unlimited free',
    'cpanel-ultimate': 'Unlimited free'
  },
  { 
    name: 'cPanel Access',
    'cpanel-starter': true,
    'cpanel-economy': true,
    'cpanel-deluxe': true,
    'cpanel-ultimate': true
  },
  { 
    name: 'Email Accounts',
    'cpanel-starter': '5',
    'cpanel-economy': '100',
    'cpanel-deluxe': 'Unlimited',
    'cpanel-ultimate': 'Unlimited'
  },
  { 
    name: 'Daily Backups',
    'cpanel-starter': true,
    'cpanel-economy': true,
    'cpanel-deluxe': true,
    'cpanel-ultimate': true
  },
  { 
    name: 'WordPress 1-Click',
    'cpanel-starter': true,
    'cpanel-economy': true,
    'cpanel-deluxe': true,
    'cpanel-ultimate': true
  },
  { 
    name: 'Support Level',
    'cpanel-starter': '24/7',
    'cpanel-economy': '24/7',
    'cpanel-deluxe': '24/7 Priority',
    'cpanel-ultimate': '24/7 VIP'
  },
  { 
    name: 'Uptime Guarantee',
    'cpanel-starter': '99.9%',
    'cpanel-economy': '99.9%',
    'cpanel-deluxe': '99.9%',
    'cpanel-ultimate': '99.9%'
  },
  { 
    name: 'Money Back',
    'cpanel-starter': '30 days',
    'cpanel-economy': '30 days',
    'cpanel-deluxe': '30 days',
    'cpanel-ultimate': '30 days'
  }
]

const businessFeatures = [
  { 
    name: 'Performance Type',
    'business-launch': 'High Performance',
    'business-enhance': 'High Performance',
    'business-grow': 'High Performance',
    'business-expand': 'High Performance'
  },
  { 
    name: 'Websites',
    'business-launch': '50',
    'business-enhance': '100',
    'business-grow': '150',
    'business-expand': '200'
  },
  { 
    name: 'Storage',
    'business-launch': '100 GB NVMe',
    'business-enhance': '200 GB NVMe',
    'business-grow': '300 GB NVMe',
    'business-expand': '400 GB NVMe'
  },
  { 
    name: 'RAM',
    'business-launch': '4 GB',
    'business-enhance': '8 GB',
    'business-grow': '16 GB',
    'business-expand': '32 GB'
  },
  { 
    name: 'CPU Cores',
    'business-launch': '2 CPUs',
    'business-enhance': '4 CPUs',
    'business-grow': '8 CPUs',
    'business-expand': '16 CPUs'
  },
  { 
    name: 'Databases',
    'business-launch': 'Unlimited',
    'business-enhance': 'Unlimited',
    'business-grow': 'Unlimited',
    'business-expand': 'Unlimited'
  },
  { 
    name: 'Bandwidth',
    'business-launch': 'Unmetered',
    'business-enhance': 'Unmetered',
    'business-grow': 'Unmetered',
    'business-expand': 'Unmetered'
  },
  { 
    name: 'Free Domain',
    'business-launch': true,
    'business-enhance': true,
    'business-grow': true,
    'business-expand': true
  },
  { 
    name: 'SSL Certificate',
    'business-launch': 'Unlimited free',
    'business-enhance': 'Unlimited free',
    'business-grow': 'Unlimited free',
    'business-expand': 'Unlimited free'
  },
  { 
    name: 'Dedicated IP',
    'business-launch': true,
    'business-enhance': true,
    'business-grow': true,
    'business-expand': true
  },
  { 
    name: 'cPanel/WHM',
    'business-launch': 'cPanel',
    'business-enhance': 'cPanel',
    'business-grow': 'cPanel',
    'business-expand': 'cPanel/WHM'
  },
  { 
    name: 'Daily Backups',
    'business-launch': true,
    'business-enhance': true,
    'business-grow': true,
    'business-expand': 'Real-time'
  },
  { 
    name: 'Support Level',
    'business-launch': '24/7 Priority',
    'business-enhance': '24/7 Priority',
    'business-grow': '24/7 VIP',
    'business-expand': '24/7 VIP'
  },
  { 
    name: 'Uptime Guarantee',
    'business-launch': '99.9%',
    'business-enhance': '99.9%',
    'business-grow': '99.9%',
    'business-expand': '99.9%'
  }
]

const plans = {
  standard: [
    { id: 'cpanel-starter', name: 'cPanel Starter', price: '$3.99', recommended: false },
    { id: 'cpanel-economy', name: 'cPanel Economy', price: '$9.99', recommended: false },
    { id: 'cpanel-deluxe', name: 'cPanel Deluxe', price: '$14.99', recommended: true },
    { id: 'cpanel-ultimate', name: 'cPanel Ultimate', price: '$18.99', recommended: false }
  ],
  business: [
    { id: 'business-launch', name: 'Plus Launch', price: '$30.99', recommended: false },
    { id: 'business-enhance', name: 'Plus Enhance', price: '$49.99', recommended: false },
    { id: 'business-grow', name: 'Plus Grow', price: '$69.99', recommended: true },
    { id: 'business-expand', name: 'Plus Expand', price: '$99.99', recommended: false }
  ]
}

export default function HostingComparison() {
  const [activeTab, setActiveTab] = useState<'standard' | 'business'>('standard')
  
  const activePlans = activeTab === 'standard' ? plans.standard : plans.business
  const activeFeatures = activeTab === 'standard' ? standardFeatures : businessFeatures

  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Compare All Features
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            See exactly what&apos;s included in each plan to make the best choice for your needs.
          </p>

          {/* Tab Navigation */}
          <div className="flex justify-center">
            <div className="inline-flex p-1 bg-gray-100 rounded-full">
              <button
                onClick={() => setActiveTab('standard')}
                className={cn(
                  'px-6 py-2 rounded-full text-sm font-medium transition-all duration-200',
                  activeTab === 'standard'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:text-gray-900'
                )}
              >
                Standard Performance
              </button>
              <button
                onClick={() => setActiveTab('business')}
                className={cn(
                  'px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ml-1',
                  activeTab === 'business'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:text-gray-900'
                )}
              >
                High Performance
              </button>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="overflow-x-auto"
        >
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-4 px-4 font-semibold text-gray-900 min-w-[200px]">Features</th>
                {activePlans.map((plan) => (
                  <th key={plan.id} className={cn(
                    "text-center py-4 px-4 min-w-[150px]",
                    plan.recommended && "bg-blue-50 rounded-t-xl"
                  )}>
                    <div className="font-semibold text-gray-900 text-lg">{plan.name}</div>
                    <div className="text-sm text-gray-600 mt-1">{plan.price}/mo</div>
                    {plan.recommended && (
                      <div className="text-xs text-blue-600 font-semibold mt-2">BEST VALUE</div>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {activeFeatures.map((feature, index) => (
                <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-4 px-4 font-medium text-gray-900">{feature.name}</td>
                  {activePlans.map((plan) => (
                    <td key={plan.id} className={cn(
                      "py-4 px-4 text-center",
                      plan.recommended && "bg-blue-50"
                    )}>
                      {typeof feature[plan.id as keyof typeof feature] === 'boolean' ? (
                        feature[plan.id as keyof typeof feature] ? (
                          <Check className="w-5 h-5 text-green-500 mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-gray-300 mx-auto" />
                        )
                      ) : (
                        <span className={cn(
                          "text-gray-700",
                          plan.recommended && "font-medium"
                        )}>{feature[plan.id as keyof typeof feature]}</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td className="py-6"></td>
                {activePlans.map((plan) => (
                  <td key={plan.id} className={cn(
                    "py-6 text-center",
                    plan.recommended && "bg-blue-50"
                  )}>
                    <button className={cn(
                      "px-6 py-2 rounded-lg transition-colors font-semibold",
                      plan.recommended
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-blue-500 text-white hover:bg-blue-600"
                    )}>
                      Get Started
                    </button>
                  </td>
                ))}
              </tr>
            </tfoot>
          </table>
        </motion.div>
      </div>
    </section>
  )
}