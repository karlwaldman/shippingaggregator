import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { TruckIcon, ClockIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { logEvent } from '@/lib/analytics'

// Form validation
const calculatorSchema = z.object({
  originZip: z.string().regex(/^\d{5}$/, 'Please enter a valid 5-digit ZIP code'),
  destinationZip: z.string().regex(/^\d{5}$/, 'Please enter a valid 5-digit ZIP code'),
  weight: z.string().transform(val => parseFloat(val)).pipe(
    z.number().min(0.1, 'Weight must be at least 0.1 lbs').max(150, 'Maximum weight is 150 lbs')
  ),
  length: z.string().optional().transform(val => val ? parseFloat(val) : undefined),
  width: z.string().optional().transform(val => val ? parseFloat(val) : undefined),
  height: z.string().optional().transform(val => val ? parseFloat(val) : undefined)
})

type CalculatorForm = z.infer<typeof calculatorSchema>

interface Rate {
  carrier: string
  serviceName: string
  serviceCode: string
  totalCharge: number
  currency: string
  transitTime: string
  deliveryDate?: string
  isMockData?: boolean
}

export function RateCalculator() {
  const [rates, setRates] = useState<Rate[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showResults, setShowResults] = useState(false)
  const [isMockData, setIsMockData] = useState(false)
  
  const { register, handleSubmit, formState: { errors } } = useForm<CalculatorForm>({
    resolver: zodResolver(calculatorSchema)
  })

  const onSubmit = async (data: CalculatorForm) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/rates/fedex', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          originZip: data.originZip,
          destinationZip: data.destinationZip,
          weight: data.weight,
          length: data.length,
          width: data.width,
          height: data.height
        })
      })
      
      const result = await response.json()
      
      if (result.success) {
        setRates(result.rates)
        setShowResults(true)
        setIsMockData(result.isMockData)
        
        // Track successful calculation
        logEvent('Calculator', 'Calculate', `Success - ${result.isMockData ? 'Mock' : 'Live'}`, result.rates.length)
      } else {
        setError(result.message || 'Failed to fetch rates')
        logEvent('Calculator', 'Error', result.error)
      }
    } catch (err) {
      setError('Unable to connect to rate service. Please try again.')
      console.error('Rate calculation error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="heading-xl mb-4">Shipping Rate Calculator</h1>
        <p className="body-lg text-gray-600">
          Get instant FedEx shipping rates for your packages
        </p>
      </div>

      {/* Calculator Form */}
      <div className="freight-rate-card mb-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="originZip" className="block text-sm font-medium text-gray-700 mb-1">
                Origin ZIP Code
              </label>
              <input
                id="originZip"
                type="text"
                {...register('originZip')}
                className="manufacturing-input"
                placeholder="46201"
                maxLength={5}
              />
              {errors.originZip && (
                <p className="mt-1 text-sm text-destructive">{errors.originZip.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="destinationZip" className="block text-sm font-medium text-gray-700 mb-1">
                Destination ZIP Code
              </label>
              <input
                id="destinationZip"
                type="text"
                {...register('destinationZip')}
                className="manufacturing-input"
                placeholder="90210"
                maxLength={5}
              />
              {errors.destinationZip && (
                <p className="mt-1 text-sm text-destructive">{errors.destinationZip.message}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
              Package Weight (lbs)
            </label>
            <input
              id="weight"
              type="number"
              step="0.1"
              {...register('weight')}
              className="manufacturing-input"
              placeholder="10"
            />
            {errors.weight && (
              <p className="mt-1 text-sm text-destructive">{errors.weight.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">Package Dimensions (optional)</p>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label htmlFor="length" className="block text-xs text-gray-600 mb-1">
                  Length (inches)
                </label>
                <input
                  id="length"
                  type="number"
                  step="0.1"
                  {...register('length')}
                  className="manufacturing-input"
                  placeholder="12"
                />
              </div>
              <div>
                <label htmlFor="width" className="block text-xs text-gray-600 mb-1">
                  Width (inches)
                </label>
                <input
                  id="width"
                  type="number"
                  step="0.1"
                  {...register('width')}
                  className="manufacturing-input"
                  placeholder="8"
                />
              </div>
              <div>
                <label htmlFor="height" className="block text-xs text-gray-600 mb-1">
                  Height (inches)
                </label>
                <input
                  id="height"
                  type="number"
                  step="0.1"
                  {...register('height')}
                  className="manufacturing-input"
                  placeholder="6"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full manufacturing-button large-touch-target"
          >
            {isLoading ? 'Calculating Rates...' : 'Calculate Shipping Rates'}
          </button>
        </form>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
          <ExclamationTriangleIcon className="h-5 w-5 text-red-600 mr-3 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-800">Error calculating rates</p>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Results */}
      {showResults && rates.length > 0 && (
        <div className="space-y-6">
          {isMockData && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Demo Mode:</strong> These are example rates. Connect your FedEx account for real-time pricing.
              </p>
            </div>
          )}

          <div className="freight-rate-card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Shipping Options</h3>
            <div className="space-y-4">
              {rates.map((rate, index) => (
                <div
                  key={`${rate.carrier}-${rate.serviceCode}`}
                  className={`p-4 rounded-lg border ${
                    index === 0 ? 'border-primary bg-primary/5' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <TruckIcon className={`h-8 w-8 ${index === 0 ? 'text-primary' : 'text-gray-400'}`} />
                      <div>
                        <p className="font-semibold text-gray-900">{rate.serviceName}</p>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <ClockIcon className="h-4 w-4" />
                          <span>{rate.transitTime}</span>
                          {rate.deliveryDate && (
                            <span className="text-gray-400">• {rate.deliveryDate}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">
                        ${rate.totalCharge.toFixed(2)}
                      </p>
                      {index === 0 && (
                        <p className="text-sm font-medium text-primary">Best Value</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center p-8 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Want to compare rates from multiple carriers?
            </h3>
            <p className="text-gray-600 mb-4">
              Join our waitlist to get access to UPS, USPS, DHL, and 20+ more carriers when we launch.
            </p>
            <a href="/" className="manufacturing-button-secondary">
              Join Waitlist for Multi-Carrier Access
            </a>
          </div>
        </div>
      )}
    </div>
  )
}