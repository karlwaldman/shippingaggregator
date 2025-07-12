import React from 'react'
import { TruckIcon, ChartBarIcon, CogIcon, ShieldCheckIcon, BoltIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline'

const features = [
  {
    name: 'Multi-Carrier Comparison',
    description: 'Compare real-time rates from FedEx, UPS, USPS, DHL, and regional carriers in one place.',
    icon: TruckIcon,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  {
    name: 'Smart Cost Analytics',
    description: 'Track shipping spend, identify savings opportunities, and optimize your logistics budget.',
    icon: ChartBarIcon,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-100',
  },
  {
    name: 'ERP Integration',
    description: 'Seamlessly connect with SAP, NetSuite, and other manufacturing systems.',
    icon: CogIcon,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
  },
  {
    name: 'Compliance Automation',
    description: 'Stay compliant with hazmat, international shipping, and industry regulations.',
    icon: ShieldCheckIcon,
    color: 'text-amber-600',
    bgColor: 'bg-amber-100',
  },
  {
    name: 'Instant Quotes',
    description: 'Get accurate shipping quotes in seconds, not minutes. No more carrier websites.',
    icon: BoltIcon,
    color: 'text-rose-600',
    bgColor: 'bg-rose-100',
  },
  {
    name: 'Volume Discounts',
    description: 'Access pre-negotiated rates and volume discounts typically reserved for large enterprises.',
    icon: CurrencyDollarIcon,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100',
  },
]

export function Features() {
  return (
    <section id="features" className="py-24 sm:py-32 bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-600">Everything you need</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            One platform for all your shipping needs
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Built specifically for manufacturers who need reliable, cost-effective shipping solutions.
          </p>
        </div>
        
        <div className="mx-auto mt-16 max-w-7xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-3 lg:gap-y-16">
            {features.map((feature) => (
              <div key={feature.name} className="relative group">
                <div className="card-modern p-6 h-full transition-all duration-300 hover:shadow-lg">
                  <dt className="flex items-start space-x-3">
                    <div className={`rounded-lg ${feature.bgColor} p-3 group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className={`h-6 w-6 ${feature.color}`} aria-hidden="true" />
                    </div>
                    <div className="flex-1">
                      <p className="text-lg font-semibold leading-7 text-gray-900">
                        {feature.name}
                      </p>
                      <dd className="mt-2 text-base leading-7 text-gray-600">
                        {feature.description}
                      </dd>
                    </div>
                  </dt>
                </div>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}