import type { NextPage } from 'next'
import Head from 'next/head'
import Navigation from '@/components/Navigation'
import USPSCapabilities from '@/components/usps/USPSCapabilities'

const USPSProgressPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>USPS API Integration Progress - ShipNode</title>
        <meta 
          name="description" 
          content="Track our progress building USPS shipping capabilities: address validation, rate calculation, package tracking, and label generation." 
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://shipnode.io/usps-progress" />
        
        {/* Open Graph */}
        <meta property="og:title" content="USPS API Integration Progress - ShipNode" />
        <meta property="og:description" content="Building comprehensive USPS shipping capabilities for businesses. Watch our real-time development progress." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://shipnode.io/usps-progress" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="USPS API Integration Progress - ShipNode" />
        <meta name="twitter:description" content="Building comprehensive USPS shipping capabilities for businesses. Watch our real-time development progress." />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <Navigation />
        
        <main className="pt-16">
          {/* Hero Section */}
          <div className="bg-gradient-to-br from-blue-600 to-purple-700 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
              <div className="text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  USPS API Integration
                </h1>
                <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
                  Building comprehensive USPS shipping capabilities for address validation, 
                  rate calculation, package tracking, and automated label generation.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a 
                    href="/calculator" 
                    className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                  >
                    Try Our Calculator
                  </a>
                  <a 
                    href="#progress" 
                    className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
                  >
                    View Progress
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Build in Public Section */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                🔧 Building in Public
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Follow our journey implementing USPS APIs step by step. We're starting with address validation 
                and building toward a complete shipping platform with rate comparison, tracking, and label generation.
              </p>
            </div>

            {/* What We're Building */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="text-2xl mb-4">📮</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Address Services</h3>
                <p className="text-gray-600 text-sm">
                  Real-time address validation and standardization using USPS official data.
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="text-2xl mb-4">💰</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Rate Calculation</h3>
                <p className="text-gray-600 text-sm">
                  Accurate shipping cost calculations for all USPS service levels and destinations.
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="text-2xl mb-4">📦</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Tracking & Labels</h3>
                <p className="text-gray-600 text-sm">
                  Package tracking integration and automated shipping label generation.
                </p>
              </div>
            </div>
          </div>

          {/* Progress Section */}
          <section id="progress" className="py-12">
            <USPSCapabilities />
          </section>

          {/* Implementation Strategy */}
          <div className="bg-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  📋 Implementation Strategy
                </h2>
                <p className="text-lg text-gray-600">
                  Following a crawl-walk-run approach for reliable, incremental progress
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🐛</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Crawl Phase</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    OAuth authentication + Address validation API integration
                  </p>
                  <div className="bg-green-50 p-3 rounded text-sm text-green-700">
                    <strong>Goal:</strong> Working address validator
                  </div>
                </div>

                <div className="text-center">
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🚶</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Walk Phase</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Rate calculation, tracking APIs, and enhanced user interface
                  </p>
                  <div className="bg-blue-50 p-3 rounded text-sm text-blue-700">
                    <strong>Goal:</strong> Complete rate comparison
                  </div>
                </div>

                <div className="text-center">
                  <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🏃</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Run Phase</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Label generation, batch processing, analytics dashboard
                  </p>
                  <div className="bg-purple-50 p-3 rounded text-sm text-purple-700">
                    <strong>Goal:</strong> Full shipping platform
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-gray-50 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                🎯 What's Next?
              </h2>
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Current Sprint: USPS Address Validation</h3>
                <ul className="text-sm text-gray-600 space-y-2 max-w-2xl mx-auto">
                  <li>✅ PRD completed and saved to docs/</li>
                  <li>✅ Progress tracking page created</li>
                  <li>🔄 OAuth 2.0 authentication implementation</li>
                  <li>⏳ Address validation API integration</li>
                  <li>⏳ Multi-carrier address validation UI</li>
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}

export default USPSProgressPage