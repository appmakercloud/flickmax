'use client'

import { motion } from 'framer-motion'
import { 
  Zap, Shield, Server, Globe, HeadphonesIcon, 
  RefreshCw, Database, Lock, Gauge, CloudUpload,
  Users, BarChart
} from 'lucide-react'

const features = [
  {
    icon: Zap,
    title: 'Lightning Fast Performance',
    description: 'SSD storage and optimized servers ensure your website loads in milliseconds.',
    color: 'bg-yellow-100 text-yellow-600'
  },
  {
    icon: Shield,
    title: 'Advanced Security',
    description: 'Free SSL, DDoS protection, and automatic malware scanning keep your site safe.',
    color: 'bg-green-100 text-green-600'
  },
  {
    icon: Server,
    title: '99.9% Uptime Guarantee',
    description: 'Enterprise-grade infrastructure ensures your website is always online.',
    color: 'bg-blue-100 text-blue-600'
  },
  {
    icon: Globe,
    title: 'Global CDN',
    description: 'Content delivery network ensures fast loading times worldwide.',
    color: 'bg-purple-100 text-purple-600'
  },
  {
    icon: HeadphonesIcon,
    title: '24/7 Expert Support',
    description: 'Get help from our hosting experts anytime via phone, chat, or email.',
    color: 'bg-red-100 text-red-600'
  },
  {
    icon: RefreshCw,
    title: 'Automatic Backups',
    description: 'Daily backups ensure you never lose your data with easy restore options.',
    color: 'bg-indigo-100 text-indigo-600'
  }
]

const stats = [
  { value: '99.9%', label: 'Uptime Guarantee' },
  { value: '24/7', label: 'Expert Support' },
  { value: '<0.5s', label: 'Load Time' },
  { value: '30-day', label: 'Money Back' }
]

export default function HostingFeatures() {
  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Why Choose Flickmax Hosting?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Industry-leading features and performance at an unbeatable price. 
            Everything you need to build and grow your online presence.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative bg-white p-6 rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300"
            >
              <div className={`inline-flex p-3 rounded-lg ${feature.color} mb-4`}>
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-blue-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Additional Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-12">
            Everything You Need in One Package
          </h3>
          
          <div className="grid md:grid-cols-2 gap-12">
            {/* Left Column */}
            <div className="space-y-6">
              <div className="flex items-start">
                <Database className="w-8 h-8 text-blue-600 mr-4 flex-shrink-0" />
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    Unlimited Databases
                  </h4>
                  <p className="text-gray-600">
                    Create unlimited MySQL databases with phpMyAdmin access for easy management.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Lock className="w-8 h-8 text-blue-600 mr-4 flex-shrink-0" />
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    Free SSL Certificates
                  </h4>
                  <p className="text-gray-600">
                    Keep your site secure with free Let&apos;s Encrypt SSL certificates for all domains.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Gauge className="w-8 h-8 text-blue-600 mr-4 flex-shrink-0" />
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    Resource Monitoring
                  </h4>
                  <p className="text-gray-600">
                    Track CPU, RAM, and bandwidth usage with detailed analytics and alerts.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div className="flex items-start">
                <CloudUpload className="w-8 h-8 text-blue-600 mr-4 flex-shrink-0" />
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    One-Click Installs
                  </h4>
                  <p className="text-gray-600">
                    Install WordPress, Joomla, and 100+ apps with just one click.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Users className="w-8 h-8 text-blue-600 mr-4 flex-shrink-0" />
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    Multi-User Access
                  </h4>
                  <p className="text-gray-600">
                    Grant access to developers and team members with customizable permissions.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <BarChart className="w-8 h-8 text-blue-600 mr-4 flex-shrink-0" />
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    Website Analytics
                  </h4>
                  <p className="text-gray-600">
                    Built-in analytics to track visitors, page views, and site performance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}