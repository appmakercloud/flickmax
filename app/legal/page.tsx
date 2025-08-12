'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FileText, Shield, ExternalLink, Loader2, ChevronRight, Scale, Info } from 'lucide-react'
import Link from 'next/link'

interface Agreement {
  key: string
  id: string
  type?: string
  displayName: string
  slug: string
  url?: string | null
  href?: string
}

interface LegalData {
  agreements: Agreement[]
  policies: Agreement[]
  total: number
  lastUpdated: string
}

export default function LegalPage() {
  const [legalData, setLegalData] = useState<LegalData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchLegalAgreements()
  }, [])

  const fetchLegalAgreements = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/legal/agreements')
      
      if (!response.ok) {
        throw new Error('Failed to fetch legal agreements')
      }
      
      const result = await response.json()
      
      if (result.success) {
        setLegalData(result.data)
      } else {
        throw new Error(result.error || 'Failed to load agreements')
      }
    } catch (err) {
      console.error('Error fetching legal agreements:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const AgreementLink = ({ item }: { item: Agreement }) => {
    // Check if it's an external link (ICANN policies)
    if (item.url || item.href) {
      return (
        <a
          href={item.url || item.href}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-blue-400 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 transition-all duration-200"
        >
          <span className="text-gray-700 group-hover:text-blue-600 transition-colors">
            {item.displayName}
          </span>
          <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
        </a>
      )
    }
    
    // Internal agreement pages
    return (
      <Link
        href={`/legal/${item.slug}`}
        className="group flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-blue-400 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 transition-all duration-200"
      >
        <span className="text-gray-700 group-hover:text-blue-600 transition-colors">
          {item.displayName}
        </span>
        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors group-hover:translate-x-1" />
      </Link>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
              <Info className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Unable to Load Legal Agreements</h2>
            <p className="text-gray-600">{error}</p>
            <button
              onClick={fetchLegalAgreements}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-cyan-50 py-16 border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 mb-6 shadow-md">
              <Scale className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-gray-900">
              Legal Agreements
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              This page contains links to current corporate policies as well as agreements for the products and services available through Flickmax.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Introduction Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Flickmax Legal Agreements and Policies
            </h2>
            <p className="text-gray-600 leading-relaxed">
              This page contains links to current corporate policies as well as agreements for the products and services available through Flickmax. 
              To view any of the documents presented on this page, click on the policy/agreement.
            </p>
            
            {/* Universal Terms of Service - Special Highlight */}
            {legalData?.agreements.find(a => a.key === 'universal-terms-of-service-agreement') && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <Link
                  href="/legal/universal-terms-of-service-agreement"
                  className="flex items-center gap-3 text-blue-700 hover:text-blue-800 font-semibold"
                >
                  <FileText className="w-5 h-5" />
                  <span>Universal Terms of Service Agreement</span>
                  <ChevronRight className="w-4 h-4 ml-auto" />
                </Link>
              </div>
            )}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Agreements Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Agreements
                </h3>
              </div>
              
              <div className="p-6">
                <div className="space-y-3">
                  {legalData?.agreements
                    .filter(a => a.key !== 'universal-terms-of-service-agreement')
                    .map((agreement) => (
                      <AgreementLink key={agreement.key} item={agreement} />
                    ))}
                </div>
              </div>
            </motion.div>

            {/* Policies Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Policies and Other Documents
                </h3>
              </div>
              
              <div className="p-6">
                <div className="space-y-3">
                  {legalData?.policies.map((policy) => (
                    <AgreementLink key={policy.key} item={policy} />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Footer Note */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 p-6 bg-gray-50 rounded-xl border border-gray-200"
          >
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-gray-500 mt-0.5" />
              <div className="text-sm text-gray-600">
                <p className="mb-2">
                  <strong>Note:</strong> Some links may direct you to external websites (such as ICANN policies). 
                  These will open in a new window.
                </p>
                <p>
                  For questions about these agreements or policies, please contact our support team.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}