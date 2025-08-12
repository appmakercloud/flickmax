'use client'

import { motion } from 'framer-motion'

export default function PricingSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Title skeleton */}
      <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-48 mb-2" />
      
      {/* Description skeleton */}
      <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-64 mb-6" />
      
      {/* Price skeleton */}
      <div className="flex items-baseline gap-2 mb-4">
        <div className="h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-24" />
        <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-16" />
      </div>
      
      {/* Features list skeleton */}
      <div className="space-y-3 mb-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-5 h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full" />
            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-full" />
          </div>
        ))}
      </div>
      
      {/* Button skeleton */}
      <div className="h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-full" />
    </div>
  )
}

export function PricingTableSkeleton({ columns = 3 }: { columns?: number }) {
  return (
    <div className={`grid gap-6 ${
      columns === 2 ? 'md:grid-cols-2' : 
      columns === 3 ? 'md:grid-cols-3' : 
      columns === 4 ? 'md:grid-cols-2 lg:grid-cols-4' : 
      'md:grid-cols-3'
    }`}>
      {Array.from({ length: columns }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
        >
          <PricingSkeleton />
        </motion.div>
      ))}
    </div>
  )
}

export function CompactPricingSkeleton() {
  return (
    <div className="animate-pulse flex items-center justify-between p-4 bg-white rounded-lg border border-gray-100">
      <div>
        <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-32 mb-2" />
        <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-48" />
      </div>
      <div className="text-right">
        <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-20 mb-1" />
        <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-16" />
      </div>
    </div>
  )
}

// Inline price skeleton for when price is loading in text
export function InlinePriceSkeleton() {
  return (
    <span className="inline-block animate-pulse">
      <span className="inline-block h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-16" />
    </span>
  )
}