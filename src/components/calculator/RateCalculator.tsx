import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { 
  EnvelopeIcon,
  CheckCircleIcon,
  RocketLaunchIcon,
  TruckIcon,
  CurrencyDollarIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'

const waitlistSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  company: z.string().optional(),
  shippingVolume: z.enum(['low', 'medium', 'high', 'enterprise']).optional()
})

type WaitlistForm = z.infer<typeof waitlistSchema>

export function RateCalculator() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors }, reset } = useForm<WaitlistForm>({
    resolver: zodResolver(waitlistSchema)
  })

  const onSubmit = async (data: WaitlistForm) => {
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      if (response.ok) {
        setIsSubmitted(true)
        reset()
      } else {
        setError('Something went wrong. Please try again.')
      }
    } catch (error) {
      setError('Unable to submit. Please try again later.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const features = [
    {
      icon: TruckIcon,
      title: 'Multi-Carrier Support',
      description: 'Compare rates from FedEx, UPS, USPS, and more in one place'
    },
    {
      icon: CurrencyDollarIcon,
      title: 'Real-Time Rates',
      description: 'Get instant, accurate shipping rates with delivery estimates'
    },
    {
      icon: ChartBarIcon,
      title: 'Advanced Analytics',
      description: 'Track shipping costs and optimize your shipping strategy'
    }
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
          <RocketLaunchIcon className="h-8 w-8 text-blue-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Shipping Rate Calculator Coming Soon
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          We're building the most comprehensive shipping rate comparison tool. Compare rates from all major carriers in one place.
        </p>
      </div>

      {/* Success Message */}
      {isSubmitted ? (
        <div className="max-w-md mx-auto">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <CheckCircleIcon className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              You're on the list!
            </h2>
            <p className="text-gray-600">
              We'll notify you as soon as the shipping calculator is ready. You'll be among the first to access our powerful rate comparison tools.
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>

          {/* Waitlist Form */}
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
                Get Early Access
              </h2>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      type="email"
                      {...register('email')}
                      className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="you@company.com"
                    />
                    <EnvelopeIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>

                {/* Company (Optional) */}
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                    Company Name (Optional)
                  </label>
                  <input
                    id="company"
                    type="text"
                    {...register('company')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Acme Corp"
                  />
                </div>

                {/* Shipping Volume */}
                <div>
                  <label htmlFor="shippingVolume" className="block text-sm font-medium text-gray-700 mb-1">
                    Monthly Shipping Volume (Optional)
                  </label>
                  <select
                    id="shippingVolume"
                    {...register('shippingVolume')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select volume</option>
                    <option value="low">Less than 100 packages</option>
                    <option value="medium">100-1,000 packages</option>
                    <option value="high">1,000-10,000 packages</option>
                    <option value="enterprise">More than 10,000 packages</option>
                  </select>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Joining...
                    </>
                  ) : (
                    <>
                      <RocketLaunchIcon className="h-5 w-5" />
                      Join the Waitlist
                    </>
                  )}
                </button>

                {/* Error Message */}
                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}
              </form>

              <p className="mt-6 text-xs text-gray-500 text-center">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </div>
          </div>
        </>
      )}

      {/* Additional Info */}
      <div className="mt-12 text-center">
        <p className="text-gray-600">
          Questions? Contact us at{' '}
          <a href="mailto:support@shipnode.com" className="text-blue-600 hover:text-blue-700">
            support@shipnode.com
          </a>
        </p>
      </div>
    </div>
  )
}