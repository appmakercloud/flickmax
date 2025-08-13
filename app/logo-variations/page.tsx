'use client'

import Image from 'next/image'
import { useState } from 'react'

export default function LogoVariations() {
  const [selectedLogo, setSelectedLogo] = useState('')
  
  const logoVariants = [
    {
      name: 'Variant 1 - Futuristic',
      file: '/flickmax-logo-variant1.svg',
      description: 'Tight spacing, Futura font, gradient text',
      specs: 'Font: Futura | Size: 34px | Weight: 800 | Spacing: -0.5'
    },
    {
      name: 'Variant 2 - Modern Split',
      file: '/flickmax-logo-variant2.svg',
      description: 'Larger icon, split color text, SF Pro',
      specs: 'Font: SF Pro | Size: 45px | Weight: 600 | Two-tone'
    },
    {
      name: 'Variant 3 - Bold Condensed',
      file: '/flickmax-logo-variant3.svg',
      description: 'Vertical gradient, condensed bold font',
      specs: 'Font: Helvetica Neue | Size: 38px | Weight: 900 | Condensed'
    },
    {
      name: 'Variant 4 - Tech Spaced',
      file: '/flickmax-logo-variant4.svg',
      description: 'Wide letter spacing, tech aesthetic',
      specs: 'Font: Roboto | Size: 32px | Weight: 500 | Spacing: 4'
    },
    {
      name: 'Variant 5 - Premium',
      file: '/flickmax-logo-variant5.svg',
      description: 'Weight contrast, shadow effect, premium feel',
      specs: 'Font: Montserrat | Size: 40px | Weight: 800/300 | Shadow'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Flickmax Logo Variations
          </h1>
          <p className="text-gray-600">5 different versions with various fonts, sizes, and blue-cyan gradients</p>
        </div>

        {/* Logo Grid */}
        <div className="grid gap-8 mb-12">
          {logoVariants.map((variant, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{variant.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{variant.description}</p>
                    <p className="text-xs text-gray-500 mt-2 font-mono">{variant.specs}</p>
                  </div>
                  <button
                    onClick={() => setSelectedLogo(variant.file)}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:shadow-md transition-shadow text-sm font-medium"
                  >
                    Select This
                  </button>
                </div>
                
                {/* Logo Display */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Light Background */}
                  <div className="bg-gray-50 p-8 rounded-lg flex items-center justify-center">
                    <Image 
                      src={variant.file} 
                      alt={variant.name}
                      width={340}
                      height={80}
                      className="max-w-full h-auto"
                    />
                  </div>
                  
                  {/* Dark Background */}
                  <div className="bg-gray-900 p-8 rounded-lg flex items-center justify-center">
                    <Image 
                      src={variant.file} 
                      alt={variant.name}
                      width={340}
                      height={80}
                      className="max-w-full h-auto"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Logo Display */}
        {selectedLogo && (
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl p-1">
            <div className="bg-white rounded-lg p-8">
              <h2 className="text-2xl font-bold mb-6 text-center">Selected Logo</h2>
              <div className="bg-gray-50 p-12 rounded-lg flex items-center justify-center">
                <Image 
                  src={selectedLogo} 
                  alt="Selected Logo"
                  width={400}
                  height={100}
                  className="max-w-full h-auto"
                />
              </div>
              <p className="text-center mt-4 text-gray-600">
                This logo would be used across your website header, footer, and branding materials
              </p>
            </div>
          </div>
        )}

        {/* Comparison Section */}
        <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6">Key Differences</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-3">
                1
              </div>
              <h3 className="font-semibold mb-2">Font Families</h3>
              <p className="text-sm text-gray-600">From futuristic Futura to premium Montserrat, each variant uses different typefaces for unique personality</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-3">
                2
              </div>
              <h3 className="font-semibold mb-2">Gradient Styles</h3>
              <p className="text-sm text-gray-600">Horizontal, vertical, and multi-stop gradients create different visual impacts</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-3">
                3
              </div>
              <h3 className="font-semibold mb-2">Icon Treatments</h3>
              <p className="text-sm text-gray-600">Different sizes and color variations of the geometric F icon for various emphasis levels</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}