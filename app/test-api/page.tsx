'use client'

import { useProducts, useTags } from '@/hooks/useCatalog'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import ErrorMessage from '@/components/ui/ErrorMessage'

export default function TestAPIPage() {
  const { products, loading: productsLoading, error: productsError, refetch: refetchProducts } = useProducts()
  const { tags, loading: tagsLoading, error: tagsError, refetch: refetchTags } = useTags()

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">API Test Page</h1>
        
        {/* Products Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Products</h2>
          
          {productsLoading && (
            <div className="bg-white rounded-lg p-8 shadow">
              <LoadingSpinner />
              <p className="text-center mt-4 text-gray-600">Loading products...</p>
            </div>
          )}
          
          {productsError && (
            <div className="bg-white rounded-lg p-8 shadow">
              <ErrorMessage error={productsError} retry={refetchProducts} />
            </div>
          )}
          
          {!productsLoading && !productsError && (
            <div className="bg-white rounded-lg p-8 shadow">
              <p className="text-gray-600 mb-4">Found {products.length} products</p>
              <div className="space-y-4">
                {products.slice(0, 5).map(product => (
                  <div key={product.id} className="border-l-4 border-blue-500 pl-4">
                    <h3 className="font-semibold text-gray-900">{product.name}</h3>
                    <p className="text-gray-600 text-sm">{product.shortDescription || product.description}</p>
                    <p className="text-gray-500 text-sm mt-1">
                      ID: {product.id} | Category: {product.category}
                      {product.pricing.monthly && (
                        <span> | Price: ${product.pricing.monthly.price.current}/mo</span>
                      )}
                    </p>
                  </div>
                ))}
                {products.length > 5 && (
                  <p className="text-gray-500 text-sm">...and {products.length - 5} more products</p>
                )}
              </div>
            </div>
          )}
        </section>
        
        {/* Tags Section */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Tags</h2>
          
          {tagsLoading && (
            <div className="bg-white rounded-lg p-8 shadow">
              <LoadingSpinner />
              <p className="text-center mt-4 text-gray-600">Loading tags...</p>
            </div>
          )}
          
          {tagsError && (
            <div className="bg-white rounded-lg p-8 shadow">
              <ErrorMessage error={tagsError} retry={refetchTags} />
            </div>
          )}
          
          {!tagsLoading && !tagsError && (
            <div className="bg-white rounded-lg p-8 shadow">
              <p className="text-gray-600 mb-4">Found {tags.length} tags</p>
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <span
                    key={tag.id}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                  >
                    {tag.name}
                    <span className="ml-2 text-xs text-blue-600">({tag.count})</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}