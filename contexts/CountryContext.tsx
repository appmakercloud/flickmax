'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { Country, countries, defaultCountry, getCountryByCode } from '@/lib/countries'

interface CountryContextType {
  country: Country
  setCountry: (country: Country) => void
  currency: string
  locale: string
  phoneNumber: string
}

const CountryContext = createContext<CountryContextType | undefined>(undefined)

export function CountryProvider({ children }: { children: React.ReactNode }) {
  const [country, setCountryState] = useState<Country>(defaultCountry)

  // Load saved country preference on mount
  useEffect(() => {
    const savedCountryCode = localStorage.getItem('selectedCountry')
    if (savedCountryCode) {
      const savedCountry = getCountryByCode(savedCountryCode)
      if (savedCountry) {
        setCountryState(savedCountry)
      }
    } else {
      // Always use US as default for new visitors
      console.log('No saved country preference, using default:', defaultCountry.name)
      setCountryState(defaultCountry)
    }
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