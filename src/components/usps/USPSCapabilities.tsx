import React from 'react'

interface Capability {
  category: string
  features: {
    name: string
    status: 'live' | 'testing' | 'planned' | 'coming'
    description: string
    complexity: 'simple' | 'medium' | 'complex'
    dependencies?: string[]
  }[]
}

const capabilities: Capability[] = [
  {
    category: "Authentication & Setup",
    features: [
      {
        name: "OAuth 2.0 Token Management",
        status: "planned",
        description: "Secure API authentication with automatic token refresh",
        complexity: "simple"
      },
      {
        name: "Environment Configuration", 
        status: "planned",
        description: "Production and testing environment setup",
        complexity: "simple"
      }
    ]
  },
  {
    category: "Address Services",
    features: [
      {
        name: "Address Validation",
        status: "planned", 
        description: "Real-time address validation and standardization",
        complexity: "simple"
      },
      {
        name: "Batch Address Processing",
        status: "coming",
        description: "Validate multiple addresses in bulk operations",
        complexity: "medium",
        dependencies: ["Address Validation"]
      }
    ]
  },
  {
    category: "Pricing & Rates",
    features: [
      {
        name: "Domestic Rate Calculation",
        status: "coming",
        description: "Real-time shipping cost calculation for US destinations",
        complexity: "medium",
        dependencies: ["OAuth 2.0 Token Management"]
      },
      {
        name: "International Pricing",
        status: "coming", 
        description: "International shipping rate calculations",
        complexity: "medium",
        dependencies: ["Domestic Rate Calculation"]
      },
      {
        name: "Service Time Estimates",
        status: "coming",
        description: "Delivery time predictions for different service levels",
        complexity: "medium"
      }
    ]
  },
  {
    category: "Tracking Services", 
    features: [
      {
        name: "Package Tracking",
        status: "coming",
        description: "Real-time package status and delivery updates",
        complexity: "medium",
        dependencies: ["OAuth 2.0 Token Management"]
      },
      {
        name: "Tracking Webhooks",
        status: "coming",
        description: "Automated tracking updates via webhooks",
        complexity: "complex",
        dependencies: ["Package Tracking"]
      },
      {
        name: "Delivery Notifications",
        status: "coming",
        description: "Customer email/SMS notifications for tracking events",
        complexity: "medium",
        dependencies: ["Package Tracking"]
      }
    ]
  },
  {
    category: "Label Generation",
    features: [
      {
        name: "Payment Authorization Setup",
        status: "coming",
        description: "Business Gateway payment token management",
        complexity: "complex",
        dependencies: ["OAuth 2.0 Token Management"]
      },
      {
        name: "Basic Label Generation",
        status: "coming",
        description: "Generate PDF shipping labels programmatically", 
        complexity: "complex",
        dependencies: ["Payment Authorization Setup"]
      },
      {
        name: "Multiple Label Formats",
        status: "coming",
        description: "Support for PDF, PNG, and ZPL label formats",
        complexity: "medium",
        dependencies: ["Basic Label Generation"]
      }
    ]
  },
  {
    category: "Advanced Features",
    features: [
      {
        name: "Rate Caching System",
        status: "coming",
        description: "24-hour TTL caching for common shipping routes",
        complexity: "medium",
        dependencies: ["Domestic Rate Calculation"]
      },
      {
        name: "Batch Operations",
        status: "coming",
        description: "Process multiple requests efficiently",
        complexity: "complex"
      },
      {
        name: "Analytics Dashboard",
        status: "coming",
        description: "Usage metrics and shipping cost optimization insights",
        complexity: "complex"
      }
    ]
  }
]

const statusColors = {
  live: 'bg-green-100 text-green-800 border-green-200',
  testing: 'bg-blue-100 text-blue-800 border-blue-200', 
  planned: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  coming: 'bg-gray-100 text-gray-600 border-gray-200'
}

const complexityColors = {
  simple: 'text-green-600',
  medium: 'text-yellow-600', 
  complex: 'text-red-600'
}

export default function USPSCapabilities() {
  const totalFeatures = capabilities.reduce((sum, cat) => sum + cat.features.length, 0)
  const liveFeatures = capabilities.reduce((sum, cat) => 
    sum + cat.features.filter(f => f.status === 'live').length, 0
  )
  const testingFeatures = capabilities.reduce((sum, cat) => 
    sum + cat.features.filter(f => f.status === 'testing').length, 0
  )
  const progressPercentage = Math.round(((liveFeatures + testingFeatures) / totalFeatures) * 100)

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          USPS API Integration Progress
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Building comprehensive USPS shipping capabilities for address validation, rate calculation, tracking, and label generation.
        </p>
        
        {/* Progress Overview */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Overall Progress</h2>
            <span className="text-2xl font-bold text-blue-600">{progressPercentage}%</span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="font-semibold text-green-600">{liveFeatures}</div>
              <div className="text-gray-600">Live</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-blue-600">{testingFeatures}</div>
              <div className="text-gray-600">Testing</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-yellow-600">
                {capabilities.reduce((sum, cat) => 
                  sum + cat.features.filter(f => f.status === 'planned').length, 0
                )}
              </div>
              <div className="text-gray-600">Planned</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-gray-600">
                {capabilities.reduce((sum, cat) => 
                  sum + cat.features.filter(f => f.status === 'coming').length, 0
                )}
              </div>
              <div className="text-gray-600">Coming</div>
            </div>
          </div>
        </div>
      </div>

      {/* Capabilities Matrix */}
      <div className="space-y-8">
        {capabilities.map((category) => (
          <div key={category.category} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">{category.category}</h3>
            </div>
            
            <div className="divide-y divide-gray-200">
              {category.features.map((feature) => (
                <div key={feature.name} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium text-gray-900">{feature.name}</h4>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${statusColors[feature.status]}`}>
                          {feature.status}
                        </span>
                        <span className={`text-xs font-medium ${complexityColors[feature.complexity]}`}>
                          {feature.complexity}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">{feature.description}</p>
                      
                      {feature.dependencies && (
                        <div className="flex flex-wrap gap-1">
                          <span className="text-xs text-gray-500">Depends on:</span>
                          {feature.dependencies.map((dep) => (
                            <span key={dep} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                              {dep}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Implementation Strategy */}
      <div className="mt-8 bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🚀 Current Focus: Crawl Phase</h3>
        <div className="text-sm text-gray-700 space-y-2">
          <p><strong>Phase 1 (Weeks 1-2):</strong> OAuth authentication + Address validation API</p>
          <p><strong>Quick Win:</strong> Address validation extends our existing FedEx validation section</p>
          <p><strong>Next Steps:</strong> Rate calculation, tracking, then label generation</p>
        </div>
      </div>

      {/* API Documentation Reference */}
      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📚 USPS API Resources</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Development</h4>
            <ul className="space-y-1 text-gray-600">
              <li>• <a href="https://developer.usps.com" className="text-blue-600 hover:underline">USPS Developer Portal</a></li>
              <li>• <a href="https://github.com/USPS/api-examples" className="text-blue-600 hover:underline">Official GitHub Examples</a></li>
              <li>• Rate Limit: 60 calls/hour per API</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Business Setup</h4>
            <ul className="space-y-1 text-gray-600">
              <li>• <a href="https://gateway.usps.com/eAdmin/view/signin" className="text-blue-600 hover:underline">Business Customer Gateway</a></li>
              <li>• Requires CRID and MID for label generation</li>
              <li>• Enterprise Payment Account needed</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}