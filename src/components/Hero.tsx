import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

export function Hero() {
  return (
    <div className="gradient-hero min-h-screen relative overflow-hidden">
      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between p-6 lg:px-8">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <Image src="/logo.svg" alt="ShipNode" width={180} height={45} className="h-10 w-auto" />
          </Link>
        </div>
        <div className="hidden lg:flex lg:gap-x-8">
          <Link href="/calculator" className="text-sm font-semibold leading-6 text-gray-900 hover:text-blue-600 transition-colors">
            Calculator
          </Link>
          <Link href="#features" className="text-sm font-semibold leading-6 text-gray-900 hover:text-blue-600 transition-colors">
            Features
          </Link>
          <Link href="#how-it-works" className="text-sm font-semibold leading-6 text-gray-900 hover:text-blue-600 transition-colors">
            How It Works
          </Link>
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <Link href="#waitlist" className="btn-primary text-sm">
            Get Early Access <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </nav>

      {/* Hero content */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 pt-10 pb-24 sm:pb-32 lg:flex lg:px-8 lg:py-40">
        <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl lg:flex-shrink-0 lg:pt-8">
          <div className="mt-24 sm:mt-32 lg:mt-16">
            <span className="inline-flex items-center space-x-2 rounded-full bg-blue-600/10 px-3 py-1 text-sm font-semibold leading-6 text-blue-600 ring-1 ring-inset ring-blue-600/10">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
              </svg>
              <span>Save up to 30% on shipping</span>
            </span>
          </div>
          <h1 className="mt-10 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl animate-slide-up">
            Ship Smarter with{' '}
            <span className="gradient-text">Instant Rate Comparison</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Compare real-time shipping rates from FedEx, UPS, USPS, and DHL in one place. 
            Built for manufacturers who ship smart and save big.
          </p>
          <div className="mt-10 flex items-center gap-x-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Link href="#waitlist" className="btn-primary">
              Join the Waitlist
            </Link>
            <Link href="/calculator" className="btn-outline">
              Try Calculator <span aria-hidden="true">→</span>
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="mt-10 flex items-center gap-x-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="flex -space-x-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 ring-2 ring-white flex items-center justify-center text-white text-xs font-semibold">
                  {i}K+
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-600">
              <span className="font-semibold text-gray-900">500+ manufacturers</span> already saving on shipping
            </p>
          </div>
        </div>

        {/* Hero image/graphic */}
        <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-32">
          <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
            <div className="relative">
              {/* Dashboard preview card */}
              <div className="card-modern p-8 w-[600px] animate-slide-up" style={{ animationDelay: '0.4s' }}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">Rate Comparison</h3>
                  <span className="text-sm text-emerald-600 font-medium">Live rates</span>
                </div>
                
                {/* Mock rate cards */}
                <div className="space-y-4">
                  {[
                    { carrier: 'FedEx', rate: '$124.50', time: '2 days', savings: '15%' },
                    { carrier: 'UPS', rate: '$132.00', time: '3 days', savings: '8%' },
                    { carrier: 'USPS', rate: '$145.00', time: '5 days', savings: '' },
                  ].map((item, i) => (
                    <div key={item.carrier} className={`p-4 rounded-lg border ${i === 0 ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 bg-white'}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-12 h-12 rounded-lg ${i === 0 ? 'bg-emerald-100' : 'bg-gray-100'} flex items-center justify-center`}>
                            <svg className={`w-6 h-6 ${i === 0 ? 'text-emerald-600' : 'text-gray-600'}`} fill="currentColor" viewBox="0 0 20 20">
                              <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                              <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{item.carrier}</p>
                            <p className="text-sm text-gray-500">{item.time}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-gray-900">{item.rate}</p>
                          {item.savings && (
                            <p className="text-sm font-medium text-emerald-600">Save {item.savings}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating feature cards */}
              <div className="absolute -top-10 -right-10 card-modern p-4 w-48 animate-float">
                <div className="flex items-center space-x-2">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">30%</p>
                    <p className="text-xs text-gray-600">Avg. Savings</p>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-10 -left-10 card-modern p-4 w-48 animate-float" style={{ animationDelay: '3s' }}>
                <div className="flex items-center space-x-2">
                  <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">2 sec</p>
                    <p className="text-xs text-gray-600">Quote Time</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}