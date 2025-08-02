'use client'

import { useCountry } from '@/contexts/CountryContext'
import { useCPanelPlans } from '@/hooks/useCPanelPlans'
import CountrySelector from '@/components/ui/CountrySelector'

export default function TestCurrency() {
  const { country, currency } = useCountry()
  const { plans, loading, error } = useCPanelPlans()

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Currency Test Page</h1>
      
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-2">Current Settings:</h2>
        <p>Country: {country.name} ({country.code})</p>
        <p>Currency: {currency}</p>
        <div className="mt-4">
          <CountrySelector />
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-2">API Response:</h2>
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-600">Error: {error.message}</p>}
        {!loading && !error && (
          <div className="space-y-4">
            {plans.map((plan) => (
              <div key={plan.id} className="border p-4 rounded">
                <h3 className="font-semibold">{plan.name}</h3>
                <p>Monthly: {plan.price.monthly} {plan.price.currency}</p>
                <p>Yearly: {plan.price.yearly} {plan.price.currency}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}