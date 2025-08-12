'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Shield, 
  Zap, 
  Clock, 
  HeadphonesIcon,
  Check,
  Star,
  Lock,
  Globe,
  Rocket,
  Award,
  Users,
  Sparkles,
  ArrowRight,
  CheckCircle,
  CloudLightning,
  ShieldCheck,
  Code,
  Play,
  X,
  Flame,
  RefreshCw,
  Zap as Lightning,
  Search,
  Layers,
  Settings,
  Boxes,
  HardDrive,
  Palette,
  TrendingUp,
  Smartphone,
  Server,
  Gauge,
  PenTool,
  ShoppingCart,
  Share2,
  Calendar,
  Database,
  Mail,
  FileText,
  CreditCard,
  Package,
  BarChart3,
  Wifi,
  ChartBar,
  ChevronDown,
  Calculator,
  Download,
  MapPin
} from 'lucide-react'
import { useCountry } from '@/contexts/CountryContext'
import { useCart } from '@/contexts/CartContext'
import { getCurrencySymbol, formatPrice } from '@/lib/utils/currency'
import toast from 'react-hot-toast'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { PricingTableSkeleton } from '@/components/ui/PricingSkeleton'

// Website Builder Plans - Fallback data matching actual GoDaddy product IDs
const builderPlans = [
  {
    productId: 'website-builder-personal',
    name: 'Personal',
    tagline: 'Share your passion online',
    monthlyPrice: 6.99,  // listPrice
    yearlyPrice: 59.88,  // salePrice * 12
    yearlyMonthlyRate: 4.99,  // salePrice
    originalPrice: 83.88,  // listPrice * 12
    savings: 29,
    hasSalePrice: true,
    badge: '',
    isPopular: false,
    features: [
      { title: 'Websites', value: '1 Website', highlight: false },
      { title: 'Storage', value: '10 GB NVMe SSD', highlight: false },
      { title: 'Visitors', value: '~25,000/month', highlight: false },
      { title: 'Free Business Email', value: '1st Year', highlight: true },
      { title: 'SSL Certificate', value: 'Free', highlight: true },
      { title: 'Daily Backups', value: '1 Year Retention', highlight: false },
      { title: 'Malware Scan & Removal', value: 'Included', highlight: false },
      { title: 'Templates', value: '100+ Professional', highlight: false },
      { title: 'Drag & Drop Editor', value: 'Included', highlight: true },
      { title: 'SEO Optimizer', value: 'Not Included', highlight: false },
      { title: 'CDN', value: 'Not Included', highlight: false }
    ],
    resources: {
      cpu: '1 CPU Core',
      ram: '512 MB',
      bandwidth: 'Unmetered',
      databases: '1 MySQL DB',
      phpWorkers: '2 Workers'
    }
  },
  {
    productId: 'website-builder-business',
    name: 'Business',
    tagline: 'Create an online presence',
    monthlyPrice: 10.99,  // listPrice
    yearlyPrice: 131.88,  // no sale, so listPrice * 12
    yearlyMonthlyRate: 10.99,  // no discount
    originalPrice: 131.88,
    savings: 0,
    hasSalePrice: false,
    badge: '',
    isPopular: false,
    features: [
      { title: 'Websites', value: '10 Websites', highlight: true },
      { title: 'Storage', value: '25 GB NVMe SSD', highlight: false },
      { title: 'Visitors', value: '~100,000/month', highlight: true },
      { title: 'Free Business Email', value: '1st Year', highlight: true },
      { title: 'SSL Certificate', value: 'Free', highlight: true },
      { title: 'Daily Backups', value: '1 Year Retention', highlight: false },
      { title: 'Malware Scan & Removal', value: 'Included', highlight: false },
      { title: 'Templates', value: '150+ Professional', highlight: false },
      { title: 'Staging Site', value: '1-Click Staging', highlight: true },
      { title: 'SEO Optimizer', value: 'Included', highlight: true },
      { title: 'SFTP Access', value: 'Included', highlight: false }
    ],
    resources: {
      cpu: '2 CPU Cores',
      ram: '1 GB',
      bandwidth: 'Unmetered',
      databases: '25 MySQL DBs',
      phpWorkers: '4 Workers'
    }
  },
  {
    productId: 'website-builder-plus',
    name: 'Business Plus',
    tagline: 'Attract more customers',
    monthlyPrice: 15.99,  // listPrice
    yearlyPrice: 143.88,  // salePrice * 12
    yearlyMonthlyRate: 11.99,  // salePrice
    originalPrice: 191.88,  // listPrice * 12
    savings: 25,
    hasSalePrice: true,
    badge: 'MOST POPULAR',
    isPopular: true,
    features: [
      { title: 'Websites', value: '25 Websites', highlight: true },
      { title: 'Storage', value: '50 GB NVMe SSD', highlight: true },
      { title: 'Visitors', value: '~400,000/month', highlight: true },
      { title: 'Free Business Email', value: '1st Year', highlight: true },
      { title: 'SSL Certificate', value: 'Free + Premium', highlight: true },
      { title: 'Daily Backups', value: '1 Year Retention', highlight: false },
      { title: 'Malware Scan & Removal', value: 'Priority', highlight: true },
      { title: 'Templates', value: '150+ Professional', highlight: false },
      { title: 'Staging Site', value: 'Multiple Staging', highlight: true },
      { title: 'SEO Optimizer', value: 'Premium', highlight: true },
      { title: 'Full CDN', value: 'Included', highlight: true },
      { title: 'SSH Access', value: 'Full Access', highlight: true }
    ],
    resources: {
      cpu: '3 CPU Cores',
      ram: '2 GB',
      bandwidth: 'Unmetered',
      databases: '50 MySQL DBs',
      phpWorkers: '6 Workers'
    }
  },
  {
    productId: 'website-builder-onlinestore',
    name: 'Online Store',
    tagline: 'Sell products and services',
    monthlyPrice: 29.99,  // listPrice
    yearlyPrice: 240.00,  // salePrice * 12
    yearlyMonthlyRate: 20.00,  // salePrice
    originalPrice: 359.88,  // listPrice * 12
    savings: 33,
    hasSalePrice: true,
    badge: 'BEST FOR STORES',
    isPopular: false,
    features: [
      { title: 'Websites', value: 'Unlimited', highlight: true },
      { title: 'Storage', value: '100 GB NVMe SSD', highlight: true },
      { title: 'Visitors', value: '~800,000/month', highlight: true },
      { title: 'Free Business Email', value: '2 Years', highlight: true },
      { title: 'SSL Certificate', value: 'Premium SSL', highlight: true },
      { title: 'Real-time Backups', value: 'Included', highlight: true },
      { title: 'Malware Scan & Removal', value: 'Priority', highlight: true },
      { title: 'E-commerce', value: 'Full Store Features', highlight: true },
      { title: 'Staging Site', value: 'Unlimited', highlight: true },
      { title: 'SEO Optimizer', value: 'Premium', highlight: true },
      { title: 'Full CDN', value: 'Premium CDN', highlight: true },
      { title: 'Object Cache Pro', value: 'Included', highlight: true },
      { title: 'Elastic Resources', value: 'Auto-scale', highlight: true }
    ],
    resources: {
      cpu: '4 CPU Cores',
      ram: '4 GB',
      bandwidth: 'Unmetered',
      databases: 'Unlimited',
      phpWorkers: 'Unlimited'
    }
  }
]

// Website Builder Features - Reorganized with Blue-Cyan Theme
const builderFeatures = [
  // Essential Features - Main Highlights
  {
    icon: Sparkles,
    title: 'AI Website Builder',
    description: 'Let AI create your perfect website in minutes with smart suggestions',
    gradient: 'from-blue-500 to-cyan-500',
    category: 'essential',
    highlight: true
  },
  {
    icon: Settings,
    title: 'Drag & Drop Builder',
    description: 'No coding needed - build visually with our intuitive editor',
    gradient: 'from-blue-600 to-cyan-600',
    category: 'essential',
    highlight: true
  },
  {
    icon: HardDrive,
    title: 'Unlimited Storage & Bandwidth',
    description: 'Never worry about limits - unlimited resources for all plans',
    gradient: 'from-cyan-500 to-teal-500',
    category: 'essential',
    highlight: true
  },
  {
    icon: Smartphone,
    title: 'Responsive Design',
    description: 'Perfect on every device - mobile, tablet, and desktop',
    gradient: 'from-teal-500 to-cyan-500',
    category: 'essential',
    highlight: true
  },
  // Design & Customization
  {
    icon: Palette,
    title: 'Customizable Themes',
    description: '100+ professional templates with endless customization',
    gradient: 'from-blue-400 to-cyan-400',
    category: 'design'
  },
  {
    icon: Layers,
    title: 'Click and Drag Reorder',
    description: 'Rearrange any element with simple drag and drop',
    gradient: 'from-cyan-400 to-teal-400',
    category: 'design'
  },
  {
    icon: ChevronDown,
    title: 'Drop-Down Menus',
    description: 'Multi-level navigation menus with smooth animations',
    gradient: 'from-blue-500 to-cyan-500',
    category: 'design'
  },
  {
    icon: Boxes,
    title: 'Content Blocks',
    description: 'Pre-designed sections ready to customize',
    gradient: 'from-cyan-500 to-blue-500',
    category: 'design'
  },
  {
    icon: FileText,
    title: 'Media Library',
    description: 'Organize images, videos, and files in one place',
    gradient: 'from-blue-400 to-teal-400',
    category: 'design'
  },
  {
    icon: Sparkles,
    title: 'Promo Banners',
    description: 'Eye-catching banners for announcements and offers',
    gradient: 'from-teal-400 to-cyan-400',
    category: 'design'
  },
  // Marketing & Growth
  {
    icon: Search,
    title: 'SEO Optimization',
    description: 'Built-in tools to rank higher on Google',
    gradient: 'from-blue-500 to-cyan-500',
    category: 'marketing'
  },
  {
    icon: Share2,
    title: 'Social Media Integration',
    description: 'Connect all your social channels seamlessly',
    gradient: 'from-cyan-500 to-teal-500',
    category: 'marketing'
  },
  {
    icon: PenTool,
    title: 'Professional Blog',
    description: 'Full-featured blogging platform included',
    gradient: 'from-teal-500 to-blue-500',
    category: 'marketing'
  },
  {
    icon: Mail,
    title: 'Contact Forms',
    description: 'Smart forms with spam protection',
    gradient: 'from-blue-400 to-cyan-500',
    category: 'marketing'
  },
  {
    icon: Zap,
    title: 'Calls to Action',
    description: 'Convert visitors with powerful CTAs',
    gradient: 'from-cyan-400 to-blue-400',
    category: 'marketing'
  },
  {
    icon: ChartBar,
    title: 'Analytics Dashboard',
    description: 'Track performance and visitor insights',
    gradient: 'from-blue-500 to-teal-500',
    category: 'marketing'
  },
  // E-Commerce
  {
    icon: ShoppingCart,
    title: 'Online Store Builder',
    description: 'Complete e-commerce functionality built-in',
    gradient: 'from-blue-600 to-cyan-600',
    category: 'ecommerce'
  },
  {
    icon: CreditCard,
    title: 'Payment Processing',
    description: 'Accept all major credit cards securely',
    gradient: 'from-cyan-600 to-teal-600',
    category: 'ecommerce'
  },
  {
    icon: Calculator,
    title: 'Tax & Shipping',
    description: 'Automated calculations for any location',
    gradient: 'from-teal-600 to-blue-600',
    category: 'ecommerce'
  },
  {
    icon: TrendingUp,
    title: 'Discounts & Coupons',
    description: 'Create promotional offers easily',
    gradient: 'from-blue-500 to-cyan-500',
    category: 'ecommerce'
  },
  {
    icon: RefreshCw,
    title: 'Cart Recovery',
    description: 'Recover abandoned carts automatically',
    gradient: 'from-cyan-500 to-teal-500',
    category: 'ecommerce'
  },
  {
    icon: Download,
    title: 'Digital Downloads',
    description: 'Sell digital products securely',
    gradient: 'from-teal-500 to-blue-500',
    category: 'ecommerce'
  },
  {
    icon: Star,
    title: 'Product Reviews',
    description: 'Build trust with customer ratings',
    gradient: 'from-blue-400 to-cyan-400',
    category: 'ecommerce'
  },
  {
    icon: MapPin,
    title: 'Local Pickup',
    description: 'Offer in-person pickup options',
    gradient: 'from-cyan-400 to-teal-400',
    category: 'ecommerce'
  },
  // Security & Reliability
  {
    icon: Lock,
    title: 'Free SSL Certificate',
    description: 'Secure, encrypted connections for all visitors',
    gradient: 'from-blue-600 to-cyan-600',
    category: 'security'
  },
  {
    icon: Shield,
    title: 'DDoS Protection',
    description: 'Enterprise-level attack mitigation',
    gradient: 'from-cyan-600 to-blue-600',
    category: 'security'
  },
  {
    icon: ShieldCheck,
    title: 'Malware Protection',
    description: 'Automated scanning and threat removal',
    gradient: 'from-blue-500 to-teal-500',
    category: 'security'
  },
  {
    icon: RefreshCw,
    title: 'Backup & Restore',
    description: 'Automatic daily backups with one-click restore',
    gradient: 'from-teal-500 to-cyan-500',
    category: 'security'
  },
  {
    icon: CloudLightning,
    title: 'CDN & Performance',
    description: 'Lightning-fast loading worldwide',
    gradient: 'from-cyan-500 to-blue-500',
    category: 'security'
  },
  {
    icon: Lock,
    title: 'Members-Only Pages',
    description: 'Create exclusive password-protected content',
    gradient: 'from-blue-400 to-cyan-400',
    category: 'security'
  }
]

export default function WebsiteBuilderPage() {
  const { currency, country } = useCountry()
  const { addProductToCart } = useCart()
  
  // Initialize with empty array to force API fetch
  const [plans, setPlans] = useState<any[]>([])
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly')
  const [selectedPlan, setSelectedPlan] = useState<number>(1)
  const [showVideo, setShowVideo] = useState(false)
  const [timeLeft, setTimeLeft] = useState({ minutes: 30, seconds: 0 })
  const [showComparison, setShowComparison] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [addingToCart, setAddingToCart] = useState<string | null>(null)
  const [showDisclaimer, setShowDisclaimer] = useState<string | null>(null)
  
  const heroRef = useRef(null)
  
  // Helper function to get appropriate icon for each feature
  const getFeatureIcon = (text: string) => {
    const lowerText = text.toLowerCase()
    
    // Match feature text to appropriate icons
    if (lowerText.includes('responsive') || lowerText.includes('mobile')) {
      return Smartphone
    }
    if (lowerText.includes('hosting') || lowerText.includes('host')) {
      return Server
    }
    if (lowerText.includes('page-load') || lowerText.includes('performance') || lowerText.includes('rapid') || lowerText.includes('speed')) {
      return Gauge
    }
    if (lowerText.includes('blog') || lowerText.includes('create')) {
      return PenTool
    }
    if (lowerText.includes('ssl') || lowerText.includes('security')) {
      return Lock
    }
    if (lowerText.includes('paypal') || lowerText.includes('payment') || lowerText.includes('donate')) {
      return CreditCard
    }
    if (lowerText.includes('seo') || lowerText.includes('search engine')) {
      return Search
    }
    if (lowerText.includes('social media') || lowerText.includes('integration')) {
      return Share2
    }
    if (lowerText.includes('facebook') || lowerText.includes('share content')) {
      return Share2
    }
    if (lowerText.includes('appointment') || lowerText.includes('booking') || lowerText.includes('schedule')) {
      return Calendar
    }
    if (lowerText.includes('shopping cart') || lowerText.includes('cart') || lowerText.includes('store')) {
      return ShoppingCart
    }
    if (lowerText.includes('product') || lowerText.includes('inventory')) {
      return Package
    }
    if (lowerText.includes('shipping')) {
      return Package
    }
    if (lowerText.includes('discount') || lowerText.includes('promotion')) {
      return TrendingUp
    }
    if (lowerText.includes('email')) {
      return Mail
    }
    if (lowerText.includes('storage') || lowerText.includes('database')) {
      return Database
    }
    if (lowerText.includes('bandwidth') || lowerText.includes('unlimited')) {
      return Wifi
    }
    if (lowerText.includes('analytics') || lowerText.includes('statistics')) {
      return BarChart3
    }
    if (lowerText.includes('template') || lowerText.includes('design')) {
      return Palette
    }
    if (lowerText.includes('support') || lowerText.includes('help')) {
      return HeadphonesIcon
    }
    if (lowerText.includes('backup')) {
      return RefreshCw
    }
    if (lowerText.includes('domain')) {
      return Globe
    }
    if (lowerText.includes('cdn') || lowerText.includes('cloudflare')) {
      return CloudLightning
    }
    if (lowerText.includes('firewall') || lowerText.includes('protection')) {
      return Shield
    }
    if (lowerText.includes('malware') || lowerText.includes('scan')) {
      return ShieldCheck
    }
    
    // Default icon
    return Check
  }

  // Fetch Website Builder plans from API - refresh on currency/country change
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setIsLoading(true)
        console.log('Fetching Website Builder plans for currency:', currency, 'country:', country.code)
        
        // Clear cache by adding timestamp to force fresh data
        const timestamp = new Date().getTime()
        // Always use en-US for market, only change currency
        const response = await fetch(
          `/api/products/website-builder?currency=${currency}&market=en-US&t=${timestamp}`,
          {
            cache: 'no-store',
            headers: {
              'Cache-Control': 'no-cache',
            }
          }
        )
        
        const data = await response.json()
        console.log('API Response:', data)
        
        if (data.plans && data.plans.length > 0) {
          console.log('Setting plans from API:', data.plans)
          setPlans(data.plans)
          
          // Set the popular plan as selected
          const popularIndex = data.plans.findIndex((p: any) => p.isPopular)
          setSelectedPlan(popularIndex !== -1 ? popularIndex : 1)
        } else {
          console.error('No plans in response, using fallback:', data)
          // If no plans from API, keep the fallback
          setPlans(builderPlans)
        }
      } catch (error) {
        console.error('Error fetching Website Builder plans:', error)
        // On error, use fallback plans
        setPlans(builderPlans)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchPlans()
  }, [currency, country])


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


  const handleAddToCart = async (plan: any) => {
    // For Online Store plan, you might want to redirect to a specific URL or handle differently
    if (plan.name === 'Online Store' || plan.productId === 'website-builder-onlinestore') {
      // For now, add to cart normally, but you can customize this
      // window.location.href = 'https://www.secureserver.net/products/website-builder?plan=onlinestore&plid=590175'
    }
    
    try {
      setAddingToCart(plan.productId)
      
      // Use the plan's productId directly from the API
      const period = billingCycle === 'yearly' ? 12 : 1
      await addProductToCart(plan.productId, period, 'MONTH')
      
      // Success message is handled by the cart context
      // No need for additional toast here as it's already shown
    } catch (error) {
      // Error is already shown by cart context
      console.error('Add to cart error:', error)
    } finally {
      setAddingToCart(null)
    }
  }

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

      {/* Dynamic Promo Banner */}
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
                  SAVE UP TO {plans.length > 0 ? Math.max(...plans.map(p => p.savings || 0)) : 40}% OFF on Annual Plans
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-yellow-300 px-2 py-0.5 bg-white/10 rounded-full font-medium">
                7-DAY MONEY BACK GUARANTEE
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
              SAVE UP TO {plans.length > 0 ? Math.max(...plans.map(p => p.savings || 0)) : 40}% OFF on Annual Plans
            </span>
            
            <span className="text-yellow-300 px-2 py-1 bg-white/10 rounded-full text-xs font-medium">
              7-DAY MONEY BACK GUARANTEE
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

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-[85vh] flex items-center justify-center py-20 bg-gradient-to-b from-white via-blue-50/10 to-white">
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
                  #1 RATED WEBSITE BUILDER
                  <Award className="w-5 h-5" />
                </div>
              </div>
            </motion.div>

            {/* Main Headline */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6">
              <motion.span
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="block text-gray-900"
              >
                Create Stunning
              </motion.span>
              <motion.span
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600"
              >
                Websites in Minutes
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="block text-3xl md:text-4xl lg:text-5xl mt-4 text-gray-700"
              >
                Zero Coding Skills Needed
              </motion.span>
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto"
            >
              Build your dream <span className="text-blue-600 font-bold">website in minutes</span> with our intuitive{' '}
              <span className="text-cyan-600 font-bold">drag-and-drop builder</span>,{' '}
              <span className="text-teal-600 font-bold">300+ designer templates</span>, and{' '}
              <span className="text-blue-600 font-bold">AI-powered tools</span>
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            >
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(59, 130, 246, 0.3)' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full font-bold text-lg text-white overflow-hidden shadow-xl"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Get Started Now
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowVideo(true)}
                className="px-8 py-4 bg-white/80 backdrop-blur-sm border-2 border-blue-200 rounded-full font-bold text-lg text-gray-700 hover:bg-white hover:border-blue-300 transition-all shadow-lg"
              >
                <Play className="inline-block mr-2 w-5 h-5 text-blue-600" />
                See How It Works
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
                { icon: Palette, text: 'Templates', value: '100+', color: 'from-blue-600 to-cyan-600' },
                { icon: Lightning, text: 'Setup Time', value: '<5 mins', color: 'from-blue-600 to-cyan-600' },
                { icon: HeadphonesIcon, text: 'Support', value: '24/7/365', color: 'from-blue-600 to-cyan-600' },
                { icon: Sparkles, text: 'AI Designer', value: 'Built-in', color: 'from-blue-600 to-cyan-600' }
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
                Website Builder Plan
              </span>
            </h2>
            <p className="text-xl text-gray-600">
              All plans include SSL certificate • 24/7 support • 7-day money-back guarantee
            </p>
          </motion.div>

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
                {billingCycle === 'yearly' && plans.length > 0 && (
                  <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                    SAVE UP TO {Math.max(...plans.map(p => p.savings || 0))}%
                  </span>
                )}
              </button>
            </motion.div>
          </div>

          {/* Pricing Cards */}
          {isLoading ? (
            <PricingTableSkeleton columns={4} />
          ) : plans.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-600">Unable to load pricing. Please try again.</p>
            </div>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.productId}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onHoverStart={() => setSelectedPlan(index)}
                className="relative group"
              >
                {/* Glow effect for popular plan */}
                {plan.isPopular && (
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-3xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
                )}

                <div
                  className={`relative bg-white border-2 ${
                    plan.isPopular ? 'border-blue-400 shadow-xl scale-105' : 'border-gray-200 hover:border-blue-300'
                  } rounded-2xl p-6 hover:shadow-lg transition-all duration-300 h-full flex flex-col`}
                >
                  {/* Badge */}
                  {plan.badge && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg">
                        {plan.badge}
                      </div>
                    </div>
                  )}

                  {/* Plan Header */}
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold mb-2 text-gray-900">{plan.name}</h3>
                    <p className="text-gray-600 text-sm">{plan.tagline}</p>
                  </div>

                  {/* Price Section */}
                  <div className="text-center mb-6">
                    {/* Show discount info based on billing cycle */}
                    {billingCycle === 'yearly' && (
                      <div className="flex items-center justify-center gap-2 mb-2">
                        {plan.savings > 0 ? (
                          <>
                            <p className="text-gray-400 line-through text-lg">
                              {formatPrice(plan.originalPrice, currency)}
                            </p>
                            <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold">
                              {plan.savings}% OFF
                            </span>
                          </>
                        ) : plan.hasSalePrice === false && (
                          <span className="text-gray-500 text-sm">
                            Same price as monthly
                          </span>
                        )}
                      </div>
                    )}
                    <div className="flex items-end justify-center gap-1">
                      <span className="text-2xl font-bold text-gray-700">{getCurrencySymbol(currency)}</span>
                      <span className="text-5xl font-black text-gray-900">
                        {billingCycle === 'yearly'
                          ? Math.floor(plan.yearlyMonthlyRate || plan.yearlyPrice / 12)
                          : Math.floor(plan.monthlyPrice)}
                      </span>
                      <span className="text-2xl font-bold text-gray-700">
                        .
                        {billingCycle === 'yearly'
                          ? ((plan.yearlyMonthlyRate || plan.yearlyPrice / 12) % 1).toFixed(2).substring(2)
                          : (plan.monthlyPrice % 1).toFixed(2).substring(2)}
                      </span>
                      <span className="text-gray-500 ml-2 mb-2">/mo</span>
                    </div>
                    {billingCycle === 'yearly' && (
                      <p className="text-xs text-gray-500 mt-2">
                        Billed {formatPrice(plan.yearlyPrice || 0, currency)}/year
                      </p>
                    )}
                  </div>

                  {/* Divider */}
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-5"></div>

                  {/* Features List - Improved Design */}
                  <div className="mb-6 flex-grow overflow-y-auto">
                    {/* For Online Store, show "Everything in Business Plus PLUS:" */}
                    {plan.name === 'Online Store' && (
                      <div className="mb-3">
                        <p className="text-xs font-semibold text-gray-600 text-center">
                          Everything in Business Plus PLUS:
                        </p>
                      </div>
                    )}
                    
                    <ul className="space-y-2">
                      {(() => {
                        let featuresToShow = plan.features || []
                        
                        // For Online Store, only show unique features not in Business Plus
                        if (plan.name === 'Online Store') {
                          // These are the unique e-commerce features that Online Store has
                          const uniqueKeywords = [
                            'shopping cart',
                            'sell physical',
                            'sell digital',
                            'accept credit',
                            'debit card',
                            'shipping',
                            'discount',
                            'promotion',
                            'inventory'
                          ]
                          
                          featuresToShow = featuresToShow.filter((feature: any) => {
                            const featureText = (feature.text || feature.title || '').toLowerCase()
                            // Check if this feature contains any of the unique e-commerce keywords
                            return uniqueKeywords.some(keyword => featureText.includes(keyword))
                          })
                        }
                        
                        return featuresToShow.map((feature: { text?: string; title?: string; highlight?: boolean }, idx: number) => {
                          const featureText = feature.text || feature.title || ''
                          const IconComponent = getFeatureIcon(featureText)
                          
                          return (
                            <li key={idx} className="flex items-center gap-2.5 group">
                              <div className="flex-shrink-0 p-1 bg-gray-50 rounded">
                                <IconComponent className="w-4 h-4 text-gray-600" />
                              </div>
                              <span className="text-sm text-gray-700 leading-tight">
                                {featureText}
                              </span>
                            </li>
                          )
                        })
                      })()}
                    </ul>
                  </div>

                  {/* CTA Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAddToCart(plan)}
                    disabled={addingToCart === plan.productId}
                    className={`w-full py-3 rounded-full font-bold text-base transition-all ${
                      plan.isPopular
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg hover:shadow-xl'
                        : 'bg-gray-100 text-gray-700 hover:bg-gradient-to-r hover:from-blue-600 hover:to-cyan-600 hover:text-white'
                    } ${addingToCart === plan.productId ? 'opacity-75 cursor-not-allowed' : ''}`}
                  >
                    {addingToCart === plan.productId ? (
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
        </div>
      </section>

      {/* Website Builder Features Section */}
      <section className="relative py-24 z-10 bg-gradient-to-b from-gray-50/30 via-white to-gray-50/30">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600/10 to-cyan-600/10 backdrop-blur-sm rounded-full text-blue-700 text-sm font-medium mb-6 border border-blue-200/30"
            >
              <Layers className="w-4 h-4" />
              <span>All Plans Include</span>
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-black mb-4 text-gray-900">
              Everything You Need to
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
                Build with Confidence
              </span>
            </h2>
          </motion.div>

          {/* Features Grid - Redesigned with Blue-Cyan Theme */}
          <div className="space-y-16">
            {/* Essential Features - Hero Section */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="text-center mb-8">
                <motion.h3 
                  initial={{ opacity: 0, y: -20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-2xl font-bold text-gray-900 mb-2"
                >
                  ✨ Essential Features
                </motion.h3>
                <p className="text-gray-600">Everything you need to build amazing websites</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {builderFeatures.filter(f => f.category === 'essential').map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                    whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{ 
                      delay: index * 0.1,
                      type: "spring",
                      stiffness: 100
                    }}
                    whileHover={{ 
                      scale: 1.05,
                      rotate: 2,
                      transition: { duration: 0.2 }
                    }}
                    className="relative group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
                    <div className="relative bg-gradient-to-br from-white to-blue-50/50 border-2 border-blue-200/50 rounded-2xl p-6 hover:border-cyan-400 hover:shadow-2xl transition-all h-full">
                      <motion.div 
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                        className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.gradient} mb-4 shadow-lg`}
                      >
                        <feature.icon className="w-6 h-6 text-white" />
                      </motion.div>
                      <h3 className="text-lg font-bold mb-2 text-gray-900">{feature.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Design & Customization */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-blue-300 to-transparent" />
                <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                  <Palette className="w-5 h-5 text-blue-600" />
                  Design & Customization
                </h3>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cyan-300 to-transparent" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                {builderFeatures.filter(f => f.category === 'design').map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ 
                      y: -8,
                      transition: { type: "spring", stiffness: 300 }
                    }}
                    className="relative group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-300 to-blue-300 rounded-xl opacity-0 group-hover:opacity-20 blur transition-all" />
                    <div className="relative bg-white/90 backdrop-blur border border-blue-100 rounded-xl p-4 hover:border-cyan-300 hover:shadow-xl transition-all h-full">
                      <div className={`inline-flex p-2 rounded-lg bg-gradient-to-r ${feature.gradient} mb-3`}>
                        <feature.icon className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="text-sm font-semibold mb-1 text-gray-900">{feature.title}</h3>
                      <p className="text-gray-600 text-xs leading-relaxed">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Marketing & Growth */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-teal-300 to-transparent" />
                <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-cyan-600" />
                  Marketing & Growth
                </h3>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-blue-300 to-transparent" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                {builderFeatures.filter(f => f.category === 'marketing').map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ 
                      delay: index * 0.05,
                      type: "spring",
                      damping: 20
                    }}
                    whileHover={{ 
                      scale: 1.05,
                      transition: { duration: 0.2 }
                    }}
                    className="relative group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-teal-200 to-cyan-200 rounded-xl opacity-0 group-hover:opacity-30 blur-sm transition-all" />
                    <div className="relative bg-gradient-to-br from-white to-cyan-50/30 border border-cyan-200/50 rounded-xl p-4 hover:border-teal-300 hover:shadow-xl transition-all h-full">
                      <div className={`inline-flex p-2 rounded-lg bg-gradient-to-r ${feature.gradient} mb-3`}>
                        <feature.icon className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="text-sm font-semibold mb-1 text-gray-900">{feature.title}</h3>
                      <p className="text-gray-600 text-xs leading-relaxed">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* E-Commerce */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-blue-300 to-transparent" />
                <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-blue-600" />
                  E-Commerce Features
                </h3>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cyan-300 to-transparent" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {builderFeatures.filter(f => f.category === 'ecommerce').map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, rotateY: -90 }}
                    whileInView={{ opacity: 1, rotateY: 0 }}
                    viewport={{ once: true }}
                    transition={{ 
                      delay: index * 0.08,
                      duration: 0.5
                    }}
                    whileHover={{ 
                      z: 50,
                      scale: 1.03,
                      transition: { duration: 0.2 }
                    }}
                    className="relative group perspective-1000"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-300 to-teal-300 rounded-lg opacity-0 group-hover:opacity-25 blur transition-all" />
                    <div className="relative bg-white border border-blue-200/60 rounded-lg p-4 hover:border-cyan-400 hover:shadow-lg transition-all h-full">
                      <div className={`inline-flex p-2 rounded bg-gradient-to-r ${feature.gradient} mb-2.5`}>
                        <feature.icon className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="text-sm font-semibold mb-1 text-gray-900">{feature.title}</h3>
                      <p className="text-gray-600 text-xs">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Security & Reliability */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cyan-300 to-transparent" />
                <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-teal-600" />
                  Security & Reliability
                </h3>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-blue-300 to-transparent" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {builderFeatures.filter(f => f.category === 'security').map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ 
                      delay: index * 0.05,
                      type: "spring",
                      stiffness: 200
                    }}
                    whileHover={{ 
                      y: -5,
                      boxShadow: "0 10px 30px rgba(59, 130, 246, 0.2)"
                    }}
                    className="relative group"
                  >
                    <div className="relative bg-gradient-to-br from-blue-50 to-cyan-50 border border-teal-200/50 rounded-lg p-3 hover:border-blue-400 transition-all h-full">
                      <div className={`inline-flex p-1.5 rounded bg-gradient-to-r ${feature.gradient} mb-2`}>
                        <feature.icon className="w-3.5 h-3.5 text-white" />
                      </div>
                      <h3 className="text-xs font-semibold mb-0.5 text-gray-900">{feature.title}</h3>
                      <p className="text-gray-600 text-[10px] leading-tight">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Plus - Every Website Builder Plan Includes */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-6 flex items-center gap-2">
                <div className="w-8 h-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full" />
                Plus - Every Website Builder Plan Includes
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    icon: HeadphonesIcon,
                    title: '24/7 Expert Support',
                    description: 'Our Flickmax Guides are always here to help',
                    gradient: 'from-blue-600 to-cyan-600'
                  },
                  {
                    icon: Smartphone,
                    title: 'Mobile-Friendly Site',
                    description: 'Easily reach customers wherever they are',
                    gradient: 'from-blue-600 to-cyan-600'
                  },
                  {
                    icon: Palette,
                    title: '100+ Beautiful Templates',
                    description: 'Dazzle customers with templates designed to sell',
                    gradient: 'from-blue-600 to-cyan-600'
                  },
                  {
                    icon: ChartBar,
                    title: 'Marketing Dashboard',
                    description: 'Real-time tracking of your performance and presence',
                    gradient: 'from-blue-600 to-cyan-600'
                  }
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -5 }}
                    className="relative group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-cyan-50 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300" />
                    <div className="relative bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-lg transition-all h-full">
                      <div className={`inline-flex p-2.5 rounded-lg bg-gradient-to-r ${feature.gradient} mb-3`}>
                        <feature.icon className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-base font-semibold mb-2 text-gray-900">{feature.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Flickmax - Performance & Trust Section */}
      <section className="relative py-24 z-10 overflow-hidden bg-gradient-to-b from-white via-blue-50/30 to-white">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-cyan-50">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-100/30 to-cyan-100/30 rounded-full filter blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-cyan-100/30 to-blue-100/30 rounded-full filter blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600/10 to-cyan-600/10 backdrop-blur-sm rounded-full text-blue-700 text-sm font-medium mb-6 border border-blue-200/30"
            >
              <Award className="w-4 h-4" />
              <span>Trusted by 5,000+ Websites</span>
            </motion.div>
            
            <h2 className="text-4xl md:text-5xl font-black mb-6 text-gray-900">
              Why Choose Flickmax for
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
                Website Builder Platform?
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our Website Builder is designed for speed and simplicity. Create professional websites 
              in minutes with our intuitive drag-and-drop interface and AI-powered design tools.
            </p>
          </motion.div>

          {/* Two Column Layout */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            {/* Left Column - Key Benefits */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <h3 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 p-2">
                    <Rocket className="w-full h-full text-white" />
                  </div>
                  We Handle Everything For You
                </h3>
                <p className="text-gray-600 mb-6">
                  With Flickmax, you don&apos;t have to stress about doing any heavy lifting or keeping up with 
                  Updates and maintenance. We handle everything automatically.
                </p>
                
                <div className="space-y-4">
                  {[
                    { icon: CheckCircle, text: '99.9% uptime guarantee and money-back guarantee' },
                    { icon: Sparkles, text: 'Pre-built sites and startup support' },
                    { icon: HeadphonesIcon, text: 'Free 24/7 expert support' },
                    { icon: RefreshCw, text: 'Automatic platform updates and security patches' },
                    { icon: Rocket, text: 'AI-based onboarding and creation tool for faster launches' }
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <item.icon className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <p className="text-gray-700">{item.text}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Right Column - Performance Stats */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { 
                  label: 'Active Websites', 
                  value: '5K+', 
                  icon: Globe, 
                  color: 'from-blue-600 to-cyan-600',
                  description: 'Trusted globally'
                },
                { 
                  label: 'Uptime Guarantee', 
                  value: '99.99%', 
                  icon: Shield, 
                  color: 'from-blue-600 to-cyan-600',
                  description: 'Always online'
                },
                { 
                  label: 'Avg Response', 
                  value: '197ms', 
                  icon: Zap, 
                  color: 'from-blue-600 to-cyan-600',
                  description: 'Lightning fast'
                },
                { 
                  label: 'Support Rating', 
                  value: '4.9/5', 
                  icon: Star, 
                  color: 'from-blue-600 to-cyan-600',
                  description: 'Expert help'
                }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, type: 'spring' }}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all"
                >
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${stat.color} p-2.5 mb-3`}>
                    <stat.icon className="w-full h-full text-white" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                  <p className="text-sm font-medium text-gray-900">{stat.label}</p>
                  <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-full">
              <CloudLightning className="w-5 h-5 text-blue-600" />
              <span className="text-gray-700">
                <span className="font-semibold">2x Faster Performance</span> with Flickmax Global CDN
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Key Features Section - Redesigned */}
      <section className="relative py-20 z-10 overflow-hidden bg-gradient-to-b from-gray-50/30 via-white to-gray-50/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="relative">
            {/* Background gradient card */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-3xl transform rotate-1" />
            <div className="relative bg-gradient-to-r from-blue-600 to-cyan-600 rounded-3xl overflow-hidden">
              {/* Pattern overlay */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }} />
              </div>
              
              <div className="relative p-12 lg:p-16">
                {/* Section Header */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-center mb-12"
                >
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6">
                    <Sparkles className="w-4 h-4" />
                    <span>Core Platform Features</span>
                  </div>
                  
                  <h2 className="text-4xl lg:text-5xl font-black mb-4 text-white">
                    Build Beautiful Websites
                    <span className="block">That Perform</span>
                  </h2>
                  
                  <p className="text-xl text-white/90 max-w-3xl mx-auto">
                    Every Flickmax Website Builder plan includes these essential features 
                    to ensure your success online
                  </p>
                </motion.div>

                {/* Features Grid - 2x2 Layout */}
                <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
                  {[
                    {
                      icon: Smartphone,
                      title: 'Mobile Design and Editing',
                      description: "No matter what device you're using, your site will look great and you can edit on-the-go.",
                      gradient: 'from-blue-500 to-cyan-500',
                      badge: 'Responsive',
                      highlights: ['Edit anywhere', 'Touch-optimized', 'Real-time preview']
                    },
                    {
                      icon: Palette,
                      title: 'Customizable Themes',
                      description: 'Play with 100+ theme filters to instantly change layouts, fonts and colors.',
                      gradient: 'from-purple-500 to-pink-500',
                      badge: '100+ Themes',
                      highlights: ['One-click styling', 'Custom colors', 'Font library']
                    },
                    {
                      icon: Server,
                      title: 'Free Website Hosting',
                      description: 'Ensure your site runs smoothly and pages load quickly with fast, reliable hosting.',
                      gradient: 'from-green-500 to-teal-500',
                      badge: 'Always Free',
                      highlights: ['99.9% uptime', 'SSL included', 'Daily backups']
                    },
                    {
                      icon: Gauge,
                      title: 'Rapid Page-Load Performance',
                      description: "Nothing's worse than a slow loading webpage. Ours are fast.",
                      gradient: 'from-orange-500 to-red-500',
                      badge: 'Lightning Fast',
                      highlights: ['CDN powered', 'Optimized images', 'Fast servers']
                    }
                  ].map((feature, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                      className="relative group"
                    >
                      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 lg:p-8 hover:bg-white/20 transition-all duration-300 h-full border border-white/20">
                        {/* Feature Badge */}
                        <div className="absolute -top-3 right-6">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${feature.gradient} text-white shadow-lg`}>
                            {feature.badge}
                          </span>
                        </div>
                        
                        {/* Icon and Title */}
                        <div className="flex items-start gap-4 mb-4">
                          <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} p-3 flex-shrink-0 shadow-lg`}>
                            <feature.icon className="w-full h-full text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-white mb-2">
                              {feature.title}
                            </h3>
                            <p className="text-white/80 text-base leading-relaxed">
                              {feature.description}
                            </p>
                          </div>
                        </div>
                        
                        {/* Feature Highlights */}
                        <div className="mt-4 pt-4 border-t border-white/10">
                          <div className="flex flex-wrap gap-2">
                            {feature.highlights.map((highlight, hidx) => (
                              <span 
                                key={hidx}
                                className="inline-flex items-center gap-1 px-3 py-1 bg-white/10 rounded-full text-xs text-white/90"
                              >
                                <CheckCircle className="w-3 h-3" />
                                {highlight}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Bottom CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="mt-12 text-center"
                >
                  <p className="text-white/90 mb-6 text-lg">
                    Start building your professional website today with our powerful platform
                  </p>
                  <div className="flex flex-wrap gap-4 justify-center">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                      className="px-8 py-4 bg-white text-blue-600 rounded-full font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                    >
                      <Rocket className="w-5 h-5" />
                      Get Started Now
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-8 py-4 bg-white/20 backdrop-blur-sm text-white rounded-full font-bold hover:bg-white/30 transition-all flex items-center gap-2"
                    >
                      <Play className="w-5 h-5" />
                      Watch Demo
                    </motion.button>
                  </div>
                  
                  {/* Trust Indicators */}
                  <div className="mt-8 flex items-center justify-center gap-8 flex-wrap">
                    <div className="flex items-center gap-2 text-white/80 text-sm">
                      <Clock className="w-4 h-4" />
                      <span>Setup in 5 minutes</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/80 text-sm">
                      <Shield className="w-4 h-4" />
                      <span>No coding required</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/80 text-sm">
                      <RefreshCw className="w-4 h-4" />
                      <span>Free updates</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section with Getting Started FAQ */}
      <section className="relative py-24 z-10 overflow-hidden bg-gradient-to-b from-white via-gray-50/20 to-white">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-blue-50">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-100/20 to-cyan-100/20 rounded-full filter blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-cyan-100/20 to-blue-100/20 rounded-full filter blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Getting Started FAQ */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-left"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600/10 to-cyan-600/10 backdrop-blur-sm rounded-full text-blue-700 text-sm font-medium mb-6 border border-blue-200/30">
                <Rocket className="w-4 h-4" />
                <span>Quick Start Guide</span>
              </div>
              
              <h3 className="text-3xl font-bold mb-6 text-gray-900">
                After I Purchase Website Builder, 
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
                  How Do I Get Started?
                </span>
              </h3>
              
              <p className="text-lg text-gray-600 mb-4 leading-relaxed">
                Your website builder comes with everything pre-configured and ready to use. 
                <span className="font-semibold text-blue-600"> Let AI help create your website in minutes.</span>
              </p>
              
              <div className="space-y-4 mb-6">
                {[
                  {
                    icon: Settings,
                    title: 'Instant Setup',
                    description: 'Log in to your control panel and start creating immediately'
                  },
                  {
                    icon: HeadphonesIcon,
                    title: '24/7 Expert Support',
                    description: 'Our award-winning support team is always ready to help'
                  },
                  {
                    icon: Sparkles,
                    title: 'Complete Guidance',
                    description: 'Get help with creating, updating, or promoting your website'
                  }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-4 bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 p-2 flex-shrink-0">
                      <item.icon className="w-full h-full text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
                      <p className="text-gray-600 text-sm">{item.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {/* New Features Grid */}
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 mb-6">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: Smartphone, text: 'Responsive Design' },
                    { icon: Database, text: 'Unlimited Storage' },
                    { icon: Wifi, text: 'Unlimited Bandwidth' },
                    { icon: Sparkles, text: 'AI Website Builder' },
                    { icon: RefreshCw, text: 'Backup/Restore' },
                    { icon: CheckCircle, text: 'Ready Instantly' }
                  ].map((feature, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.05 }}
                      className="flex items-center gap-2 text-sm"
                    >
                      <feature.icon className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      <span className="text-gray-700 font-medium">{feature.text}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Website builder ready to use instantly</span>
              </div>
            </motion.div>
            
            {/* Right Column - CTA */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center lg:text-left"
            >
              <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-3xl p-8 lg:p-10 text-white relative overflow-hidden">
                {/* Pattern overlay */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.3'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
                  }} />
                </div>
                
                <div className="relative">
                  <h2 className="text-4xl lg:text-5xl font-black mb-4">
                    Ready to Launch Your Site?
                  </h2>
                  <p className="text-xl text-white/90 mb-8">
                    Join 5,000+ businesses using our powerful website builder
                  </p>
                  
                  {/* Support Contact Section */}
                  <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 sm:p-6 mb-8">
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 mb-3">
                      <HeadphonesIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      <span className="text-base sm:text-lg font-semibold text-center">Need Help? Call Our Experts</span>
                    </div>
                    <div className="text-center">
                      <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 mb-2">
                        <span className="text-xl sm:text-2xl font-bold">{country.phoneNumber}</span>
                        <span className="text-white/80 text-xs sm:text-sm">({country.name})</span>
                      </div>
                      <p className="text-white/80 text-xs sm:text-sm">
                        Available 24/7 • Speak to a Website Expert
                      </p>
                    </div>
                  </div>
                  
                  {/* Features List */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-white text-sm">
                      <Check className="w-5 h-5 flex-shrink-0" />
                      <span>Free migration service included</span>
                    </div>
                    <div className="flex items-center gap-3 text-white text-sm">
                      <Check className="w-5 h-5 flex-shrink-0" />
                      <span>7-day money-back guarantee</span>
                    </div>
                    <div className="flex items-center gap-3 text-white text-sm">
                      <Check className="w-5 h-5 flex-shrink-0" />
                      <span>Instant setup with everything ready to go</span>
                    </div>
                  </div>
                  
                  {/* Action Link */}
                  <div className="mt-8 text-center">
                    <a 
                      href="#pricing" 
                      onClick={(e) => {
                        e.preventDefault()
                        document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })
                      }}
                      className="inline-flex items-center gap-2 text-white hover:text-white/80 transition-colors group"
                    >
                      <span className="underline underline-offset-4">View pricing plans</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </a>
                  </div>
                </div>
              </div>
              
              {/* Trust badges */}
              <div className="mt-6 flex items-center justify-center lg:justify-start gap-6">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-600">SSL Secured</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-600">99.9% Uptime</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-600">24/7 Support</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>


      {/* Video Modal */}
      <AnimatePresence>
        {showVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center p-4"
            onClick={() => setShowVideo(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-4xl w-full aspect-video bg-gray-900 rounded-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowVideo(false)}
                className="absolute top-4 right-4 z-10 bg-white/10 backdrop-blur-md p-2 rounded-full hover:bg-white/20 transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-gray-400">Demo video would play here</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Disclaimer Modal */}
      <AnimatePresence>
        {showDisclaimer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowDisclaimer(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">Disclaimers</h3>
                <button
                  onClick={() => setShowDisclaimer(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              
              <div className="text-sm text-gray-600 space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="font-medium mb-2">SSL Certificate:</p>
                  <p>*An SSL certificate is included with every site and free for the life of the hosting plan. Our hassle-free certificates are automatically installed, validated and renewed. The strong 2048-bit encryption will ensure all transactions are secure. Annual plan purchase required.</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="font-medium mb-2">Performance:</p>
                  <p>** Page load times compared to leading website builder providers for page load times between January and March 2023. Flickmax does not claim to have the industry best page load performance. Actual performance may vary by region. Please see terms and conditions for any uptime guarantee.</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}