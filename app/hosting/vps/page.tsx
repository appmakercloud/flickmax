'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useInView, useScroll, useTransform, AnimatePresence, useMotionValue, useSpring } from 'framer-motion'
import { 
  Server,
  Cpu,
  HardDrive,
  Shield,
  Globe,
  Check,
  ChevronLeft,
  ChevronRight,
  Zap,
  Clock,
  HeadphonesIcon,
  Award,
  Star,
  ArrowRight,
  Loader2,
  Database,
  Network,
  Lock,
  RefreshCw,
  Terminal,
  Cloud,
  Gauge,
  Layers,
  Settings,
  TrendingUp,
  CheckCircle2,
  Infinity,
  Wifi,
  Monitor,
  Code,
  Package,
  Users,
  BarChart3,
  Activity,
  GitBranch,
  Key,
  Upload,
  Download,
  AlertCircle,
  Sparkles,
  Rocket,
  LucideIcon
} from 'lucide-react'
import { useCountry } from '@/contexts/CountryContext'
import { useCart } from '@/contexts/CartContext'
import toast from 'react-hot-toast'
import Image from 'next/image'

// Types
interface VPSPlan {
  id: string
  name: string
  ram: string
  cpu: string
  storage: string
  bandwidth: string
  price: {
    monthly: number
    yearly: number
  }
  features: string[]
  popular?: boolean
  savings?: number
}

interface Feature {
  icon: LucideIcon
  title: string
  description: string
}

interface Testimonial {
  id: number
  name: string
  role: string
  company: string
  content: string
  rating: number
  avatar: string
}

// Animated Counter Component
const AnimatedCounter = ({ end, duration = 2, suffix = '' }: { end: number; duration?: number; suffix?: string }) => {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (inView) {
      let startTime: number | null = null
      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime
        const progress = Math.min((currentTime - startTime) / (duration * 1000), 1)
        
        setCount(Math.floor(progress * end))
        
        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }
      requestAnimationFrame(animate)
    }
  }, [inView, end, duration])

  return (
    <span ref={ref}>
      {count}{suffix}
    </span>
  )
}

// Parallax Component
const ParallaxSection = ({ children, offset = 50 }: { children: React.ReactNode; offset?: number }) => {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })
  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset])

  return (
    <motion.div ref={ref} style={{ y }}>
      {children}
    </motion.div>
  )
}

// Mouse Follow Card Effect
const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', updateMousePosition)
    return () => window.removeEventListener('mousemove', updateMousePosition)
  }, [])

  return mousePosition
}

export default function VPSHostingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly')
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const { currency } = useCountry()
  const { addProductToCart } = useCart()
  const mousePosition = useMousePosition()

  // Scroll progress for gradient
  const { scrollYProgress } = useScroll()
  const gradientY = useTransform(scrollYProgress, [0, 1], [0, 100])

  // VPS Plans
  const vpsPlans: VPSPlan[] = [
    {
      id: 'vps-starter',
      name: 'VPS Starter',
      ram: '2GB',
      cpu: '1 vCPU',
      storage: '50GB NVMe',
      bandwidth: 'Unlimited',
      price: {
        monthly: 12.99,
        yearly: 129.90
      },
      features: [
        'KVM Virtualization',
        'Full Root Access',
        'Free SSL (1st Year)',
        '1 Dedicated IP',
        'Weekly Backups',
        'DDoS Protection',
        'Linux OS Options'
      ],
      savings: 17
    },
    {
      id: 'vps-business',
      name: 'VPS Business',
      ram: '8GB',
      cpu: '4 vCPU',
      storage: '200GB NVMe',
      bandwidth: 'Unlimited',
      price: {
        monthly: 39.99,
        yearly: 383.90
      },
      features: [
        'Everything in Starter',
        'cPanel/WHM Included',
        '2 Dedicated IPs',
        'Daily Backups',
        'Priority Support',
        'Windows OS Available',
        'Free Migration'
      ],
      popular: true,
      savings: 20
    },
    {
      id: 'vps-pro',
      name: 'VPS Professional',
      ram: '16GB',
      cpu: '8 vCPU',
      storage: '400GB NVMe',
      bandwidth: 'Unlimited',
      price: {
        monthly: 79.99,
        yearly: 719.90
      },
      features: [
        'Everything in Business',
        'Plesk Available',
        '4 Dedicated IPs',
        'Real-time Backups',
        'Advanced Monitoring',
        'Load Balancer Ready',
        'Custom Firewall Rules'
      ],
      savings: 25
    },
    {
      id: 'vps-enterprise',
      name: 'VPS Enterprise',
      ram: '32GB',
      cpu: '16 vCPU',
      storage: '800GB NVMe',
      bandwidth: 'Unlimited',
      price: {
        monthly: 159.99,
        yearly: 1439.90
      },
      features: [
        'Everything in Professional',
        'Dedicated Account Manager',
        '8 Dedicated IPs',
        'Continuous Backups',
        'Custom SLA',
        'Private Network',
        'Managed Services Available'
      ],
      savings: 25
    }
  ]

  // Features
  const features: Feature[] = [
    {
      icon: Server,
      title: 'KVM Virtualization',
      description: 'Full kernel-level virtualization for complete isolation and security'
    },
    {
      icon: Zap,
      title: 'NVMe SSD Storage',
      description: '10x faster than traditional SSDs with ultra-low latency'
    },
    {
      icon: Shield,
      title: 'DDoS Protection',
      description: 'Enterprise-grade protection against all types of attacks'
    },
    {
      icon: Globe,
      title: 'Global Network',
      description: 'Multiple data center locations for optimal performance'
    },
    {
      icon: RefreshCw,
      title: 'Automated Backups',
      description: 'Daily automated backups with one-click restoration'
    },
    {
      icon: HeadphonesIcon,
      title: '24/7 Support',
      description: 'Expert technical support available round the clock'
    }
  ]

  // Testimonials
  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: 'Alex Thompson',
      role: 'DevOps Engineer',
      company: 'TechCorp',
      content: 'The performance is incredible! Our applications run 3x faster compared to our previous provider. The NVMe storage makes a huge difference.',
      rating: 5,
      avatar: 'https://i.pravatar.cc/150?img=1'
    },
    {
      id: 2,
      name: 'Sarah Mitchell',
      role: 'CTO',
      company: 'StartupHub',
      content: 'Exceptional uptime and support. We\'ve been with FlickMax for 2 years and haven\'t experienced a single major issue. Highly recommended!',
      rating: 5,
      avatar: 'https://i.pravatar.cc/150?img=2'
    },
    {
      id: 3,
      name: 'David Chen',
      role: 'System Administrator',
      company: 'E-Commerce Plus',
      content: 'The control panel options and one-click installations save us hours of setup time. Migration was seamless with their free service.',
      rating: 5,
      avatar: 'https://i.pravatar.cc/150?img=3'
    }
  ]

  const handleAddToCart = async (plan: VPSPlan) => {
    setLoading(true)
    setSelectedPlan(plan.id)
    try {
      await addProductToCart(
        plan.id,
        billingCycle === 'yearly' ? 12 : 1,
        'MONTH'
      )
      toast.success(`${plan.name} added to cart!`)
    } catch (error) {
      toast.error('Failed to add to cart')
    } finally {
      setLoading(false)
      setSelectedPlan(null)
    }
  }

  const formatPrice = (price: number) => {
    const symbols: { [key: string]: string } = {
      USD: '$',
      INR: '₹',
      EUR: '€',
      GBP: '£'
    }
    const rates: { [key: string]: number } = {
      USD: 1,
      INR: 83,
      EUR: 0.92,
      GBP: 0.79
    }
    
    const convertedPrice = price * (rates[currency] || 1)
    const symbol = symbols[currency] || '$'
    
    return `${symbol}${convertedPrice.toFixed(2)}`
  }

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [testimonials.length])

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Gradient Background */}
      <motion.div 
        className="fixed inset-0 -z-10"
        style={{
          background: `linear-gradient(135deg, 
            rgba(59, 130, 246, 0.1) 0%, 
            rgba(6, 182, 212, 0.1) ${gradientY}%, 
            rgba(59, 130, 246, 0.05) 100%)`
        }}
      />

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 opacity-90" />
          
          {/* Floating Orbs */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white/10 backdrop-blur-xl"
              style={{
                width: Math.random() * 300 + 100,
                height: Math.random() * 300 + 100,
              }}
              animate={{
                x: [0, Math.random() * 100 - 50],
                y: [0, Math.random() * 100 - 50],
              }}
              transition={{
                duration: Math.random() * 20 + 10,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * 500,
              }}
            />
          ))}
        </div>

        <div className="relative container mx-auto px-4">
          <motion.div 
            className="max-w-4xl mx-auto text-center text-white"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <motion.div 
              className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md rounded-full px-4 py-2 mb-6"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Launch Special: 25% OFF First Month</span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-cyan-200">
              Lightning-Fast VPS Hosting
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 text-white/90 leading-relaxed">
              KVM virtualization with full root access, NVMe storage,
              <br />and 99.9% uptime guarantee
            </p>

            <div className="flex flex-wrap gap-4 justify-center mb-12">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 bg-white text-blue-600 rounded-full font-semibold shadow-2xl hover:shadow-white/20 transition-all"
              >
                View Plans <ArrowRight className="inline ml-2 w-5 h-5" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white/10 backdrop-blur-md text-white rounded-full font-semibold border border-white/20 hover:bg-white/20 transition-all"
              >
                Free Trial
              </motion.button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { label: 'Uptime', value: 99.9, suffix: '%' },
                { label: 'Servers', value: 50000, suffix: '+' },
                { label: 'Customers', value: 100000, suffix: '+' },
                { label: 'Support', value: 24, suffix: '/7' }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl md:text-4xl font-bold">
                    <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-white/70">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section with Parallax */}
      <section className="py-20 bg-white relative">
        <ParallaxSection>
          <div className="container mx-auto px-4">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                Enterprise-Grade Features
              </h2>
              <p className="text-xl text-gray-600">Everything you need for high-performance hosting</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10, transition: { type: "spring" } }}
                  className="group relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                  
                  <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-gray-100">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                      className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white mb-6"
                    >
                      <feature.icon className="w-8 h-8" />
                    </motion.div>
                    
                    <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </ParallaxSection>
      </section>

      {/* Pricing Section with Glassmorphism */}
      <section id="pricing" className="py-20 relative bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Choose Your Perfect VPS Plan
            </h2>
            <p className="text-xl text-gray-600 mb-8">Scale as you grow with flexible resources</p>

            {/* Billing Toggle */}
            <div className="inline-flex bg-white/50 backdrop-blur-md rounded-full p-1 shadow-lg">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-6 py-3 rounded-full font-medium transition-all ${
                  billingCycle === 'monthly'
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-6 py-3 rounded-full font-medium transition-all ${
                  billingCycle === 'yearly'
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Yearly
                <span className="ml-2 text-xs bg-green-500 text-white px-2 py-1 rounded-full">
                  Save up to 25%
                </span>
              </button>
            </div>
          </motion.div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {vpsPlans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="relative group"
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                    <motion.div 
                      className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      MOST POPULAR
                    </motion.div>
                  </div>
                )}

                {/* Card */}
                <div className={`relative bg-white/80 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden border ${
                  plan.popular ? 'border-blue-500 shadow-blue-500/20' : 'border-gray-200'
                } hover:shadow-2xl transition-all duration-300`}>
                  
                  {/* Gradient Overlay on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="relative p-8">
                    {/* Plan Name */}
                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                    
                    {/* Specs */}
                    <div className="space-y-2 mb-6 pb-6 border-b">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Cpu className="w-4 h-4" />
                        <span>{plan.cpu}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Server className="w-4 h-4" />
                        <span>{plan.ram} RAM</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <HardDrive className="w-4 h-4" />
                        <span>{plan.storage}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Wifi className="w-4 h-4" />
                        <span>{plan.bandwidth}</span>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="mb-6">
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                          {formatPrice(
                            billingCycle === 'yearly' 
                              ? plan.price.yearly / 12
                              : plan.price.monthly
                          )}
                        </span>
                        <span className="text-gray-600">/month</span>
                      </div>
                      {billingCycle === 'yearly' && plan.savings && (
                        <div className="mt-2 text-sm text-green-600 font-medium">
                          Save {plan.savings}% annually
                        </div>
                      )}
                    </div>

                    {/* Features */}
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA Button */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAddToCart(plan)}
                      disabled={loading && selectedPlan === plan.id}
                      className={`w-full py-4 rounded-xl font-semibold transition-all ${
                        plan.popular
                          ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:shadow-lg'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {loading && selectedPlan === plan.id ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Adding...
                        </span>
                      ) : (
                        'Get Started'
                      )}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Performance Metrics Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold mb-6">
                Real-Time Performance Monitoring
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Monitor your VPS performance with our advanced dashboard. Track CPU, RAM, storage, 
                and network usage in real-time with instant alerts.
              </p>

              <div className="space-y-6">
                {[
                  { label: 'CPU Performance', value: 98 },
                  { label: 'Memory Optimization', value: 95 },
                  { label: 'Network Speed', value: 99 },
                  { label: 'Storage Efficiency', value: 97 }
                ].map((metric, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">{metric.label}</span>
                      <span className="text-blue-600 font-semibold">{metric.value}%</span>
                    </div>
                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${metric.value}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: index * 0.2 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Live Metrics Dashboard */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold">Server Status</h3>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-sm text-green-600 font-medium">Live</span>
                  </div>
                </div>

                {/* Animated Metrics */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl">
                    <Activity className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-600">
                      <AnimatedCounter end={42} suffix="%" />
                    </div>
                    <div className="text-sm text-gray-600">CPU Usage</div>
                  </div>
                  
                  <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
                    <Server className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-600">
                      <AnimatedCounter end={3.2} suffix="GB" />
                    </div>
                    <div className="text-sm text-gray-600">RAM Used</div>
                  </div>
                  
                  <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
                    <HardDrive className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-purple-600">
                      <AnimatedCounter end={124} suffix="GB" />
                    </div>
                    <div className="text-sm text-gray-600">Storage Used</div>
                  </div>
                  
                  <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl">
                    <Wifi className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-orange-600">
                      <AnimatedCounter end={856} suffix="Mbps" />
                    </div>
                    <div className="text-sm text-gray-600">Network Speed</div>
                  </div>
                </div>

                {/* Uptime Chart */}
                <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Uptime Last 30 Days</span>
                    <span className="text-sm text-green-600 font-semibold">99.99%</span>
                  </div>
                  <div className="flex gap-0.5">
                    {[...Array(30)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="flex-1 h-8 bg-green-500 rounded-sm"
                        initial={{ scaleY: 0 }}
                        whileInView={{ scaleY: Math.random() * 0.3 + 0.7 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.02 }}
                        style={{ originY: 1 }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Carousel */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-4">What Our Customers Say</h2>
            <p className="text-xl text-gray-600">Join thousands of satisfied VPS hosting customers</p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Testimonial Cards */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTestimonial}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5 }}
                  className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 md:p-12"
                >
                  <div className="flex flex-col md:flex-row gap-8 items-center">
                    <div className="flex-shrink-0">
                      <div className="relative">
                        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
                          <Image
                            src={testimonials[currentTestimonial].avatar}
                            alt={testimonials[currentTestimonial].name}
                            width={96}
                            height={96}
                            className="object-cover"
                          />
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white rounded-full p-2">
                          <Award className="w-5 h-5" />
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 text-center md:text-left">
                      <div className="flex gap-1 justify-center md:justify-start mb-4">
                        {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      
                      <p className="text-lg text-gray-700 mb-6 italic">
                        "{testimonials[currentTestimonial].content}"
                      </p>
                      
                      <div>
                        <div className="font-semibold text-lg">
                          {testimonials[currentTestimonial].name}
                        </div>
                        <div className="text-gray-600">
                          {testimonials[currentTestimonial].role} at {testimonials[currentTestimonial].company}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation */}
              <div className="flex justify-center gap-4 mt-8">
                <button
                  onClick={() => setCurrentTestimonial(
                    (prev) => (prev - 1 + testimonials.length) % testimonials.length
                  )}
                  className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                <div className="flex gap-2 items-center">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentTestimonial(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentTestimonial
                          ? 'w-8 bg-gradient-to-r from-blue-600 to-cyan-500'
                          : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                    />
                  ))}
                </div>
                
                <button
                  onClick={() => setCurrentTestimonial(
                    (prev) => (prev + 1) % testimonials.length
                  )}
                  className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Features Grid */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-4">Everything You Need & More</h2>
            <p className="text-xl text-gray-600">Comprehensive features included with every VPS plan</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              { icon: Key, label: 'Full Root Access' },
              { icon: Lock, label: 'Free SSL Certificate' },
              { icon: Infinity, label: 'Unlimited Bandwidth' },
              { icon: Clock, label: '24/7 Monitoring' },
              { icon: Shield, label: 'DDoS Protection' },
              { icon: Database, label: 'Automated Backups' },
              { icon: Globe, label: 'Choice of OS' },
              { icon: Settings, label: 'Control Panels' },
              { icon: Upload, label: 'Free Migration' },
              { icon: Terminal, label: 'SSH Access' },
              { icon: Package, label: 'One-Click Apps' },
              { icon: Users, label: 'Expert Support' }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-all"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center text-white mb-3">
                  <item.icon className="w-6 h-6" />
                </div>
                <span className="text-sm font-medium text-gray-700">{item.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500" />
        
        {/* Animated Background Pattern */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-64 h-64 bg-white/5 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.1, 0.2, 0.1],
              }}
              transition={{
                duration: Math.random() * 5 + 5,
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
            />
          ))}
        </div>

        <div className="relative container mx-auto px-4 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Supercharge Your Projects?
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Get started with powerful VPS hosting today. 30-day money-back guarantee.
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 bg-white text-blue-600 rounded-full font-semibold shadow-2xl hover:shadow-white/20 transition-all"
              >
                Get Started Now <Rocket className="inline ml-2 w-5 h-5" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white/10 backdrop-blur-md text-white rounded-full font-semibold border border-white/20 hover:bg-white/20 transition-all"
              >
                Contact Sales
              </motion.button>
            </div>

            {/* Trust Badges */}
            <div className="mt-12 flex flex-wrap justify-center gap-8 text-white/80">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                <span>30-Day Money Back</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                <span>99.9% Uptime SLA</span>
              </div>
              <div className="flex items-center gap-2">
                <HeadphonesIcon className="w-5 h-5" />
                <span>24/7 Expert Support</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}