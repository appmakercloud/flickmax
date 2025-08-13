'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Server, 
  Zap, 
  Database, 
  Cpu, 
  HardDrive, 
  Gauge, 
  Shield, 
  MousePointer, 
  Activity, 
  Lock, 
  Save, 
  Settings, 
  Sparkles,
  Check,
  Star,
  Globe,
  Rocket,
  Award,
  Users,
  ArrowRight,
  CheckCircle,
  CloudLightning,
  ShieldCheck,
  Code,
  Flame,
  RefreshCw,
  Layers,
  Boxes,
  TrendingUp,
  Smartphone,
  PenTool,
  Mail,
  FileText,
  Package,
  BarChart3,
  Wifi,
  ChevronDown,
  HeadphonesIcon,
  X
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useWebHostingPlans } from '@/hooks/useWebHostingPlans'
import { useCountry } from '@/contexts/CountryContext'
import { formatCurrency } from '@/lib/countries'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { PricingTableSkeleton } from '@/components/ui/PricingSkeleton'
import type { HostingPlan } from '@/types/hosting-plans'
import { useCart } from '@/contexts/CartContext'
import { getCurrencySymbol, formatPrice } from '@/lib/utils/currency'
import toast from 'react-hot-toast'

// Helper function to get icon for features
function getFeatureIcon(featureText: string): any {
  const text = featureText.toLowerCase()
  
  if (text.includes('website') || text.includes('site')) return Globe
  if (text.includes('storage') || text.includes('gb') || text.includes('nvme')) return HardDrive
  if (text.includes('bandwidth') || text.includes('traffic')) return Gauge
  if (text.includes('database') || text.includes('mysql')) return Database
  if (text.includes('ssl') || text.includes('certificate')) return Shield
  if (text.includes('email') || text.includes('mail')) return Mail
  if (text.includes('cpu') || text.includes('processor')) return Cpu
  if (text.includes('ram') || text.includes('memory')) return Zap
  if (text.includes('backup')) return Save
  if (text.includes('domain')) return Globe
  if (text.includes('cpanel') || text.includes('panel')) return Settings
  if (text.includes('uptime')) return Activity
  if (text.includes('support')) return HeadphonesIcon
  if (text.includes('security') || text.includes('protection')) return ShieldCheck
  if (text.includes('speed') || text.includes('fast')) return Rocket
  if (text.includes('unlimited')) return Sparkles
  if (text.includes('free')) return Award
  if (text.includes('dedicated ip')) return Lock
  
  return Check
}

export default function ModernWebHostingPlans() {
  const [activeTab, setActiveTab] = useState<'standard' | 'high'>('standard')
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly')
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null)
  const [addingToCart, setAddingToCart] = useState<string | null>(null)
  const [timeLeft, setTimeLeft] = useState({ minutes: 30, seconds: 0 })
  const [showFeatureComparison, setShowFeatureComparison] = useState(false)
  
  const { currency, locale, country } = useCountry()
  const { addProductToCart } = useCart()
  const { cpanelPlans, businessPlans, loading, error } = useWebHostingPlans()
  
  // Use API plans or empty array
  const plans = activeTab === 'standard' ? cpanelPlans : businessPlans

  // Countdown timer for offer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        } else if (prev.minutes > 0) {
          return { minutes: prev.minutes - 1, seconds: 59 }
        } else {
          // Reset to 30 minutes when it reaches 0
          return { minutes: 30, seconds: 0 }
        }
      })
    }, 1000)
    
    return () => clearInterval(timer)
  }, [])

  const handleAddToCart = async (plan: HostingPlan) => {
    try {
      setAddingToCart(plan.id)
      
      // Use the plan ID as the product ID
      // For yearly billing, period is 12 months
      const period = billingCycle === 'yearly' ? 12 : 1
      await addProductToCart(plan.id, period, 'MONTH')
      
      // Success message is handled by the cart context
    } catch (error) {
      // Error is already shown by cart context
      console.error('Add to cart error:', error)
    } finally {
      setAddingToCart(null)
    }
  }

  // Calculate max savings for display (only from actual API discounts)
  const maxSavings = plans.length > 0 
    ? Math.max(...plans.map(p => p.savings || 0))
    : 0

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/30 to-cyan-50/30 text-gray-900 overflow-x-hidden relative">
      {/* Modern Blue/Cyan Gradient Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white to-cyan-50/50" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-100/40 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-blue-100/40 via-transparent to-transparent" />
        
        {/* Static gradient orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-200/20 to-cyan-200/20 rounded-full filter blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-cyan-200/20 to-teal-200/20 rounded-full filter blur-3xl" />
        
        {/* Grid pattern overlay */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      {/* Dynamic Promo Banner - Only show when there are actual savings */}
      {maxSavings > 0 ? (
      <motion.div 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="relative z-20 bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 py-3 overflow-hidden"
      >
        {/* Animated background effect */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black/10" />
          <motion.div
            animate={{
              x: ['0%', '100%'],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: 'linear'
            }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent w-full"
          />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-3 sm:px-4">
          {/* Mobile Layout */}
          <div className="flex flex-col sm:hidden space-y-2 py-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles className="w-4 h-4 text-white" />
                </motion.div>
                <span className="font-bold text-white text-sm">
                  SAVE UP TO {maxSavings}% OFF on Annual Plans
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-yellow-300 px-2 py-0.5 bg-white/10 rounded-full font-medium">
                30-DAY MONEY BACK GUARANTEE
              </span>
              <div className="flex items-center gap-1 text-yellow-300">
                <Flame className="w-3 h-3" />
                <span className="font-bold">
                  OFFER EXPIRES IN: {String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
                </span>
              </div>
            </div>
          </div>
          
          {/* Desktop Layout */}
          <div className="hidden sm:flex items-center justify-center gap-2 md:gap-4 text-white text-sm md:text-base">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="w-5 h-5" />
            </motion.div>
            
            <span className="font-bold">
              SAVE UP TO {maxSavings}% OFF on Annual Plans
            </span>
            
            <span className="text-yellow-300 px-2 py-1 bg-white/10 rounded-full text-xs font-medium">
              30-DAY MONEY BACK GUARANTEE
            </span>
            
            <div className="flex items-center gap-2 text-yellow-300">
              <Flame className="w-4 h-4" />
              <span className="font-bold text-sm">
                OFFER EXPIRES IN: {String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
      ) : null}

      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center py-16 bg-gradient-to-b from-white via-blue-50/10 to-white">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-50/20 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Trust Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="inline-block mb-6"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-500 blur-2xl opacity-30 animate-pulse" />
                <div className="relative bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-full font-bold text-sm flex items-center gap-2 shadow-xl">
                  <Award className="w-5 h-5" />
                  #1 RATED WEB HOSTING
                  <Award className="w-5 h-5" />
                </div>
              </div>
            </motion.div>

            {/* Main Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6">
              <motion.span
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="block text-gray-900"
              >
                Lightning-Fast
              </motion.span>
              <motion.span
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600"
              >
                Web Hosting Solutions
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="block text-2xl md:text-3xl lg:text-4xl mt-4 text-gray-700"
              >
                From Starter to Enterprise
              </motion.span>
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto"
            >
              Choose between <span className="text-blue-600 font-bold">Standard Performance</span> for simple websites or{' '}
              <span className="text-cyan-600 font-bold">High Performance</span> for demanding applications.{' '}
              <span className="text-teal-600 font-bold">99.9% uptime</span> guaranteed.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
            >
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(59, 130, 246, 0.3)' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full font-bold text-lg text-white overflow-hidden shadow-xl"
              >
                <span className="relative z-10 flex items-center gap-2">
                  View Hosting Plans
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowFeatureComparison(true)}
                className="px-8 py-4 bg-white/80 backdrop-blur-sm border-2 border-blue-200 rounded-full font-bold text-lg text-gray-700 hover:bg-white hover:border-blue-300 transition-all shadow-lg"
              >
                Compare Features
              </motion.button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
            >
              {[
                { icon: Shield, text: 'Uptime Guarantee', value: '99.9%', color: 'from-blue-600 to-cyan-600' },
                { icon: Rocket, text: 'Load Time', value: '<300ms', color: 'from-blue-600 to-cyan-600' },
                { icon: HeadphonesIcon, text: 'Support', value: '24/7/365', color: 'from-blue-600 to-cyan-600' },
                { icon: Globe, text: 'Free Domain', value: '1 Year', color: 'from-blue-600 to-cyan-600' }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-5 hover:bg-white hover:shadow-lg transition-all duration-300">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${item.color} p-2.5 mx-auto mb-3 shadow-md`}>
                      <item.icon className="w-full h-full text-white" />
                    </div>
                    <p className="text-xs text-gray-600 font-medium">{item.text}</p>
                    <p className="text-lg font-bold text-gray-900">{item.value}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative py-20 z-10 bg-gradient-to-b from-white via-gray-50/50 to-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-4 text-gray-900">
              Choose Your Perfect{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
                Hosting Plan
              </span>
            </h2>
            <p className="text-xl text-gray-600">
              All plans include free SSL certificate • 24/7 support • 30-day money-back guarantee
            </p>
          </motion.div>

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
                  <div className="text-xs mt-0.5 opacity-90">
                    cPanel hosting for simple websites
                  </div>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('high')}
                className={cn(
                  'px-6 py-3 rounded-xl text-sm transition-all duration-300 ml-1',
                  activeTab === 'high'
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:text-gray-900'
                )}
              >
                <div className="text-center">
                  <div className="font-semibold">High Performance</div>
                  <div className="text-xs mt-0.5 opacity-90">
                    Business hosting for demanding sites
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Billing Toggle */}
          <div className="flex justify-center mb-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative inline-flex bg-gray-100 rounded-full p-1"
            >
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`relative px-8 py-3 rounded-full font-semibold text-sm transition-all duration-200 ${
                  billingCycle === 'monthly' 
                    ? 'bg-white text-gray-900 shadow-md' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`relative px-8 py-3 rounded-full font-semibold text-sm transition-all duration-200 flex items-center gap-2 ${
                  billingCycle === 'yearly' 
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Yearly
                {billingCycle === 'yearly' && maxSavings > 0 ? (
                  <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                    SAVE UP TO {maxSavings}%
                  </span>
                ) : null}
              </button>
            </motion.div>
          </div>

          {/* Pricing Cards */}
          {loading ? (
            <PricingTableSkeleton columns={4} />
          ) : plans.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-600">Unable to load pricing. Please try again.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {plans.map((plan, index) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  onHoverStart={() => setHoveredPlan(plan.id)}
                  onHoverEnd={() => setHoveredPlan(null)}
                  className="relative group"
                >
                  {/* Glow effect for popular plan */}
                  {plan.recommended ? (
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-3xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
                  ) : null}

                  <div
                    className={`relative bg-white border-2 ${
                      plan.recommended ? 'border-blue-400 shadow-xl scale-105' : 'border-gray-200 hover:border-blue-300'
                    } rounded-2xl p-6 hover:shadow-lg transition-all duration-300 h-full flex flex-col`}
                  >
                    {/* Badge */}
                    {plan.badge ? (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg">
                          {plan.badge}
                        </div>
                      </div>
                    ) : null}

                    {/* Plan Header */}
                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-bold mb-2 text-gray-900">{plan.name}</h3>
                      <p className="text-gray-600 text-sm">{plan.description}</p>
                    </div>

                    {/* Price Section */}
                    <div className="text-center mb-6">
                      {/* Show discount info only when there's a real sale price from API */}
                      {billingCycle === 'yearly' && plan.originalPrice && plan.originalPrice > 0 && plan.savings && plan.savings > 0 ? (
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <p className="text-gray-400 line-through text-lg">
                            {formatPrice(plan.originalPrice, currency)}
                          </p>
                          <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold">
                            {plan.savings}% OFF
                          </span>
                        </div>
                      ) : null}
                      <div className="flex items-end justify-center gap-1">
                        <span className="text-2xl font-bold text-gray-700">{getCurrencySymbol(currency)}</span>
                        <span className="text-5xl font-black text-gray-900">
                          {Math.floor(billingCycle === 'yearly' ? plan.price.yearly : plan.price.monthly)}
                        </span>
                        <span className="text-2xl font-bold text-gray-700">
                          .{((billingCycle === 'yearly' ? plan.price.yearly : plan.price.monthly) % 1).toFixed(2).substring(2)}
                        </span>
                        <span className="text-gray-500 ml-2 mb-2">/mo</span>
                      </div>
                      {billingCycle === 'yearly' ? (
                        <p className="text-xs text-gray-500 mt-2">
                          Billed {formatPrice(plan.price.yearly * 12, currency)}/year
                        </p>
                      ) : null}
                    </div>

                    {/* Divider */}
                    <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-5"></div>

                    {/* Key Features */}
                    <div className="mb-6 flex-grow">
                      <ul className="space-y-2">
                        {/* Show key limits */}
                        {plan.limits?.websites ? (
                          <li className="flex items-center gap-2.5">
                            <div className="flex-shrink-0 p-1 bg-gray-50 rounded">
                              <Globe className="w-4 h-4 text-gray-600" />
                            </div>
                            <span className="text-sm text-gray-700">
                              {typeof plan.limits.websites === 'number' 
                                ? `${plan.limits.websites} website${plan.limits.websites > 1 ? 's' : ''}` 
                                : 'Unlimited websites'}
                            </span>
                          </li>
                        ) : null}
                        {plan.limits?.storage ? (
                          <li className="flex items-center gap-2.5">
                            <div className="flex-shrink-0 p-1 bg-gray-50 rounded">
                              <HardDrive className="w-4 h-4 text-gray-600" />
                            </div>
                            <span className="text-sm text-gray-700">{plan.limits.storage}</span>
                          </li>
                        ) : null}
                        {plan.limits?.databases ? (
                          <li className="flex items-center gap-2.5">
                            <div className="flex-shrink-0 p-1 bg-gray-50 rounded">
                              <Database className="w-4 h-4 text-gray-600" />
                            </div>
                            <span className="text-sm text-gray-700">
                              {typeof plan.limits.databases === 'number' 
                                ? `${plan.limits.databases} database${plan.limits.databases > 1 ? 's' : ''}` 
                                : 'Unlimited databases'}
                            </span>
                          </li>
                        ) : null}
                        {/* Show RAM and CPU for business plans */}
                        {activeTab === 'high' ? (
                          <>
                            {plan.limits?.ram ? (
                              <li className="flex items-center gap-2.5">
                                <div className="flex-shrink-0 p-1 bg-gray-50 rounded">
                                  <Zap className="w-4 h-4 text-gray-600" />
                                </div>
                                <span className="text-sm text-gray-700">{plan.limits.ram}</span>
                              </li>
                            ) : null}
                            {plan.limits?.cpu ? (
                              <li className="flex items-center gap-2.5">
                                <div className="flex-shrink-0 p-1 bg-gray-50 rounded">
                                  <Cpu className="w-4 h-4 text-gray-600" />
                                </div>
                                <span className="text-sm text-gray-700">{plan.limits.cpu}</span>
                              </li>
                            ) : null}
                          </>
                        ) : null}
                        {plan.limits?.ssl ? (
                          <li className="flex items-center gap-2.5">
                            <div className="flex-shrink-0 p-1 bg-green-50 rounded">
                              <Shield className="w-4 h-4 text-green-600" />
                            </div>
                            <span className="text-sm text-gray-700 font-medium">{plan.limits.ssl}</span>
                          </li>
                        ) : null}
                        {/* Common features */}
                        <li className="flex items-center gap-2.5">
                          <div className="flex-shrink-0 p-1 bg-blue-50 rounded">
                            <Settings className="w-4 h-4 text-blue-600" />
                          </div>
                          <span className="text-sm text-gray-700 font-medium">cPanel included</span>
                        </li>
                        <li className="flex items-center gap-2.5">
                          <div className="flex-shrink-0 p-1 bg-blue-50 rounded">
                            <Activity className="w-4 h-4 text-blue-600" />
                          </div>
                          <span className="text-sm text-gray-700 font-medium">99.9% uptime</span>
                        </li>
                      </ul>
                    </div>

                    {/* CTA Button */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAddToCart(plan)}
                      disabled={addingToCart === plan.id}
                      className={`w-full py-3 rounded-full font-bold text-base transition-all ${
                        plan.recommended
                          ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg hover:shadow-xl'
                          : 'bg-gray-100 text-gray-700 hover:bg-gradient-to-r hover:from-blue-600 hover:to-cyan-600 hover:text-white'
                      } ${addingToCart === plan.id ? 'opacity-75 cursor-not-allowed' : ''}`}
                    >
                      {addingToCart === plan.id ? (
                        <span className="flex items-center justify-center gap-2">
                          <LoadingSpinner size="sm" />
                          Adding...
                        </span>
                      ) : (
                        'Get Started Now'
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* What's Included Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mt-20"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Everything You Need to Succeed Online
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Every Web Hosting plan includes powerful features and reliable infrastructure to help your website thrive
              </p>
            </div>

            <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl border border-gray-200 shadow-xl p-8 lg:p-12 max-w-5xl mx-auto">
              <div className="grid md:grid-cols-2 gap-x-12 gap-y-6">
                {/* Core Features */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-4"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">99.9% Uptime Guarantee**</h4>
                    <p className="text-sm text-gray-600">We guarantee your site's uptime, so you don't miss customers.</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-4"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
                    <Settings className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Easy-to-Use cPanel</h4>
                    <p className="text-sm text-gray-600">Industry-standard control panel to install apps, manage backups and security.</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-4"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                    <Activity className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Unmetered Bandwidth</h4>
                    <p className="text-sm text-gray-600">Handle all the traffic your business generates without limits.</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-4"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <Save className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Automatic Daily Backups</h4>
                    <p className="text-sm text-gray-600">Recover your entire hosting account from the previous day.</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-4"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                    <Globe className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Global Data Centers</h4>
                    <p className="text-sm text-gray-600">Enjoy faster page loads with data centers in North America and Europe.</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-4"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <Lock className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Free SSL Certificate</h4>
                    <p className="text-sm text-gray-600">Keep your website secure with HTTPS encryption included free.</p>
                  </div>
                </motion.div>
              </div>

              {/* Additional Features Grid */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                viewport={{ once: true }}
                className="mt-8 pt-8 border-t border-gray-200"
              >
                <h4 className="font-semibold text-gray-900 mb-4">Also Included in All Plans:</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    '24/7 Expert Support',
                    'One-Click App Installer',
                    'Email Accounts',
                    'FTP Access',
                    'Database Support',
                    'Free Domain (with annual plan)'
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            <p className="text-xs text-gray-500 text-center mt-8">
              ** 99.9% uptime guarantee applies to paid plans. See terms for details.
            </p>
          </motion.div>

          {/* Why Flickmax Web Hosting Section - Modern Alternating Layout */}
          <section className="mt-24 overflow-hidden">
            <div className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <span className="inline-block px-4 py-2 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 rounded-full text-sm font-semibold mb-4">
                  WHY CHOOSE US
                </span>
                <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                  Why Flickmax Web Hosting?
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Experience hosting that goes beyond expectations with performance, flexibility, and peace of mind
                </p>
              </motion.div>
            </div>

            {/* Feature 1: Our web hosting delivers - Left Image, Right Content */}
            <div className="relative py-16 lg:py-20">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                  {/* Left Side - Icon */}
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="relative"
                  >
                    <div className="relative bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl p-8 lg:p-12 flex items-center justify-center">
                      <div className="absolute -top-6 -left-6 w-24 h-24 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl opacity-10 blur-2xl"></div>
                      <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-full opacity-10 blur-2xl"></div>
                      
                      <div className="relative">
                        <div className="w-32 h-32 lg:w-40 lg:h-40 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-3xl flex items-center justify-center shadow-2xl">
                          <Shield className="w-16 h-16 lg:w-20 lg:h-20 text-white" />
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                          <Check className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Right Side - Content */}
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    viewport={{ once: true }}
                  >
                    <div className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-full mb-6">
                      <Zap className="w-4 h-4 text-blue-600 mr-2" />
                      <span className="text-sm font-semibold text-blue-700">Performance & Security</span>
                    </div>
                    
                    <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                      Our web hosting delivers
                    </h3>
                    
                    <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                      You get speedier page-load times, tools to help grow your business, and essential security measures to build trust and help protect user data. Plus, you get peace of mind with a money-back guarantee.
                    </p>
                    
                    <ul className="space-y-4 mb-8">
                      <li className="flex items-start">
                        <Check className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">Lightning-fast SSD storage for optimal performance</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">Advanced DDoS protection and security monitoring</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">99.9% uptime guarantee with redundant infrastructure</span>
                      </li>
                    </ul>
                    
                    <button className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 shadow-lg hover:shadow-xl group">
                      Learn More
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
                    </button>
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Feature 2: Flexible Resources - Right Image, Left Content */}
            <div className="relative py-16 lg:py-20 bg-gradient-to-br from-gray-50 to-white">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                  {/* Left Side - Content */}
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="lg:order-1 order-2"
                  >
                    <div className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full mb-6">
                      <Settings className="w-4 h-4 text-purple-600 mr-2" />
                      <span className="text-sm font-semibold text-purple-700">Scalable Resources</span>
                    </div>
                    
                    <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                      Flexible resources help you grow
                    </h3>
                    
                    <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                      Through a robust dashboard, grow your business with integrated site optimization tools like CPU, memory, entry processes, I/O — all yours and one click away.
                    </p>
                    
                    <div className="grid grid-cols-2 gap-6 mb-8">
                      <div className="bg-white p-4 rounded-xl border border-gray-200">
                        <Cpu className="w-8 h-8 text-blue-600 mb-2" />
                        <h4 className="font-semibold text-gray-900">CPU Power</h4>
                        <p className="text-sm text-gray-600 mt-1">Scale processing power on demand</p>
                      </div>
                      <div className="bg-white p-4 rounded-xl border border-gray-200">
                        <Database className="w-8 h-8 text-cyan-600 mb-2" />
                        <h4 className="font-semibold text-gray-900">Storage</h4>
                        <p className="text-sm text-gray-600 mt-1">Expand storage as you grow</p>
                      </div>
                      <div className="bg-white p-4 rounded-xl border border-gray-200">
                        <Activity className="w-8 h-8 text-purple-600 mb-2" />
                        <h4 className="font-semibold text-gray-900">Bandwidth</h4>
                        <p className="text-sm text-gray-600 mt-1">Unlimited data transfer</p>
                      </div>
                      <div className="bg-white p-4 rounded-xl border border-gray-200">
                        <Gauge className="w-8 h-8 text-green-600 mb-2" />
                        <h4 className="font-semibold text-gray-900">Performance</h4>
                        <p className="text-sm text-gray-600 mt-1">Real-time monitoring</p>
                      </div>
                    </div>
                    
                    <button className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 shadow-lg hover:shadow-xl group">
                      Explore Features
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
                    </button>
                  </motion.div>

                  {/* Right Side - Icon */}
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="relative lg:order-2 order-1"
                  >
                    <div className="relative bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-8 lg:p-12 flex items-center justify-center">
                      <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl opacity-10 blur-2xl"></div>
                      <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-pink-600 to-purple-600 rounded-full opacity-10 blur-2xl"></div>
                      
                      <div className="relative">
                        <div className="w-32 h-32 lg:w-40 lg:h-40 bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl flex items-center justify-center shadow-2xl">
                          <TrendingUp className="w-16 h-16 lg:w-20 lg:h-20 text-white" />
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                          <Settings className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Feature 3: Money Back Guarantee - Left Image, Right Content */}
            <div className="relative py-16 lg:py-20">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                  {/* Left Side - Icon */}
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="relative"
                  >
                    <div className="relative bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-8 lg:p-12 flex items-center justify-center">
                      <div className="absolute -top-6 -left-6 w-24 h-24 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl opacity-10 blur-2xl"></div>
                      <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-br from-emerald-600 to-green-600 rounded-full opacity-10 blur-2xl"></div>
                      
                      <div className="relative">
                        <div className="w-32 h-32 lg:w-40 lg:h-40 bg-gradient-to-br from-green-600 to-emerald-600 rounded-3xl flex items-center justify-center shadow-2xl">
                          <Award className="w-16 h-16 lg:w-20 lg:h-20 text-white" />
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                          <span className="text-white font-bold text-sm">30</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Right Side - Content */}
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    viewport={{ once: true }}
                  >
                    <div className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full mb-6">
                      <Shield className="w-4 h-4 text-green-600 mr-2" />
                      <span className="text-sm font-semibold text-green-700">Risk-Free Guarantee</span>
                    </div>
                    
                    <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                      We guarantee it. Or your money back
                    </h3>
                    
                    <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                      As in, we offer a 30-day money-back guarantee.+ So, if you're not satisfied with our hosting, you get your money back. It's that simple.
                    </p>
                    
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 mb-8">
                      <h4 className="font-semibold text-gray-900 mb-3">Our Promise to You:</h4>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <Check className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                          <span className="text-gray-700">Full refund within 30 days, no questions asked</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                          <span className="text-gray-700">Easy cancellation process through your account</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                          <span className="text-gray-700">Prorated refunds available after 30 days</span>
                        </li>
                      </ul>
                    </div>
                    
                    <button className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl group">
                      View Guarantee
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
                    </button>
                    
                    <p className="text-xs text-gray-500 mt-4">
                      + 30-day money-back guarantee applies to new hosting purchases only.
                    </p>
                  </motion.div>
                </div>
              </div>
            </div>
          </section>

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
                Get enterprise-grade hosting with custom resources, dedicated support, and uptime guarantees.
              </p>
              <a 
                href="/contact" 
                className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold group"
              >
                Talk to sales team
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
            <p className="text-xs text-gray-500 text-center mt-6">
              All prices shown in {currency}. Prices exclude applicable taxes. Features subject to availability.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Feature Comparison Modal */}
      <AnimatePresence>
        {showFeatureComparison ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center p-4"
            onClick={() => setShowFeatureComparison(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-6xl w-full max-h-[90vh] bg-white rounded-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Feature Comparison</h2>
                <button
                  onClick={() => setShowFeatureComparison(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>
              <div className="p-6 overflow-y-auto">
                <div className="grid grid-cols-2 gap-8">
                  {/* Standard Performance */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Standard Performance (cPanel)</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                        <div>
                          <p className="font-medium text-gray-900">Ideal for simple websites</p>
                          <p className="text-sm text-gray-600">Perfect for blogs, portfolios, small business sites</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                        <div>
                          <p className="font-medium text-gray-900">cPanel control panel</p>
                          <p className="text-sm text-gray-600">Industry-standard hosting management</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                        <div>
                          <p className="font-medium text-gray-900">Shared resources</p>
                          <p className="text-sm text-gray-600">Cost-effective solution for low-traffic sites</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                        <div>
                          <p className="font-medium text-gray-900">Free SSL certificate</p>
                          <p className="text-sm text-gray-600">Secure your website with HTTPS</p>
                        </div>
                      </li>
                    </ul>
                  </div>

                  {/* High Performance */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">High Performance (Business)</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5" />
                        <div>
                          <p className="font-medium text-gray-900">Ideal for demanding sites</p>
                          <p className="text-sm text-gray-600">E-commerce, high-traffic, resource-intensive apps</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5" />
                        <div>
                          <p className="font-medium text-gray-900">Dedicated resources</p>
                          <p className="text-sm text-gray-600">Guaranteed RAM, CPU, and storage</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5" />
                        <div>
                          <p className="font-medium text-gray-900">NVMe SSD storage</p>
                          <p className="text-sm text-gray-600">Up to 10x faster than traditional hosting</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5" />
                        <div>
                          <p className="font-medium text-gray-900">Free dedicated IP</p>
                          <p className="text-sm text-gray-600">Improve email deliverability and SEO</p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}