'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Server, Zap, Database, Cpu, HardDrive, Gauge, Shield, MousePointer, Activity, Lock, Save, Settings, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCPanelPlans } from '@/hooks/useCPanelPlans'
import { useBusinessHosting } from '@/hooks/useBusinessHosting'
import { useCountry } from '@/contexts/CountryContext'
import { formatCurrency } from '@/lib/countries'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import ErrorMessage from '@/components/ui/ErrorMessage'
import type { HostingPlan } from '@/types/hosting-plans'
import { useCart } from '@/contexts/CartContext'
import toast from 'react-hot-toast'

// Fallback plans for Standard Performance (cPanel)
const fallbackStandardPlans: HostingPlan[] = [
  {
    id: 'cpanel-starter',
    name: 'cPanel Starter',
    description: "cPanel that's easy, reliable and lightning-fast",
    price: {
      monthly: 3.99,
      yearly: 3.99,
      currency: 'USD'
    },
    features: [
      '1 website',
      '1 database',
      '10 GB storage'
    ],
    recommended: false,
    limits: {
      websites: 1,
      storage: '10 GB storage',
      bandwidth: 'Unmetered',
      databases: 1,
      ssl: 'Free SSL Certificate'
    }
  },
  {
    id: 'cpanel-economy',
    name: 'cPanel Economy',
    description: "cPanel Hosting that's easy, reliable and lightning-fast",
    price: {
      monthly: 9.99,
      yearly: 9.99,
      currency: 'USD'
    },
    features: [
      '1 website',
      '10 databases',
      '25 GB storage'
    ],
    recommended: false,
    limits: {
      websites: 1,
      storage: '25 GB storage',
      bandwidth: 'Unmetered',
      databases: 10,
      ssl: 'Free SSL Certificate'
    }
  },
  {
    id: 'cpanel-deluxe',
    name: 'cPanel Deluxe',
    description: "cPanel Hosting that's easy, reliable and lightning-fast",
    price: {
      monthly: 14.99,
      yearly: 14.99,
      currency: 'USD'
    },
    features: [
      '10 websites',
      '25 databases',
      '50 GB storage',
      'Free, unlimited SSL for all your websites'
    ],
    recommended: false,
    limits: {
      websites: 10,
      storage: '50 GB storage',
      bandwidth: 'Unmetered',
      databases: 25,
      ssl: 'Free, unlimited SSL for all your websites'
    }
  },
  {
    id: 'cpanel-ultimate',
    name: 'cPanel Ultimate',
    description: "cPanel Hosting that's easy, reliable and lightning-fast",
    price: {
      monthly: 18.99,
      yearly: 18.99,
      currency: 'USD'
    },
    features: [
      '25 websites',
      '50 databases',
      '75 GB storage',
      'Free, unlimited SSL for all your websites'
    ],
    recommended: false,
    limits: {
      websites: 25,
      storage: '75 GB storage',
      bandwidth: 'Unmetered',
      databases: 50,
      ssl: 'Free, unlimited SSL for all your websites'
    }
  }
]

// Fallback plans for High Performance (Business)
const fallbackBusinessPlans: HostingPlan[] = [
  {
    id: 'business-launch',
    name: 'Web Hosting Plus Launch',
    description: 'High performance hosting for growing sites',
    price: {
      monthly: 30.99,
      yearly: 30.99,
      currency: 'USD'
    },
    features: [
      '50 websites',
      'Unlimited databases',
      '100 GB NVMe storage',
      'cPanel',
      '4 GB RAM, 2 vCPUs',
      'Free dedicated IP',
      'Free domain*',
      'Free, unlimited SSL for all your websites⁵',
      '30-day, money-back guarantee³',
      'Site security trial offer⁶'
    ],
    recommended: false,
    limits: {
      websites: 50,
      storage: '100 GB NVMe storage',
      databases: 'unlimited',
      ram: '4 GB RAM',
      cpu: '2 CPUs',
      ssl: 'Free, unlimited SSL for all your websites'
    }
  },
  {
    id: 'business-enhance',
    name: 'Web Hosting Plus Enhance',
    description: 'Enhanced performance for busy sites',
    price: {
      monthly: 49.99,
      yearly: 49.99,
      currency: 'USD'
    },
    features: [
      '100 websites',
      'Unlimited databases',
      '200 GB NVMe storage',
      'cPanel',
      '8 GB RAM, 4 vCPUs',
      'Free dedicated IP',
      'Free domain*',
      'Free, unlimited SSL for all your websites⁵',
      '30-day, money-back guarantee³',
      'Site security trial offer⁶'
    ],
    recommended: false,
    limits: {
      websites: 100,
      storage: '200 GB NVMe storage',
      databases: 'unlimited',
      ram: '8 GB RAM',
      cpu: '4 CPUs',
      ssl: 'Free, unlimited SSL for all your websites'
    }
  },
  {
    id: 'business-grow',
    name: 'Web Hosting Plus Grow',
    description: 'Powerful hosting for high-traffic sites',
    price: {
      monthly: 69.99,
      yearly: 69.99,
      currency: 'USD'
    },
    features: [
      '150 websites',
      'Unlimited databases',
      '300 GB NVMe storage',
      'cPanel',
      '16 GB RAM, 8 vCPUs',
      'Free dedicated IP',
      'Free domain*',
      'Free, unlimited SSL for all your websites⁵',
      '30-day, money-back guarantee³',
      'Site security trial offer⁶'
    ],
    recommended: true,
    badge: 'BEST VALUE',
    limits: {
      websites: 150,
      storage: '300 GB NVMe storage',
      databases: 'unlimited',
      ram: '16 GB RAM',
      cpu: '8 CPUs',
      ssl: 'Free, unlimited SSL for all your websites'
    }
  },
  {
    id: 'business-expand',
    name: 'Web Hosting Plus Expand',
    description: 'Maximum resources for enterprise sites',
    price: {
      monthly: 99.99,
      yearly: 99.99,
      currency: 'USD'
    },
    features: [
      '200 websites',
      'Unlimited databases',
      '400 GB NVMe storage',
      'cPanel',
      '32 GB RAM, 16 vCPUs',
      'Free dedicated IP',
      'Free domain*',
      'Free, unlimited SSL for all your websites⁵',
      '30-day, money-back guarantee³',
      'Site security trial offer⁶'
    ],
    recommended: false,
    limits: {
      websites: 200,
      storage: '400 GB NVMe storage',
      databases: 'unlimited',
      ram: '32 GB RAM',
      cpu: '16 CPUs',
      ssl: 'Free, unlimited SSL for all your websites'
    }
  }
]

export default function TabbedHostingPlans() {
  const [activeTab, setActiveTab] = useState<'standard' | 'business'>('standard')
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('yearly')
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null)
  const [addingToCart, setAddingToCart] = useState<string | null>(null)
  const { currency, locale } = useCountry()
  const { addProductToCart } = useCart()
  
  const { plans: standardPlans, loading: standardLoading, error: standardError } = useCPanelPlans()
  const { plans: businessPlans, loading: businessLoading, error: businessError } = useBusinessHosting()

  // Use API plans if available, otherwise use fallbacks
  const displayStandardPlans = standardPlans.length > 0 ? standardPlans : fallbackStandardPlans
  const displayBusinessPlans = businessPlans.length > 0 ? businessPlans : fallbackBusinessPlans

  const loading = activeTab === 'standard' ? standardLoading : businessLoading
  const error = activeTab === 'standard' ? standardError : businessError
  const plans = activeTab === 'standard' ? displayStandardPlans : displayBusinessPlans

  const handleAddToCart = async (plan: HostingPlan) => {
    try {
      setAddingToCart(plan.id)
      
      // Use the plan ID as the product ID
      // For yearly billing, period is 12 months
      const period = billingPeriod === 'yearly' ? 12 : 1
      await addProductToCart(plan.id, period, 'MONTH')
      
      // For hosting, the product was instantly submitted via form
      // The success message is already shown by the cart context
    } catch (error) {
      // Error is already shown by cart context
      console.error('Add to cart error:', error)
    } finally {
      setAddingToCart(null)
    }
  }

  return (
    <section id="plans" className="py-24 relative overflow-hidden">
      {/* Modern gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
      </div>
      
      {/* Animated gradient orbs */}
      <motion.div
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-20 left-0 w-96 h-96 bg-blue-200 rounded-full filter blur-3xl opacity-20"
      />
      <motion.div
        animate={{
          x: [0, -100, 0],
          y: [0, 50, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute bottom-20 right-0 w-96 h-96 bg-cyan-200 rounded-full filter blur-3xl opacity-20"
      />
      
      <div className="relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
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
            <Sparkles className="w-4 h-4" />
            <span>Choose Your Perfect Plan</span>
          </motion.div>
          
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 mb-4">
            Hosting Plans That
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600"> Scale With You</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
            All plans include free domain, SSL certificate, 24/7 support, one-click install, 
            99.9% uptime, daily backups, and easy-to-use control panel. Upgrade or downgrade anytime.
          </p>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex p-1.5 bg-gray-100/80 backdrop-blur-sm rounded-2xl shadow-inner">
              <button
                onClick={() => setActiveTab('standard')}
                className={cn(
                  'px-6 py-3 rounded-xl text-sm transition-all duration-300',
                  activeTab === 'standard'
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:text-gray-900'
                )}
              >
                <div className="text-center">
                  <div className="font-semibold">Standard Performance</div>
                  <div className="text-xs mt-0.5">
                    Ideal for getting started with simple websites.
                  </div>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('business')}
                className={cn(
                  'px-6 py-3 rounded-xl text-sm transition-all duration-300 ml-1',
                  activeTab === 'business'
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:text-gray-900'
                )}
              >
                <div className="text-center">
                  <div className="font-semibold">High Performance</div>
                  <div className="text-xs mt-0.5">
                    Great for multi-site, high traffic or resource-heavy sites.
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Billing Toggle */}
          <div className="flex justify-center">
            <div className="bg-gray-200/80 backdrop-blur-sm p-1 rounded-lg inline-flex">
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
                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gradient-to-r from-green-400 to-emerald-400 text-white">
                  Save up to 50%
                </span>
              </button>
            </div>
          </div>
        </motion.div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-gray-600">Loading hosting plans...</p>
          </div>
        )}

        {error && !loading && (
          <ErrorMessage error={error} />
        )}

        {!loading && !error && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                onHoverStart={() => setHoveredPlan(plan.id)}
                onHoverEnd={() => setHoveredPlan(null)}
                className={cn(
                  'relative bg-white rounded-2xl transition-all duration-300 overflow-hidden group',
                  plan.recommended 
                    ? 'shadow-2xl border-2 border-blue-500 scale-105' 
                    : 'shadow-lg hover:shadow-2xl border border-gray-100 hover:border-blue-300',
                  hoveredPlan === plan.id && 'z-10'
                )}
              >
                {/* Background gradient on hover - moved to bottom layer */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-cyan-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0" />
                
                {(plan.recommended || plan.badge) && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="absolute top-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-center py-2 z-20">
                    <span className="text-xs font-bold uppercase tracking-wider">
                      ⭐ {plan.badge || 'MOST POPULAR'}
                    </span>
                  </motion.div>
                )}
                
                <div className="relative z-10 p-6 pt-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{plan.name}</h3>
                  {plan.description && (
                    <p className="text-sm text-gray-600 mb-4">{plan.description}</p>
                  )}
                  
                  <div className="mb-6">
                    {billingPeriod === 'yearly' && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 text-xs font-bold px-3 py-1.5 rounded-full mb-3 border border-green-200"
                      >
                        💰 SAVE {activeTab === 'standard' ? '40%' : '50%'}
                      </motion.div>
                    )}
                    <div className="flex items-baseline mb-2">
                      <span className="text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                        {formatCurrency(billingPeriod === 'yearly' ? plan.price.yearly : plan.price.monthly, plan.price.currency, locale)}
                      </span>
                      <span className="text-gray-500 ml-2 text-lg">/mo</span>
                    </div>
                    {billingPeriod === 'yearly' && (
                      <p className="text-xs text-gray-500">
                        Billed annually at {formatCurrency(plan.price.yearly * 12, plan.price.currency, locale)}
                      </p>
                    )}
                  </div>

                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAddToCart(plan)}
                    disabled={addingToCart === plan.id}
                    className={cn(
                      'w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 mb-6 relative',
                      plan.recommended
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700 shadow-lg hover:shadow-xl'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200',
                      addingToCart === plan.id && 'opacity-75 cursor-not-allowed'
                    )}
                  >
                    {addingToCart === plan.id ? (
                      <span className="flex items-center justify-center gap-2">
                        <LoadingSpinner size="sm" />
                        Adding...
                      </span>
                    ) : (
                      'Get Started'
                    )}
                  </motion.button>

                  <div className="border-t border-gray-100 pt-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">What&apos;s Included:</p>
                    <div className="space-y-3">
                    {/* Standard Performance - cPanel plans */}
                    {activeTab === 'standard' && (
                      <>
                        {/* Websites */}
                        {plan.limits?.websites && (
                          <div className="flex items-center text-sm text-gray-700">
                            <Server className="w-4 h-4 mr-3 text-blue-500 flex-shrink-0" />
                            <span>
                              {typeof plan.limits.websites === 'number' 
                                ? `${plan.limits.websites} website${plan.limits.websites > 1 ? 's' : ''}` 
                                : 'Unlimited websites'}
                            </span>
                          </div>
                        )}
                        
                        {/* Storage */}
                        {plan.limits?.storage && (
                          <div className="flex items-center text-sm text-gray-700">
                            <HardDrive className="w-4 h-4 mr-3 text-blue-500 flex-shrink-0" />
                            <span>{plan.limits.storage}</span>
                          </div>
                        )}
                        
                        {/* Databases */}
                        {plan.limits?.databases !== undefined && (
                          <div className="flex items-center text-sm text-gray-700">
                            <Database className="w-4 h-4 mr-3 text-blue-500 flex-shrink-0" />
                            <span>
                              {typeof plan.limits.databases === 'number' 
                                ? `${plan.limits.databases} database${plan.limits.databases > 1 ? 's' : ''}` 
                                : 'Unlimited databases'}
                            </span>
                          </div>
                        )}
                        
                        {/* SSL Certificate */}
                        {plan.limits?.ssl && (
                          <div className="flex items-center text-sm text-gray-700">
                            <Shield className="w-4 h-4 mr-3 text-green-500 flex-shrink-0" />
                            <span>{plan.limits.ssl}</span>
                          </div>
                        )}
                      </>
                    )}
                    
                    {/* High Performance - Business plans */}
                    {activeTab === 'business' && (
                      <>
                        {/* Storage */}
                        {plan.limits?.storage && (
                          <div className="flex items-center text-sm text-gray-700">
                            <HardDrive className="w-4 h-4 mr-3 text-blue-500 flex-shrink-0" />
                            <span>{plan.limits.storage}</span>
                          </div>
                        )}
                        
                        {/* RAM */}
                        {plan.limits?.ram && (
                          <div className="flex items-center text-sm text-gray-700">
                            <Zap className="w-4 h-4 mr-3 text-orange-500 flex-shrink-0" />
                            <span>{plan.limits.ram}</span>
                          </div>
                        )}
                        
                        {/* CPUs */}
                        {plan.limits?.cpu && (
                          <div className="flex items-center text-sm text-gray-700">
                            <Cpu className="w-4 h-4 mr-3 text-indigo-500 flex-shrink-0" />
                            <span>{plan.limits.cpu}</span>
                          </div>
                        )}
                        
                        {/* Traffic */}
                        <div className="flex items-center text-sm text-gray-700">
                          <Gauge className="w-4 h-4 mr-3 text-indigo-500 flex-shrink-0" />
                          <span>Unmetered traffic</span>
                        </div>
                        
                        {/* Websites */}
                        {plan.limits?.websites && (
                          <div className="flex items-center text-sm text-gray-700">
                            <Server className="w-4 h-4 mr-3 text-blue-500 flex-shrink-0" />
                            <span>
                              {typeof plan.limits.websites === 'number' 
                                ? `${plan.limits.websites} website${plan.limits.websites > 1 ? 's' : ''}` 
                                : 'Unlimited websites'}
                            </span>
                          </div>
                        )}
                        
                        {/* Databases */}
                        {plan.limits?.databases !== undefined && (
                          <div className="flex items-center text-sm text-gray-700">
                            <Database className="w-4 h-4 mr-3 text-blue-500 flex-shrink-0" />
                            <span>
                              {typeof plan.limits.databases === 'number' 
                                ? `${plan.limits.databases} database${plan.limits.databases > 1 ? 's' : ''}` 
                                : 'Unlimited databases'}
                            </span>
                          </div>
                        )}
                        
                        {/* SSL Certificate */}
                        {plan.limits?.ssl && (
                          <div className="flex items-center text-sm text-gray-700">
                            <Shield className="w-4 h-4 mr-3 text-green-500 flex-shrink-0" />
                            <span>{plan.limits.ssl}</span>
                          </div>
                        )}
                      </>
                    )}
                    
                    {/* Common Features for All Plans */}
                    <div className="border-t border-gray-100 mt-3 pt-3 space-y-2">
                      <div className="flex items-center text-sm text-gray-700">
                        <MousePointer className="w-4 h-4 mr-3 text-blue-500 flex-shrink-0" />
                        <span>One-click install</span>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-700">
                        <Activity className="w-4 h-4 mr-3 text-green-500 flex-shrink-0" />
                        <span>99.9% uptime guarantee</span>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-700">
                        <Lock className="w-4 h-4 mr-3 text-red-500 flex-shrink-0" />
                        <span>24/7 security monitoring</span>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-700">
                        <Save className="w-4 h-4 mr-3 text-indigo-500 flex-shrink-0" />
                        <span>Daily backups</span>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-700">
                        <Settings className="w-4 h-4 mr-3 text-gray-500 flex-shrink-0" />
                        <span>Easy-to-use control panel</span>
                      </div>
                    </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <div className="bg-gradient-to-r from-blue-50/50 to-cyan-50/50 backdrop-blur-sm rounded-2xl p-8 text-center border border-blue-100/50">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Need a custom solution?</h3>
            <p className="text-gray-600 mb-4">
              Get enterprise-grade hosting with custom resources, dedicated support, and SLA guarantees.
            </p>
            <a 
              href="/contact" 
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold group"
            >
              Talk to sales team
              <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
          <p className="text-xs text-gray-500 text-center mt-6">
            All prices shown in {currency}. Prices exclude applicable taxes. Features subject to availability.
          </p>
        </motion.div>
        </div>
      </div>
    </section>
  )
}