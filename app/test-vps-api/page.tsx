'use client'

import { useState, useEffect } from 'react'
import { useCountry } from '@/contexts/CountryContext'

export default function TestVPSAPI() {
  const [apiData, setApiData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const { currency, country } = useCountry()

  const fetchData = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/products/vps-hosting?currency=${currency}&market=en-US`)
      const data = await response.json()
      setApiData(data)
    } catch (error) {
      console.error('Error:', error)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [currency, country])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">VPS API Test</h1>
      <div className="mb-4">
        <p>Currency: <strong>{currency}</strong></p>
        <p>Country: <strong>{country.code}</strong></p>
      </div>
      
      <button 
        onClick={fetchData}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Refresh Data
      </button>

      {loading && <p>Loading...</p>}
      
      {apiData && (
        <div>
          <h2 className="text-xl font-bold mb-2">API Response:</h2>
          <div className="bg-gray-100 p-4 rounded">
            <p>Success: {apiData.success ? 'Yes' : 'No'}</p>
            <p>Currency: {apiData.currency}</p>
            <p>Market: {apiData.market}</p>
            
            {apiData.plans?.standard && (
              <div className="mt-4">
                <h3 className="font-bold">First Standard Plan:</h3>
                <p>Product ID: {apiData.plans.standard[0]?.productId}</p>
                <p>Monthly Price: {apiData.plans.standard[0]?.monthlyPrice}</p>
                <p>Currency in features: {apiData.plans.standard[0]?.features?.autoRenews}</p>
              </div>
            )}
          </div>
          
          <div className="mt-4">
            <h3 className="font-bold">Raw JSON:</h3>
            <pre className="bg-gray-100 p-4 rounded overflow-auto text-xs">
              {JSON.stringify(apiData, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  )
}