'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import './legal-content.css'

interface AgreementContent {
  content: string
  title?: string
  sections?: Array<{
    type: string
    title: string
    content: string
  }>
  processedAt?: string
}

export default function AgreementPage() {
  const params = useParams()
  const slug = params.slug as string
  
  const [agreement, setAgreement] = useState<AgreementContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (slug) {
      fetchAgreement()
    }
  }, [slug])

  const fetchAgreement = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Map slug to agreement ID
      const agreementId = mapSlugToId(slug)
      
      const response = await fetch(`/api/legal/agreements/${agreementId}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Agreement not found. This may be an external document.')
        }
        throw new Error('Failed to fetch agreement')
      }
      
      const result = await response.json()
      
      if (result.success) {
        setAgreement(result.data)
      } else {
        throw new Error(result.error || 'Failed to load agreement')
      }
    } catch (err) {
      console.error('Error fetching agreement:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const mapSlugToId = (slug: string): string => {
    const slugToIdMap: Record<string, string> = {
      'universal-terms-of-service-agreement': 'utos',
      'certificate-services-agreement': '26864',
      'change-of-registrant-agreement': 'domain_nc',
      'domain-name-proxy-agreement': 'domain_nameproxy',
      'domain-name-transfer-agreement': 'transfer_sa',
      'domain-name-registration-agreement': 'reg_sa',
      'email-marketing-services': '15991',
      'hosting-agreement': 'hosting_sa',
      'marketing-applications-agreement': '8310',
      'online-store-quick-shopping-cart-agreement': 'qsc_eula',
      'professional-web-services-agreement': '7911',
      'website-builder-service-agreement': '26443',
      'website-security-terms-of-use': '26464',
      'workspace-service-agreement': '7973',
      'microsoft-office-terms-of-use': '8887',
      'privacy-policy': 'privacy',
      'subpoena-policy-attorney-tips': '5505',
      'dispute-on-transfer-away-form': 'dispute_on_transfer_away_form',
      'uniform-domain-name-dispute-resolution-policy': 'uniform_domain',
      'trademark-copyright-infringement': 'tradmark_copy',
      'refund-policy': '19963',
      'statement-of-support': '40085',
      'data-processing-addendum': '27912'
    }
    
    return slugToIdMap[slug] || slug
  }

  const formatTitle = (slug: string): string => {
    const titles: Record<string, string> = {
      'universal-terms-of-service-agreement': 'Universal Terms of Service Agreement',
      'privacy-policy': 'Privacy Policy',
      'data-processing-addendum': 'Data Processing Addendum (Customers)'
    }
    
    return titles[slug] || slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }


  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 13V7m0 6l.01.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Unable to Load Agreement</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="flex items-center justify-center gap-4">
              <Link
                href="/legal"
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Back to Legal
              </Link>
              <button
                onClick={fetchAgreement}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-cyan-50 py-12 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div>
            <Link
              href="/legal"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors mb-6 font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Legal Agreements
            </Link>
            
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                {agreement?.title || formatTitle(slug)}
              </h1>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
            {/* Table of Contents if sections exist */}
            {agreement?.sections && agreement.sections.length > 1 && (
              <div className="mb-8 p-6 bg-gray-50 rounded-lg print:hidden">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Table of Contents</h2>
                <ul className="space-y-2">
                  {agreement.sections.map((section, index) => (
                    <li key={index}>
                      <a
                        href={`#section-${index}`}
                        className="text-blue-600 hover:text-blue-700 hover:underline"
                      >
                        {section.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Main Content */}
            <div className="prose prose-gray max-w-none">
              {agreement?.sections && agreement.sections.length > 0 ? (
                // Render sections
                agreement.sections.map((section, index) => (
                  <div key={index} id={`section-${index}`} className="mb-8">
                    {section.type !== 'toc' && (
                      <>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4 pt-4 border-t border-gray-200 first:border-0 first:pt-0">
                          {section.title}
                        </h2>
                        <div 
                          className="legal-content text-gray-600 leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: section.content }}
                        />
                      </>
                    )}
                  </div>
                ))
              ) : (
                // Render raw content
                <div 
                  className="legal-content text-gray-600 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: agreement?.content || '' }}
                />
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="mt-8 print:hidden">
            <Link
              href="/legal"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Legal Agreements
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}