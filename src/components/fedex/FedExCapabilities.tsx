import React from 'react'
import { CheckCircleIcon, XCircleIcon, ClockIcon, BeakerIcon } from '@heroicons/react/24/solid'
import { TruckIcon, CubeIcon, DocumentTextIcon, CreditCardIcon, GlobeAltIcon, ChartBarIcon } from '@heroicons/react/24/outline'
import { ProgressBadge, MiniProgressBar } from './ProgressBadge'

interface Capability {
  category: string
  icon: React.ComponentType<{ className?: string }>
  features: {
    name: string
    status: 'live' | 'testing' | 'planned' | 'not-started'
    description: string
    apiEndpoint?: string
    completedDate?: string
    targetDate?: string
  }[]
}

const capabilities: Capability[] = [
  {
    category: 'Shipping Rates & Transit Times',
    icon: TruckIcon,
    features: [
      {
        name: 'Rate Quotes',
        status: 'live',
        description: 'Get real-time shipping rates for all FedEx services',
        apiEndpoint: '/rate/v1/rates/quotes',
        completedDate: 'July 2025'
      },
      {
        name: 'Transit Time Calculation',
        status: 'live',
        description: 'Calculate delivery dates and service availability',
        apiEndpoint: '/availability/v1/transittimes',
        completedDate: 'July 2025'
      },
      {
        name: 'Service Availability',
        status: 'planned',
        description: 'Check which services are available for specific routes',
        apiEndpoint: '/availability/v1/packageandserviceoptions',
        targetDate: 'August 2025'
      },
      {
        name: 'Dimensional Weight Pricing',
        status: 'not-started',
        description: 'Automatic dimensional weight calculations',
        targetDate: 'September 2025'
      }
    ]
  },
  {
    category: 'Shipment Creation & Labels',
    icon: CubeIcon,
    features: [
      {
        name: 'Create Shipment',
        status: 'planned',
        description: 'Create shipments and generate tracking numbers',
        apiEndpoint: '/ship/v1/shipments',
        targetDate: 'August 2025'
      },
      {
        name: 'Label Generation',
        status: 'planned',
        description: 'Generate PDF shipping labels in multiple formats',
        apiEndpoint: '/ship/v1/shipments',
        targetDate: 'August 2025'
      },
      {
        name: 'Multi-piece Shipments',
        status: 'not-started',
        description: 'Handle pallets and multi-package shipments',
        targetDate: 'September 2025'
      },
      {
        name: 'Return Labels',
        status: 'not-started',
        description: 'Generate return shipping labels',
        apiEndpoint: '/ship/v1/shipments/returnlabel',
        targetDate: 'October 2025'
      }
    ]
  },
  {
    category: 'Tracking & Visibility',
    icon: GlobeAltIcon,
    features: [
      {
        name: 'Track by Number',
        status: 'live',
        description: 'Real-time package tracking with detailed scan events',
        apiEndpoint: '/track/v1/trackingnumbers',
        completedDate: 'July 2025'
      },
      {
        name: 'Tracking Webhooks',
        status: 'planned',
        description: 'Push notifications for tracking updates',
        apiEndpoint: '/track/v1/notifications',
        targetDate: 'September 2025'
      },
      {
        name: 'Proof of Delivery',
        status: 'not-started',
        description: 'Retrieve signature and delivery confirmation',
        apiEndpoint: '/track/v1/shipments/pod',
        targetDate: 'October 2025'
      },
      {
        name: 'Shipment Visibility',
        status: 'not-started',
        description: 'Enhanced tracking with detailed scan events',
        targetDate: 'November 2025'
      }
    ]
  },
  {
    category: 'Document Management',
    icon: DocumentTextIcon,
    features: [
      {
        name: 'Commercial Invoice',
        status: 'planned',
        description: 'Generate customs documentation',
        apiEndpoint: '/ship/v1/shipments/docs',
        targetDate: 'September 2025'
      },
      {
        name: 'Electronic Trade Documents',
        status: 'not-started',
        description: 'ETD for international shipping',
        apiEndpoint: '/etd/v2/etd',
        targetDate: 'October 2025'
      },
      {
        name: 'Dangerous Goods Declaration',
        status: 'not-started',
        description: 'Hazmat shipping documentation',
        targetDate: 'December 2025'
      }
    ]
  },
  {
    category: 'Advanced Features',
    icon: ChartBarIcon,
    features: [
      {
        name: 'Address Validation',
        status: 'live',
        description: 'Verify and standardize shipping addresses',
        apiEndpoint: '/address/v1/addresses/resolve',
        completedDate: 'July 2025'
      },
      {
        name: 'Pickup Scheduling',
        status: 'planned',
        description: 'Schedule package pickups',
        apiEndpoint: '/pickup/v1/pickups',
        targetDate: 'September 2025'
      },
      {
        name: 'Freight LTL/FTL',
        status: 'not-started',
        description: 'FedEx Freight integration for heavy shipments',
        targetDate: 'Q4 2025'
      },
      {
        name: 'Carbon Footprint',
        status: 'not-started',
        description: 'Calculate shipping emissions',
        targetDate: 'Q1 2026'
      }
    ]
  }
]

function getStatusIcon(status: string) {
  switch (status) {
    case 'live':
      return <CheckCircleIcon className="h-5 w-5 text-green-500" />
    case 'testing':
      return <BeakerIcon className="h-5 w-5 text-blue-500" />
    case 'planned':
      return <ClockIcon className="h-5 w-5 text-yellow-500" />
    default:
      return <XCircleIcon className="h-5 w-5 text-gray-300" />
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case 'live':
      return 'bg-green-100 text-green-800 border-green-200'
    case 'testing':
      return 'bg-blue-100 text-blue-800 border-blue-200'
    case 'planned':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    default:
      return 'bg-gray-100 text-gray-600 border-gray-200'
  }
}

function getStatusLabel(status: string) {
  switch (status) {
    case 'live':
      return 'Live'
    case 'testing':
      return 'Testing'
    case 'planned':
      return 'In Progress'
    default:
      return 'Coming Soon'
  }
}

export function FedExCapabilities() {
  // Calculate progress
  const allFeatures = capabilities.flatMap(c => c.features)
  const liveCount = allFeatures.filter(f => f.status === 'live').length
  const testingCount = allFeatures.filter(f => f.status === 'testing').length
  const totalCount = allFeatures.length
  const progressPercent = Math.round(((liveCount + testingCount * 0.5) / totalCount) * 100)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <TruckIcon className="h-16 w-16 text-blue-600" />
            <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1">
              <img src="/fedex-logo.svg" alt="FedEx" className="h-6 w-6" />
            </div>
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          FedEx API Integration Progress
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          We're building in public! Track our progress as we integrate every FedEx API capability 
          to give you the most powerful shipping platform for manufacturers.
        </p>

        {/* Progress Badge */}
        <div className="flex justify-center mb-8">
          <ProgressBadge percentage={progressPercent} size="large" />
        </div>

        {/* Category Progress */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto mb-8">
          {capabilities.map(cat => {
            const catFeatures = cat.features
            const catLive = catFeatures.filter(f => f.status === 'live').length
            const catTesting = catFeatures.filter(f => f.status === 'testing').length
            const catPercent = Math.round(((catLive + catTesting * 0.5) / catFeatures.length) * 100)
            
            return (
              <MiniProgressBar 
                key={cat.category} 
                label={cat.category.split(' ')[0]} 
                percentage={catPercent} 
              />
            )
          })}
        </div>

        {/* Status Legend */}
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <CheckCircleIcon className="h-5 w-5 text-green-500" />
            <span>Live ({liveCount})</span>
          </div>
          <div className="flex items-center gap-2">
            <BeakerIcon className="h-5 w-5 text-blue-500" />
            <span>Testing ({testingCount})</span>
          </div>
          <div className="flex items-center gap-2">
            <ClockIcon className="h-5 w-5 text-yellow-500" />
            <span>In Progress ({allFeatures.filter(f => f.status === 'planned').length})</span>
          </div>
          <div className="flex items-center gap-2">
            <XCircleIcon className="h-5 w-5 text-gray-300" />
            <span>Coming Soon ({allFeatures.filter(f => f.status === 'not-started').length})</span>
          </div>
        </div>
      </div>

      {/* Capabilities Grid */}
      <div className="space-y-8">
        {capabilities.map((category) => (
          <div key={category.category} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <category.icon className="h-6 w-6 text-gray-600" />
                <h2 className="text-lg font-semibold text-gray-900">{category.category}</h2>
              </div>
            </div>
            
            <div className="divide-y divide-gray-200">
              {category.features.map((feature) => (
                <div key={feature.name} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                      {getStatusIcon(feature.status)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-base font-semibold text-gray-900 mb-1">
                            {feature.name}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">
                            {feature.description}
                          </p>
                          {feature.apiEndpoint && (
                            <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-700">
                              {feature.apiEndpoint}
                            </code>
                          )}
                        </div>
                        
                        <div className="flex flex-col items-end gap-2 ml-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(feature.status)}`}>
                            {getStatusLabel(feature.status)}
                          </span>
                          {feature.completedDate && (
                            <span className="text-xs text-gray-500">
                              Completed {feature.completedDate}
                            </span>
                          )}
                          {feature.targetDate && feature.status !== 'live' && (
                            <span className="text-xs text-gray-500">
                              Target: {feature.targetDate}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Call to Action */}
      <div className="mt-12 text-center">
        <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-8 border border-blue-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Want to be notified when new features go live?
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Join our waitlist to get early access to new FedEx features as we build them. 
            Manufacturing companies on our waitlist get priority access and special pricing.
          </p>
          <div className="flex gap-4 justify-center">
            <a href="/" className="btn-primary">
              Join the Waitlist
            </a>
            <a href="/calculator" className="btn-outline">
              Try Live Features
            </a>
          </div>
        </div>
      </div>

      {/* Share Progress */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-600 mb-2">Share our progress:</p>
        <div className="flex justify-center gap-2">
          <button className="text-gray-400 hover:text-gray-600">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
            </svg>
          </button>
          <button className="text-gray-400 hover:text-gray-600">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}