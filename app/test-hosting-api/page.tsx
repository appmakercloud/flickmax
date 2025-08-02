'use client'

import { useProductsByTag } from '@/hooks/useCatalog'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

export default function TestHostingAPIPage() {
  const { products: cpanelProducts, loading: cpanelLoading } = useProductsByTag('cpanel')
  const { products: businessProducts, loading: businessLoading } = useProductsByTag('business')

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-bold mb-8">Hosting API Test</h1>
      
      <div className="space-y-8">
        {/* cPanel Products */}
        <div>
          <h2 className="text-xl font-semibold mb-4">cPanel Products (Standard Performance)</h2>
          {cpanelLoading ? (
            <LoadingSpinner />
          ) : (
            <div className="bg-white p-4 rounded-lg">
              <p className="mb-2">Found {cpanelProducts.length} products</p>
              {cpanelProducts.map(product => (
                <div key={product.id} className="border-b py-2">
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-gray-600">
                    Monthly: ${product.pricing.monthly?.price.current || 0} | 
                    Yearly: ${product.pricing.yearly?.price.current || 0}
                  </p>
                  <details className="mt-1">
                    <summary className="text-sm text-blue-600 cursor-pointer">View raw pricing data</summary>
                    <pre className="text-xs mt-2 bg-gray-100 p-2 rounded overflow-auto">
                      {JSON.stringify(product.pricing, null, 2)}
                    </pre>
                  </details>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Business Products */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Business Products (High Performance)</h2>
          {businessLoading ? (
            <LoadingSpinner />
          ) : (
            <div className="bg-white p-4 rounded-lg">
              <p className="mb-2">Found {businessProducts.length} products</p>
              {businessProducts.map(product => (
                <div key={product.id} className="border-b py-2">
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-gray-600">
                    Monthly: ${product.pricing.monthly?.price.current || 0} | 
                    Yearly: ${product.pricing.yearly?.price.current || 0}
                  </p>
                  <details className="mt-1">
                    <summary className="text-sm text-blue-600 cursor-pointer">View raw pricing data</summary>
                    <pre className="text-xs mt-2 bg-gray-100 p-2 rounded overflow-auto">
                      {JSON.stringify(product.pricing, null, 2)}
                    </pre>
                  </details>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}