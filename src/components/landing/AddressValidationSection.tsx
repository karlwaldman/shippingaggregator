import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { CheckCircleIcon, ExclamationTriangleIcon, MapPinIcon, ArrowRightIcon, BuildingOfficeIcon, TruckIcon } from '@heroicons/react/24/outline'

const addressSchema = z.object({
  street: z.string().min(1, 'Street address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().regex(/^[A-Z]{2}$/, 'State must be 2 characters'),
  zip: z.string().regex(/^\d{5}(-\d{4})?$/, 'ZIP code must be 5 or 9 digits')
})

type AddressForm = z.infer<typeof addressSchema>
type CarrierType = 'fedex' | 'usps' | 'both'

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
  provider?: string
}

export function AddressValidationSection() {
  const [result, setResult] = useState<ValidationResult | null>(null)
  const [uspsResult, setUspsResult] = useState<ValidationResult | null>(null)
  const [isValidating, setIsValidating] = useState(false)
  const [selectedCarrier, setSelectedCarrier] = useState<CarrierType>('both')
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
    setUspsResult(null)

    try {
      const requests = []
      
      // Always validate with FedEx unless USPS only is selected
      if (selectedCarrier === 'fedex' || selectedCarrier === 'both') {
        requests.push(
          fetch('/api/validate-address', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          }).then(res => res.json()).then(result => ({ ...result, carrier: 'fedex' }))
        )
      }
      
      // Validate with USPS if selected
      if (selectedCarrier === 'usps' || selectedCarrier === 'both') {
        requests.push(
          fetch('/api/validate-address-usps', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              streetAddress: data.street,
              city: data.city,
              state: data.state,
              zipCode: data.zip
            })
          }).then(res => res.json()).then(result => ({ ...result, carrier: 'usps' }))
        )
      }

      const results = await Promise.all(requests)
      
      // Set results based on carrier selection
      results.forEach(apiResult => {
        if (apiResult.success) {
          const resultWithProvider = { ...apiResult.result, provider: apiResult.provider }
          if (apiResult.carrier === 'fedex') {
            setResult(resultWithProvider)
            if (selectedCarrier === 'fedex') setIsMockData(apiResult.isMockData)
          } else if (apiResult.carrier === 'usps') {
            setUspsResult(resultWithProvider)
            if (selectedCarrier === 'usps') setIsMockData(apiResult.isMockData)
          }
        } else {
          const errorResult = {
            isValid: false,
            suggestions: [apiResult.error || 'Failed to validate address'],
            provider: apiResult.provider || apiResult.carrier?.toUpperCase()
          }
          if (apiResult.carrier === 'fedex') {
            setResult(errorResult)
          } else if (apiResult.carrier === 'usps') {
            setUspsResult(errorResult)
          }
        }
      })
      
      // Set mock data status for 'both' mode
      if (selectedCarrier === 'both' && results.length > 0) {
        setIsMockData(results.some(r => r.isMockData))
      }
      
    } catch (error) {
      const errorResult = {
        isValid: false,
        suggestions: ['Unable to connect to validation service. Please try again.']
      }
      setResult(errorResult)
      if (selectedCarrier === 'both') setUspsResult(errorResult)
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
    setUspsResult(null)
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex justify-center gap-3 mb-4">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              <TruckIcon className="h-4 w-4" />
              Live FedEx API
            </span>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              <BuildingOfficeIcon className="h-4 w-4" />
              USPS Integration
            </span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Multi-Carrier Address Validation
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Compare address validation across FedEx and USPS APIs. 
            Verify, standardize, and check deliverability with multiple carriers.
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

              {/* Carrier Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Validation Provider</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedCarrier('fedex')}
                    className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
                      selectedCarrier === 'fedex'
                        ? 'bg-green-100 border-green-300 text-green-800'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    FedEx Only
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedCarrier('usps')}
                    className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
                      selectedCarrier === 'usps'
                        ? 'bg-blue-100 border-blue-300 text-blue-800'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    USPS Only
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedCarrier('both')}
                    className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
                      selectedCarrier === 'both'
                        ? 'bg-purple-100 border-purple-300 text-purple-800'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Compare Both
                  </button>
                </div>
              </div>
              
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
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Validation Results</h3>
              
              {!result && !uspsResult && (
                <div className="text-center py-12 text-gray-500">
                  <MapPinIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Enter an address to see validation results</p>
                </div>
              )}

              {(result || uspsResult) && (
                <div className="space-y-6">
                  {isMockData && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Demo Mode:</strong> Using enhanced validation logic. Connect APIs for real-time validation.
                      </p>
                    </div>
                  )}

                  {/* FedEx Results */}
                  {result && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                        <TruckIcon className="h-5 w-5 text-green-600" />
                        <h4 className="font-semibold text-gray-900">FedEx Validation</h4>
                        {result.provider && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                            {result.provider}
                          </span>
                        )}
                      </div>
                      
                      <div className={`flex items-start gap-4 p-4 rounded-lg ${
                        result.isValid 
                          ? 'bg-green-50 border border-green-200' 
                          : 'bg-red-50 border border-red-200'
                      }`}>
                        {result.isValid ? (
                          <>
                            <CheckCircleIcon className="h-6 w-6 text-green-600 mt-1" />
                            <div>
                              <p className="font-medium text-green-800">Valid ✓</p>
                              {result.confidence && (
                                <p className="text-sm text-green-700">Confidence: {result.confidence}</p>
                              )}
                              {result.deliverable && (
                                <p className="text-sm text-green-700">✓ Deliverable</p>
                              )}
                            </div>
                          </>
                        ) : (
                          <>
                            <ExclamationTriangleIcon className="h-6 w-6 text-red-600 mt-1" />
                            <div>
                              <p className="font-medium text-red-800">Invalid ✗</p>
                            </div>
                          </>
                        )}
                      </div>

                      {result.standardized && (
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h5 className="font-medium text-gray-900 mb-2">FedEx Standardized</h5>
                          <div className="bg-white p-3 rounded border text-sm">
                            <p className="font-medium">{result.standardized.street}</p>
                            <p>{result.standardized.city}, {result.standardized.state} {result.standardized.zip}</p>
                          </div>
                        </div>
                      )}

                      {result.suggestions && result.suggestions.length > 0 && (
                        <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
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

                  {/* USPS Results */}
                  {uspsResult && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                        <BuildingOfficeIcon className="h-5 w-5 text-blue-600" />
                        <h4 className="font-semibold text-gray-900">USPS Validation</h4>
                        {uspsResult.provider && (
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                            {uspsResult.provider}
                          </span>
                        )}
                      </div>
                      
                      <div className={`flex items-start gap-4 p-4 rounded-lg ${
                        uspsResult.isValid 
                          ? 'bg-green-50 border border-green-200' 
                          : 'bg-red-50 border border-red-200'
                      }`}>
                        {uspsResult.isValid ? (
                          <>
                            <CheckCircleIcon className="h-6 w-6 text-green-600 mt-1" />
                            <div>
                              <p className="font-medium text-green-800">Valid ✓</p>
                              {uspsResult.confidence && (
                                <p className="text-sm text-green-700">Confidence: {uspsResult.confidence}</p>
                              )}
                              {uspsResult.deliverable && (
                                <p className="text-sm text-green-700">✓ Deliverable</p>
                              )}
                            </div>
                          </>
                        ) : (
                          <>
                            <ExclamationTriangleIcon className="h-6 w-6 text-red-600 mt-1" />
                            <div>
                              <p className="font-medium text-red-800">Invalid ✗</p>
                            </div>
                          </>
                        )}
                      </div>

                      {uspsResult.standardized && (
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h5 className="font-medium text-gray-900 mb-2">USPS Standardized</h5>
                          <div className="bg-white p-3 rounded border text-sm">
                            <p className="font-medium">{uspsResult.standardized.street}</p>
                            <p>{uspsResult.standardized.city}, {uspsResult.standardized.state} {uspsResult.standardized.zip}</p>
                          </div>
                        </div>
                      )}

                      {uspsResult.suggestions && uspsResult.suggestions.length > 0 && (
                        <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                          <ul className="space-y-1 text-sm text-yellow-700">
                            {uspsResult.suggestions.map((suggestion, index) => (
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