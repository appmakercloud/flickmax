'use client'

import { useCPanelPlans } from '@/hooks/useCPanelPlans'
import { useProductsByTag } from '@/hooks/useCatalog'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import ErrorMessage from '@/components/ui/ErrorMessage'

export default function TestCPanelPage() {
  const { plans, loading: plansLoading, error: plansError, refetch: refetchPlans } = useCPanelPlans()
  const { products, loading: productsLoading, error: productsError, refetch: refetchProducts } = useProductsByTag('cpanel')

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">cPanel API Test Page</h1>
        
        {/* Raw Products Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Raw cPanel Products</h2>
          
          {productsLoading && (
            <div className="bg-white rounded-lg p-8 shadow">
              <LoadingSpinner />
              <p className="text-center mt-4 text-gray-600">Loading cPanel products...</p>
            </div>
          )}
          
          {productsError && (
            <div className="bg-white rounded-lg p-8 shadow">
              <ErrorMessage error={productsError} retry={refetchProducts} />
            </div>
          )}
          
          {!productsLoading && !productsError && (
            <div className="bg-white rounded-lg p-8 shadow">
              <p className="text-gray-600 mb-4">Found {products.length} cPanel products</p>
              <div className="space-y-6">
                {products.map(product => (
                  <div key={product.id} className="border-l-4 border-blue-500 pl-4">
                    <h3 className="font-semibold text-gray-900">{product.name}</h3>
                    <p className="text-gray-600 text-sm">{product.shortDescription || product.description}</p>
                    <div className="mt-2">
                      <p className="text-gray-500 text-sm">
                        ID: {product.id} | Category: {product.category} | Tags: {product.tags.join(', ')}
                      </p>
                      {product.pricing.monthly && (
                        <p className="text-gray-700 font-medium">
                          Monthly: ${product.pricing.monthly.price.current} | 
                          Yearly: ${product.pricing.yearly?.price.current || 'N/A'}
                        </p>
                      )}
                    </div>
                    <details className="mt-2">
                      <summary className="cursor-pointer text-blue-600 hover:text-blue-700 text-sm">View Features</summary>
                      <ul className="mt-2 space-y-1">
                        {product.features.map((feature, idx) => (
                          <li key={idx} className="text-sm text-gray-600">
                            • {feature.name}: {String(feature.value)} {feature.description && `(${feature.description})`}
                          </li>
                        ))}
                      </ul>
                    </details>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
        
        {/* Transformed Plans Section */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Transformed cPanel Hosting Plans</h2>
          
          {plansLoading && (
            <div className="bg-white rounded-lg p-8 shadow">
              <LoadingSpinner />
              <p className="text-center mt-4 text-gray-600">Loading cPanel plans...</p>
            </div>
          )}
          
          {plansError && (
            <div className="bg-white rounded-lg p-8 shadow">
              <ErrorMessage error={plansError} retry={refetchPlans} />
            </div>
          )}
          
          {!plansLoading && !plansError && (
            <div className="bg-white rounded-lg p-8 shadow">
              <p className="text-gray-600 mb-4">Found {plans.length} cPanel hosting plans</p>
              <div className="grid md:grid-cols-3 gap-6">
                {plans.map(plan => (
                  <div key={plan.id} className="border rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900">{plan.name}</h3>
                    <p className="text-gray-600 text-sm mb-2">{plan.description}</p>
                    <div className="text-lg font-bold text-blue-600">
                      ${plan.price.monthly}/mo
                    </div>
                    <div className="text-sm text-gray-500">
                      ${plan.price.yearly}/mo (yearly)
                    </div>
                    <div className="mt-4 space-y-1">
                      <p className="text-sm font-medium text-gray-700">Resources:</p>
                      {plan.limits.websites && (
                        <p className="text-sm text-gray-600">• Websites: {plan.limits.websites}</p>
                      )}
                      {plan.limits.storage && (
                        <p className="text-sm text-gray-600">• Storage: {plan.limits.storage}</p>
                      )}
                      {plan.limits.databases && (
                        <p className="text-sm text-gray-600">• Databases: {plan.limits.databases}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}