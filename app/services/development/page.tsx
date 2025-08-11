'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { 
  Code, 
  Smartphone, 
  Globe, 
  Layers, 
  Zap, 
  Shield, 
  Users, 
  Sparkles,
  ArrowRight,
  CheckCircle,
  Monitor,
  Palette,
  Rocket,
  HeadphonesIcon,
  TrendingUp,
  Clock,
  Award,
  Star,
  ChevronRight,
  Database,
  Cloud,
  Lock,
  RefreshCw,
  BarChart3,
  ShoppingCart,
  MessageSquare,
  Settings,
  GitBranch,
  Cpu,
  FileCode,
  Figma,
  Package,
  Server,
  TestTube,
  Wrench,
  PenTool,
  Layout,
  Megaphone,
  Target,
  DollarSign,
  LineChart,
  UserCheck,
  Search,
  Mail,
  Phone,
  Video,
  Send,
  MapPin,
  Coffee,
  Heart,
  ThumbsUp,
  Briefcase,
  Building,
  Store,
  CreditCard,
  Banknote,
  Receipt,
  Calculator,
  PieChart,
  Activity,
  Wifi,
  Bluetooth,
  Navigation,
  Camera,
  Image,
  Film,
  Music,
  Mic,
  Volume2,
  Bell,
  BellOff,
  Eye,
  EyeOff,
  Link,
  ExternalLink,
  Download,
  Upload,
  Share2,
  Copy,
  Clipboard,
  Edit,
  Trash2,
  Plus,
  Minus,
  X,
  Check,
  AlertCircle,
  Info,
  HelpCircle,
  Flag,
  Bookmark,
  Tag,
  Hash,
  AtSign,
  Percent,
  Binary,
  Code2,
  Terminal,
  Command,
  CloudLightning,
  Workflow,
  Boxes,
  Package2,
  Layers3,
  LayoutGrid,
  Trello
} from 'lucide-react'
import DevelopmentQuoteForm from '@/components/forms/DevelopmentQuoteForm'

export default function DevelopmentServicesPage() {
  const [activeService, setActiveService] = useState(0)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [mounted, setMounted] = useState(false)
  const [showQuoteForm, setShowQuoteForm] = useState(false)
  const heroRef = useRef<HTMLDivElement>(null)
  const previewPanelRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8])

  // Handle client-side mounting
  useEffect(() => {
    setMounted(true)
  }, [])

  // Mouse parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect()
        setMousePosition({
          x: (e.clientX - rect.left) / rect.width - 0.5,
          y: (e.clientY - rect.top) / rect.height - 0.5
        })
      }
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Handle service selection with auto-scroll
  const handleServiceSelect = (index: number) => {
    setActiveService(index)
    
    // Auto-scroll preview panel into view on desktop
    if (previewPanelRef.current && window.innerWidth >= 1024) {
      setTimeout(() => {
        previewPanelRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        })
      }, 100)
    }
  }

  const services = [
    {
      icon: Globe,
      title: 'Custom Website Development',
      description: 'Tailored websites built from scratch to match your exact business needs',
      features: ['Responsive Design', 'SEO Optimized', 'Fast Loading', 'Custom CMS'],
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Smartphone,
      title: 'Mobile App Development',
      description: 'Native and cross-platform apps that deliver exceptional user experiences',
      features: ['iOS & Android', 'React Native', 'Flutter', 'App Store Deployment'],
      gradient: 'from-cyan-500 to-teal-500'
    },
    {
      icon: ShoppingCart,
      title: 'E-Commerce Solutions',
      description: 'Complete online stores with payment integration and inventory management',
      features: ['Shopping Cart', 'Payment Gateway', 'Inventory System', 'Analytics'],
      gradient: 'from-teal-500 to-blue-500'
    },
    {
      icon: Layers,
      title: 'Web Applications',
      description: 'Powerful web apps that streamline your business operations',
      features: ['Dashboard', 'Real-time Updates', 'API Integration', 'Cloud Hosting'],
      gradient: 'from-blue-600 to-cyan-600'
    }
  ]

  const process = [
    {
      step: '01',
      title: 'Discovery & Planning',
      description: 'We analyze your requirements and create a detailed project roadmap',
      icon: Search,
      duration: '1-2 weeks'
    },
    {
      step: '02',
      title: 'Design & Prototype',
      description: 'Creating stunning designs and interactive prototypes for your approval',
      icon: PenTool,
      duration: '2-3 weeks'
    },
    {
      step: '03',
      title: 'Development & Testing',
      description: 'Building your solution with clean code and rigorous testing',
      icon: Code,
      duration: '4-8 weeks'
    },
    {
      step: '04',
      title: 'Launch & Support',
      description: 'Deploying your project and providing ongoing maintenance',
      icon: Rocket,
      duration: 'Ongoing'
    }
  ]

  const technologies = [
    { name: 'React', icon: Code2, category: 'Frontend' },
    { name: 'Next.js', icon: Layers3, category: 'Frontend' },
    { name: 'Node.js', icon: Server, category: 'Backend' },
    { name: 'Python', icon: Binary, category: 'Backend' },
    { name: 'AWS', icon: Cloud, category: 'Cloud' },
    { name: 'MongoDB', icon: Database, category: 'Database' },
    { name: 'PostgreSQL', icon: Database, category: 'Database' },
    { name: 'Docker', icon: Package2, category: 'DevOps' },
    { name: 'Kubernetes', icon: Boxes, category: 'DevOps' },
    { name: 'TypeScript', icon: FileCode, category: 'Language' },
    { name: 'GraphQL', icon: GitBranch, category: 'API' },
    { name: 'Flutter', icon: Smartphone, category: 'Mobile' }
  ]

  const benefits = [
    {
      icon: TrendingUp,
      title: 'Increase Revenue',
      description: 'Modern digital solutions that drive sales and grow your business',
      stats: '3x ROI Average'
    },
    {
      icon: Clock,
      title: 'Save Time',
      description: 'Automated processes that free up your time for what matters',
      stats: '10+ hrs/week saved'
    },
    {
      icon: Users,
      title: 'Better Customer Experience',
      description: 'Intuitive interfaces that keep your customers coming back',
      stats: '95% satisfaction rate'
    },
    {
      icon: Shield,
      title: 'Secure & Reliable',
      description: 'Enterprise-grade security with 99.9% uptime guarantee',
      stats: '24/7 monitoring'
    }
  ]

  const portfolioItems = [
    {
      title: 'E-Commerce Platform',
      category: 'Web Development',
      image: '/portfolio1.jpg',
      stats: { revenue: '+250%', users: '10K+', rating: '4.9' }
    },
    {
      title: 'Mobile Banking App',
      category: 'App Development',
      image: '/portfolio2.jpg',
      stats: { downloads: '50K+', rating: '4.8', transactions: '$5M+' }
    },
    {
      title: 'SaaS Dashboard',
      category: 'Web Application',
      image: '/portfolio3.jpg',
      stats: { users: '500+', uptime: '99.99%', features: '50+' }
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/30 to-cyan-50/30 overflow-x-hidden relative">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white to-cyan-50/50" />
        <motion.div
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: 'reverse'
          }}
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(6, 182, 212, 0.1) 0%, transparent 50%)',
            backgroundSize: '100% 100%'
          }}
        />
      </div>

      {/* Hero Section with Advanced Animations */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center py-20 overflow-hidden">
        {/* Animated Background Gradient */}
        <motion.div
          style={{ opacity, scale }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-50/10 to-white" />
        </motion.div>

        {/* Animated Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(90deg, #3b82f6 1px, transparent 1px), linear-gradient(#3b82f6 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }} />
        </div>

        {/* Floating Code Snippets Animation */}
        {[
          { top: '10%', left: '5%', delay: 0, code: '<div />' },
          { top: '20%', right: '10%', delay: 2, code: '{...}' },
          { bottom: '30%', left: '8%', delay: 1, code: 'function()' },
          { top: '50%', right: '5%', delay: 3, code: '.css' },
          { bottom: '20%', right: '15%', delay: 1.5, code: '[]' }
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: [0, 0.4, 0.4, 0],
              scale: [0, 1, 1, 0],
              rotate: [0, 10, -10, 0]
            }}
            transition={{
              duration: 8,
              delay: item.delay,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              position: 'absolute',
              top: item.top,
              left: item.left,
              right: item.right,
              bottom: item.bottom
            }}
            className="text-blue-400/40 font-mono text-sm md:text-lg font-bold"
          >
            {item.code}
          </motion.div>
        ))}

        {/* Animated Floating Orbs */}
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-br from-cyan-400/20 to-teal-400/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -50, 100, -50, 0],
            y: [0, 100, 50, -100, 0],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/2 left-1/3 w-24 h-24 bg-gradient-to-br from-teal-400/20 to-blue-400/20 rounded-full blur-2xl"
        />

        {/* Animated Tech Icons Background */}
        {mounted && (
          <div className="absolute inset-0 overflow-hidden">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <motion.div
                key={`tech-icon-${i}`}
                initial={{ 
                  y: -100
                }}
                animate={{
                  y: ['-100px', '100vh'],
                  rotate: [0, 360]
                }}
                transition={{
                  duration: 15 + i * 2,
                  repeat: Infinity,
                  delay: i * 2,
                  ease: "linear"
                }}
                className="absolute"
                style={{
                  left: `${15 + i * 15}%`
                }}
              >
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-100/20 to-cyan-100/20 backdrop-blur-sm flex items-center justify-center">
                  {i % 3 === 0 ? <Code className="w-6 h-6 text-blue-300/30" /> : 
                   i % 3 === 1 ? <Smartphone className="w-6 h-6 text-cyan-300/30" /> :
                   <Globe className="w-6 h-6 text-teal-300/30" />}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Particle Effect */}
        {mounted && (
          <div className="absolute inset-0">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19].map((i) => (
              <motion.div
                key={`particle-${i}`}
                initial={{ 
                  scale: 0
                }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 0.5, 0]
                }}
                transition={{
                  duration: 3 + (i % 3),
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: "easeInOut"
                }}
                className="absolute w-1 h-1 bg-blue-400/50 rounded-full"
                style={{
                  left: `${5 + (i * 5) % 95}%`,
                  top: `${10 + (i * 7) % 90}%`
                }}
              />
            ))}
          </div>
        )}

        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Animated Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0, rotate: -180 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ 
                delay: 0.2, 
                type: 'spring', 
                stiffness: 200,
                damping: 15
              }}
              className="inline-block mb-6"
            >
              <motion.div 
                animate={{ 
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="relative"
              >
                <motion.div 
                  animate={{
                    opacity: [0.3, 0.6, 0.3],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-500 blur-2xl" 
                />
                <div className="relative bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-full font-bold text-sm flex items-center gap-2 shadow-xl overflow-hidden">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="w-5 h-5" />
                  </motion.div>
                  <span className="relative">
                    PREMIUM DEVELOPMENT SERVICES
                    <motion.div
                      animate={{ x: [-100, 300] }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                      className="absolute inset-0 w-20 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                    />
                  </span>
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="w-4 sm:w-5 h-4 sm:h-5" />
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>

            {/* Animated Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black mb-4 sm:mb-6">
              <motion.span
                initial={{ opacity: 0, x: -100, filter: 'blur(10px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                transition={{ 
                  delay: 0.3,
                  duration: 0.8,
                  type: "spring",
                  stiffness: 100
                }}
                className="block text-gray-900 mb-2"
              >
                {'Transform Your Business'.split('').map((char, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.3 + i * 0.03,
                      duration: 0.5,
                      type: "spring",
                      damping: 12
                    }}
                    className="inline-block"
                    style={{ display: char === ' ' ? 'inline' : 'inline-block' }}
                  >
                    {char === ' ' ? '\u00A0' : char}
                  </motion.span>
                ))}
              </motion.span>
              <motion.span
                initial={{ opacity: 0, x: 100, filter: 'blur(10px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                transition={{ 
                  delay: 0.5,
                  duration: 0.8,
                  type: "spring",
                  stiffness: 100
                }}
                className="block text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl"
              >
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 animate-gradient bg-[length:200%_auto]">
                  {'With Custom Development'.split('').map((char, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, y: -50, rotate: 180 }}
                      animate={{ opacity: 1, y: 0, rotate: 0 }}
                      transition={{
                        delay: 0.5 + i * 0.03,
                        duration: 0.5,
                        type: "spring",
                        damping: 12
                      }}
                      className="inline-block"
                      style={{ display: char === ' ' ? 'inline' : 'inline-block' }}
                    >
                      {char === ' ' ? '\u00A0' : char}
                    </motion.span>
                  ))}
                </span>
              </motion.span>
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto"
            >
              We build stunning websites and powerful applications that help small businesses 
              <span className="text-blue-600 font-bold"> compete with the giants</span>
            </motion.p>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex justify-center mb-12"
            >
              <motion.button
                onClick={() => setShowQuoteForm(true)}
                whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(59, 130, 246, 0.3)' }}
                whileTap={{ scale: 0.95 }}
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full font-bold text-lg text-white overflow-hidden shadow-xl"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Get Free Quote
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600"
                  initial={{ x: '100%' }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
            >
              {[
                { icon: Briefcase, text: 'Projects', value: '500+' },
                { icon: Users, text: 'Happy Clients', value: '200+' },
                { icon: Star, text: 'Rating', value: '4.9/5' },
                { icon: Clock, text: 'Years', value: '10+' }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-5 hover:bg-white hover:shadow-lg transition-all duration-300">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 p-2.5 mx-auto mb-3 shadow-md">
                      <item.icon className="w-full h-full text-white" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{item.value}</p>
                    <p className="text-xs text-gray-600 font-medium">{item.text}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-blue-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-blue-400 rounded-full mt-2 animate-bounce" />
          </div>
        </motion.div>
      </section>

      {/* Services Section - Redesigned for Mobile & Desktop */}
      <section className="relative py-12 sm:py-16 md:py-20 bg-gradient-to-b from-white via-gray-50/50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 text-gray-900">
              Our Development
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600"> Services</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              From concept to launch, we handle every aspect of your digital project
            </p>
          </motion.div>

          {/* Mobile View - Accordion Style */}
          <div className="lg:hidden space-y-4">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100"
              >
                <button
                  onClick={() => handleServiceSelect(activeService === index ? -1 : index)}
                  className="w-full p-5 flex items-center gap-4 hover:bg-gray-50 transition-all"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${service.gradient} p-2.5 flex-shrink-0`}>
                    <service.icon className="w-full h-full text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="text-lg font-bold text-gray-900">{service.title}</h3>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{service.description}</p>
                  </div>
                  <ChevronRight className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${
                    activeService === index ? 'rotate-90' : ''
                  }`} />
                </button>
                
                <AnimatePresence>
                  {activeService === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="p-5 pt-0 space-y-4">
                        <div className="flex flex-wrap gap-2">
                          {service.features.map((feature, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                        <button 
                          onClick={() => setShowQuoteForm(true)}
                          className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                        >
                          Get Quote
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          {/* Desktop View - Side by Side */}
          <div className="hidden lg:grid lg:grid-cols-2 gap-8">
            {/* Service Tabs */}
            <div className="space-y-4">
              {services.map((service, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleServiceSelect(index)}
                  className={`relative group cursor-pointer transition-all duration-300 ${
                    activeService === index ? 'scale-[1.02]' : 'hover:scale-[1.01]'
                  }`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${service.gradient} rounded-2xl transition-opacity ${
                    activeService === index ? 'opacity-15' : 'opacity-0 group-hover:opacity-10'
                  }`} />
                  <div className={`relative bg-white rounded-2xl p-6 transition-all border-2 ${
                    activeService === index 
                      ? 'border-blue-400 shadow-xl' 
                      : 'border-gray-200 hover:border-blue-200 hover:shadow-lg'
                  }`}>
                    <div className="flex items-start gap-4">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${service.gradient} p-3 shadow-lg flex-shrink-0`}>
                        <service.icon className="w-full h-full text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
                        <p className="text-gray-600 mb-3">{service.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {service.features.map((feature, idx) => (
                            <span
                              key={idx}
                              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                                activeService === index 
                                  ? 'bg-blue-100 text-blue-800' 
                                  : 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                      <ChevronRight className={`w-5 h-5 transition-all flex-shrink-0 ${
                        activeService === index 
                          ? 'text-blue-600 translate-x-1' 
                          : 'text-gray-400 group-hover:text-blue-500'
                      }`} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Service Preview Panel */}
            <div className="relative">
              <div className="sticky top-24" ref={previewPanelRef}>
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="relative bg-gradient-to-br from-blue-600 to-cyan-600 rounded-3xl p-8 text-white overflow-hidden shadow-2xl"
                >
                  <div className="absolute inset-0 bg-black/10" />
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeService}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="relative z-10"
                    >
                      <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur p-4 mb-6">
                        {(() => {
                          const Icon = services[activeService].icon
                          return <Icon className="w-full h-full text-white" />
                        })()}
                      </div>
                      <h3 className="text-3xl font-bold mb-4">{services[activeService].title}</h3>
                      <p className="text-white/90 mb-6 text-lg">{services[activeService].description}</p>
                      <div className="space-y-3 mb-8">
                        {services[activeService].features.map((feature, idx) => (
                          <motion.div 
                            key={idx} 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="flex items-center gap-3"
                          >
                            <CheckCircle className="w-5 h-5 text-cyan-300 flex-shrink-0" />
                            <span className="text-white/90">{feature}</span>
                          </motion.div>
                        ))}
                      </div>
                      <motion.button
                        onClick={() => setShowQuoteForm(true)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-4 bg-white text-blue-600 rounded-xl font-bold hover:bg-gray-50 transition-all flex items-center justify-center gap-2 shadow-lg"
                      >
                        Get Quote for {services[activeService].title.split(' ')[0]}
                        <ArrowRight className="w-5 h-5" />
                      </motion.button>
                    </motion.div>
                  </AnimatePresence>

                  {/* Decorative Elements */}
                  <motion.div 
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: [0.1, 0.2, 0.1]
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" 
                  />
                  <motion.div
                    animate={{ 
                      scale: [1, 1.3, 1],
                      opacity: [0.1, 0.15, 0.1]
                    }}
                    transition={{
                      duration: 7,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="absolute -bottom-10 -left-10 w-40 h-40 bg-cyan-300/10 rounded-full blur-2xl" 
                  />
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="relative py-12 sm:py-16 md:py-20 bg-gradient-to-b from-white via-gray-50/50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-4 text-gray-900">
              Our Development
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600"> Process</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A proven methodology that ensures your project is delivered on time and exceeds expectations
            </p>
          </motion.div>

          <div className="relative">
            {/* Connection Line */}
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-cyan-200 to-blue-200 hidden lg:block" />

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {process.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100"
                  >
                    {/* Step Number */}
                    <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                      {step.step}
                    </div>

                    <div className="mb-4 mt-4">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 p-3">
                        <step.icon className="w-full h-full text-blue-600" />
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                    <p className="text-gray-600 mb-4">{step.description}</p>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span className="text-blue-600 font-medium">{step.duration}</span>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Technologies Section */}
      <section className="relative py-20">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-4 text-gray-900">
              Technologies We
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600"> Master</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We use cutting-edge technologies to build scalable and future-proof solutions
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {technologies.map((tech, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.02 }}
                whileHover={{ 
                  scale: 1.1,
                  rotate: [0, -5, 5, 0],
                  transition: { duration: 0.3 }
                }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-xl opacity-0 group-hover:opacity-20 blur transition-all" />
                <div className="relative bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-lg transition-all">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 p-2 mx-auto mb-2">
                    <tech.icon className="w-full h-full text-blue-600" />
                  </div>
                  <p className="text-sm font-semibold text-gray-900 text-center">{tech.name}</p>
                  <p className="text-xs text-gray-500 text-center">{tech.category}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="relative py-20 bg-gradient-to-b from-gray-50/50 via-white to-gray-50/50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-4 text-gray-900">
              Why Small Businesses
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600"> Choose Us</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We understand the unique challenges small businesses face and deliver solutions that make a real impact
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-all" />
                <div className="relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all h-full border border-gray-100">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 p-3.5 mb-4 shadow-lg">
                    <benefit.icon className="w-full h-full text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-gray-600 mb-4">{benefit.description}</p>
                  <div className="pt-4 border-t border-gray-100">
                    <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
                      {benefit.stats}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-12 md:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-3 sm:mb-4 text-gray-900">
              Client Success
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600"> Stories</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-2 sm:px-4">
              See how we've helped businesses like yours achieve digital transformation
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {[
              {
                name: 'Sarah Johnson',
                company: 'TechStart Solutions',
                role: 'CEO',
                text: 'They transformed our outdated website into a modern platform that increased our conversions by 300%. Absolutely phenomenal work!',
                rating: 5,
                image: '👩‍💼'
              },
              {
                name: 'Michael Chen',
                company: 'Green Earth Store',
                role: 'Founder',
                text: 'The e-commerce solution they built helped us scale from $10K to $100K monthly revenue in just 6 months. Game-changing!',
                rating: 5,
                image: '👨‍💼'
              },
              {
                name: 'Emily Rodriguez',
                company: 'FitLife App',
                role: 'Product Manager',
                text: 'Our mobile app now has 50K+ active users thanks to their exceptional development and user experience design.',
                rating: 5,
                image: '👩‍💻'
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-all" />
                <div className="relative bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all h-full border border-gray-100">
                  <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                    <div className="w-12 sm:w-14 h-12 sm:h-14 rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 flex items-center justify-center text-xl sm:text-2xl">
                      {testimonial.image}
                    </div>
                    <div>
                      <h4 className="text-sm sm:text-base font-bold text-gray-900">{testimonial.name}</h4>
                      <p className="text-xs sm:text-sm text-gray-600">{testimonial.role} at {testimonial.company}</p>
                    </div>
                  </div>
                  <div className="flex gap-1 mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm sm:text-base text-gray-700 italic">"{testimonial.text}"</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative py-12 sm:py-16 md:py-20 bg-gradient-to-b from-gray-50/50 via-white to-gray-50/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-12 md:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-3 sm:mb-4 text-gray-900">
              Frequently Asked
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600"> Questions</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600">
              Everything you need to know about our development services
            </p>
          </motion.div>

          <div className="space-y-4">
            {[
              {
                question: 'How long does a typical project take?',
                answer: 'Most projects are completed within 8-12 weeks. Simple websites can be done in 4-6 weeks, while complex applications may take 3-4 months.'
              },
              {
                question: 'Do you provide ongoing support after launch?',
                answer: 'Yes! We offer comprehensive maintenance packages including updates, security monitoring, backups, and technical support to keep your solution running smoothly.'
              },
              {
                question: 'Can you work with our existing systems?',
                answer: 'Absolutely. We specialize in integrations and can seamlessly connect your new solution with existing tools, databases, and third-party services.'
              },
              {
                question: 'What is your development process?',
                answer: 'We follow an agile methodology with regular updates and client feedback. You\'ll have full visibility throughout the project with weekly progress reports.'
              },
              {
                question: 'How much does a custom development project cost?',
                answer: 'Project costs vary based on complexity and features. We provide detailed quotes after our initial consultation. Most small business projects range from $5K-$50K.'
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all"
              >
                <details className="group">
                  <summary className="flex items-center justify-between p-4 sm:p-6 cursor-pointer">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 pr-3 sm:pr-4">{faq.question}</h3>
                    <div className="w-7 sm:w-8 h-7 sm:h-8 rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 flex items-center justify-center flex-shrink-0">
                      <ChevronRight className="w-5 h-5 text-blue-600 group-open:rotate-90 transition-transform" />
                    </div>
                  </summary>
                  <div className="px-4 sm:px-6 pb-4 sm:pb-6">
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                </details>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-10 sm:py-12 md:py-16 bg-gradient-to-r from-blue-600 to-cyan-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {[
              { number: '500+', label: 'Projects Completed', icon: Briefcase },
              { number: '200+', label: 'Happy Clients', icon: Users },
              { number: '99%', label: 'Client Satisfaction', icon: ThumbsUp },
              { number: '24/7', label: 'Support Available', icon: HeadphonesIcon }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, type: 'spring' }}
                className="text-center text-white"
              >
                <div className="w-12 sm:w-14 md:w-16 h-12 sm:h-14 md:h-16 rounded-xl sm:rounded-2xl bg-white/20 backdrop-blur p-2.5 sm:p-3 mx-auto mb-2 sm:mb-3">
                  <stat.icon className="w-full h-full text-white" />
                </div>
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                >
                  <p className="text-2xl sm:text-3xl md:text-4xl font-black mb-1">{stat.number}</p>
                  <p className="text-white/80 text-xs sm:text-sm">{stat.label}</p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative py-16 sm:py-20 md:py-24 overflow-hidden bg-gradient-to-b from-white via-blue-50/30 to-white">
        <div className="absolute inset-0">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-64 sm:w-80 md:w-96 h-64 sm:h-80 md:h-96 bg-blue-400/20 rounded-full blur-2xl sm:blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 5
            }}
            className="absolute top-1/2 right-1/4 translate-x-1/2 -translate-y-1/2 w-64 sm:w-80 md:w-96 h-64 sm:h-80 md:h-96 bg-cyan-400/20 rounded-full blur-2xl sm:blur-3xl"
          />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-full text-blue-700 font-semibold text-xs sm:text-sm mb-6 sm:mb-8">
              <Sparkles className="w-3 sm:w-4 h-3 sm:h-4" />
              <span className="hidden sm:inline">LIMITED TIME OFFER</span>
              <span className="sm:hidden">SPECIAL OFFER</span>
              <Sparkles className="w-3 sm:w-4 h-3 sm:h-4" />
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4 sm:mb-6">
              <span className="text-gray-900">Ready to Transform</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600">
                Your Business?
              </span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 mb-6 sm:mb-8 md:mb-10 max-w-2xl mx-auto px-2">
              Get a free consultation and quote for your project. No obligations, just expert advice.
            </p>

            <div className="flex justify-center mb-6 sm:mb-8">
              <motion.button
                onClick={() => setShowQuoteForm(true)}
                whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(59, 130, 246, 0.3)' }}
                whileTap={{ scale: 0.95 }}
                className="group relative px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full font-bold text-base sm:text-lg text-white overflow-hidden shadow-xl"
              >
                <span className="relative z-10 flex items-center gap-2 justify-center">
                  <Mail className="w-4 sm:w-5 h-4 sm:h-5" />
                  <span className="hidden sm:inline">Get Free Quote Now</span>
                  <span className="sm:hidden">Get Quote</span>
                  <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600"
                  initial={{ x: '100%' }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-6 text-gray-600 text-xs sm:text-sm">
              <div className="flex items-center gap-1 sm:gap-2">
                <CheckCircle className="w-4 sm:w-5 h-4 sm:h-5 text-green-500" />
                <span>Free Consultation</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <CheckCircle className="w-4 sm:w-5 h-4 sm:h-5 text-green-500" />
                <span>No Obligations</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <CheckCircle className="w-4 sm:w-5 h-4 sm:h-5 text-green-500" />
                <span className="hidden sm:inline">Expert Advice</span>
                <span className="sm:hidden">Expert</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <CheckCircle className="w-4 sm:w-5 h-4 sm:h-5 text-green-500" />
                <span className="hidden sm:inline">Quick Response</span>
                <span className="sm:hidden">Fast</span>
              </div>
            </div>

            {/* Contact Info */}
            <div className="mt-8 sm:mt-10 md:mt-12 pt-6 sm:pt-8 border-t border-gray-200">
              <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">Prefer to reach out directly?</p>
              <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 md:gap-6 justify-center text-gray-700 text-sm sm:text-base">
                <a href="tel:+1234567890" className="flex items-center justify-center sm:justify-start gap-2 hover:text-blue-600 transition-colors">
                  <Phone className="w-3 sm:w-4 h-3 sm:h-4" />
                  <span className="hidden sm:inline">+1 (234) 567-890</span>
                  <span className="sm:hidden">Call Us</span>
                </a>
                <a href="mailto:hello@flickmax.com" className="flex items-center justify-center sm:justify-start gap-2 hover:text-blue-600 transition-colors">
                  <Mail className="w-3 sm:w-4 h-3 sm:h-4" />
                  <span className="hidden sm:inline">hello@flickmax.com</span>
                  <span className="sm:hidden">Email Us</span>
                </a>
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <MapPin className="w-3 sm:w-4 h-3 sm:h-4" />
                  <span className="hidden sm:inline">Available Worldwide</span>
                  <span className="sm:hidden">Worldwide</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quote Form Modal */}
      {showQuoteForm && (
        <DevelopmentQuoteForm onClose={() => setShowQuoteForm(false)} />
      )}
    </div>
  )
}