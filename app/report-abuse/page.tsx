'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Shield,
  AlertTriangle,
  Mail,
  Globe,
  FileText,
  User,
  Link,
  MessageSquare,
  Send,
  CheckCircle,
  Info,
  Phone,
  Clock,
  ChevronDown,
  ShieldAlert,
  Bug,
  CreditCard,
  UserX,
  Copyright,
  Megaphone,
  Ban,
  AlertCircle,
  HelpCircle,
  ExternalLink,
  ArrowRight,
  Lock,
  FileWarning,
  Zap
} from 'lucide-react'
import { useCountry } from '@/contexts/CountryContext'
import toast from 'react-hot-toast'

export default function ReportAbusePage() {
  const [formData, setFormData] = useState({
    reporterName: '',
    reporterEmail: '',
    reporterPhone: '',
    abuseType: '',
    domainUrl: '',
    description: '',
    evidence: '',
    additionalInfo: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const { country } = useCountry()

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

  const abuseTypes = [
    { 
      value: 'phishing', 
      label: 'Phishing', 
      icon: ShieldAlert,
      description: 'Fraudulent attempts to obtain sensitive information'
    },
    { 
      value: 'malware', 
      label: 'Malware/Virus', 
      icon: Bug,
      description: 'Distribution of malicious software'
    },
    { 
      value: 'spam', 
      label: 'Spam', 
      icon: Megaphone,
      description: 'Unsolicited bulk messages or content'
    },
    { 
      value: 'fraud', 
      label: 'Fraud/Scam', 
      icon: CreditCard,
      description: 'Deceptive practices for financial gain'
    },
    { 
      value: 'copyright', 
      label: 'Copyright Infringement', 
      icon: Copyright,
      description: 'Unauthorized use of copyrighted material'
    },
    { 
      value: 'impersonation', 
      label: 'Impersonation', 
      icon: UserX,
      description: 'False representation of identity'
    },
    { 
      value: 'illegal', 
      label: 'Illegal Content', 
      icon: Ban,
      description: 'Content that violates laws'
    },
    { 
      value: 'other', 
      label: 'Other', 
      icon: AlertCircle,
      description: 'Other types of abuse not listed'
    }
  ]

  const responseSteps = [
    {
      number: '01',
      title: 'Report Received',
      description: 'We acknowledge your report within 24 hours',
      icon: FileText
    },
    {
      number: '02',
      title: 'Investigation',
      description: 'Our team investigates the reported content',
      icon: Shield
    },
    {
      number: '03',
      title: 'Action Taken',
      description: 'Appropriate measures are implemented',
      icon: CheckCircle
    },
    {
      number: '04',
      title: 'Follow-up',
      description: 'We update you on the resolution',
      icon: MessageSquare
    }
  ]

  const faqs = [
    {
      question: 'What qualifies as abuse?',
      answer: 'Abuse includes phishing, malware distribution, spam, fraud, copyright infringement, impersonation, illegal content, and any activity that violates our Terms of Service or applicable laws.'
    },
    {
      question: 'How quickly will you respond to my report?',
      answer: 'We acknowledge all reports within 24 hours. Investigation and resolution timeframes vary based on the complexity and severity of the abuse, but most cases are resolved within 48-72 hours.'
    },
    {
      question: 'Will my identity be kept confidential?',
      answer: 'Yes, we treat all reports confidentially. Your personal information will not be shared with the reported party. We only use your contact details to communicate about the investigation.'
    },
    {
      question: 'What evidence should I provide?',
      answer: 'Include screenshots, email headers, URLs, timestamps, and any documentation that supports your report. The more detailed evidence you provide, the faster we can investigate.'
    },
    {
      question: 'What happens after I submit a report?',
      answer: 'You\'ll receive an acknowledgment email with a ticket number. Our abuse team will investigate and take appropriate action, which may include content removal, account suspension, or law enforcement referral.'
    },
    {
      question: 'Can I report abuse anonymously?',
      answer: 'While we prefer contact information for follow-up questions, you can submit reports without providing personal details. However, this may limit our ability to investigate thoroughly.'
    },
    {
      question: 'What if the abuse is urgent or life-threatening?',
      answer: 'For immediate threats to safety or life-threatening situations, contact local law enforcement immediately. Then submit a report to us marking it as urgent, and we\'ll prioritize the investigation.'
    },
    {
      question: 'Do you work with law enforcement?',
      answer: 'Yes, we cooperate with law enforcement agencies when required by law or when criminal activity is suspected. We maintain records and provide information as legally required.'
    }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    toast.success('Abuse report submitted successfully. We\'ll investigate and contact you within 24 hours.')
    setFormData({
      reporterName: '',
      reporterEmail: '',
      reporterPhone: '',
      abuseType: '',
      domainUrl: '',
      description: '',
      evidence: '',
      additionalInfo: ''
    })
    setSubmitting(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
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
          {[Shield, AlertTriangle, Lock, FileWarning, Ban].map((Icon, i) => (
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
              <ShieldAlert className="w-4 h-4" />
              Help Us Keep the Internet Safe
            </motion.div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-4">
              Report Abuse
            </h1>
            <p className="text-xl sm:text-2xl md:text-3xl font-bold mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
                Protecting Our Community Together
              </span>
            </p>
            
            <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Found something suspicious? Report abuse, fraud, or any content that violates our policies. 
              We take all reports seriously and respond within 24 hours.
            </p>

            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="#report-form"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                <FileWarning className="mr-2 w-5 h-5" />
                File a Report
              </motion.a>
              
              <motion.a
                href="#emergency"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center px-6 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-all"
              >
                <Zap className="mr-2 w-5 h-5" />
                Urgent Report
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Emergency Contact */}
      <section id="emergency" className="py-8 bg-blue-50 border-y-2 border-blue-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-8 h-8 text-blue-600 animate-pulse" />
              <div>
                <h3 className="font-bold text-gray-900">For Urgent Security Issues</h3>
                <p className="text-sm text-gray-600">Life-threatening situations or immediate security threats</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href={`tel:${country.phoneNumber.replace(/[^0-9+]/g, '')}`}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all"
              >
                <Phone className="w-4 h-4 mr-2" />
                {country.phoneNumber}
              </a>
              <a 
                href="mailto:abuse@flickmax.com"
                className="inline-flex items-center px-4 py-2 bg-white text-blue-600 border border-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-all"
              >
                <Mail className="w-4 h-4 mr-2" />
                abuse@flickmax.com
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Abuse Types */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 mb-4">
              Types of Abuse We Handle
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Select the category that best describes the issue you're reporting
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {abuseTypes.map((type, index) => (
              <motion.div
                key={type.value}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="group p-6 bg-white border border-gray-200 rounded-xl hover:shadow-lg hover:border-blue-300 transition-all cursor-pointer"
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className="inline-flex p-3 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-lg mb-4"
                >
                  <type.icon className="w-6 h-6 text-blue-600" />
                </motion.div>
                <h3 className="font-bold text-gray-900 mb-2">{type.label}</h3>
                <p className="text-sm text-gray-600">{type.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Report Form */}
      <section id="report-form" className="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 mb-4">
              Submit Abuse Report
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Please provide detailed information to help us investigate effectively
            </p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            {/* Reporter Information */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Your Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="reporterName" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    id="reporterName"
                    name="reporterName"
                    value={formData.reporterName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label htmlFor="reporterEmail" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="reporterEmail"
                    name="reporterEmail"
                    value={formData.reporterEmail}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="john@example.com"
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="reporterPhone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    id="reporterPhone"
                    name="reporterPhone"
                    value={formData.reporterPhone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>
            </div>

            {/* Abuse Details */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-blue-600" />
                Abuse Details
              </h3>
              <div className="space-y-6">
                <div>
                  <label htmlFor="abuseType" className="block text-sm font-medium text-gray-700 mb-2">
                    Type of Abuse *
                  </label>
                  <select
                    id="abuseType"
                    name="abuseType"
                    value={formData.abuseType}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="">Select abuse type</option>
                    {abuseTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label} - {type.description}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="domainUrl" className="block text-sm font-medium text-gray-700 mb-2">
                    Domain/URL Involved *
                  </label>
                  <input
                    type="text"
                    id="domainUrl"
                    name="domainUrl"
                    value={formData.domainUrl}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="https://example.com or suspicious@domain.com"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Detailed Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all resize-none"
                    placeholder="Please describe the abuse in detail. Include dates, times, and specific incidents..."
                  />
                </div>

                <div>
                  <label htmlFor="evidence" className="block text-sm font-medium text-gray-700 mb-2">
                    Evidence/Supporting Information
                  </label>
                  <textarea
                    id="evidence"
                    name="evidence"
                    value={formData.evidence}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all resize-none"
                    placeholder="Links to screenshots, email headers, or other evidence (you can also email attachments separately)"
                  />
                </div>

                <div>
                  <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Information
                  </label>
                  <textarea
                    id="additionalInfo"
                    name="additionalInfo"
                    value={formData.additionalInfo}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all resize-none"
                    placeholder="Any other relevant information..."
                  />
                </div>
              </div>
            </div>

            {/* Legal Notice */}
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-amber-800">
                  <p className="font-semibold mb-1">Legal Notice</p>
                  <p>
                    By submitting this report, you confirm that the information provided is accurate to the best of your knowledge. 
                    False reports may result in legal action. We may share information with law enforcement when required.
                  </p>
                </div>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={submitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full py-4 rounded-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 ${
                submitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {submitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Submitting Report...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Submit Abuse Report
                </>
              )}
            </motion.button>
          </motion.form>
        </div>
      </section>

      {/* Response Process */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 mb-4">
              What Happens Next?
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Our dedicated abuse team follows a structured process to address your report
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {responseSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative text-center"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-cyan-600 text-white rounded-2xl shadow-lg mb-4"
                >
                  <span className="text-2xl font-bold">{step.number}</span>
                </motion.div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-600">{step.description}</p>
                {index < responseSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-full w-full">
                    <ArrowRight className="w-6 h-6 text-blue-300 -ml-3" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-base sm:text-lg text-gray-600">
              Common questions about reporting abuse
            </p>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900">{faq.question}</span>
                  <motion.div
                    animate={{ rotate: expandedFaq === index ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {expandedFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-6 pb-4">
                        <p className="text-gray-600">{faq.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Resources */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 mb-4">
              Additional Resources
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Helpful links and information for online safety
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <motion.a
              href="https://www.ic3.gov"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -4 }}
              className="p-6 bg-white border border-gray-200 rounded-xl hover:shadow-lg transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <Shield className="w-8 h-8 text-blue-600" />
                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">FBI IC3</h3>
              <p className="text-sm text-gray-600">
                Internet Crime Complaint Center for reporting cybercrime
              </p>
            </motion.a>

            <motion.a
              href="https://www.consumer.ftc.gov"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -4 }}
              className="p-6 bg-white border border-gray-200 rounded-xl hover:shadow-lg transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <FileText className="w-8 h-8 text-green-600" />
                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">FTC Consumer</h3>
              <p className="text-sm text-gray-600">
                Federal Trade Commission consumer protection resources
              </p>
            </motion.a>

            <motion.a
              href="/legal/terms"
              whileHover={{ y: -4 }}
              className="p-6 bg-white border border-gray-200 rounded-xl hover:shadow-lg transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <FileWarning className="w-8 h-8 text-orange-600" />
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Terms of Service</h3>
              <p className="text-sm text-gray-600">
                Review our policies and acceptable use guidelines
              </p>
            </motion.a>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-blue-600 to-cyan-600 relative overflow-hidden">
        <div className="absolute inset-0">
          <motion.div
            animate={{ 
              x: [0, 100, 0],
              y: [0, -50, 0]
            }}
            transition={{ 
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"
          />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4">
              Committed to Online Safety
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              We work 24/7 to maintain a safe and trusted online environment for everyone
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="/contact"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-xl font-bold shadow-xl hover:shadow-2xl transition-all"
              >
                <MessageSquare className="w-5 h-5 mr-2" />
                Contact Support
              </motion.a>
              
              <motion.a
                href="/legal/privacy"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center px-8 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 rounded-xl font-bold hover:bg-white/20 transition-all"
              >
                <Lock className="w-5 h-5 mr-2" />
                Privacy Policy
              </motion.a>
            </div>

            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20"
              >
                <div className="flex items-center justify-center gap-2 text-white">
                  <Clock className="w-6 h-6 text-yellow-400" />
                  <div className="text-left">
                    <p className="text-sm font-medium">24-Hour</p>
                    <p className="text-xs text-white/80">Response Time</p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20"
              >
                <div className="flex items-center justify-center gap-2 text-white">
                  <Shield className="w-6 h-6 text-green-400" />
                  <div className="text-left">
                    <p className="text-sm font-medium">Verified</p>
                    <p className="text-xs text-white/80">Security Team</p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20"
              >
                <div className="flex items-center justify-center gap-2 text-white">
                  <Lock className="w-6 h-6 text-cyan-400" />
                  <div className="text-left">
                    <p className="text-sm font-medium">Confidential</p>
                    <p className="text-xs text-white/80">Report Handling</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}