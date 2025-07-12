import React from 'react'
import Link from 'next/link'
import { EyeIcon, CodeBracketIcon, RocketLaunchIcon } from '@heroicons/react/24/outline'
import { ProgressBadge } from '@/components/fedex/ProgressBadge'

export function BuildInPublic() {
  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              <EyeIcon className="h-4 w-4" />
              Building in Public
            </span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Watch Us Build the Future of Shipping
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            We're developing ShipNode completely transparently. See our real-time progress integrating 
            FedEx APIs, track feature releases, and watch working software evolve daily.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Progress Visualization */}
          <div className="text-center lg:text-left">
            <div className="flex justify-center lg:justify-start mb-6">
              <ProgressBadge percentage={22} size="large" />
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              FedEx API Integration Progress
            </h3>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-700">Rate quotes API - Live ✨</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-700">Address validation - Live ✨</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-700">Label generation - In progress 🔨</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                <span className="text-sm text-gray-700">Tracking webhooks - Coming soon</span>
              </div>
            </div>

            <Link 
              href="/fedex-progress" 
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              <CodeBracketIcon className="h-5 w-5" />
              View Full Progress
            </Link>
          </div>

          {/* Why Build in Public */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-start gap-4">
                <div className="bg-green-100 rounded-lg p-2">
                  <EyeIcon className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Complete Transparency</h4>
                  <p className="text-sm text-gray-600">
                    See exactly which features are working, being tested, or in development. 
                    No marketing fluff - just real software progress.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 rounded-lg p-2">
                  <CodeBracketIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Real Working Software</h4>
                  <p className="text-sm text-gray-600">
                    Try live features as we build them. Our rate calculator uses real FedEx APIs 
                    - no mock data or fake demos.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-start gap-4">
                <div className="bg-purple-100 rounded-lg p-2">
                  <RocketLaunchIcon className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Early Access Rewards</h4>
                  <p className="text-sm text-gray-600">
                    Waitlist members get first access to new features, special pricing, 
                    and direct input on development priorities.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Join the Journey
            </h3>
            <p className="text-gray-600 mb-6">
              Be part of our development process. Get updates when features ship, 
              influence our roadmap, and be first to access new capabilities.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/" className="btn-primary">
                Join Waitlist for Updates
              </Link>
              <Link href="/calculator" className="btn-outline">
                Try Working Features
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}