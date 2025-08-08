'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { 
  Server,
  Cpu,
  Globe,
  Shield,
  Check,
  Star,
  ChevronDown,
  ChevronUp,
  Rocket,
  CheckCircle,
  Infinity,
  Terminal,
  Cloud,
  Settings,
  BarChart3,
  Network,
  MemoryStick,
  HardDriveIcon,
  Zap,
  Lock,
  Gauge,
  HeadphonesIcon,
  Clock,
  Database,
  Activity,
  Layers,
  Award,
  TrendingUp,
  Users,
  Code,
  Monitor,
  Smartphone,
  ArrowRight,
  Loader2,
  ShieldCheck,
  CloudUpload,
  FileText,
  MessageCircle,
  DollarSign,
  RefreshCw,
  GitBranch,
  Package,
  Boxes,
  CircuitBoard,
  Wifi,
  HardDrive
} from 'lucide-react'
import { useCountry } from '@/contexts/CountryContext'
import { useCart } from '@/contexts/CartContext'
import toast from 'react-hot-toast'

interface VPSPlan {
  productId: number
  name: string
  monthlyPrice: number
  yearlyPrice: number
  originalPrice?: number
  features: string[]
  isPopular?: boolean
  cpu: string
  ram: string
  storage: string
  bandwidth: string
  ipAddresses: string
  specs: {
    cores: number
    ram: string
    storage: string
    bandwidth: string
    ipv4: number
    backups: string
    support: string
  }
  highlighted?: string[]
}

// High-tech server animation component
const ServerAnimation = () => {
  const [activeNodes, setActiveNodes] = useState<number[]>([])
  
  useEffect(() => {
    try {
      const interval = setInterval(() => {
        const newNodes = Array.from({ length: 3 }, () => Math.floor(Math.random() * 12))
        setActiveNodes(newNodes)
      }, 2000)
      return () => clearInterval(interval)
    } catch (error) {
      console.error('Animation error:', error)
    }
  }, [])

  return (
    <div className="relative w-full h-full">
      {/* 3D Server Rack */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative transform-gpu" style={{ perspective: '1000px' }}>
          {/* Server Stack */}
          <motion.div
            animate={{ 
              rotateY: [0, 10, 0, -10, 0],
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="relative"
          >
            {[0, 1, 2].map((serverIndex) => (
              <motion.div
                key={serverIndex}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: serverIndex * 0.2 }}
                className="relative mb-2"
              >
                <div className="relative bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 rounded-lg p-4 shadow-2xl"
                     style={{ 
                       transform: `translateZ(${serverIndex * 30}px)`,
                       boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
                     }}>
                  {/* Server Front Panel */}
                  <div className="flex items-center gap-3">
                    {/* Drive Bays */}
                    <div className="grid grid-cols-4 gap-1">
                      {Array.from({ length: 12 }).map((_, i) => (
                        <motion.div
                          key={i}
                          animate={{
                            backgroundColor: activeNodes.includes(i) 
                              ? ['#3B82F6', '#06B6D4', '#3B82F6']
                              : '#1F2937',
                            boxShadow: activeNodes.includes(i)
                              ? '0 0 10px rgba(6, 182, 212, 0.5)'
                              : 'none'
                          }}
                          transition={{ duration: 0.5 }}
                          className="w-8 h-2 rounded-sm border border-gray-600"
                        />
                      ))}
                    </div>
                    
                    {/* Status LEDs */}
                    <div className="flex gap-2">
                      <motion.div
                        animate={{ 
                          backgroundColor: ['#10B981', '#34D399', '#10B981'],
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-2 h-2 rounded-full"
                      />
                      <motion.div
                        animate={{ 
                          backgroundColor: ['#3B82F6', '#60A5FA', '#3B82F6'],
                        }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="w-2 h-2 rounded-full"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Network Connections */}
          <svg className="absolute -inset-20 w-[calc(100%+10rem)] h-[calc(100%+10rem)]" style={{ zIndex: -1 }}>
            {Array.from({ length: 6 }).map((_, i) => {
              const angle = (i * 60) * Math.PI / 180
              const x1 = 150 + Math.cos(angle) * 100
              const y1 = 100 + Math.sin(angle) * 100
              const x2 = 150
              const y2 = 100
              
              return (
                <motion.line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="url(#gradient)"
                  strokeWidth="2"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ 
                    pathLength: [0, 1, 1, 0],
                    opacity: [0, 1, 1, 0]
                  }}
                  transition={{
                    duration: 3,
                    delay: i * 0.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              )
            })}
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#06B6D4" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full"
            initial={{
              x: Math.random() * 400,
              y: Math.random() * 400,
              opacity: 0
            }}
            animate={{
              x: Math.random() * 400,
              y: Math.random() * 400,
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              delay: Math.random() * 5
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default function VPSHostingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly')
  const [expandedPlan, setExpandedPlan] = useState<number | null>(null)
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const { currency } = useCountry()
  const { addProductToCart } = useCart()
  const heroRef = useRef(null)
  const heroInView = useInView(heroRef, { once: true })

  // VPS Plans with GoDaddy-style structure
  const vpsPlans: VPSPlan[] = [
    {
      productId: 1,
      name: "1 vCPU / 1GB RAM",
      monthlyPrice: 8.99,
      yearlyPrice: 4.99 * 12,
      originalPrice: 8.99 * 12,
      cpu: "1 vCPU",
      ram: "1 GB",
      storage: "40 GB NVMe SSD",
      bandwidth: "Unmetered",
      ipAddresses: "1 IPv4 & IPv6",
      specs: {
        cores: 1,
        ram: "1 GB RAM",
        storage: "40 GB NVMe SSD",
        bandwidth: "Unmetered",
        ipv4: 1,
        backups: "Snapshot",
        support: "Standard"
      },
      features: [
        "1 vCPU Core",
        "1 GB RAM",
        "40 GB NVMe SSD Storage",
        "Unmetered Bandwidth",
        "1 IPv4 & IPv6 Address",
        "Free Snapshot Backups",
        "Root Access",
        "99.9% Uptime SLA"
      ],
      highlighted: ["40 GB NVMe SSD Storage", "Free Snapshot Backups"]
    },
    {
      productId: 2,
      name: "2 vCPU / 2GB RAM",
      monthlyPrice: 17.99,
      yearlyPrice: 9.99 * 12,
      originalPrice: 17.99 * 12,
      cpu: "2 vCPU",
      ram: "2 GB",
      storage: "100 GB NVMe SSD",
      bandwidth: "Unmetered",
      ipAddresses: "1 IPv4 & IPv6",
      isPopular: true,
      specs: {
        cores: 2,
        ram: "2 GB RAM",
        storage: "100 GB NVMe SSD",
        bandwidth: "Unmetered",
        ipv4: 1,
        backups: "Snapshot",
        support: "Standard"
      },
      features: [
        "2 vCPU Cores",
        "2 GB RAM",
        "100 GB NVMe SSD Storage",
        "Unmetered Bandwidth",
        "1 IPv4 & IPv6 Address",
        "Free Snapshot Backups",
        "Root Access",
        "99.9% Uptime SLA",
        "DDoS Protection"
      ],
      highlighted: ["100 GB NVMe SSD Storage", "DDoS Protection"]
    },
    {
      productId: 3,
      name: "4 vCPU / 4GB RAM",
      monthlyPrice: 34.99,
      yearlyPrice: 19.99 * 12,
      originalPrice: 34.99 * 12,
      cpu: "4 vCPU",
      ram: "4 GB",
      storage: "200 GB NVMe SSD",
      bandwidth: "Unmetered",
      ipAddresses: "2 IPv4 & IPv6",
      specs: {
        cores: 4,
        ram: "4 GB RAM",
        storage: "200 GB NVMe SSD",
        bandwidth: "Unmetered",
        ipv4: 2,
        backups: "Automated",
        support: "Priority"
      },
      features: [
        "4 vCPU Cores",
        "4 GB RAM",
        "200 GB NVMe SSD Storage",
        "Unmetered Bandwidth",
        "2 IPv4 & IPv6 Addresses",
        "Automated Backups",
        "Root Access",
        "99.9% Uptime SLA",
        "Enhanced DDoS Protection",
        "Priority Support"
      ],
      highlighted: ["2 IPv4 & IPv6 Addresses", "Automated Backups", "Priority Support"]
    },
    {
      productId: 4,
      name: "4 vCPU / 8GB RAM",
      monthlyPrice: 44.99,
      yearlyPrice: 29.99 * 12,
      originalPrice: 44.99 * 12,
      cpu: "4 vCPU",
      ram: "8 GB",
      storage: "400 GB NVMe SSD",
      bandwidth: "Unmetered",
      ipAddresses: "3 IPv4 & IPv6",
      specs: {
        cores: 4,
        ram: "8 GB RAM",
        storage: "400 GB NVMe SSD",
        bandwidth: "Unmetered",
        ipv4: 3,
        backups: "Automated",
        support: "Priority"
      },
      features: [
        "4 vCPU Cores",
        "8 GB RAM",
        "400 GB NVMe SSD Storage",
        "Unmetered Bandwidth",
        "3 IPv4 & IPv6 Addresses",
        "Automated Backups",
        "Root Access",
        "99.95% Uptime SLA",
        "Advanced DDoS Protection",
        "Priority Support",
        "Free SSL Certificate"
      ],
      highlighted: ["400 GB NVMe SSD Storage", "3 IPv4 & IPv6 Addresses", "99.95% Uptime SLA"]
    }
  ]

  const handleAddToCart = async (plan: VPSPlan) => {
    setLoading(true)
    try {
      await addProductToCart(plan.productId.toString(), billingCycle === 'yearly' ? 12 : 1, 'MONTH')
      toast.success(`${plan.name} VPS added to cart!`)
    } catch {
      toast.error('Failed to add to cart')
    } finally {
      setLoading(false)
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

  return (
    <div className="min-h-screen bg-white">
      {/* Debug Test */}
      <div style={{ padding: '20px', background: '#f0f0f0', textAlign: 'center' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>VPS Hosting Page</h1>
        <p>If you can see this, the page is loading correctly.</p>
      </div>
      
      {/* Hero Section with Server Animation */}
      <section ref={heroRef} className="relative pt-20 pb-32 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #3B82F6 0%, #06B6D4 50%, #3B82F6 100%)' }} />

        <div className="relative container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={heroInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="text-white"
            >
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-medium">Lightning-Fast NVMe Storage</span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                VPS Hosting that&apos;s{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300">
                  flexible, private, and affordable
                </span>
              </h1>
              
              <p className="text-xl text-white/90 mb-8">
                Get dedicated resources, root access, and complete control over your virtual server. 
                Perfect for developers, growing businesses, and resource-intensive applications.
              </p>

              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-cyan-300" />
                  <span>99.9% Uptime Guarantee</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-cyan-300" />
                  <span>Free Snapshots</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-cyan-300" />
                  <span>Root Access</span>
                </div>
              </div>

              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold shadow-xl hover:shadow-2xl transition-all"
                >
                  View Plans
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-lg font-semibold border border-white/20 hover:bg-white/20 transition-all"
                >
                  Learn More
                </motion.button>
              </div>

              {/* Trust Badges */}
              <div className="mt-12 flex items-center gap-8">
                <div className="text-center">
                  <div className="text-3xl font-bold">99.9%</div>
                  <div className="text-sm text-white/80">Uptime SLA</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">24/7</div>
                  <div className="text-sm text-white/80">Expert Support</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">45-Day</div>
                  <div className="text-sm text-white/80">Money Back</div>
                </div>
              </div>
            </motion.div>

            {/* Right Content - Server Animation */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={heroInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative hidden lg:block"
              style={{ minHeight: '500px' }}
            >
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Server className="w-32 h-32 text-white/80 mx-auto mb-4" />
                  <p className="text-white text-lg">High-Performance VPS</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing Section - GoDaddy Style */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              Choose your VPS hosting plan
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Powerful virtual private servers with dedicated resources
            </p>

            {/* Billing Toggle */}
            <div className="inline-flex items-center bg-white rounded-lg p-1 shadow-md">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-6 py-3 rounded-md font-medium transition-all ${
                  billingCycle === 'monthly'
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-6 py-3 rounded-md font-medium transition-all ${
                  billingCycle === 'yearly'
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Yearly
                <span className="ml-2 text-xs bg-green-500 text-white px-2 py-1 rounded-full">
                  Save up to 44%
                </span>
              </button>
            </div>
          </div>

          {/* Pricing Cards - GoDaddy Grid Style */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {vpsPlans.map((plan, index) => (
              <motion.div
                key={plan.productId}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative bg-white rounded-lg shadow-lg overflow-hidden ${
                  plan.isPopular ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                {plan.isPopular && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-4 py-1 text-sm font-semibold rounded-bl-lg">
                    MOST POPULAR
                  </div>
                )}

                <div className="p-6">
                  {/* Plan Header */}
                  <div className="mb-6">
                    <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold">
                        {formatPrice(billingCycle === 'yearly' ? plan.yearlyPrice / 12 : plan.monthlyPrice)}
                      </span>
                      <span className="text-gray-600">/mo</span>
                    </div>
                    {billingCycle === 'yearly' && plan.originalPrice && (
                      <div className="mt-2">
                        <span className="text-sm text-gray-500 line-through">
                          {formatPrice(plan.originalPrice / 12)}/mo
                        </span>
                        <span className="ml-2 text-sm text-green-600 font-semibold">
                          Save {Math.round(((plan.originalPrice - plan.yearlyPrice) / plan.originalPrice) * 100)}%
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Quick Specs */}
                  <div className="grid grid-cols-2 gap-3 mb-6 pb-6 border-b">
                    <div className="flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium">{plan.specs.cores} vCPU</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MemoryStick className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium">{plan.specs.ram}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <HardDrive className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium">{plan.specs.storage}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Wifi className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium">{plan.specs.bandwidth}</span>
                    </div>
                  </div>

                  {/* Features List */}
                  <ul className="space-y-3 mb-6">
                    {plan.features.slice(0, expandedPlan === plan.productId ? undefined : 5).map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                          plan.highlighted?.includes(feature) ? 'text-green-500' : 'text-gray-400'
                        }`} />
                        <span className={`text-sm ${
                          plan.highlighted?.includes(feature) ? 'font-medium text-gray-900' : 'text-gray-600'
                        }`}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {plan.features.length > 5 && (
                    <button
                      onClick={() => setExpandedPlan(expandedPlan === plan.productId ? null : plan.productId)}
                      className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 mb-4"
                    >
                      {expandedPlan === plan.productId ? (
                        <>Show less <ChevronUp className="w-4 h-4" /></>
                      ) : (
                        <>Show more <ChevronDown className="w-4 h-4" /></>
                      )}
                    </button>
                  )}

                  {/* CTA Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAddToCart(plan)}
                    disabled={loading}
                    className={`w-full py-3 px-4 rounded-lg font-semibold transition-all ${
                      plan.isPopular
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:shadow-lg'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Adding...
                      </span>
                    ) : (
                      'Add to Cart'
                    )}
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Additional Info */}
          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">
              All plans include: Free snapshots • Root access • 99.9% uptime SLA • IPv4 & IPv6
            </p>
            <div className="flex justify-center gap-6">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-500" />
                <span className="text-sm">45-day money-back guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <HeadphonesIcon className="w-5 h-5 text-blue-500" />
                <span className="text-sm">24/7 expert support</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Everything you need for success</h2>
            <p className="text-xl text-gray-600">Powerful features included with every VPS plan</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Gauge className="w-8 h-8" />,
                title: "Lightning Performance",
                description: "NVMe SSD storage and powerful processors for blazing-fast speed"
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: "Enhanced Security",
                description: "DDoS protection, firewall, and automated security patches"
              },
              {
                icon: <Terminal className="w-8 h-8" />,
                title: "Full Root Access",
                description: "Complete control over your server environment and configurations"
              },
              {
                icon: <Cloud className="w-8 h-8" />,
                title: "Instant Provisioning",
                description: "Get your VPS up and running in minutes, not hours"
              },
              {
                icon: <Database className="w-8 h-8" />,
                title: "Automated Backups",
                description: "Regular snapshots to protect your data and applications"
              },
              {
                icon: <Network className="w-8 h-8" />,
                title: "Global Network",
                description: "Multiple data center locations for optimal performance"
              },
              {
                icon: <BarChart3 className="w-8 h-8" />,
                title: "Resource Monitoring",
                description: "Real-time metrics and alerts for CPU, RAM, and storage"
              },
              {
                icon: <HeadphonesIcon className="w-8 h-8" />,
                title: "24/7 Support",
                description: "Expert assistance whenever you need it"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-lg mb-4">
                  <div className="text-blue-600">{feature.icon}</div>
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Monitoring & Alerts Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">
                Monitoring and alerts
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Stay on top of your server&apos;s performance with our comprehensive monitoring dashboard. 
                Get instant notifications when something needs your attention.
              </p>
              
              <div className="space-y-4">
                {[
                  "Real-time CPU, RAM, and disk usage metrics",
                  "Network traffic and bandwidth monitoring",
                  "Custom alert thresholds and notifications",
                  "Historical data and performance trends",
                  "Mobile app for monitoring on the go"
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-8 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                Learn More About Monitoring
              </motion.button>
            </div>

            <div className="relative">
              <div className="bg-white rounded-lg shadow-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">Server Metrics</h3>
                  <span className="text-sm text-green-500 flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    Live
                  </span>
                </div>
                
                {/* Mock Metrics Display */}
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>CPU Usage</span>
                      <span className="font-medium">42%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full" style={{ width: '42%' }} />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Memory</span>
                      <span className="font-medium">2.8 GB / 4 GB</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full" style={{ width: '70%' }} />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Storage</span>
                      <span className="font-medium">124 GB / 200 GB</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full" style={{ width: '62%' }} />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Network I/O</span>
                      <span className="font-medium">245 Mbps</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full animate-pulse" style={{ width: '35%' }} />
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">99.9%</div>
                    <div className="text-xs text-gray-600">Uptime</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">12ms</div>
                    <div className="text-xs text-gray-600">Latency</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">8</div>
                    <div className="text-xs text-gray-600">Active Processes</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Around-the-clock support
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Our team of VPS experts is available 24/7 to help you with any questions or issues. 
            Get the support you need, when you need it.
          </p>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <MessageCircle className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Live Chat</h3>
              <p className="text-gray-600">Instant answers from our support team</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Knowledge Base</h3>
              <p className="text-gray-600">Detailed guides and tutorials</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Community Forum</h3>
              <p className="text-gray-600">Connect with other VPS users</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Frequently asked questions about VPS Hosting
          </h2>

          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                question: "What&apos;s VPS hosting and what can I do with it?",
                answer: "VPS (Virtual Private Server) hosting provides you with dedicated resources on a shared physical server. You get root access, guaranteed resources, and complete control over your server environment. It&apos;s perfect for hosting websites, applications, game servers, or development environments."
              },
              {
                question: "What&apos;s the difference between managed & unmanaged VPS?",
                answer: "With unmanaged VPS, you have full control and responsibility for server management, including OS updates, security, and software installation. Managed VPS includes server management services like updates, monitoring, and technical support, allowing you to focus on your applications."
              },
              {
                question: "How long does it take to set up a VPS?",
                answer: "Your VPS is automatically provisioned and ready to use within minutes of purchase. You&apos;ll receive login credentials via email, and you can start configuring your server immediately."
              },
              {
                question: "Can I upgrade my VPS plan later?",
                answer: "Yes! You can easily upgrade your VPS resources at any time through your control panel. Upgrades are seamless with minimal downtime, and you only pay the difference in pricing."
              },
              {
                question: "What operating systems are available?",
                answer: "We offer a variety of Linux distributions including Ubuntu, CentOS, Debian, and Fedora. Windows Server is also available for an additional license fee. You can reinstall or change your OS at any time."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-md"
              >
                <button
                  onClick={() => setExpandedPlan(expandedPlan === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold">{faq.question}</span>
                  {expandedPlan === index ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </button>
                <AnimatePresence>
                  {expandedPlan === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-4 text-gray-600">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-cyan-500">
        <div className="container mx-auto px-4 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">
            Ready to get started?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of customers running their applications on FlickMax VPS
          </p>
          <div className="flex gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold shadow-xl hover:shadow-2xl transition-all"
            >
              Get Started Now
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-lg font-semibold border border-white/20 hover:bg-white/20 transition-all"
            >
              Contact Sales
            </motion.button>
          </div>
        </div>
      </section>
    </div>
  )
}