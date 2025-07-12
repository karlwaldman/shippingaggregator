import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { CheckCircleIcon, ExclamationTriangleIcon, MapPinIcon, ArrowRightIcon } from '@heroicons/react/24/outline'

const addressSchema = z.object({
  street: z.string().min(1, 'Street address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().regex(/^[A-Z]{2}$/, 'State must be 2 characters'),
  zip: z.string().regex(/^\d{5}(-\d{4})?$/, 'ZIP code must be 5 or 9 digits')
})

type AddressForm = z.infer<typeof addressSchema>

interface ValidationResult {
  isValid: boolean
  standardized?: {
    street: string
    city: string
    state: string
    zip: string
    country: string
  }
  suggestions?: string[]
  confidence?: string
  deliverable?: boolean
  isMockData?: boolean
}

export function AddressValidationSection() {
  const [result, setResult] = useState<ValidationResult | null>(null)
  const [isValidating, setIsValidating] = useState(false)
  const [isMockData, setIsMockData] = useState(false)

  const { register, handleSubmit, formState: { errors }, reset } = useForm<AddressForm>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      street: '123 Main Street',
      city: 'Indianapolis', 
      state: 'IN',
      zip: '46201'
    }
  })

  const onSubmit = async (data: AddressForm) => {
    setIsValidating(true)
    setResult(null)

    try {
      const response = await fetch('/api/validate-address', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      const apiResult = await response.json()

      if (apiResult.success) {
        setResult(apiResult.result)
        setIsMockData(apiResult.isMockData)
      } else {
        setResult({
          isValid: false,
          suggestions: [apiResult.error || 'Failed to validate address']
        })
      }
    } catch (error) {
      setResult({
        isValid: false,
        suggestions: ['Unable to connect to validation service. Please try again.']
      })
    } finally {
      setIsValidating(false)
    }
  }

  const tryInvalidAddress = () => {
    reset({
      street: '123 Fake Street',
      city: 'Nowhere',
      state: 'ZZ',
      zip: '00000'
    })
    setResult(null)
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              <MapPinIcon className="h-4 w-4" />
              Live FedEx API
            </span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Validate Addresses Instantly
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Try our address validation tool powered by FedEx's real-time API. 
            Verify, standardize, and check deliverability before shipping.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Form */}
            <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-8 border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <MapPinIcon className="h-6 w-6 text-blue-600" />
                Enter Address to Validate
              </h3>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">
                    Street Address
                  </label>
                  <input
                    id="street"
                    type="text"
                    {...register('street')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="123 Main Street"
                  />
                  {errors.street && (
                    <p className="mt-1 text-sm text-red-600">{errors.street.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      id="city"
                      type="text"
                      {...register('city')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Indianapolis"
                    />
                    {errors.city && (
                      <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                      State
                    </label>
                    <input
                      id="state"
                      type="text"
                      {...register('state')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="IN"
                      maxLength={2}
                      style={{ textTransform: 'uppercase' }}
                    />
                    {errors.state && (
                      <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="zip" className="block text-sm font-medium text-gray-700 mb-1">
                    ZIP Code
                  </label>
                  <input
                    id="zip"
                    type="text"
                    {...register('zip')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="46201"
                  />
                  {errors.zip && (
                    <p className="mt-1 text-sm text-red-600">{errors.zip.message}</p>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={isValidating}
                    className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                    {isValidating ? 'Validating...' : 'Validate Address'}
                  </button>
                  <button
                    type="button"
                    onClick={tryInvalidAddress}
                    className="px-4 py-3 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Try Invalid
                  </button>
                </div>
              </form>
            </div>

            {/* Results */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Validation Result</h3>
              
              {!result && (
                <div className="text-center py-12 text-gray-500">
                  <MapPinIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Enter an address to see validation results</p>
                </div>
              )}

              {result && (
                <div className="space-y-6">
                  {isMockData && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Demo Mode:</strong> Using enhanced validation logic. Connect FedEx API for real-time validation.
                      </p>
                    </div>
                  )}

                  {/* Status */}
                  <div className={`flex items-start gap-4 p-4 rounded-lg ${
                    result.isValid 
                      ? 'bg-green-50 border border-green-200' 
                      : 'bg-red-50 border border-red-200'
                  }`}>
                    {result.isValid ? (
                      <>
                        <CheckCircleIcon className="h-8 w-8 text-green-600 mt-1" />
                        <div>
                          <p className="font-semibold text-green-800 text-lg">Address is Valid ✓</p>
                          {result.confidence && (
                            <p className="text-sm text-green-700">Confidence: {result.confidence}</p>
                          )}
                          {result.deliverable && (
                            <p className="text-sm text-green-700">✓ Deliverable by FedEx</p>
                          )}
                        </div>
                      </>
                    ) : (
                      <>
                        <ExclamationTriangleIcon className="h-8 w-8 text-red-600 mt-1" />
                        <div>
                          <p className="font-semibold text-red-800 text-lg">Address Invalid ✗</p>
                          <p className="text-sm text-red-700">Please review and correct</p>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Standardized Address */}
                  {result.standardized && (
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h4 className="font-semibold text-gray-900 mb-3">Standardized Format</h4>
                      <div className="bg-white p-4 rounded border border-gray-200">
                        <p className="text-gray-900 font-medium">{result.standardized.street}</p>
                        <p className="text-gray-900">{result.standardized.city}, {result.standardized.state} {result.standardized.zip}</p>
                        <p className="text-gray-600 text-sm">{result.standardized.country}</p>
                      </div>
                    </div>
                  )}

                  {/* Suggestions */}
                  {result.suggestions && result.suggestions.length > 0 && (
                    <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                      <h4 className="font-semibold text-yellow-800 mb-2">Suggestions</h4>
                      <ul className="space-y-1 text-sm text-yellow-700">
                        {result.suggestions.map((suggestion, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-yellow-600 mt-1">•</span>
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-6">
              Need address validation for your shipping workflow?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/address-validator" className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Try Full Tool
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
              <Link href="/" className="inline-flex items-center gap-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                Join Waitlist for API Access
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}