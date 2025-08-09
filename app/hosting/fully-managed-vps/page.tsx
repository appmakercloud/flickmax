'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Server,
  HardDrive,
  Cpu,
  MemoryStick,
  Shield,
  Zap,
  Globe,
  Lock,
  CloudLightning,
  ArrowRight,
  Check,
  CheckCircle,
  Star,
  TrendingUp,
  Gauge,
  Database,
  Network,
  Terminal,
  Settings,
  HeadphonesIcon,
  Award,
  Users,
  ChevronDown,
  Rocket,
  Activity,
  BarChart3,
  LineChart,
  PieChart,
  Sparkles,
  Clock,
  RefreshCw,
  Layers,
  Box,
  Package,
  Boxes,
  Cloud
} from 'lucide-react'
import { useCountry } from '@/contexts/CountryContext'
import { getCurrencySymbol, formatPrice } from '@/lib/utils/currency'

// Fully Managed VPS Plans Data - Standard Performance (FALLBACK ONLY)
const vpsPlansStandard = [
  {
    productId: 'vps4-linux-fully-managed-1vcpu',
    name: '1 vCPU / 1GB RAM',
    monthlyPrice: 4.20,  // $4.20 sale price from API
    yearlyPrice: 50.40,
    originalPrice: 5.99,  // $5.99 list price from API  
    savings: 30,
    isPopular: false,
    specs: {
      cpu: '1 vCPU core',
      ram: '1 GB RAM',
      storage: '20 GB SSD Storage',
      snapshots: 'Snapshot backups',
      os: 'Linux only',
      panel: 'No Control Panel',
      ips: '1 additional IP available upon request',
      datacenters: 'Global data centers'
    },
    features: {
      term: '3-yr term',
      autoRenews: 'auto-renews at $59.88',
      sslRenews: 'SSL renews annually at $119.99',
      cancelAnytime: 'Cancel anytime in Account Settings'
    }
  },
  {
    productId: 'vps4-linux-fully-managed-2vcpu',
    name: '2 vCPU / 4GB RAM',
    monthlyPrice: 32.99,  // $32.99 from API
    yearlyPrice: 395.88,
    originalPrice: 65.98,
    savings: 50,
    isPopular: true,
    isRecommended: true,
    specs: {
      cpu: '2 vCPU cores',
      ram: '4 GB RAM',
      storage: '100 GB SSD Storage',
      snapshots: 'Snapshot backups',
      os: 'Linux or Windows compatible',
      panel: 'cPanel or Plesk available',
      ips: '2 additional IPs available upon request',
      datacenters: 'Global data centers'
    },
    features: {
      term: '3-yr term',
      autoRenews: 'auto-renews at $875.88',
      sslRenews: 'SSL renews annually at $119.99',
      cancelAnytime: 'Cancel anytime in Account Settings'
    }
  },
  {
    productId: 'vps4-linux-fully-managed-4vcpu',
    name: '4 vCPU / 8GB RAM',
    monthlyPrice: 64.99,  // $64.99 from API
    yearlyPrice: 779.88,
    originalPrice: 129.98,
    savings: 50,
    isPopular: false,
    specs: {
      cpu: '4 vCPU cores',
      ram: '8 GB RAM',
      storage: '200 GB SSD Storage',
      snapshots: 'Snapshot backups',
      os: 'Linux or Windows compatible',
      panel: 'cPanel or Plesk available',
      ips: '3 additional IPs available upon request',
      datacenters: 'Global data centers'
    },
    features: {
      term: '3-yr term',
      autoRenews: 'auto-renews at $779.88',
      sslRenews: 'SSL renews annually at $119.99',
      cancelAnytime: 'Cancel anytime in Account Settings'
    }
  },
  {
    productId: 'vps4-linux-fully-managed-8vcpu',
    name: '8 vCPU / 16GB RAM',
    monthlyPrice: 112.99,  // $112.99 from API
    yearlyPrice: 1355.88,
    originalPrice: 225.98,
    savings: 50,
    isPopular: false,
    specs: {
      cpu: '8 vCPU cores',
      ram: '16 GB RAM',
      storage: '400 GB SSD Storage',
      snapshots: 'Snapshot backups',
      os: 'Linux or Windows compatible',
      panel: 'cPanel or Plesk available',
      ips: '3 additional IPs available upon request',
      datacenters: 'Global data centers'
    },
    features: {
      term: '3-yr term',
      autoRenews: 'auto-renews at $2999.88',
      sslRenews: 'SSL renews annually at $119.99',
      cancelAnytime: 'Cancel anytime in Account Settings'
    }
  },
  {
    productId: 'vps4-linux-fully-managed-16vcpu',
    name: '16 vCPU / 32GB RAM',
    monthlyPrice: 188.99,  // $188.99 from API
    yearlyPrice: 2267.88,
    originalPrice: 377.98,
    savings: 50,
    isPopular: false,
    specs: {
      cpu: '16 vCPU cores',
      ram: '32 GB RAM',
      storage: '800 GB SSD Storage',
      snapshots: 'Snapshot backups',
      os: 'Linux or Windows compatible',
      panel: 'cPanel or Plesk available',
      ips: '3 additional IPs available upon request',
      datacenters: 'Global data centers'
    },
    features: {
      term: '3-yr term',
      autoRenews: 'auto-renews at $2267.88',
      sslRenews: 'SSL renews annually at $119.99',
      cancelAnytime: 'Cancel anytime in Account Settings'
    }
  }
]

// VPS Plans Data - High Performance (FALLBACK ONLY)
const vpsPlansHighPerformance = [
  {
    productId: 'vps4-linux-fully-managed-high-ram-2vcpu',
    name: '2 vCPU / 8GB RAM',
    monthlyPrice: 49.99,  // $49.99 from API
    yearlyPrice: 599.88,
    originalPrice: 99.98,
    savings: 50,
    isPopular: false,
    specs: {
      cpu: '2 vCPU cores',
      ram: '8 GB RAM',
      storage: '100 GB SSD Storage',
      snapshots: 'Snapshot backups',
      os: 'Linux or Windows compatible',
      panel: 'cPanel or Plesk included',
      ips: '2 additional IPs available upon request',
      datacenters: 'Premium data centers'
    },
    features: {
      term: '3-yr term',
      autoRenews: 'auto-renews at $1307.88',
      sslRenews: 'SSL included free',
      cancelAnytime: 'Cancel anytime in Account Settings'
    }
  },
  {
    productId: 'vps4-linux-fully-managed-high-ram-4vcpu',
    name: '4 vCPU / 16GB RAM',
    monthlyPrice: 81.99,  // $81.99 from API
    yearlyPrice: 983.88,
    originalPrice: 163.98,
    savings: 50,
    isPopular: true,
    isRecommended: true,
    specs: {
      cpu: '4 vCPU cores',
      ram: '16 GB RAM',
      storage: '200 GB SSD Storage',
      snapshots: 'Snapshot backups',
      os: 'Linux or Windows compatible',
      panel: 'cPanel or Plesk included',
      ips: '3 additional IPs available upon request',
      datacenters: 'Premium data centers'
    },
    features: {
      term: '3-yr term',
      autoRenews: 'auto-renews at $2171.88',
      sslRenews: 'SSL included free',
      cancelAnytime: 'Cancel anytime in Account Settings'
    }
  },
  {
    productId: 'vps4-linux-fully-managed-high-ram-8vcpu',
    name: '8 vCPU / 32GB RAM',
    monthlyPrice: 159.99,  // $159.99 from API
    yearlyPrice: 1919.88,
    originalPrice: 319.98,
    savings: 50,
    isPopular: false,
    specs: {
      cpu: '8 vCPU cores',
      ram: '32 GB RAM',
      storage: '400 GB SSD Storage',
      snapshots: 'Snapshot backups',
      os: 'Linux or Windows compatible',
      panel: 'cPanel or Plesk included',
      ips: '3 additional IPs available upon request',
      datacenters: 'Premium data centers'
    },
    features: {
      term: '3-yr term',
      autoRenews: 'auto-renews at $4247.88',
      sslRenews: 'SSL included free',
      cancelAnytime: 'Cancel anytime in Account Settings'
    }
  },
  {
    productId: 'vps4-linux-fully-managed-high-ram-16vcpu',
    name: '16 vCPU / 64GB RAM',
    monthlyPrice: 241.99,  // $241.99 from API
    yearlyPrice: 2903.88,
    originalPrice: 483.98,
    savings: 50,
    isPopular: false,
    specs: {
      cpu: '16 vCPU cores',
      ram: '64 GB RAM',
      storage: '800 GB SSD Storage',
      snapshots: 'Snapshot backups',
      os: 'Linux or Windows compatible',
      panel: 'cPanel or Plesk included',
      ips: '3 additional IPs available upon request',
      datacenters: 'Premium data centers'
    },
    features: {
      term: '3-yr term',
      autoRenews: 'auto-renews at $2903.88',
      sslRenews: 'SSL included free',
      cancelAnytime: 'Cancel anytime in Account Settings'
    }
  },
  {
    productId: 'vps4-linux-fully-managed-high-ram-32vcpu',
    name: '32 vCPU / 128GB RAM',
    monthlyPrice: 328.99,  // $328.99 from API
    yearlyPrice: 3947.88,
    originalPrice: 657.98,
    savings: 50,
    isPopular: false,
    specs: {
      cpu: '32 vCPU cores',
      ram: '128 GB RAM',
      storage: '1.5 TB SSD Storage',
      snapshots: 'Snapshot backups',
      os: 'Any OS compatible',
      panel: 'cPanel or Plesk included + WHM',
      ips: '3 additional IPs available upon request',
      datacenters: 'Premium data centers with CDN'
    },
    features: {
      term: '3-yr term',
      autoRenews: 'auto-renews at $3947.88',
      sslRenews: 'SSL included free',
      cancelAnytime: 'Cancel anytime in Account Settings'
    }
  }
]

// Operating Systems Available
const operatingSystems = [
  { name: 'Ubuntu', versions: ['22.04 LTS', '20.04 LTS', '18.04 LTS'], icon: '🐧' },
  { name: 'CentOS', versions: ['Stream 9', 'Stream 8', '7'], icon: '🎯' },
  { name: 'Debian', versions: ['12', '11', '10'], icon: '🌀' },
  { name: 'Rocky Linux', versions: ['9', '8'], icon: '🏔️' },
  { name: 'AlmaLinux', versions: ['9', '8'], icon: '☁️' },
  { name: 'Fedora', versions: ['38', '37'], icon: '🎩' }
]

// Tooltip content for specs
const tooltipContent = {
  snapshots: '7 days of automated snapshot backups, plus the option to create a single on-demand snapshot backup.',
  panel: 'These are not free features, cPanel (or Plesk) can be added to your plan for an additional fee.',
  datacenters: 'Choose from multiple data centers: United States, Europe and Singapore.',
  ips: 'To add additional IPs, go to your My Hosting dashboard, locate IP Addresses and click Request, check the terms of agreement then click Submit Request. You may only add 1 additional IP address per request.'
}

export default function VPSHostingPage() {
  const [performanceType, setPerformanceType] = useState<'standard' | 'high'>('standard')
  const [selectedOS, setSelectedOS] = useState('Ubuntu')
  const [showOSDropdown, setShowOSDropdown] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [activeSection, setActiveSection] = useState('pricing')
  // Start with empty arrays - only show API data
  const [plansData, setPlansData] = useState<any>({
    standard: [],
    high: []
  })
  
  const { currency, country } = useCountry()
  
  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  // Scroll progress and active section tracking
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = (window.scrollY / totalHeight) * 100
      setScrollProgress(progress)
      
      // Determine active section
      const sections = ['pricing', 'benefits', 'use-cases', 'faq']
      const scrollPosition = window.scrollY + 100
      
      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section)
            break
          }
        }
      }
    }
    
    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  const currentPlans = plansData[performanceType]

  // Fetch VPS plans from API - exactly like WordPress page
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setIsLoading(true)
        // Add timestamp to prevent caching
        // Always use en-US market to get sale prices, but change currency
        const url = `/api/products/fully-managed-vps?currency=${currency}&market=en-US&t=${Date.now()}`
        const response = await fetch(url, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache'
          }
        })
        const data = await response.json()
        
        if (data.success && data.plans) {
          setPlansData(data.plans)
        } else {
          console.error('Failed to fetch plans:', data.error)
          // Use fallback only if API completely fails
          setPlansData({
            standard: vpsPlansStandard,
            high: vpsPlansHighPerformance
          })
        }
      } catch (error) {
        console.error('Error fetching VPS plans:', error)
        // Use fallback on network error
        setPlansData({
          standard: vpsPlansStandard,
          high: vpsPlansHighPerformance
        })
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchPlans()
  }, [currency, country])

  const handleConfigureServer = (plan: typeof vpsPlansStandard[0]) => {
    // Map product IDs to GoDaddy configuration URLs for Fully Managed VPS
    const configUrls: Record<string, string> = {
      // Standard Performance - Fully Managed
      'vps4-linux-managed-1vcpu': 'https://host.flickmax.com/products/vps?plan=vps4-managed-lin-cpanel-tier1&src=gs&term=12%3Amonth&xs=0',
      'vps4-linux-managed-2vcpu': 'https://host.flickmax.com/products/vps?plan=vps4-managed-lin-cpanel-tier2&src=gs&term=12%3Amonth&xs=0',
      'vps4-linux-managed-4vcpu': 'https://host.flickmax.com/products/vps?plan=vps4-managed-lin-cpanel-tier4&src=gs&term=12%3Amonth&xs=0',
      'vps4-linux-managed-8vcpu': 'https://host.flickmax.com/products/vps?plan=vps4-managed-lin-cpanel-tier6&src=gs&term=12%3Amonth&xs=0',
      'vps4-linux-managed-16vcpu': 'https://host.flickmax.com/products/vps?plan=vps4-managed-lin-cpanel-tier7&src=gs&term=12%3Amonth&xs=0',
      // High Performance - Fully Managed
      'vps4-linux-managed-high-mem-1vcpu': 'https://host.flickmax.com/products/vps?plan=vps4-managed-high-mem-lin-cpanel-tier1&src=gs&term=12%3Amonth&xs=0',
      'vps4-linux-managed-high-mem-2vcpu': 'https://host.flickmax.com/products/vps?plan=vps4-managed-high-mem-lin-cpanel-tier2&src=gs&term=12%3Amonth&xs=0',
      'vps4-linux-managed-high-mem-4vcpu': 'https://host.flickmax.com/products/vps?plan=vps4-managed-high-mem-lin-cpanel-tier4&src=gs&term=12%3Amonth&xs=0',
      'vps4-linux-managed-high-mem-8vcpu': 'https://host.flickmax.com/products/vps?plan=vps4-managed-high-mem-lin-cpanel-tier6&src=gs&term=12%3Amonth&xs=0',
      'vps4-linux-managed-high-mem-16vcpu': 'https://host.flickmax.com/products/vps?plan=vps4-managed-high-mem-lin-cpanel-tier7&src=gs&term=12%3Amonth&xs=0',
      'vps4-linux-managed-32vcpu': 'https://host.flickmax.com/products/vps?plan=vps4-managed-lin-cpanel-tier8&src=gs&term=12%3Amonth&xs=0'
    }
    
    const url = configUrls[plan.productId]
    if (url) {
      window.open(url, '_blank')
    }
  }

  return (
    <>
      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -200% center;
          }
          100% {
            background-position: 200% center;
          }
        }
      `}</style>
      
    <div className="min-h-screen bg-white">
      {/* Hero Section with Modern Dashboard Visual */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50/30 to-cyan-50/20 pt-8">
        {/* Enhanced Background Pattern */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Mesh Gradient Background */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb15_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb15_1px,transparent_1px)] bg-[size:40px_40px]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_-100px,#3b82f620,transparent)]" />
          </div>
          {/* Floating Orbs */}
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-blue-400/20 to-cyan-400/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-gradient-to-br from-cyan-400/20 to-blue-400/10 rounded-full blur-[100px] animate-pulse" style={{animationDelay: '2s'}} />
          <div className="absolute top-1/2 left-3/4 w-[300px] h-[300px] bg-gradient-to-br from-blue-400/10 to-indigo-400/10 rounded-full blur-[80px] animate-pulse" style={{animationDelay: '4s'}} />
          {/* Subtle Grid Overlay */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:60px_60px]" />
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-12 lg:py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Trust Badges */}
              <div className="flex flex-wrap gap-3 mb-10">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-500/10 rounded-full"
                >
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-semibold text-blue-700">Fully Managed VPS</span>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-500/10 rounded-full"
                >
                  <Database className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-semibold text-blue-700">NVMe SSD Storage</span>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-cyan-500/10 rounded-full"
                >
                  <Settings className="w-4 h-4 text-cyan-600" />
                  <span className="text-xs font-semibold text-cyan-700">Root Access</span>
                </motion.div>
              </div>

              {/* Heading */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <span className="text-xs font-bold text-blue-600 uppercase tracking-[0.3em] mb-4 block">FULLY MANAGED VPS</span>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8">
                  <motion.span 
                    className="text-gray-900 leading-[1.1] block mb-3 text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                  >
                    Managed VPS
                  </motion.span>
                  <motion.span 
                    className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-500 leading-[1.1] block text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight relative"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    style={{
                      backgroundSize: '200% 100%',
                      animation: 'shimmer 3s linear infinite'
                    }}
                  >
                    We Handle It.
                  </motion.span>
                  <motion.span 
                    className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 leading-[1.1] block text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mt-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    style={{
                      backgroundSize: '200% 100%',
                      animation: 'shimmer 3s linear infinite',
                      animationDelay: '1.5s'
                    }}
                  >
                    You Grow.
                  </motion.span>
                </h1>
              </motion.div>

              {/* Feature List */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-4 mb-12"
              >
                <div className="flex items-start gap-3 relative group">
                  <div className="mt-1">
                    <CheckCircle className="w-5 h-5 text-blue-500" />
                  </div>
                  <div className="relative">
                    <p className="text-gray-600 text-base cursor-help border-b border-dotted border-gray-400 inline-block">
                      Scale instantly with flexible resources
                    </p>
                    
                    {/* Scaling Tooltip on Hover */}
                    <div className="absolute left-0 bottom-full mb-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                      <div className="bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl p-6 shadow-2xl min-w-[320px] border border-blue-400">
                        {/* Arrow */}
                        <div className="absolute -bottom-2 left-8 w-4 h-4 bg-blue-600 transform rotate-45"></div>
                        
                        {/* Icon and Title */}
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur">
                            <TrendingUp className="w-7 h-7 text-white" />
                          </div>
                          <h4 className="text-xl font-bold text-white">Instant Scaling Power</h4>
                        </div>
                        
                        {/* Description */}
                        <p className="text-white/95 text-sm leading-relaxed mb-4">
                          Scale your projects effortlessly with flexible hardware options:
                        </p>
                        
                        {/* Specs Grid */}
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="bg-white/10 rounded-lg p-3 backdrop-blur">
                            <div className="flex items-center gap-2 mb-1">
                              <Cpu className="w-4 h-4 text-white/80" />
                              <span className="font-semibold text-white">vCPU</span>
                            </div>
                            <span className="text-white/90 text-xs">1 to 32 cores</span>
                          </div>
                          
                          <div className="bg-white/10 rounded-lg p-3 backdrop-blur">
                            <div className="flex items-center gap-2 mb-1">
                              <MemoryStick className="w-4 h-4 text-white/80" />
                              <span className="font-semibold text-white">RAM</span>
                            </div>
                            <span className="text-white/90 text-xs">1GB to 128GB</span>
                          </div>
                          
                          <div className="bg-white/10 rounded-lg p-3 backdrop-blur">
                            <div className="flex items-center gap-2 mb-1">
                              <HardDrive className="w-4 h-4 text-white/80" />
                              <span className="font-semibold text-white">Storage</span>
                            </div>
                            <span className="text-white/90 text-xs">20GB to 1.5TB NVMe</span>
                          </div>
                          
                          <div className="bg-white/10 rounded-lg p-3 backdrop-blur">
                            <div className="flex items-center gap-2 mb-1">
                              <Layers className="w-4 h-4 text-white/80" />
                              <span className="font-semibold text-white">KVM</span>
                            </div>
                            <span className="text-white/90 text-xs">Full virtualization</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3 relative group">
                  <div className="mt-1">
                    <CheckCircle className="w-5 h-5 text-blue-500" />
                  </div>
                  <div className="relative">
                    <p className="text-gray-600 text-base cursor-help border-b border-dotted border-gray-400 inline-block">
                      Fully managed server with expert support
                    </p>
                    
                    {/* OS Tooltip on Hover */}
                    <div className="absolute left-0 bottom-full mb-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                      <div className="bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl p-6 shadow-2xl min-w-[320px] border border-blue-400">
                        {/* Arrow */}
                        <div className="absolute -bottom-2 left-8 w-4 h-4 bg-blue-600 transform rotate-45"></div>
                        
                        {/* OS Logos and Names - Styled as Brands */}
                        <div className="space-y-4">
                          {/* Windows Server */}
                          <div className="flex items-center gap-3">
                            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="white">
                              <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801"/>
                            </svg>
                            <span className="font-semibold text-white text-xl tracking-tight">Windows Server</span>
                          </div>
                          
                          {/* Ubuntu */}
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-white/20 rounded flex items-center justify-center">
                              <Terminal className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-semibold text-white text-xl tracking-tight">Ubuntu</span>
                          </div>
                          
                          {/* Debian */}
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-white/20 rounded flex items-center justify-center">
                              <Layers className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-semibold text-white text-xl tracking-tight">Debian</span>
                          </div>
                          
                          {/* AlmaLinux */}
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-white/20 rounded flex items-center justify-center">
                              <Server className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-semibold text-white text-xl tracking-tight">AlmaLinux</span>
                          </div>
                        </div>
                        
                        <div className="mt-4 pt-4 border-t border-white/20">
                          <p className="text-white/90 text-sm">
                            Choose your operating system: Windows or Linux, with options like AlmaLinux, Windows Server, Debian, or Ubuntu. Create hosting accounts with optional cPanel/WHM + Installatron or Plesk.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3 relative group">
                  <div className="mt-1">
                    <CheckCircle className="w-5 h-5 text-blue-500" />
                  </div>
                  <div className="relative">
                    <p className="text-gray-600 text-base cursor-help border-b border-dotted border-gray-400 inline-block">
                      99.9% uptime guaranteed
                    </p>
                    
                    {/* Uptime Tooltip on Hover */}
                    <div className="absolute left-0 bottom-full mb-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                      <div className="bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl p-6 shadow-2xl min-w-[320px] border border-blue-400">
                        {/* Arrow */}
                        <div className="absolute -bottom-2 left-8 w-4 h-4 bg-blue-600 transform rotate-45"></div>
                        
                        {/* Icon and Title */}
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur">
                            <Activity className="w-7 h-7 text-white animate-pulse" />
                          </div>
                          <h4 className="text-xl font-bold text-white">Rock-Solid Reliability</h4>
                        </div>
                        
                        {/* Description */}
                        <p className="text-white/95 text-sm leading-relaxed mb-4">
                          Your sites stay online with enterprise-grade protection:
                        </p>
                        
                        {/* Features List */}
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <Check className="w-3 h-3 text-white" />
                            </div>
                            <div>
                              <span className="font-semibold text-white text-sm">99.9% Uptime SLA</span>
                              <p className="text-white/80 text-xs mt-0.5">Guaranteed availability backed by our SLA</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <Check className="w-3 h-3 text-white" />
                            </div>
                            <div>
                              <span className="font-semibold text-white text-sm">24/7 Monitoring</span>
                              <p className="text-white/80 text-xs mt-0.5">Round-the-clock network surveillance</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <Check className="w-3 h-3 text-white" />
                            </div>
                            <div>
                              <span className="font-semibold text-white text-sm">DDoS Protection</span>
                              <p className="text-white/80 text-xs mt-0.5">Advanced attack mitigation included</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <Check className="w-3 h-3 text-white" />
                            </div>
                            <div>
                              <span className="font-semibold text-white text-sm">Auto Backups</span>
                              <p className="text-white/80 text-xs mt-0.5">Daily snapshots for instant recovery</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-4 sm:gap-5 mb-12 justify-center lg:justify-start"
              >
                <button
                  onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-8 sm:px-10 py-4 sm:py-4.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-bold text-base sm:text-lg hover:from-blue-700 hover:to-cyan-600 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
                >
                  Get Plans and Pricing
                </button>
                <a
                  href="/hosting/vps"
                  className="inline-block px-8 sm:px-10 py-4 sm:py-4.5 bg-white text-blue-600 rounded-xl font-bold text-base sm:text-lg border-2 border-blue-200 hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  See Self Managed VPS
                </a>
              </motion.div>

              {/* Trust Points */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex items-center gap-4 flex-wrap justify-center lg:justify-start mt-8"
              >
                <p className="text-xs sm:text-sm text-gray-600 font-medium text-center lg:text-left">
                  ✓ 30-day money-back guarantee • ✓ Cancel anytime
                </p>
              </motion.div>
            </motion.div>

            {/* Right Visual - Dashboard Mockup */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative lg:pl-12 hidden lg:block"
            >
              <div className="relative">
                {/* Main Dashboard Card */}
                <div className="bg-white rounded-2xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.2)] border border-gray-100 p-6 relative">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg">
                        <Server className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-sm">My VPS Hosting</h3>
                        <p className="text-xs text-gray-500">vps01.flickmax.com</p>
                      </div>
                    </div>
                  </div>

                  {/* Tabs */}
                  <div className="flex gap-6 border-b border-gray-200 mb-5">
                    <button className="pb-2.5 text-sm font-semibold text-blue-600 border-b-2 border-blue-600">
                      Usage
                    </button>
                    <button className="pb-2.5 text-sm font-medium text-gray-400 hover:text-gray-600">
                      Uptime
                    </button>
                  </div>

                  {/* Usage Stats */}
                  <div className="space-y-5">
                    <div>
                      <div className="flex justify-between text-xs mb-2">
                        <span className="text-gray-500 font-medium">CPU</span>
                        <span className="text-gray-900 font-semibold">45%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: "45%" }}
                          transition={{ duration: 1, delay: 0.5 }}
                          className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full" 
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-2">
                        <span className="text-gray-500 font-medium">Memory</span>
                        <span className="text-gray-900 font-semibold">62%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: "62%" }}
                          transition={{ duration: 1, delay: 0.7 }}
                          className="h-full bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full" 
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-2">
                        <span className="text-gray-500 font-medium">Storage</span>
                        <span className="text-gray-900 font-semibold">38%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: "38%" }}
                          transition={{ duration: 1, delay: 0.9 }}
                          className="h-full bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full" 
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-2">
                        <span className="text-gray-500 font-medium">Bandwidth</span>
                        <span className="text-gray-900 font-semibold">71%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: "71%" }}
                          transition={{ duration: 1, delay: 1.1 }}
                          className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full" 
                        />
                      </div>
                    </div>
                  </div>

                  {/* Performance Graph */}
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-medium text-gray-700">Server Performance</span>
                      <span className="text-[10px] text-gray-400">Last 24 hours</span>
                    </div>
                    <div className="h-24 flex items-end gap-0.5">
                      {[40, 55, 45, 70, 65, 80, 75, 90, 85, 70, 60, 50, 65, 75, 80, 70, 55, 60, 45, 50, 40, 35, 30, 25].map((height, i) => (
                        <motion.div 
                          key={i} 
                          initial={{ height: 0 }}
                          animate={{ height: `${height}%` }}
                          transition={{ duration: 0.5, delay: i * 0.02 }}
                          className="flex-1 bg-gradient-to-t from-blue-400 to-cyan-400 rounded-t" 
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 1.5 }}
                  className="absolute -top-3 -right-3 bg-white rounded-xl shadow-xl p-3 border border-gray-100"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center">
                      <Activity className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">99.9%</p>
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider">Uptime Status</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 1.8 }}
                  className="absolute -bottom-4 -left-4 bg-white rounded-lg shadow-lg p-3 border border-gray-100"
                >
                  <div className="flex items-center gap-2">
                    <Settings className="w-4 h-4 text-gray-600" />
                    <div>
                      <p className="text-xs font-semibold text-gray-900">Manage Email Alerts</p>
                      <div className="flex gap-1 mt-1">
                        {[true, true, false, true].map((active, i) => (
                          <div key={i} className={`w-6 h-3 ${active ? 'bg-blue-100' : 'bg-gray-100'} rounded-full flex items-center justify-end px-0.5`}>
                            <div className={`w-2 h-2 ${active ? 'bg-blue-600' : 'bg-gray-400'} rounded-full`} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Background Transition Section */}
      <div className="bg-gradient-to-b from-cyan-50/20 via-blue-50/10 to-gray-50/50 h-20"></div>

      {/* Sticky Navigation Bar - Desktop Only */}
      <div className="hidden lg:block sticky top-24 z-40">
        <div className="max-w-7xl mx-auto px-4 pr-8">
          <div className="flex items-center justify-end py-2">
            <nav className="flex items-center gap-6 md:gap-8 bg-white/95 backdrop-blur-md rounded-full px-5 md:px-6 py-2.5 shadow-lg border border-gray-200/50">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="flex items-center justify-center text-gray-600 hover:text-blue-600 transition-colors"
                aria-label="Back to top"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              </button>
              
              <a 
                href="#pricing" 
                className={`text-xs font-medium transition-colors whitespace-nowrap ${
                  activeSection === 'pricing' ? 'text-blue-600 font-semibold' : 'text-gray-700 hover:text-blue-600'
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Plans and Pricing
              </a>
              
              <a 
                href="#benefits" 
                className={`text-xs font-medium transition-colors ${
                  activeSection === 'benefits' ? 'text-blue-600 font-semibold' : 'text-gray-700 hover:text-blue-600'
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('benefits')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Benefits
              </a>
              
              <a 
                href="#use-cases" 
                className={`text-xs font-medium transition-colors hidden sm:block ${
                  activeSection === 'use-cases' ? 'text-blue-600 font-semibold' : 'text-gray-700 hover:text-blue-600'
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('use-cases')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Popular Uses
              </a>
              
              <a 
                href="#faq" 
                className={`text-xs font-medium transition-colors ${
                  activeSection === 'faq' ? 'text-blue-600 font-semibold' : 'text-gray-700 hover:text-blue-600'
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                FAQ
              </a>
            </nav>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Navigation - Bottom */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200/50 shadow-lg">
        <nav className="flex items-center justify-around py-2 px-2">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex flex-col items-center justify-center text-gray-600 hover:text-blue-600 transition-colors p-1"
            aria-label="Back to top"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            <span className="text-[10px] mt-0.5">Top</span>
          </button>
          
          <a 
            href="#pricing" 
            className={`flex flex-col items-center justify-center p-1 transition-colors ${
              activeSection === 'pricing' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
            }`}
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <span className="text-[10px] font-medium">Pricing</span>
          </a>
          
          <a 
            href="#benefits" 
            className={`flex flex-col items-center justify-center p-1 transition-colors ${
              activeSection === 'benefits' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
            }`}
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('benefits')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <span className="text-[10px] font-medium">Benefits</span>
          </a>
          
          <a 
            href="#use-cases" 
            className={`flex flex-col items-center justify-center p-1 transition-colors ${
              activeSection === 'use-cases' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
            }`}
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('use-cases')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <span className="text-[10px] font-medium">Uses</span>
          </a>
          
          <a 
            href="#faq" 
            className={`flex flex-col items-center justify-center p-1 transition-colors ${
              activeSection === 'faq' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
            }`}
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <span className="text-[10px] font-medium">FAQ</span>
          </a>
        </nav>
      </div>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 lg:py-20 bg-gradient-to-b from-gray-50/50 to-white">
        <div className="max-w-[1400px] mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 leading-tight">
              Choose Your VPS Plan
            </h2>
            <p className="text-base md:text-lg text-gray-600 mb-8 leading-relaxed">
              Scalable solutions for projects of any size
            </p>
            
            {/* Performance Type Toggle */}
            <div className="inline-flex rounded-full bg-gray-100 p-1">
              <button
                onClick={() => {
                  setPerformanceType('standard')
                }}
                className={`px-8 py-3 rounded-full font-medium transition-all ${
                  performanceType === 'standard'
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <div className="text-center">
                  <div className="text-sm font-semibold">Standard Performance</div>
                  <div className="text-xs mt-0.5 opacity-90">Best value for most projects</div>
                </div>
              </button>
              <button
                onClick={() => {
                  setPerformanceType('high')
                }}
                className={`px-8 py-3 rounded-full font-medium transition-all ${
                  performanceType === 'high'
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <div className="text-center">
                  <div className="text-sm font-semibold">High Performance</div>
                  <div className="text-xs mt-0.5 opacity-90">More RAM, CPU and storage</div>
                </div>
              </button>
            </div>
          </div>

          {/* VPS Plans Grid */}
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
          ) : (
          <div className="relative py-8">
            {/* Plans Container */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 px-4 lg:px-0">
                {currentPlans.map((plan, index) => (
              <motion.div
                key={`${plan.productId}-${currency}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                {/* Recommended Badge */}
                {plan.isRecommended && (
                  <div className="absolute -top-3 left-0 right-0 z-10 flex justify-center">
                    <span className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-bold py-1.5 px-4 rounded-full shadow-lg">
                      MOST POPULAR
                    </span>
                  </div>
                )}
                
                  <div className={`bg-white h-full flex flex-col transition-all duration-300 rounded-xl ${
                    plan.isRecommended 
                      ? 'shadow-xl border-2 border-blue-500 mt-2' 
                      : 'border border-gray-200 hover:border-blue-400 hover:shadow-lg'
                  }`}>
                    <div className="p-4 sm:p-5 flex flex-col flex-1">
                  {/* Plan Name */}
                  <h3 className="text-xs sm:text-sm font-bold mb-3 text-center text-gray-900">
                    {plan.name}
                  </h3>

                  {/* Savings Badge - Only show if there's a real discount */}
                  {plan.savings > 0 && (
                    <div className="text-center mb-3">
                      <span className="inline-block bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">
                        SAVE {plan.savings}%
                      </span>
                      <span className="block line-through text-xs sm:text-sm text-gray-500 mt-1.5">
                        {getCurrencySymbol(currency)}{plan.originalPrice?.toFixed(2) || '0.00'}/mo
                      </span>
                    </div>
                  )}
                  {plan.savings === 0 && (
                    <div className="mb-3 h-9"></div>
                  )}

                  {/* Price Display */}
                  <div className="mb-4 text-center">
                    <div className="flex items-end gap-0.5 justify-center">
                      <span className="text-xl lg:text-2xl font-bold text-gray-900">
                        {getCurrencySymbol(currency)}{Math.floor(plan.monthlyPrice)}
                      </span>
                      <span className="text-sm lg:text-base font-bold text-gray-900">
                        .{(plan.monthlyPrice % 1).toFixed(2).substring(2)}
                      </span>
                      <span className="text-xs mb-0.5 text-gray-600">/mo</span>
                    </div>
                    <div className="text-xs mt-2 space-y-0.5">
                      <p className="font-semibold text-gray-700">
                        {getCurrencySymbol(currency)}{plan.yearlyPrice?.toFixed(0) || '0'} for 12 months
                      </p>
                      <p className="text-gray-500">
                        30-day money back
                      </p>
                    </div>
                  </div>

                  {/* Configure Button */}
                  <button
                    onClick={() => handleConfigureServer(plan)}
                    className={`w-full py-3 rounded-lg text-sm font-semibold transition-all mb-4 transform hover:-translate-y-0.5 ${
                      plan.isRecommended 
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:from-blue-700 hover:to-cyan-600 shadow-lg hover:shadow-xl' 
                        : 'bg-gray-900 text-white hover:bg-gray-800 hover:shadow-lg'
                    }`}
                  >
                    Configure Your Server
                  </button>

                  {/* Specs List */}
                  <div className="space-y-2 sm:space-y-2.5 text-[10px] sm:text-xs pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <Cpu className="w-3.5 h-3.5 flex-shrink-0 text-blue-500" />
                      <span className="text-gray-700">{plan.specs.cpu}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MemoryStick className="w-3.5 h-3.5 flex-shrink-0 text-blue-500" />
                      <span className="text-gray-700">{plan.specs.ram}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <HardDrive className="w-3.5 h-3.5 flex-shrink-0 text-cyan-500" />
                      <span className="text-gray-700">{plan.specs.storage}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <RefreshCw className="w-3.5 h-3.5 flex-shrink-0 text-cyan-500" />
                      <span className="relative text-gray-700 text-xs">
                        {plan.specs.snapshots}
                        <button 
                          className="ml-0.5 text-gray-400 hover:text-gray-600 relative"
                          onMouseEnter={() => setActiveTooltip(`snapshots-${index}`)}
                          onMouseLeave={() => setActiveTooltip(null)}
                        >
                          <svg className="w-2.5 h-2.5 inline" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                          </svg>
                        </button>
                        {activeTooltip === `snapshots-${index}` && (
                          <div className="absolute z-50 bottom-full left-0 mb-2 w-56 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-xl">
                            <button 
                              onClick={() => setActiveTooltip(null)}
                              className="absolute top-2 right-2 text-gray-400 hover:text-white"
                            >
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </button>
                            {tooltipContent.snapshots}
                          </div>
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Terminal className="w-3.5 h-3.5 flex-shrink-0 text-orange-500" />
                      <span className="text-gray-700 text-xs">{plan.specs.os}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Settings className="w-3.5 h-3.5 flex-shrink-0 text-indigo-500" />
                      <span className="relative text-gray-700 text-xs">
                        {plan.specs.panel}
                        {plan.specs.panel !== 'No Control Panel' && (
                          <>
                            <button 
                              className="ml-0.5 text-gray-400 hover:text-gray-600 relative"
                              onMouseEnter={() => setActiveTooltip(`panel-${index}`)}
                              onMouseLeave={() => setActiveTooltip(null)}
                            >
                              <svg className="w-2.5 h-2.5 inline" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                              </svg>
                            </button>
                            {activeTooltip === `panel-${index}` && (
                              <div className="absolute z-50 bottom-full left-0 mb-2 w-56 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-xl">
                                <button 
                                  onClick={() => setActiveTooltip(null)}
                                  className="absolute top-2 right-2 text-gray-400 hover:text-white"
                                >
                                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                  </svg>
                                </button>
                                {tooltipContent.panel}
                              </div>
                            )}
                          </>
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Network className="w-3.5 h-3.5 flex-shrink-0 text-pink-500" />
                      <span className="relative text-gray-700 text-xs">
                        {plan.specs.ips}
                        <button 
                          className="ml-0.5 text-gray-400 hover:text-gray-600 relative"
                          onMouseEnter={() => setActiveTooltip(`ips-${index}`)}
                          onMouseLeave={() => setActiveTooltip(null)}
                        >
                          <svg className="w-2.5 h-2.5 inline" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                          </svg>
                        </button>
                        {activeTooltip === `ips-${index}` && (
                          <div className="absolute z-50 bottom-full left-0 mb-2 w-56 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-xl">
                            <button 
                              onClick={() => setActiveTooltip(null)}
                              className="absolute top-2 right-2 text-gray-400 hover:text-white"
                            >
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </button>
                            {tooltipContent.ips}
                          </div>
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="w-3.5 h-3.5 flex-shrink-0 text-blue-500" />
                      <span className="relative text-gray-700 text-xs">
                        {plan.specs.datacenters}
                        <button 
                          className="ml-0.5 text-gray-400 hover:text-gray-600 relative"
                          onMouseEnter={() => setActiveTooltip(`datacenters-${index}`)}
                          onMouseLeave={() => setActiveTooltip(null)}
                        >
                          <svg className="w-2.5 h-2.5 inline" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                          </svg>
                        </button>
                        {activeTooltip === `datacenters-${index}` && (
                          <div className="absolute z-50 bottom-full left-0 mb-2 w-56 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-xl">
                            <button 
                              onClick={() => setActiveTooltip(null)}
                              className="absolute top-2 right-2 text-gray-400 hover:text-white"
                            >
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </button>
                            {tooltipContent.datacenters}
                          </div>
                        )}
                      </span>
                    </div>
                    {plan.specs.management && (
                      <div className="flex items-center gap-2">
                        <Users className="w-3.5 h-3.5 flex-shrink-0 text-purple-500" />
                        <span className="text-gray-700 text-xs">{plan.specs.management}</span>
                      </div>
                    )}
                  </div>
                    </div>
                  </div>
              </motion.div>
            ))}
            </div>
          </div>
          )}

          {/* Additional Info */}
          <div className="mt-12 text-center">
            <div className="flex items-center justify-center gap-8">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Shield className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">DDoS Protected</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Lock className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">SSL Included</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <Clock className="w-4 h-4 text-cyan-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">Instant Setup</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What's Included Section - Redesigned */}
      <section className="py-16 lg:py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full mb-4"
            >
              <Package className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-semibold text-blue-600">
                {performanceType === 'standard' ? 'STANDARD PERFORMANCE' : 'HIGH PERFORMANCE'}
              </span>
            </motion.div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              Everything Included in Your VPS Plan
            </h2>
            <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Get enterprise-grade features and performance with every plan
            </p>
          </div>

          {/* Features Grid - Modern Card Design */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* NVMe SSDs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-t-2xl" />
              <div className="mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Zap className="w-7 h-7 text-blue-600" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Lightning-Fast NVMe SSDs</h3>
              <p className="text-sm text-gray-600 leading-6">
                3X faster performance with NVMe storage. Full KVM virtualization and scalable resources.
              </p>
              <div className="mt-4 flex items-center text-xs text-blue-600 font-medium">
                <TrendingUp className="w-3 h-3 mr-1" />
                Up to 3X Speed Boost
              </div>
            </motion.div>

            {/* DDoS Protection + SSL */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-t-2xl" />
              <div className="mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Shield className="w-7 h-7 text-blue-600" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Advanced DDoS Protection</h3>
              <p className="text-sm text-gray-600 leading-6">
                24/7 network monitoring, DDoS mitigation, and free SSL certificate with dedicated IP.
              </p>
              <div className="mt-4 flex items-center text-xs text-blue-600 font-medium">
                <Lock className="w-3 h-3 mr-1" />
                Enterprise Security
              </div>
            </motion.div>

            {/* Unlimited Hosting */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-t-2xl" />
              <div className="mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Server className="w-7 h-7 text-indigo-600" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Unlimited Hosting</h3>
              <p className="text-sm text-gray-600 leading-6">
                Host unlimited websites with optional cPanel/WHM and Installatron support.
              </p>
              <div className="mt-4 flex items-center text-xs text-indigo-600 font-medium">
                <Layers className="w-3 h-3 mr-1" />
                No Limits
              </div>
            </motion.div>

            {/* Root Access */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-t-2xl" />
              <div className="mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Terminal className="w-7 h-7 text-orange-600" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Full Root Access</h3>
              <p className="text-sm text-gray-600 leading-6">
                Complete server control with SSH access. Configure everything to your exact needs.
              </p>
              <div className="mt-4 flex items-center text-xs text-orange-600 font-medium">
                <Settings className="w-3 h-3 mr-1" />
                Total Control
              </div>
            </motion.div>
          </div>

          {/* Additional Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-8 border border-blue-100"
          >
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-3 shadow-md">
                  <Activity className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">99.9% Uptime Guarantee</h4>
                <p className="text-xs text-gray-600">Guaranteed reliability for your applications</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-3 shadow-md">
                  <RefreshCw className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">Automated Backups</h4>
                <p className="text-xs text-gray-600">7-day snapshots with instant restore</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-3 shadow-md">
                  <Globe className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">Global Data Centers</h4>
                <p className="text-xs text-gray-600">Choose from multiple worldwide locations</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Managed VPS Features Section */}
      <section id="features" className="py-16 lg:py-20 bg-gradient-to-b from-white via-blue-50/30 to-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(59, 130, 246, 0.1) 35px, rgba(59, 130, 246, 0.1) 70px)`
          }} />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-14">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 mb-4"
            >
              <span className="px-4 py-1.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-semibold rounded-full uppercase tracking-wider">
                Managed VPS Features
              </span>
            </motion.div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Managed VPS Hosting
              </span>{' '}
              <span className="text-gray-900">is loaded with services</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Perfect for business owners who want to save valuable time. With us managing your servers, 
              you can focus on what matters most - growing your business.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* 24/7 Fully-Managed Support */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-200"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-cyan-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform">
                  <HeadphonesIcon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">24/7 Fully-Managed Support</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Our server hosting experts handle all your requests. Choose from the expert services menu or request individual tasks.
                </p>
              </div>
            </motion.div>

            {/* Monitoring and Remediation */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-200"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-cyan-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform">
                  <Activity className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Monitoring & Remediation</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  We monitor server uptime, resources (CPU, RAM, Storage), and domains. Then remediate issues and alert you for further action.
                </p>
              </div>
            </motion.div>

            {/* Fully-Managed Backups */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-200"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-cyan-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform">
                  <RefreshCw className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Fully-Managed Backups</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Get 7 days of automated snapshot backups with on-demand backup options. Plus, our team is available 24/7 to assist you.
                </p>
              </div>
            </motion.div>

            {/* Managed Patching & Updates */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-200"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/5 to-blue-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform">
                  <Settings className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Managed Patching & Updates</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Stop manually patching your OS and control panel. We've got it covered, so your server is always up-to-date and secure.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Additional Feature Highlights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mt-12 text-center"
          >
            <div className="inline-flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full">
                <CheckCircle className="w-4 h-4" />
                <span className="font-medium">Expert Management</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-cyan-50 text-cyan-700 rounded-full">
                <Shield className="w-4 h-4" />
                <span className="font-medium">Enhanced Security</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full">
                <Zap className="w-4 h-4" />
                <span className="font-medium">Optimized Performance</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-cyan-50 text-cyan-700 rounded-full">
                <Clock className="w-4 h-4" />
                <span className="font-medium">Save Valuable Time</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Popular Uses Section */}
      <section id="use-cases" className="py-12 lg:py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              Popular uses for VPS Hosting
            </h2>
            <p className="text-base md:text-lg text-gray-600 leading-relaxed">
              Discover the endless possibilities with our flexible VPS solutions
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Ecommerce-ready hosting */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              whileHover={{ y: -5 }}
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-cyan-500" />
              <div className="p-6">
                <div className="w-14 h-14 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Boxes className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-3 leading-snug">Ecommerce-ready hosting</h3>
                <p className="text-sm text-gray-600 leading-6">
                  Launch your traffic-ready ecommerce site by installing WordPress, Magento, OpenCart and PrestaShop — with a single click.
                </p>
              </div>
            </motion.div>

            {/* Multiple sites */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              whileHover={{ y: -5 }}
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-cyan-500" />
              <div className="p-6">
                <div className="w-14 h-14 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Layers className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-3 leading-snug">Multiple sites</h3>
                <p className="text-sm text-gray-600 leading-6">
                  Host multiple sites without impacting the response time of any one client — thanks to our isolated environment.
                </p>
              </div>
            </motion.div>

            {/* Web or database server */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              whileHover={{ y: -5 }}
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-cyan-500" />
              <div className="p-6">
                <div className="w-14 h-14 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Database className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-3 leading-snug">Web or database server</h3>
                <p className="text-sm text-gray-600 leading-6">
                  Instantly set up a web or database server — whether it's a MySQL or Apache.
                </p>
              </div>
            </motion.div>

            {/* Resource-heavy applications */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              whileHover={{ y: -5 }}
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-cyan-500" />
              <div className="p-6">
                <div className="w-14 h-14 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Rocket className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-3 leading-snug">Resource-heavy applications</h3>
                <p className="text-sm text-gray-600 leading-6">
                  Take control of them with our VPS — be it business, financial, CRM, social media, or real estate apps.
                </p>
              </div>
            </motion.div>

            {/* Email server control */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              whileHover={{ y: -5 }}
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-cyan-500" />
              <div className="p-6">
                <div className="w-14 h-14 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Network className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-3 leading-snug">Email server control</h3>
                <p className="text-sm text-gray-600 leading-6">
                  Set up and fully control your own email server. Run unlimited mailboxes and addresses for your business or clients.
                </p>
              </div>
            </motion.div>

            {/* Global testing environments */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              whileHover={{ y: -5 }}
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-cyan-500" />
              <div className="p-6">
                <div className="w-14 h-14 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Globe className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-3 leading-snug">Global testing environments</h3>
                <p className="text-sm text-gray-600 leading-6">
                  Instantly spin up test servers across any continent and test the response times of your app or site.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Combined Features & Why Choose Section */}
      <section id="features" className="py-12 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              Enterprise-Grade VPS Features
            </h2>
            <p className="text-base md:text-lg text-gray-600 leading-relaxed">
              Everything you need to run demanding applications
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Shield,
                title: 'DDoS Protection',
                description: 'Advanced protection against DDoS attacks with automatic mitigation',
                gradient: 'from-blue-600 to-cyan-500'
              },
              {
                icon: Zap,
                title: 'NVMe SSD Storage',
                description: 'Lightning-fast NVMe SSDs for superior I/O performance',
                gradient: 'from-blue-600 to-cyan-500'
              },
              {
                icon: Globe,
                title: 'Global Network',
                description: 'Multiple data center locations for optimal latency',
                gradient: 'from-blue-600 to-cyan-500'
              },
              {
                icon: Terminal,
                title: 'Full Root Access',
                description: 'Complete control over your server environment',
                gradient: 'from-blue-600 to-cyan-500'
              },
              {
                icon: RefreshCw,
                title: 'Automated Backups',
                description: 'Daily automated backups with easy restore options',
                gradient: 'from-blue-600 to-cyan-500'
              },
              {
                icon: HeadphonesIcon,
                title: '24/7 Support',
                description: 'Expert support available round the clock',
                gradient: 'from-blue-600 to-cyan-500'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group bg-white rounded-xl p-6 hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-blue-200"
              >
                <div className={`w-12 h-12 bg-gradient-to-r ${feature.gradient} rounded-lg flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600 leading-6">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>




      {/* FAQ Section */}
      <section id="faq" className="py-12 lg:py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-bold rounded-full mb-4">
              FAQ
            </span>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-base md:text-lg text-gray-600 leading-relaxed">
              Everything you need to know about Flickmax VPS Hosting
            </p>
          </motion.div>

          <div className="space-y-4">
            {[
              {
                question: "What is VPS hosting and why should I choose it?",
                answer: "VPS (Virtual Private Server) hosting gives you your own private space on a server with dedicated resources like CPU, RAM, and storage that aren't shared with others. Think of it like having your own apartment in a building rather than sharing a room. You get better performance, enhanced security, faster loading times, and full control over your server environment. It's perfect when you've outgrown shared hosting but don't need a full dedicated server yet."
              },
              {
                question: "What's the difference between Managed and Self-Managed VPS?",
                answer: "Self-Managed VPS is for tech-savvy users who are comfortable with Linux command line and want complete control over their server setup. You handle all updates, security, and configurations yourself. Managed VPS includes expert support from Flickmax - we handle all the technical maintenance, security updates, and server optimization so you can focus on your business. Choose Managed if you want peace of mind, or Self-Managed if you prefer hands-on control."
              },
              {
                question: "Can I use both Linux and Windows on Flickmax VPS?",
                answer: "Yes! We support both operating systems. Choose Linux (AlmaLinux) for open-source flexibility and lower costs, or Windows Server with Plesk for familiar Windows applications and .NET support. Both options come with resources ranging from 2GB to 32GB RAM, so you can scale based on your needs."
              },
              {
                question: "How many IP addresses do I get and what are they for?",
                answer: "Every VPS plan includes one dedicated IP address. Higher-tier plans include up to 3 additional IPs. Use them for running multiple SSL certificates, improving email deliverability, separating your control panel from websites for better security, or running custom applications that require their own IP address."
              },
              {
                question: "Where are your servers located?",
                answer: "We have data centers strategically located across North America, Europe, and Asia-Pacific. During setup, you can choose the location closest to your target audience for optimal performance and lowest latency."
              },
              {
                question: "Are my files backed up automatically?",
                answer: "Yes! All VPS plans include automated weekly snapshot backups. You can schedule backup times that work for you or create on-demand backups before making major changes. We keep 7 days of backups so you can easily restore if needed."
              },
              {
                question: "How quickly can I start using my VPS?",
                answer: "Most VPS servers are ready within minutes of purchase. In rare cases, it might take up to 24 hours. If you need urgent setup, our support team can help expedite the process - just give us a call!"
              },
              {
                question: "Why choose Flickmax for VPS hosting?",
                answer: "Flickmax is trusted by millions worldwide for reliable hosting. We offer high-performance KVM virtualization, flexible configurations for any budget, 99.9% uptime guarantee, and 24/7 expert support. Plus, you get automated backups, real-time monitoring, choice of OS and control panels, and the option to upgrade to fully managed services whenever you need extra help."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="group"
              >
                <details className="bg-white border border-gray-200 rounded-xl hover:border-blue-300 transition-all duration-300">
                  <summary className="px-6 py-4 cursor-pointer list-none hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 rounded-t-xl transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-semibold text-gray-900 pr-4">{faq.question}</h3>
                      <div className="flex-shrink-0">
                        <motion.div
                          className="w-8 h-8 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full flex items-center justify-center"
                        >
                          <ChevronDown className="w-4 h-4 text-white transition-transform duration-300 group-open:rotate-180" />
                        </motion.div>
                      </div>
                    </div>
                  </summary>
                  <div className="px-6 pb-4 pt-2">
                    <p className="text-sm text-gray-600 leading-6">{faq.answer}</p>
                  </div>
                </details>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 text-center p-8 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border border-blue-200"
          >
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full flex items-center justify-center">
                <Shield className="w-8 h-8 text-white" />
              </div>
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 leading-tight">Need Complete Peace of Mind?</h3>
            <p className="text-base text-gray-700 mb-2 font-semibold">Try Our Fully Managed VPS Hosting</p>
            <p className="text-sm text-gray-600 mb-6 max-w-2xl mx-auto leading-relaxed">
              Let our experts handle everything for you - from server setup and security to 24/7 monitoring, 
              automatic updates, and performance optimization. Focus on growing your business while we take 
              care of all the technical details.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-gray-700">Expert Setup & Migration</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-gray-700">24/7 Proactive Monitoring</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-gray-700">Automatic Security Updates</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-gray-700">Performance Optimization</span>
              </div>
            </div>
            <button 
              onClick={() => window.location.href = '/hosting/managed-vps'}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-600 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Explore Fully Managed VPS →
            </button>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-16 md:py-20 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff1a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff1a_1px,transparent_1px)] bg-[size:20px_20px]" />
        </div>
        
        <div className="relative max-w-5xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6 border border-white/30">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span className="text-sm font-semibold text-white">Limited Time Offer - Save up to 50%</span>
            </div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight">
              Ready to Get Started?
            </h2>
            <p className="text-lg md:text-xl text-white/95 mb-8">
              Deploy your VPS in under 2 minutes with our instant provisioning
            </p>
            
            {/* Support Info with Country */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 md:p-8 mb-8 max-w-2xl mx-auto border border-white/20">
              <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
                {/* Country Info */}
                <div className="flex items-center gap-3">
                  <span className="text-3xl md:text-4xl">{country.flag}</span>
                  <div className="text-left">
                    <p className="text-xs text-white/80">Your Location</p>
                    <p className="text-sm md:text-base font-semibold text-white">{country.name}</p>
                  </div>
                </div>
                
                {/* Divider */}
                <div className="hidden md:block w-px h-12 bg-white/30"></div>
                
                {/* Phone Number */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <HeadphonesIcon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-white/80">24/7 Support</p>
                    <p className="text-base md:text-lg font-bold text-white">{country.phoneNumber}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-6 md:px-8 py-3 md:py-3.5 bg-white text-blue-600 rounded-lg font-bold hover:bg-gray-50 transition-all shadow-xl hover:shadow-2xl"
              >
                View Plans & Pricing
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.open(`tel:${country.phoneNumber.replace(/\s/g, '')}`, '_self')}
                className="px-6 md:px-8 py-3 md:py-3.5 bg-white/10 backdrop-blur-sm text-white rounded-lg font-bold border-2 border-white/30 hover:bg-white/20 transition-all flex items-center justify-center gap-2"
              >
                <HeadphonesIcon className="w-5 h-5" />
                Call {country.phoneNumber}
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
    </>
  )
}