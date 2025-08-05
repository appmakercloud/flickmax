'use client'

import { useCountry } from '@/contexts/CountryContext'

export function GeoDebug() {
  const { country, isDetecting } = useCountry()
  
  if (process.env.NODE_ENV !== 'development') {
    return null
  }
  
  return (
    <div className="fixed bottom-4 left-4 bg-black/80 text-white p-3 rounded-lg text-xs font-mono z-50">
      <div className="mb-1">Geo Detection Debug</div>
      <div>Status: {isDetecting ? '🔄 Detecting...' : '✅ Complete'}</div>
      <div>Country: {country.flag} {country.name}</div>
      <div>Currency: {country.currency}</div>
      <div>Phone: {country.phoneNumber}</div>
    </div>
  )
}