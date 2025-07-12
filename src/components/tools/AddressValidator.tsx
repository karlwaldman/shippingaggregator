import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CheckCircleIcon, ExclamationTriangleIcon, MapPinIcon } from '@heroicons/react/24/outline'

const addressSchema = z.object({
  street: z.string().min(1, 'Street address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().regex(/^[A-Z]{2}$/, 'State must be 2 characters (e.g. CA, NY)'),
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

export function AddressValidator() {
  const [result, setResult] = useState<ValidationResult | null>(null)
  const [isValidating, setIsValidating] = useState(false)
  const [isMockData, setIsMockData] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<AddressForm>({
    resolver: zodResolver(addressSchema)
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

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <MapPinIcon className="h-12 w-12 text-blue-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Address Validation Tool
        </h1>
        <p className="text-lg text-gray-600">
          Verify and standardize shipping addresses using FedEx's validation API
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Input Form */}
        <div className="freight-rate-card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Enter Address</h3>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">
                Street Address
              </label>
              <input
                id="street"
                type="text"
                {...register('street')}
                className="manufacturing-input"
                placeholder="123 Main Street"
              />
              {errors.street && (
                <p className="mt-1 text-sm text-destructive">{errors.street.message}</p>
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
                  className="manufacturing-input"
                  placeholder="Indianapolis"
                />
                {errors.city && (
                  <p className="mt-1 text-sm text-destructive">{errors.city.message}</p>
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
                  className="manufacturing-input"
                  placeholder="IN"
                  maxLength={2}
                  style={{ textTransform: 'uppercase' }}
                />
                {errors.state && (
                  <p className="mt-1 text-sm text-destructive">{errors.state.message}</p>
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
                className="manufacturing-input"
                placeholder="46201"
              />
              {errors.zip && (
                <p className="mt-1 text-sm text-destructive">{errors.zip.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isValidating}
              className="w-full manufacturing-button"
            >
              {isValidating ? 'Validating Address...' : 'Validate Address'}
            </button>
          </form>
        </div>

        {/* Results */}
        <div className="freight-rate-card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Validation Result</h3>
          
          {!result && (
            <div className="text-center py-8 text-gray-500">
              <MapPinIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Enter an address to see validation results</p>
            </div>
          )}

          {isMockData && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Demo Mode:</strong> Using sample validation. Connect FedEx API for real validation.
              </p>
            </div>
          )}

          {result && (
            <div className="space-y-4">
              {/* Status */}
              <div className={`flex items-center gap-3 p-4 rounded-lg ${
                result.isValid 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-red-50 border border-red-200'
              }`}>
                {result.isValid ? (
                  <>
                    <CheckCircleIcon className="h-6 w-6 text-green-600" />
                    <div>
                      <p className="font-medium text-green-800">Address is valid</p>
                      {result.confidence && (
                        <p className="text-sm text-green-700">Confidence: {result.confidence}</p>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
                    <div>
                      <p className="font-medium text-red-800">Address needs correction</p>
                    </div>
                  </>
                )}
              </div>

              {/* Standardized Address */}
              {result.standardized && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Standardized Address</h4>
                  <div className="space-y-1 text-sm text-gray-700">
                    <p>{result.standardized.street}</p>
                    <p>{result.standardized.city}, {result.standardized.state} {result.standardized.zip}</p>
                    <p>{result.standardized.country}</p>
                  </div>
                  {result.deliverable !== undefined && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className={`text-sm font-medium ${
                        result.deliverable ? 'text-green-700' : 'text-yellow-700'
                      }`}>
                        {result.deliverable ? '✓ Deliverable' : '⚠ Delivery may be delayed'}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Suggestions */}
              {result.suggestions && result.suggestions.length > 0 && (
                <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                  <h4 className="font-medium text-yellow-800 mb-2">Suggestions</h4>
                  <ul className="space-y-1 text-sm text-yellow-700">
                    {result.suggestions.map((suggestion, index) => (
                      <li key={index}>• {suggestion}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Information */}
      <div className="mt-12 text-center p-6 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-gray-900 mb-2">How Address Validation Works</h3>
        <p className="text-sm text-gray-600 mb-4">
          Our address validation uses FedEx's real-time API to verify addresses, standardize formatting, 
          and check deliverability before shipping.
        </p>
        <div className="flex justify-center gap-4 text-xs text-gray-500">
          <span>✓ Real-time validation</span>
          <span>✓ Address standardization</span>
          <span>✓ Deliverability check</span>
          <span>✓ ZIP+4 enhancement</span>
        </div>
      </div>
    </div>
  )
}