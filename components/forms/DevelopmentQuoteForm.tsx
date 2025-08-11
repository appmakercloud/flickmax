'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  User, 
  Building, 
  Mail, 
  Phone, 
  Globe, 
  Layers, 
  DollarSign,
  Calendar,
  FileText,
  Sparkles,
  Loader2,
  CheckCircle,
  AlertCircle,
  Smartphone,
  ShoppingCart,
  Code,
  Palette,
  Rocket,
  Clock,
  Users,
  Shield,
  Zap,
  Target,
  MessageSquare,
  X,
  Briefcase,
  MapPin,
  ChevronRight,
  Star,
  Trophy,
  TrendingUp,
  Heart,
  Gift,
  Coffee,
  Cpu,
  Database,
  Server,
  Cloud,
  GitBranch,
  Package,
  Settings,
  PenTool,
  Monitor,
  Tablet,
  Watch,
  Headphones,
  Mic,
  Camera,
  Image,
  Film,
  Music,
  Bell,
  Send,
  Share2,
  Link,
  Hash,
  Award,
  BarChart,
  PieChart,
  Activity,
  Wifi,
  Navigation,
  Compass,
  Map,
  Book,
  BookOpen,
  FileSearch,
  FolderOpen,
  Archive,
  Download,
  Upload,
  Save,
  Edit,
  Copy,
  Clipboard,
  Trash2
} from 'lucide-react'
import toast from 'react-hot-toast'

interface FormData {
  // Step 1: Contact Information
  fullName: string
  email: string
  phone: string
  company: string
  website: string
  
  // Step 2: Project Type
  projectType: string[]
  industry: string
  
  // Step 3: Project Details
  projectDescription: string
  features: string[]
  existingWebsite: string
  
  // Step 4: Technical Requirements
  platforms: string[]
  integrations: string[]
  hosting: string
  
  // Step 5: Timeline & Budget
  timeline: string
  budget: string
  startDate: string
  
  // Step 6: Additional Information
  competitors: string
  additionalNotes: string
  howDidYouHear: string
}

const initialFormData: FormData = {
  fullName: '',
  email: '',
  phone: '',
  company: '',
  website: '',
  projectType: [],
  industry: '',
  projectDescription: '',
  features: [],
  existingWebsite: '',
  platforms: [],
  integrations: [],
  hosting: '',
  timeline: '',
  budget: '',
  startDate: '',
  competitors: '',
  additionalNotes: '',
  howDidYouHear: ''
}

const projectTypes = [
  { id: 'website', label: 'Custom Website', icon: Globe, color: 'from-blue-500 to-cyan-500' },
  { id: 'webapp', label: 'Web Application', icon: Layers, color: 'from-purple-500 to-pink-500' },
  { id: 'mobile', label: 'Mobile App', icon: Smartphone, color: 'from-green-500 to-teal-500' },
  { id: 'ecommerce', label: 'E-Commerce', icon: ShoppingCart, color: 'from-orange-500 to-red-500' },
  { id: 'redesign', label: 'Website Redesign', icon: Palette, color: 'from-indigo-500 to-purple-500' },
  { id: 'other', label: 'Other', icon: Code, color: 'from-gray-500 to-gray-600' }
]

const industries = [
  'Healthcare', 'Education', 'Finance', 'Retail', 'Technology',
  'Real Estate', 'Restaurant/Food', 'Fitness/Wellness', 'Legal',
  'Manufacturing', 'Non-Profit', 'Entertainment', 'Travel', 'Other'
]

const features = [
  { name: 'User Authentication', icon: Shield },
  { name: 'Payment Processing', icon: CreditCard },
  { name: 'Admin Dashboard', icon: Settings },
  { name: 'API Integration', icon: GitBranch },
  { name: 'Real-time Updates', icon: Activity },
  { name: 'Multi-language Support', icon: Globe },
  { name: 'Search Functionality', icon: Search },
  { name: 'Social Media Integration', icon: Share2 },
  { name: 'Analytics Dashboard', icon: BarChart },
  { name: 'Email Notifications', icon: Mail },
  { name: 'File Upload/Download', icon: Upload },
  { name: 'Chat/Messaging', icon: MessageSquare },
  { name: 'Booking/Scheduling', icon: Calendar },
  { name: 'Inventory Management', icon: Package },
  { name: 'CRM Integration', icon: Users }
]

const platforms = [
  { name: 'Web Browser', icon: Monitor },
  { name: 'iOS', icon: Smartphone },
  { name: 'Android', icon: Tablet },
  { name: 'Windows', icon: Monitor },
  { name: 'macOS', icon: Monitor },
  { name: 'Linux', icon: Server }
]

const integrations = [
  'Payment Gateway (Stripe/PayPal)', 'Google Services', 'Social Media APIs',
  'Email Service (SendGrid/Mailgun)', 'SMS Service (Twilio)', 'CRM (Salesforce/HubSpot)',
  'Accounting Software', 'Shipping APIs', 'Analytics Tools', 'Custom API'
]

const timelines = [
  { value: 'asap', label: 'ASAP', description: 'Need it yesterday!' },
  { value: '1month', label: 'Within 1 month', description: 'Quick turnaround' },
  { value: '2-3months', label: '2-3 months', description: 'Standard timeline' },
  { value: '3-6months', label: '3-6 months', description: 'Complex project' },
  { value: '6months+', label: '6+ months', description: 'Enterprise scale' },
  { value: 'flexible', label: 'Flexible', description: 'No rush' }
]

const budgets = [
  { value: '5k-10k', label: '$5,000 - $10,000', description: 'Starter budget' },
  { value: '10k-25k', label: '$10,000 - $25,000', description: 'Professional' },
  { value: '25k-50k', label: '$25,000 - $50,000', description: 'Advanced' },
  { value: '50k-100k', label: '$50,000 - $100,000', description: 'Premium' },
  { value: '100k+', label: '$100,000+', description: 'Enterprise' },
  { value: 'not-sure', label: 'Not sure yet', description: 'Let\'s discuss' }
]

// Icons for steps
const stepIcons = [User, Briefcase, FileText, Cpu, Clock, Gift]

// Import icons dynamically
import { 
  CreditCard,
  Search
} from 'lucide-react'

export default function DevelopmentQuoteForm({ onClose }: { onClose?: () => void }) {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [errors, setErrors] = useState<Partial<FormData>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const totalSteps = 6

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error for this field
    setErrors(prev => ({ ...prev, [field]: '' }))
  }

  const toggleArrayField = (field: 'projectType' | 'features' | 'platforms' | 'integrations', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }))
  }

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<FormData> = {}

    switch (step) {
      case 1:
        if (!formData.fullName) newErrors.fullName = 'Name is required'
        if (!formData.email) newErrors.email = 'Email is required'
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email'
        if (!formData.phone) newErrors.phone = 'Phone is required'
        break
      case 2:
        if (formData.projectType.length === 0) newErrors.projectType = ['Select at least one project type']
        if (!formData.industry) newErrors.industry = 'Industry is required'
        break
      case 3:
        if (!formData.projectDescription) newErrors.projectDescription = 'Project description is required'
        if (formData.features.length === 0) newErrors.features = ['Select at least one feature']
        break
      case 4:
        if (formData.platforms.length === 0) newErrors.platforms = ['Select at least one platform']
        break
      case 5:
        if (!formData.timeline) newErrors.timeline = 'Timeline is required'
        if (!formData.budget) newErrors.budget = 'Budget range is required'
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps))
    }
  }

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/quote/development', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setIsSuccess(true)
        toast.success('Quote request submitted successfully!')
      } else {
        throw new Error('Failed to submit quote request')
      }
    } catch (error) {
      toast.error('Failed to submit. Please try again.')
      console.error('Submit error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-6 sm:mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center"
              >
                <User className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" />
              </motion.div>
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Let's Get Started!</h3>
              <p className="text-sm sm:text-base text-gray-600 px-4 sm:px-0">Tell us who you are so we can reach out</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <User className="inline w-4 h-4 mr-1" />
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => updateFormData('fullName', e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border-2 ${
                    errors.fullName ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'
                  } focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all text-gray-900 placeholder-gray-400`}
                  placeholder="John Doe"
                />
                {errors.fullName && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-sm text-red-600 flex items-center gap-1"
                  >
                    <AlertCircle className="w-4 h-4" />
                    {errors.fullName}
                  </motion.p>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Mail className="inline w-4 h-4 mr-1" />
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData('email', e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border-2 ${
                    errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'
                  } focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all text-gray-900 placeholder-gray-400`}
                  placeholder="john@company.com"
                />
                {errors.email && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-sm text-red-600 flex items-center gap-1"
                  >
                    <AlertCircle className="w-4 h-4" />
                    {errors.email}
                  </motion.p>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Phone className="inline w-4 h-4 mr-1" />
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateFormData('phone', e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border-2 ${
                    errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'
                  } focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all text-gray-900 placeholder-gray-400`}
                  placeholder="+1 (555) 123-4567"
                />
                {errors.phone && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-sm text-red-600 flex items-center gap-1"
                  >
                    <AlertCircle className="w-4 h-4" />
                    {errors.phone}
                  </motion.p>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Building className="inline w-4 h-4 mr-1" />
                  Company Name
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => updateFormData('company', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all text-gray-900 placeholder-gray-400"
                  placeholder="Acme Inc. (Optional)"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="md:col-span-2"
              >
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Globe className="inline w-4 h-4 mr-1" />
                  Current Website
                </label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => updateFormData('website', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all text-gray-900 placeholder-gray-400"
                  placeholder="https://www.example.com (Optional)"
                />
              </motion.div>
            </div>
          </motion.div>
        )

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-6 sm:mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center"
              >
                <Briefcase className="w-8 h-8 sm:w-10 sm:h-10 text-purple-600" />
              </motion.div>
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">What Are You Building?</h3>
              <p className="text-sm sm:text-base text-gray-600 px-4 sm:px-0">Select all that apply to your project</p>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-3 sm:mb-4">
                <Layers className="inline w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                Project Type * (Select all that apply)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                {projectTypes.map((type, index) => {
                  const Icon = type.icon
                  const isSelected = formData.projectType.includes(type.id)
                  return (
                    <motion.button
                      key={type.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() => toggleArrayField('projectType', type.id)}
                      className={`relative p-4 sm:p-6 rounded-xl sm:rounded-2xl border-2 transition-all overflow-hidden ${
                        isSelected
                          ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-cyan-50 shadow-lg'
                          : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
                      }`}
                    >
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-1 right-1 sm:top-2 sm:right-2"
                        >
                          <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                        </motion.div>
                      )}
                      <div className={`w-10 h-10 sm:w-14 sm:h-14 mx-auto mb-2 sm:mb-3 rounded-lg sm:rounded-xl bg-gradient-to-br ${type.color} p-2 sm:p-3`}>
                        <Icon className="w-full h-full text-white" />
                      </div>
                      <p className={`text-xs sm:text-sm font-semibold ${
                        isSelected ? 'text-blue-900' : 'text-gray-700'
                      }`}>{type.label}</p>
                    </motion.button>
                  )
                })}
              </div>
              {errors.projectType && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 text-sm text-red-600 flex items-center gap-1"
                >
                  <AlertCircle className="w-4 h-4" />
                  {errors.projectType[0]}
                </motion.p>
              )}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Building className="inline w-4 h-4 mr-1" />
                Industry *
              </label>
              <select
                value={formData.industry}
                onChange={(e) => updateFormData('industry', e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border-2 ${
                  errors.industry ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'
                } focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all text-gray-900`}
              >
                <option value="">Select your industry</option>
                {industries.map(industry => (
                  <option key={industry} value={industry}>{industry}</option>
                ))}
              </select>
              {errors.industry && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-sm text-red-600 flex items-center gap-1"
                >
                  <AlertCircle className="w-4 h-4" />
                  {errors.industry}
                </motion.p>
              )}
            </motion.div>
          </motion.div>
        )

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-6 sm:mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 bg-gradient-to-br from-green-100 to-teal-100 rounded-full flex items-center justify-center"
              >
                <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" />
              </motion.div>
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Project Details</h3>
              <p className="text-sm sm:text-base text-gray-600 px-4 sm:px-0">Tell us about your vision</p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <PenTool className="inline w-4 h-4 mr-1" />
                Describe Your Project *
              </label>
              <textarea
                value={formData.projectDescription}
                onChange={(e) => updateFormData('projectDescription', e.target.value)}
                rows={5}
                className={`w-full px-4 py-3 rounded-xl border-2 ${
                  errors.projectDescription ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'
                } focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all text-gray-900 placeholder-gray-400`}
                placeholder="Tell us about your project goals, target audience, and what success looks like..."
              />
              {errors.projectDescription && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-sm text-red-600 flex items-center gap-1"
                >
                  <AlertCircle className="w-4 h-4" />
                  {errors.projectDescription}
                </motion.p>
              )}
            </motion.div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-3 sm:mb-4">
                <Sparkles className="inline w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                Required Features * (Select all that apply)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
                {features.map((feature, index) => {
                  const Icon = feature.icon
                  const isSelected = formData.features.includes(feature.name)
                  return (
                    <motion.button
                      key={feature.name}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.02 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() => toggleArrayField('features', feature.name)}
                      className={`px-4 py-3 rounded-xl border-2 transition-all flex items-center gap-3 ${
                        isSelected
                          ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 shadow-md'
                          : 'border-gray-200 bg-white hover:border-blue-300 text-gray-700 hover:shadow-sm'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isSelected ? 'text-blue-600' : 'text-gray-400'}`} />
                      <span className="text-sm font-medium">{feature.name}</span>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="ml-auto"
                        >
                          <Check className="w-4 h-4 text-blue-600" />
                        </motion.div>
                      )}
                    </motion.button>
                  )
                })}
              </div>
              {errors.features && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 text-sm text-red-600 flex items-center gap-1"
                >
                  <AlertCircle className="w-4 h-4" />
                  {errors.features[0]}
                </motion.p>
              )}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Link className="inline w-4 h-4 mr-1" />
                Existing Website/App to Migrate From?
              </label>
              <input
                type="text"
                value={formData.existingWebsite}
                onChange={(e) => updateFormData('existingWebsite', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all text-gray-900 placeholder-gray-400"
                placeholder="https://current-website.com or 'No existing website'"
              />
            </motion.div>
          </motion.div>
        )

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-6 sm:mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center"
              >
                <Cpu className="w-8 h-8 sm:w-10 sm:h-10 text-orange-600" />
              </motion.div>
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Technical Requirements</h3>
              <p className="text-sm sm:text-base text-gray-600">Let's get into the technical details</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-4">
                <Monitor className="inline w-4 h-4 mr-1" />
                Target Platforms * (Select all that apply)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                {platforms.map((platform, index) => {
                  const Icon = platform.icon
                  const isSelected = formData.platforms.includes(platform.name)
                  return (
                    <motion.button
                      key={platform.name}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() => toggleArrayField('platforms', platform.name)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        isSelected
                          ? 'border-orange-500 bg-gradient-to-br from-orange-50 to-red-50 shadow-md'
                          : 'border-gray-200 bg-white hover:border-orange-300 hover:shadow-sm'
                      }`}
                    >
                      <Icon className={`w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 ${
                        isSelected ? 'text-orange-600' : 'text-gray-400'
                      }`} />
                      <p className={`text-sm font-medium ${
                        isSelected ? 'text-orange-900' : 'text-gray-700'
                      }`}>{platform.name}</p>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-2 right-2"
                        >
                          <CheckCircle className="w-5 h-5 text-orange-600" />
                        </motion.div>
                      )}
                    </motion.button>
                  )
                })}
              </div>
              {errors.platforms && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 text-sm text-red-600 flex items-center gap-1"
                >
                  <AlertCircle className="w-4 h-4" />
                  {errors.platforms[0]}
                </motion.p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-4">
                <GitBranch className="inline w-4 h-4 mr-1" />
                Third-Party Integrations (Optional)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {integrations.map((integration, index) => {
                  const isSelected = formData.integrations.includes(integration)
                  return (
                    <motion.button
                      key={integration}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.02 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() => toggleArrayField('integrations', integration)}
                      className={`px-4 py-2.5 rounded-lg border-2 transition-all text-sm text-left flex items-center justify-between ${
                        isSelected
                          ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700'
                          : 'border-gray-200 bg-white hover:border-blue-300 text-gray-700'
                      }`}
                    >
                      <span>{integration}</span>
                      {isSelected && <Check className="w-4 h-4 text-blue-600 ml-2" />}
                    </motion.button>
                  )
                })}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Cloud className="inline w-4 h-4 mr-1" />
                Hosting Preference
              </label>
              <select
                value={formData.hosting}
                onChange={(e) => updateFormData('hosting', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all text-gray-900"
              >
                <option value="">Select hosting preference</option>
                <option value="flickmax">Flickmax Hosting (Recommended)</option>
                <option value="aws">AWS</option>
                <option value="google-cloud">Google Cloud</option>
                <option value="azure">Microsoft Azure</option>
                <option value="own">I have my own hosting</option>
                <option value="not-sure">Not sure / Need recommendation</option>
              </select>
            </motion.div>
          </motion.div>
        )

      case 5:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-6 sm:mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center"
              >
                <Clock className="w-8 h-8 sm:w-10 sm:h-10 text-indigo-600" />
              </motion.div>
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Timeline & Budget</h3>
              <p className="text-sm sm:text-base text-gray-600">Help us plan your project</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-4">
                <Clock className="inline w-4 h-4 mr-1" />
                Project Timeline *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                {timelines.map((timeline, index) => (
                  <motion.button
                    key={timeline.value}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => updateFormData('timeline', timeline.value)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      formData.timeline === timeline.value
                        ? 'border-indigo-500 bg-gradient-to-br from-indigo-50 to-purple-50 shadow-md'
                        : 'border-gray-200 bg-white hover:border-indigo-300 hover:shadow-sm'
                    }`}
                  >
                    <p className={`text-sm font-semibold mb-1 ${
                      formData.timeline === timeline.value ? 'text-indigo-900' : 'text-gray-700'
                    }`}>{timeline.label}</p>
                    <p className={`text-xs ${
                      formData.timeline === timeline.value ? 'text-indigo-700' : 'text-gray-500'
                    }`}>{timeline.description}</p>
                    {formData.timeline === timeline.value && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="mt-2"
                      >
                        <CheckCircle className="w-5 h-5 text-indigo-600 mx-auto" />
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>
              {errors.timeline && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 text-sm text-red-600 flex items-center gap-1"
                >
                  <AlertCircle className="w-4 h-4" />
                  {errors.timeline}
                </motion.p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-4">
                <DollarSign className="inline w-4 h-4 mr-1" />
                Budget Range *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {budgets.map((budget, index) => (
                  <motion.button
                    key={budget.value}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => updateFormData('budget', budget.value)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      formData.budget === budget.value
                        ? 'border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 shadow-md'
                        : 'border-gray-200 bg-white hover:border-green-300 hover:shadow-sm'
                    }`}
                  >
                    <p className={`text-base font-bold mb-1 ${
                      formData.budget === budget.value ? 'text-green-900' : 'text-gray-700'
                    }`}>{budget.label}</p>
                    <p className={`text-xs ${
                      formData.budget === budget.value ? 'text-green-700' : 'text-gray-500'
                    }`}>{budget.description}</p>
                    {formData.budget === budget.value && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="mt-2"
                      >
                        <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>
              {errors.budget && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 text-sm text-red-600 flex items-center gap-1"
                >
                  <AlertCircle className="w-4 h-4" />
                  {errors.budget}
                </motion.p>
              )}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Calendar className="inline w-4 h-4 mr-1" />
                Preferred Start Date
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => updateFormData('startDate', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all text-gray-900"
                min={new Date().toISOString().split('T')[0]}
              />
            </motion.div>
          </motion.div>
        )

      case 6:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-6 sm:mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 bg-gradient-to-br from-pink-100 to-rose-100 rounded-full flex items-center justify-center"
              >
                <Gift className="w-8 h-8 sm:w-10 sm:h-10 text-pink-600" />
              </motion.div>
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Almost Done!</h3>
              <p className="text-sm sm:text-base text-gray-600">Any additional information to share?</p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Target className="inline w-4 h-4 mr-1" />
                Competitor/Reference Websites
              </label>
              <textarea
                value={formData.competitors}
                onChange={(e) => updateFormData('competitors', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all text-gray-900 placeholder-gray-400"
                placeholder="List any websites you admire or compete with..."
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <MessageSquare className="inline w-4 h-4 mr-1" />
                Additional Notes
              </label>
              <textarea
                value={formData.additionalNotes}
                onChange={(e) => updateFormData('additionalNotes', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all text-gray-900 placeholder-gray-400"
                placeholder="Anything else you'd like us to know?"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Heart className="inline w-4 h-4 mr-1" />
                How did you hear about us?
              </label>
              <select
                value={formData.howDidYouHear}
                onChange={(e) => updateFormData('howDidYouHear', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all text-gray-900"
              >
                <option value="">Please select</option>
                <option value="google">Google Search</option>
                <option value="social">Social Media</option>
                <option value="referral">Referral from Friend</option>
                <option value="advertisement">Advertisement</option>
                <option value="other">Other</option>
              </select>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-blue-200"
            >
              <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                What Happens Next?
              </h4>
              <div className="space-y-3">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                    <span className="text-blue-600 font-bold text-xs sm:text-sm">1</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Quick Review</p>
                    <p className="text-xs text-gray-600">We'll review your requirements within 24 hours</p>
                  </div>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                    <span className="text-blue-600 font-bold text-xs sm:text-sm">2</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Custom Proposal</p>
                    <p className="text-xs text-gray-600">Receive a detailed proposal and quote</p>
                  </div>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                    <span className="text-blue-600 font-bold text-xs sm:text-sm">3</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Free Consultation</p>
                    <p className="text-xs text-gray-600">Schedule a call to discuss your project</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )

      default:
        return null
    }
  }

  if (isSuccess) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-2 sm:p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl sm:rounded-3xl max-w-md w-full p-6 sm:p-8 text-center shadow-2xl"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
            </motion.div>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3"
          >
            Quote Request Submitted!
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8"
          >
            Thank you for your interest! We've received your project details and will get back to you within 24 hours.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex gap-4"
          >
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all hover:scale-105"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl sm:rounded-3xl max-w-3xl w-full max-h-[90vh] my-auto shadow-2xl flex flex-col"
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-600 to-cyan-600 p-4 sm:p-6 rounded-t-2xl sm:rounded-t-3xl">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 backdrop-blur rounded-lg flex items-center justify-center flex-shrink-0"
              >
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </motion.div>
              <div>
                <h2 className="text-base sm:text-xl lg:text-2xl font-bold text-white">Get Your Custom Quote</h2>
                <p className="text-blue-100 text-xs">Takes only 2-3 minutes</p>
              </div>
            </div>
            {onClose && (
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-1.5 sm:p-2 bg-white/20 backdrop-blur hover:bg-white/30 rounded-lg sm:rounded-xl transition-all"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </motion.button>
            )}
          </div>
          
          {/* Enhanced Progress Bar */}
          <div className="relative">
            <div className="flex justify-between mb-2 sm:mb-3">
              {[...Array(totalSteps)].map((_, index) => {
                const StepIcon = stepIcons[index]
                const isActive = index + 1 === currentStep
                const isCompleted = index + 1 < currentStep
                return (
                  <motion.div
                    key={index}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="relative flex flex-col items-center flex-1"
                  >
                    <motion.div
                      animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                      className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all ${
                        isCompleted 
                          ? 'bg-white text-blue-600' 
                          : isActive
                          ? 'bg-white/30 backdrop-blur text-white ring-2 sm:ring-4 ring-white/50'
                          : 'bg-white/10 text-white/50'
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                      ) : (
                        <StepIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                      )}
                    </motion.div>
                    <span className={`text-[10px] sm:text-xs mt-1 hidden sm:block ${
                      isActive ? 'text-white font-semibold' : 'text-white/70'
                    }`}>
                      {index + 1}
                    </span>
                  </motion.div>
                )
              })}
            </div>
            <div className="h-1.5 sm:h-2 bg-white/20 rounded-full overflow-hidden backdrop-blur">
              <motion.div
                className="h-full bg-gradient-to-r from-white to-blue-200 rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <AnimatePresence mode="wait">
            {getStepContent()}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-6 bg-gray-50 rounded-b-2xl sm:rounded-b-3xl border-t border-gray-200">
          <div className="flex justify-between items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className={`flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-semibold transition-all ${
                currentStep === 1
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 shadow-sm'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Previous</span>
              <span className="sm:hidden">Back</span>
            </motion.button>

            <div className="hidden sm:flex items-center justify-center gap-2">
              <span className="text-xs sm:text-sm text-gray-500">Step {currentStep} of {totalSteps}</span>
            </div>

            {currentStep < totalSteps ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNext}
                className="flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg sm:rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                <span>Next</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg sm:rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="hidden sm:inline">Submitting...</span>
                    <span className="sm:hidden">Submit...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span className="hidden sm:inline">Submit Quote Request</span>
                    <span className="sm:hidden">Submit</span>
                  </>
                )}
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}