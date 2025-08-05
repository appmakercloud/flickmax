'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { Country, countries, defaultCountry, getCountryByCode } from '@/lib/countries'
import { detectUserCountry } from '@/lib/api/geolocation'

interface CountryContextType {
  country: Country
  setCountry: (country: Country) => void
  currency: string
  locale: string
  phoneNumber: string
  isDetecting: boolean
}

const CountryContext = createContext<CountryContextType | undefined>(undefined)

export function CountryProvider({ children }: { children: React.ReactNode }) {
  const [country, setCountryState] = useState<Country>(defaultCountry)
  const [isDetecting, setIsDetecting] = useState(true)

  // Load saved country preference or detect user's country
  useEffect(() => {
    const initializeCountry = async () => {
      try {
        // First check if user has a saved preference
        const savedCountryCode = localStorage.getItem('selectedCountry')
        if (savedCountryCode) {
          const savedCountry = getCountryByCode(savedCountryCode)
          if (savedCountry) {
            setCountryState(savedCountry)
            setIsDetecting(false)
            return
          }
        }

        // If no saved preference, detect user's country
        console.log('Detecting user country...')
        const detectedCountryCode = await detectUserCountry()
        const detectedCountry = getCountryByCode(detectedCountryCode)
        
        if (detectedCountry) {
          console.log('Detected country:', detectedCountry.name)
          setCountryState(detectedCountry)
          // Save the detected country as preference
          localStorage.setItem('selectedCountry', detectedCountry.code)
        } else {
          console.log('Country not supported, using default:', defaultCountry.name)
          setCountryState(defaultCountry)
        }
      } catch (error) {
        console.error('Failed to detect country:', error)
        setCountryState(defaultCountry)
      } finally {
        setIsDetecting(false)
      }
    }

    initializeCountry()
  }, [])

  const setCountry = (newCountry: Country) => {
    setCountryState(newCountry)
    localStorage.setItem('selectedCountry', newCountry.code)
  }

  const value: CountryContextType = {
    country,
    setCountry,
    currency: country.currency,
    locale: country.locale,
    phoneNumber: country.phoneNumber,
    isDetecting,
  }

  return (
    <CountryContext.Provider value={value}>
      {children}
    </CountryContext.Provider>
  )
}

export function useCountry() {
  const context = useContext(CountryContext)
  if (context === undefined) {
    throw new Error('useCountry must be used within a CountryProvider')
  }
  return context
}