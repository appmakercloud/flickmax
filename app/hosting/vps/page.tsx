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
  HardDriveIcon
} from 'lucide-react'
import { useCountry } from '@/contexts/CountryContext'
import { useCart } from '@/contexts/CartContext'
import toast from 'react-hot-toast'

interface VPSPlan {
  productId: number
  name: string
  monthlyPrice: number
  yearlyPrice: number
  listPrice?: number
  features: string[]
  isPopular?: boolean
  cpu: string
  ram: string
  storage: string
  bandwidth: string
  ipAddresses: string
  rootAccess: boolean
  managementLevel: string
  backup?: boolean
  specs: {
    cores: number
    ram: number
    storage: number
    bandwidth: string
    ipv4: number
    ipv6: string
  }
}

interface FAQ {
  question: string
  answer: string
}

const faqs: FAQ[] = [
  {
    question: "What is a VPS and how is it different from shared hosting?",
    answer: "A Virtual Private Server (VPS) is a virtualized server that mimics a dedicated server within a shared hosting environment. Unlike shared hosting where resources are shared among all users, VPS provides dedicated resources (CPU, RAM, storage) exclusively for your use, offering better performance, security, and control."
  },
  {
    question: "Do I need technical knowledge to manage a VPS?",
    answer: "While basic technical knowledge is helpful, we offer different management levels. Our Managed VPS includes full server management, automatic updates, and 24/7 support. For experienced users, our Self-Managed VPS provides complete root access and control."
  },
  {
    question: "Can I upgrade my VPS plan later?",
    answer: "Yes! You can upgrade your VPS plan at any time. The upgrade process is seamless with minimal to no downtime. You only pay the difference for the remaining billing period."
  },
  {
    question: "What operating systems are available?",
    answer: "We offer a wide range of operating systems including Ubuntu, CentOS, Debian, Fedora, and Windows Server. You can also install custom OS images through our control panel."
  },
  {
    question: "Is my data backed up?",
    answer: "All VPS plans include weekly automatic backups with 2-week retention. You can also create manual snapshots anytime through the control panel. For critical applications, we recommend our premium backup service with daily backups and extended retention."
  },
  {
    question: "What kind of support do you provide?",
    answer: "We provide 24/7/365 technical support via phone, chat, and email. Managed VPS customers receive priority support with faster response times and proactive server monitoring."
  }
]

const testimonials = [
  {
    name: "David Martinez",
    company: "SaaS Platform CEO",
    rating: 5,
    text: "Migrating to FlickMax VPS was the best decision for our growing platform. The performance boost was immediate, and the scalability options are perfect for our needs."
  },
  {
    name: "Lisa Anderson",
    company: "DevOps Engineer",
    rating: 5,
    text: "The control and flexibility of FlickMax VPS is unmatched. Full root access, choice of OS, and excellent uptime. Exactly what our development team needed."
  },
  {
    name: "Robert Kim",
    company: "E-commerce Business Owner",
    rating: 5,
    text: "Our online store handles thousands of transactions daily. FlickMax VPS provides the reliability and speed we need, plus their support team is incredibly responsive."
  }
]

const features = [
  {
    icon: Cpu,
    title: "Powerful Processing",
    description: "Latest Intel Xeon processors with dedicated vCPU cores for consistent performance"
  },
  {
    icon: MemoryStick,
    title: "100% RAM Allocation",
    description: "Guaranteed RAM allocation with no overselling or resource sharing"
  },
  {
    icon: HardDriveIcon,
    title: "NVMe SSD Storage",
    description: "Ultra-fast NVMe SSDs with up to 10x faster read/write speeds"
  },
  {
    icon: Network,
    title: "1Gbps Network",
    description: "High-speed network connectivity with low latency worldwide"
  },
  {
    icon: Shield,
    title: "DDoS Protection",
    description: "Enterprise-grade DDoS protection included with all plans"
  },
  {
    icon: Terminal,
    title: "Full Root Access",
    description: "Complete control over your server environment and configurations"
  }
]

// CountUp Component for animated numbers
const CountUp = ({ end, decimals = 0, duration = 2 }: { end: number; decimals?: number; duration?: number }) => {
  const [count, setCount] = useState(0)
  const countRef = useRef(null)
  const isInView = useInView(countRef, { once: true })
  
  useEffect(() => {
    if (isInView && duration > 0 && end > 0) {
      let start = 0
      const increment = Math.max(end / (duration * 60), 0.01) // Ensure positive increment
      const timer = setInterval(() => {
        start += increment
        if (start >= end) {
          setCount(end)
          clearInterval(timer)
        } else {
          setCount(start)
        }
      }, 1000 / 60)
      return () => clearInterval(timer)
    }
  }, [isInView, end, duration])
  
  return <span ref={countRef}>{count.toFixed(decimals)}</span>
}

export default function VPSHostingPage() {
  const [plans, setPlans] = useState<VPSPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')
  const [openFAQ, setOpenFAQ] = useState<number | null>(null)
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [selectedOS, setSelectedOS] = useState('ubuntu')
  
  const { currency } = useCountry()
  const { addProductToCart } = useCart()
  
  const heroRef = useRef(null)
  const statsRef = useRef(null)
  const isStatsInView = useInView(statsRef, { once: true })

  useEffect(() => {
    fetchVPSPlans()
  }, [currency])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const fetchVPSPlans = async () => {
    try {
      setLoading(true)
      
      // Mock VPS plans data
      const processedPlans: VPSPlan[] = [
        {
          productId: 101,
          name: 'VPS Starter',
          monthlyPrice: 19.99,
          yearlyPrice: 179.99,
          listPrice: 239.88,
          features: [
            '2 vCPU Cores',
            '4 GB RAM',
            '80 GB NVMe SSD',
            '2 TB Bandwidth',
            '1 IPv4 Address',
            'Free SSL Certificate',
            'Weekly Backups',
            'DDoS Protection'
          ],
          cpu: '2 vCPU',
          ram: '4 GB',
          storage: '80 GB NVMe',
          bandwidth: '2 TB',
          ipAddresses: '1 IPv4',
          rootAccess: true,
          managementLevel: 'Self-Managed',
          backup: true,
          specs: {
            cores: 2,
            ram: 4,
            storage: 80,
            bandwidth: '2 TB',
            ipv4: 1,
            ipv6: 'Unlimited'
          }
        },
        {
          productId: 102,
          name: 'VPS Professional',
          monthlyPrice: 39.99,
          yearlyPrice: 359.99,
          listPrice: 479.88,
          features: [
            '4 vCPU Cores',
            '8 GB RAM',
            '160 GB NVMe SSD',
            '4 TB Bandwidth',
            '2 IPv4 Addresses',
            'Free SSL Certificate',
            'Daily Backups',
            'DDoS Protection',
            'Priority Support'
          ],
          isPopular: true,
          cpu: '4 vCPU',
          ram: '8 GB',
          storage: '160 GB NVMe',
          bandwidth: '4 TB',
          ipAddresses: '2 IPv4',
          rootAccess: true,
          managementLevel: 'Managed Available',
          backup: true,
          specs: {
            cores: 4,
            ram: 8,
            storage: 160,
            bandwidth: '4 TB',
            ipv4: 2,
            ipv6: 'Unlimited'
          }
        },
        {
          productId: 103,
          name: 'VPS Business',
          monthlyPrice: 79.99,
          yearlyPrice: 719.99,
          listPrice: 959.88,
          features: [
            '6 vCPU Cores',
            '16 GB RAM',
            '320 GB NVMe SSD',
            '8 TB Bandwidth',
            '3 IPv4 Addresses',
            'Free SSL Certificate',
            'Daily Backups',
            'DDoS Protection',
            'Priority Support',
            'Load Balancer Ready',
            'Advanced Monitoring'
          ],
          cpu: '6 vCPU',
          ram: '16 GB',
          storage: '320 GB NVMe',
          bandwidth: '8 TB',
          ipAddresses: '3 IPv4',
          rootAccess: true,
          managementLevel: 'Fully Managed',
          backup: true,
          specs: {
            cores: 6,
            ram: 16,
            storage: 320,
            bandwidth: '8 TB',
            ipv4: 3,
            ipv6: 'Unlimited'
          }
        },
        {
          productId: 104,
          name: 'VPS Enterprise',
          monthlyPrice: 149.99,
          yearlyPrice: 1349.99,
          listPrice: 1799.88,
          features: [
            '8 vCPU Cores',
            '32 GB RAM',
            '640 GB NVMe SSD',
            'Unlimited Bandwidth',
            '5 IPv4 Addresses',
            'Free SSL Certificate',
            'Real-time Backups',
            'DDoS Protection',
            'Dedicated Support',
            'Load Balancer Included',
            'Advanced Monitoring',
            'Custom Firewall Rules',
            'Kubernetes Ready'
          ],
          cpu: '8 vCPU',
          ram: '32 GB',
          storage: '640 GB NVMe',
          bandwidth: 'Unlimited',
          ipAddresses: '5 IPv4',
          rootAccess: true,
          managementLevel: 'Fully Managed',
          backup: true,
          specs: {
            cores: 8,
            ram: 32,
            storage: 640,
            bandwidth: 'Unlimited',
            ipv4: 5,
            ipv6: 'Unlimited'
          }
        }
      ]
      
      setPlans(processedPlans)
    } catch (error) {
      console.error('Error fetching VPS plans:', error)
      setPlans([])
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async (plan: VPSPlan) => {
    try {
      const period = billingCycle === 'yearly' ? 12 : 1
      await addProductToCart(String(plan.productId), period, 'MONTH')
      toast.success(`${plan.name} added to cart!`)
    } catch (error) {
      toast.error('Failed to add to cart')
    }
  }

  const scrollToPricing = () => {
    document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })
  }

  const operatingSystems = [
    { id: 'ubuntu', name: 'Ubuntu', versions: ['22.04 LTS', '20.04 LTS'] },
    { id: 'centos', name: 'CentOS', versions: ['Stream 9', 'Stream 8'] },
    { id: 'debian', name: 'Debian', versions: ['12', '11'] },
    { id: 'windows', name: 'Windows Server', versions: ['2022', '2019'] }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Clean Hero Section with Simple Gradient */}
      <section ref={heroRef} className="relative min-h-[85vh] flex items-center justify-center bg-gradient-to-br from-blue-500 via-cyan-500 to-blue-600">
        {/* Simple floating elements */}
        <div className="absolute top-20 left-[10%] w-16 h-16 border-2 border-white/20 rounded-lg" />
        <div className="absolute top-40 right-[20%] w-20 h-20 border-2 border-white/15 rounded-xl" />
        <div className="absolute bottom-32 left-[25%] w-12 h-12 bg-white/10 rounded-lg" />
        <div className="absolute top-[60%] right-[15%] w-8 h-8 border border-white/20 rounded" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Simple Badge */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-block mb-8"
            >
              <span className="bg-white/20 backdrop-blur-sm text-white text-sm font-medium px-4 py-2 rounded-full">
                Starting at $19.99/mo
              </span>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Powerful VPS Hosting
              </motion.div>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-3xl sm:text-4xl lg:text-5xl mt-4 font-normal"
              >
                That Scales With You
              </motion.div>
            </h1>
            
            <p className="text-lg sm:text-xl text-white/80 mb-10 max-w-2xl mx-auto">
              Deploy in seconds. Scale in minutes. Full root access with 99.99% uptime guarantee.
            </p>

            {/* Simple CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={scrollToPricing}
                className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                View Plans
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-3 bg-transparent border-2 border-white/80 text-white rounded-lg font-semibold hover:bg-white/10 transition-all duration-300"
              >
                Learn More
              </motion.button>
            </div>
          </motion.div>
        </div>

      </section>
      
      {/* Wave Separator */}
      <div className="relative -mt-1">
        <svg className="w-full h-24" viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 0L48 8.5C96 17 192 34 288 42.5C384 51 480 51 576 42.5C672 34 768 17 864 17C960 17 1056 34 1152 42.5C1248 51 1344 51 1392 51L1440 51V120H1392C1344 120 1248 120 1152 120C1056 120 960 120 864 120C768 120 672 120 576 120C480 120 384 120 288 120C192 120 96 120 48 120H0V0Z" fill="white"/>
        </svg>
      </div>

      {/* Key Features Grid - Clean Style */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-semibold mb-4 text-gray-900">
              Startup Friendly
            </h2>
            <p className="text-lg text-gray-600">Built on cutting-edge technology for unmatched performance</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group p-6 text-center hover:shadow-lg transition-all duration-300 rounded-xl"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Clean VPS Pricing Section */}
      <section id="pricing" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-semibold mb-4 text-gray-900">
              Choose Your Perfect VPS Plan
            </h2>
            <p className="text-lg text-gray-600">All plans include free setup and instant deployment</p>
          </motion.div>

          {/* Simple Billing Toggle */}
          <div className="flex justify-center mb-12">
            <div className="bg-white rounded-lg border border-gray-200 p-1 inline-flex">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-2 rounded-md font-medium text-sm transition-all ${
                  billingCycle === 'monthly'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-4 py-2 rounded-md font-medium text-sm transition-all ${
                  billingCycle === 'yearly'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Yearly <span className="text-xs">(-25%)</span>
              </button>
            </div>
          </div>

          {/* Clean Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.productId}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative bg-white rounded-xl p-6 ${
                  plan.isPopular 
                    ? 'border-2 border-blue-500 shadow-xl' 
                    : 'border border-gray-200'
                } hover:shadow-lg transition-shadow duration-300`}
              >
                {plan.isPopular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                      RECOMMENDED
                    </span>
                  </div>
                )}

                {/* Plan Header */}
                <div className="text-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">{plan.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{plan.cpu} • {plan.ram}</p>
                </div>

                {/* Price */}
                <div className="text-center mb-6">
                  <div className="flex items-baseline justify-center">
                    <span className="text-lg text-gray-600">$</span>
                    <span className="text-3xl font-bold text-gray-900">
                      {billingCycle === 'yearly' 
                        ? Math.floor(plan.yearlyPrice / 12)
                        : Math.floor(plan.monthlyPrice)
                      }
                    </span>
                    <span className="text-gray-600 ml-1">/mo</span>
                  </div>
                </div>

                {/* Main Specs */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Storage</span>
                    <span className="font-semibold">{plan.storage}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Bandwidth</span>
                    <span className="font-semibold">{plan.bandwidth}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">IP Address</span>
                    <span className="font-semibold">{plan.ipAddresses}</span>
                  </div>
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => handleAddToCart(plan)}
                  className={`w-full py-2.5 rounded-lg font-medium transition-all ${
                    plan.isPopular
                      ? 'bg-blue-500 text-white hover:bg-blue-600'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  Choose Plan
                </button>

                {/* Key Features */}
                <div className="mt-4 space-y-2">
                  {plan.features.slice(0, 3).map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span className="text-xs text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Custom Solutions CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Need More Power?</h3>
              <p className="text-lg mb-6">Get custom VPS solutions with dedicated resources and priority support</p>
              <button className="px-8 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
                Contact Sales Team
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Operating Systems Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              Deploy Any OS in
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600"> Seconds</span>
            </h2>
            <p className="text-xl text-gray-600">Choose from popular Linux distributions or Windows Server</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {operatingSystems.map((os, index) => (
              <motion.div
                key={os.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedOS(os.id)}
                className={`relative cursor-pointer rounded-xl p-6 border-2 transition-all duration-300 ${
                  selectedOS === os.id
                    ? 'border-cyan-500 bg-gradient-to-br from-cyan-50 to-blue-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                {selectedOS === os.id && (
                  <div className="absolute top-2 right-2">
                    <CheckCircle className="w-6 h-6 text-cyan-600" />
                  </div>
                )}
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
                    <Settings className="w-8 h-8 text-gray-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900">{os.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">{os.versions[0]}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Performance Stats with Counter Animation */}
      <section ref={statsRef} className="py-20 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 relative overflow-hidden">
        {/* Static Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
              backgroundSize: '60px 60px',
              backgroundPosition: '0 0'
            }}
          />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { value: 99.99, suffix: '%', label: 'Uptime SLA', icon: Infinity, decimals: 2 },
              { value: 60, prefix: '<', suffix: 's', label: 'Deployment Time', icon: Rocket, decimals: 0 },
              { value: 10, suffix: 'Gbps', label: 'DDoS Protection', icon: Shield, decimals: 0 },
              { value: 15, suffix: '+', label: 'Data Centers', icon: Globe, decimals: 0 }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5, rotateY: -180 }}
                animate={isStatsInView ? { 
                  opacity: 1, 
                  scale: 1,
                  rotateY: 0
                } : {}}
                transition={{ 
                  delay: index * 0.2,
                  type: 'spring',
                  stiffness: 100,
                  damping: 10
                }}
                whileHover={{ 
                  scale: 1.1,
                  rotateY: 10,
                  transition: { duration: 0.3 }
                }}
                className="text-center text-white group cursor-pointer"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <motion.div
                  animate={isStatsInView ? { 
                    rotate: 360
                  } : { rotate: 0 }}
                  transition={{ 
                    duration: 1,
                    delay: index * 0.2,
                    ease: "easeOut"
                  }}
                >
                  <stat.icon className="w-12 h-12 mx-auto mb-4 text-white/80 group-hover:text-white transition-colors" />
                </motion.div>
                <div className="text-4xl lg:text-5xl font-bold mb-2">
                  {stat.prefix}
                  {isStatsInView && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 1 }}
                    >
                      <CountUp 
                        end={stat.value} 
                        decimals={stat.decimals}
                        duration={Math.max(2 + index * 0.5, 1)}
                      />
                    </motion.span>
                  )}
                  {stat.suffix}
                </div>
                <motion.p 
                  className="text-white/90 group-hover:text-white transition-colors"
                  initial={{ opacity: 0, y: 10 }}
                  animate={isStatsInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: index * 0.2 + 0.5 }}
                >
                  {stat.label}
                </motion.p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Control Panel Preview */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              Powerful Control Panel
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600"> at Your Fingertips</span>
            </h2>
            <p className="text-xl text-gray-600">Manage your VPS with our intuitive control panel</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative max-w-5xl mx-auto"
          >
            <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl p-1">
              <div className="bg-white rounded-xl p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { icon: BarChart3, title: 'Real-time Monitoring', desc: 'CPU, RAM, and bandwidth usage' },
                    { icon: Server, title: 'One-Click Actions', desc: 'Reboot, rebuild, and resize' },
                    { icon: Shield, title: 'Security Center', desc: 'Firewall rules and DDoS stats' },
                    { icon: Cloud, title: 'Instant Backups', desc: 'Snapshots and automated backups' },
                    { icon: Terminal, title: 'Web Console', desc: 'Browser-based SSH access' },
                    { icon: Settings, title: 'API Access', desc: 'Full RESTful API for automation' }
                  ].map((feature, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <feature.icon className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{feature.title}</h4>
                        <p className="text-sm text-gray-600">{feature.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              Trusted by
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600"> Developers</span>
            </h2>
            <p className="text-xl text-gray-600">See what our customers are building</p>
          </motion.div>

          <div className="relative max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="bg-gradient-to-br from-slate-50 to-white rounded-2xl shadow-xl p-8 border border-gray-200"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                      {testimonials[currentTestimonial].name.charAt(0)}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-gray-700 text-lg mb-4 italic">&ldquo;{testimonials[currentTestimonial].text}&rdquo;</p>
                    <div>
                      <p className="font-semibold text-gray-900">{testimonials[currentTestimonial].name}</p>
                      <p className="text-gray-600">{testimonials[currentTestimonial].company}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Testimonial Navigation Dots */}
            <div className="flex justify-center gap-2 mt-6">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`transition-all duration-300 ${
                    index === currentTestimonial
                      ? 'w-8 h-2 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full'
                      : 'w-2 h-2 bg-gray-300 hover:bg-gray-400 rounded-full'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              Frequently Asked
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600"> Questions</span>
            </h2>
            <p className="text-xl text-gray-600">Everything you need to know about VPS hosting</p>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200"
              >
                <button
                  onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-slate-50 transition-colors"
                >
                  <span className="font-semibold text-gray-800">{faq.question}</span>
                  {openFAQ === index ? (
                    <ChevronUp className="w-5 h-5 text-cyan-600" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                <AnimatePresence>
                  {openFAQ === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-6 pb-4"
                    >
                      <p className="text-gray-600">{faq.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to Deploy Your VPS?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Get started in under 60 seconds with our instant deployment.
              No setup fees, no contracts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}
                whileTap={{ scale: 0.95 }}
                onClick={scrollToPricing}
                className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                Deploy VPS Now
                <Rocket className="inline-block ml-2 w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-semibold text-lg hover:bg-white/10 transition-all duration-300"
              >
                Talk to Sales
              </motion.button>
            </div>
            <p className="text-white/70 text-sm mt-6">
              30-day money-back guarantee • Free migration assistance • 24/7 support
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  )
}