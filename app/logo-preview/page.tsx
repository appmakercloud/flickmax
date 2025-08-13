import Image from 'next/image'

export default function LogoPreview() {
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Flickmax Logo Variations</h1>
      
      {/* Current Logos */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Current Logos (Diamond Pattern)</h2>
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-sm text-gray-600 mb-2">Light Version</p>
            <Image src="/flickmax-logo-light.svg?v=3" alt="Current Light Logo" width={310} height={80} />
          </div>
          <div className="bg-gray-900 p-6 rounded-lg shadow">
            <p className="text-sm text-gray-400 mb-2">Dark Version</p>
            <Image src="/flickmax-logo-dark.svg?v=3" alt="Current Dark Logo" width={310} height={80} />
          </div>
        </div>
      </section>

      {/* New Logos with Geometric F */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">New Logo Option 1 (Basic Geometric F)</h2>
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-sm text-gray-600 mb-2">Light Version</p>
            <Image src="/flickmax-logo-v2-light.svg" alt="New Light Logo V2" width={360} height={80} />
          </div>
          <div className="bg-gray-900 p-6 rounded-lg shadow">
            <p className="text-sm text-gray-400 mb-2">Dark Version</p>
            <Image src="/flickmax-logo-v2-dark.svg" alt="New Dark Logo V2" width={360} height={80} />
          </div>
        </div>
      </section>

      {/* Modern Variation */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">New Logo Option 2 (Modern Style)</h2>
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-sm text-gray-600 mb-2">Light Version - Two-tone Text</p>
            <Image src="/flickmax-logo-modern-light.svg" alt="Modern Light Logo" width={320} height={70} />
          </div>
          <div className="bg-gray-900 p-6 rounded-lg shadow">
            <p className="text-sm text-gray-400 mb-2">Dark Version - Two-tone Text</p>
            <Image src="/flickmax-logo-modern-dark.svg" alt="Modern Dark Logo" width={320} height={70} />
          </div>
        </div>
      </section>

      {/* Side by Side Comparison */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Icon Comparison</h2>
        <div className="grid grid-cols-2 gap-8">
          <div className="bg-gray-100 p-6 rounded-lg">
            <h3 className="font-medium mb-3">Current Diamond Icon</h3>
            <div className="bg-white p-4 rounded">
              <svg viewBox="0 0 60 60" className="w-20 h-20">
                <defs>
                  <linearGradient id="comp1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{stopColor:'#0066ff', stopOpacity:1}} />
                    <stop offset="100%" style={{stopColor:'#00ccff', stopOpacity:1}} />
                  </linearGradient>
                </defs>
                <g transform="translate(5, 5)">
                  <rect x="0" y="0" width="12" height="12" fill="url(#comp1)" transform="rotate(45 6 6)" opacity="0.5"/>
                  <rect x="17" y="0" width="12" height="12" fill="url(#comp1)" transform="rotate(45 23 6)" opacity="1"/>
                  <rect x="34" y="0" width="12" height="12" fill="url(#comp1)" transform="rotate(45 40 6)" opacity="0.5"/>
                  <rect x="0" y="17" width="12" height="12" fill="url(#comp1)" transform="rotate(45 6 23)" opacity="1"/>
                  <rect x="17" y="17" width="12" height="12" fill="url(#comp1)" transform="rotate(45 23 23)" opacity="1"/>
                  <rect x="34" y="17" width="12" height="12" fill="url(#comp1)" transform="rotate(45 40 23)" opacity="1"/>
                  <rect x="0" y="34" width="12" height="12" fill="url(#comp1)" transform="rotate(45 6 40)" opacity="0.5"/>
                  <rect x="17" y="34" width="12" height="12" fill="url(#comp1)" transform="rotate(45 23 40)" opacity="1"/>
                  <rect x="34" y="34" width="12" height="12" fill="url(#comp1)" transform="rotate(45 40 40)" opacity="0.5"/>
                </g>
              </svg>
            </div>
          </div>
          <div className="bg-gray-100 p-6 rounded-lg">
            <h3 className="font-medium mb-3">New Geometric F Icon</h3>
            <div className="bg-white p-4 rounded">
              <svg viewBox="0 0 60 60" className="w-20 h-20">
                <g transform="translate(5, 5) scale(0.025, 0.025)">
                  <polygon style={{fill:'#0856D6'}} points="994.774,1404 734.396,1126.173 994.774,1126.173"/>
                  <polygon style={{fill:'#1A8FFF'}} points="718.439,1126.173 1299.695,1126.173 1023.36,815.272 718.439,805.349"/>
                  <polygon style={{fill:'#5AC3FF'}} points="718.439,514.293 1023.36,815.272 1299.695,805.349 1299.695,514.293"/>
                </g>
              </svg>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}