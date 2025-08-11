'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FileText,
  Shield,
  Scale,
  Book,
  ChevronDown,
  Clock,
  AlertCircle,
  CheckCircle,
  Info,
  Search,
  Download,
  Printer,
  Calendar,
  RefreshCw,
  Globe,
  Lock,
  Users,
  Building,
  ChevronRight,
  Eye,
  Hash,
  List
} from 'lucide-react'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import toast from 'react-hot-toast'

interface Section {
  title: string
  content: string
  type: string
}

interface AgreementData {
  title?: string
  content?: string
  lastUpdated?: string
  sections?: Section[]
  effectiveDate?: string
  version?: string
}

interface ApiResponse {
  success: boolean
  data: AgreementData
  cached?: boolean
  cacheAge?: number
  nextRefresh?: string
  stale?: boolean
  error?: string
}

export default function LegalAgreementsPage() {
  const [agreementData, setAgreementData] = useState<AgreementData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedSection, setSelectedSection] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [cacheInfo, setCacheInfo] = useState<{
    cached: boolean
    cacheAge?: number
    nextRefresh?: string
  }>({ cached: false })
  const [showToc, setShowToc] = useState(true)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useEffect(() => {
    fetchAgreements()
  }, [])

  const fetchAgreements = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/legal/agreements')
      const data: ApiResponse = await response.json()
      
      if (data.success && data.data) {
        setAgreementData(data.data)
        setCacheInfo({
          cached: data.cached || false,
          cacheAge: data.cacheAge,
          nextRefresh: data.nextRefresh
        })
        
        if (data.stale) {
          toast('Using cached data. Fresh data will be available soon.', {
            icon: '⚠️'
          })
        }
      } else {
        throw new Error(data.error || 'Failed to load agreements')
      }
    } catch (err) {
      console.error('Error fetching agreements:', err)
      setError(err instanceof Error ? err.message : 'Failed to load legal agreements')
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    try {
      const response = await fetch('/api/legal/agreements', {
        method: 'POST'
      })
      
      if (response.ok) {
        toast.success('Legal agreements refreshed successfully')
        await fetchAgreements()
      } else {
        toast.error('Failed to refresh agreements')
      }
    } catch (err) {
      toast.error('Error refreshing agreements')
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    if (!agreementData) return
    
    const content = agreementData.content || 'No content available'
    const blob = new Blob([content.replace(/<[^>]*>/g, '')], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'flickmax-legal-agreements.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('Legal agreements downloaded')
  }

  const renderContent = (content: string) => {
    // Parse and render HTML content safely
    return (
      <div 
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ 
          __html: content
            .replace(/<h1/g, '<h1 class="text-3xl font-bold text-gray-900 mb-4 mt-8"')
            .replace(/<h2/g, '<h2 class="text-2xl font-bold text-gray-900 mb-3 mt-6"')
            .replace(/<h3/g, '<h3 class="text-xl font-semibold text-gray-800 mb-2 mt-4"')
            .replace(/<p/g, '<p class="text-gray-700 mb-4 leading-relaxed"')
            .replace(/<ul/g, '<ul class="list-disc list-inside mb-4 text-gray-700 space-y-2"')
            .replace(/<ol/g, '<ol class="list-decimal list-inside mb-4 text-gray-700 space-y-2"')
            .replace(/<li/g, '<li class="ml-4"')
            .replace(/<strong/g, '<strong class="font-semibold text-gray-900"')
            .replace(/<a /g, '<a class="text-blue-600 hover:text-blue-800 underline" ')
        }}
      />
    )
  }

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-cyan-50 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(59, 130, 246, 0.1), transparent 50%)`,
            }}
          />
          <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        </div>

        {/* Floating Icons */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[FileText, Shield, Scale, Book, Lock].map((Icon, i) => (
            <motion.div
              key={i}
              className="absolute"
              initial={{ 
                x: `${20 + i * 15}%`,
                y: -100
              }}
              animate={{
                y: '120vh',
                rotate: 360
              }}
              transition={{
                duration: 20 + i * 3,
                repeat: Infinity,
                delay: i * 2,
                ease: "linear"
              }}
            >
              <Icon className="w-8 h-8 text-blue-200/30" />
            </motion.div>
          ))}
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring' }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 rounded-full text-sm font-medium mb-6"
            >
              <Scale className="w-4 h-4" />
              Legal Documentation
            </motion.div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-4">
              Legal Agreements
            </h1>
            <p className="text-xl sm:text-2xl md:text-3xl font-bold mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
                Terms of Service & Policies
              </span>
            </p>
            
            <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Read our comprehensive legal agreements, terms of service, and policies that govern the use of our services.
            </p>

            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                onClick={handlePrint}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center px-6 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-all"
              >
                <Printer className="mr-2 w-5 h-5" />
                Print Document
              </motion.button>
              
              <motion.button
                onClick={handleDownload}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                <Download className="mr-2 w-5 h-5" />
                Download PDF
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Cache Info Bar */}
      {cacheInfo.cached && (
        <section className="py-3 bg-amber-50 border-y border-amber-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-sm text-amber-800">
                <Info className="w-4 h-4" />
                <span>
                  Document cached {cacheInfo.cacheAge ? Math.floor(cacheInfo.cacheAge / 3600) + ' hours ago' : ''}.
                  Next refresh: {cacheInfo.nextRefresh ? new Date(cacheInfo.nextRefresh).toLocaleString() : 'Unknown'}
                </span>
              </div>
              <button
                onClick={handleRefresh}
                className="inline-flex items-center gap-2 px-3 py-1 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 transition-all"
              >
                <RefreshCw className="w-3 h-3" />
                Refresh Now
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <LoadingSpinner size="lg" />
            </div>
          ) : error ? (
            <div className="max-w-2xl mx-auto text-center py-20">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Failed to Load Agreements</h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <button
                onClick={fetchAgreements}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all"
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                Try Again
              </button>
            </div>
          ) : agreementData ? (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Table of Contents - Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-4 bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                      <List className="w-5 h-5 text-blue-600" />
                      Table of Contents
                    </h3>
                    <button
                      onClick={() => setShowToc(!showToc)}
                      className="lg:hidden"
                    >
                      <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${showToc ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                  
                  <AnimatePresence>
                    {showToc && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="space-y-2"
                      >
                        {agreementData.sections?.map((section, index) => (
                          <motion.button
                            key={index}
                            onClick={() => {
                              setSelectedSection(index)
                              const element = document.getElementById(`section-${index}`)
                              element?.scrollIntoView({ behavior: 'smooth' })
                            }}
                            whileHover={{ x: 4 }}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center gap-2 ${
                              selectedSection === index
                                ? 'bg-blue-100 text-blue-700 font-medium'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                          >
                            <Hash className="w-3 h-3" />
                            <span className="line-clamp-2">{section.title}</span>
                          </motion.button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Document Info */}
                <div className="mt-6 bg-blue-50 rounded-xl p-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Document Information</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <span>Last Updated: {agreementData.lastUpdated ? new Date(agreementData.lastUpdated).toLocaleDateString() : 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Globe className="w-4 h-4 text-blue-600" />
                      <span>Region: United States</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Shield className="w-4 h-4 text-blue-600" />
                      <span>Version: {agreementData.version || '1.0'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content Area */}
              <div className="lg:col-span-3">
                <div className="bg-white rounded-xl shadow-lg p-8">
                  {/* Search Bar */}
                  <div className="mb-6">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search in document..."
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="prose-container">
                    {agreementData.sections && agreementData.sections.length > 0 ? (
                      <div className="space-y-8">
                        {agreementData.sections.map((section, index) => (
                          <motion.div
                            key={index}
                            id={`section-${index}`}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="scroll-mt-20"
                          >
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                              <span className="text-blue-600">{index + 1}.</span>
                              {section.title}
                            </h2>
                            {renderContent(section.content)}
                          </motion.div>
                        ))}
                      </div>
                    ) : agreementData.content ? (
                      renderContent(agreementData.content)
                    ) : (
                      <div className="text-center py-10">
                        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No agreement content available</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </section>

      {/* Footer Notice */}
      <section className="py-8 bg-gray-50 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            By using our services, you agree to these terms
          </div>
          <p className="text-xs text-gray-500">
            These agreements are legally binding. Please read them carefully. 
            If you have questions, contact our legal team at legal@flickmax.com
          </p>
        </div>
      </section>
    </div>
  )
}