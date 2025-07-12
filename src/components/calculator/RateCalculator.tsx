import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { 
  TruckIcon, 
  ClockIcon, 
  CurrencyDollarIcon,
  CalendarDaysIcon,
  InformationCircleIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'

const calculatorSchema = z.object({
  originZip: z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code'),
  destinationZip: z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code'),
  weight: z.number().min(0.1, 'Weight must be at least 0.1 lbs').max(150, 'Maximum weight is 150 lbs'),
  length: z.number().min(1, 'Length must be at least 1 inch').max(119, 'Maximum length is 119 inches').optional(),
  width: z.number().min(1, 'Width must be at least 1 inch').max(119, 'Maximum width is 119 inches').optional(),
  height: z.number().min(1, 'Height must be at least 1 inch').max(119, 'Maximum height is 119 inches').optional(),
  packageType: z.enum(['YOUR_PACKAGING', 'FEDEX_BOX', 'FEDEX_TUBE']).optional()
})

type CalculatorForm = z.infer<typeof calculatorSchema>

interface FedExRate {
  carrier: 'FedEx'
  serviceName: string
  serviceCode: string
  totalCharge: number
  currency: string
  transitTime: string
  deliveryDate?: string
  deliveryDay?: string
  deliveryTime?: string
  rateType?: 'ACCOUNT' | 'LIST'
  businessDays?: number
}

export function RateCalculator() {
  const [rates, setRates] = useState<FedExRate[]>([])
  const [isCalculating, setIsCalculating] = useState(false)
  const [isMockData, setIsMockData] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors }, reset } = useForm<CalculatorForm>({
    resolver: zodResolver(calculatorSchema),
    defaultValues: {
      originZip: '46201',
      destinationZip: '90210',
      weight: 10,
      length: 12,
      width: 8,
      height: 6,
      packageType: 'YOUR_PACKAGING'
    }
  })

  const onSubmit = async (data: CalculatorForm) => {
    setIsCalculating(true)
    setError(null)
    setRates([])

    try {
      const response = await fetch('/api/rates/fedex', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      const apiResult = await response.json()

      if (apiResult.success) {
        setRates(apiResult.rates)
        setIsMockData(apiResult.isMockData)
      } else {
        setError(apiResult.error || 'Failed to calculate rates')
      }
    } catch (error) {
      setError('Unable to connect to rate calculation service. Please try again.')
    } finally {
      setIsCalculating(false)
    }
  }

  const loadExampleData = () => {
    reset({
      originZip: '44101',
      destinationZip: '02021',
      weight: 10,
      length: 12,
      width: 8,
      height: 6,
      packageType: 'YOUR_PACKAGING'
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const getServiceIcon = (serviceCode: string) => {
    if (serviceCode.includes('OVERNIGHT') || serviceCode.includes('FIRST')) {
      return '⚡'
    } else if (serviceCode.includes('2_DAY')) {
      return '🚚'
    } else if (serviceCode.includes('EXPRESS_SAVER')) {
      return '💰'
    }
    return '📦'
  }

  const getPriorityLevel = (businessDays?: number) => {
    if (!businessDays) return 'standard'
    if (businessDays === 1) return 'urgent'
    if (businessDays === 2) return 'express'
    return 'standard'
  }

  const getPriorityColor = (level: string) => {
    switch (level) {
      case 'urgent': return 'border-red-200 bg-red-50'
      case 'express': return 'border-blue-200 bg-blue-50'
      default: return 'border-green-200 bg-green-50'
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          FedEx Shipping Rate Calculator
        </h1>
        <p className="text-lg text-gray-600">
          Get instant FedEx shipping rates with delivery dates and times
        </p>
        {isMockData && rates.length > 0 && (
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-lg text-sm">
            <InformationCircleIcon className="h-4 w-4" />
            Demo using enhanced mock data. Live API would show real account-specific rates.
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Rate Calculator Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Calculate Shipping Rates
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* ZIP Codes */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="originZip" className="block text-sm font-medium text-gray-700 mb-1">
                  From ZIP Code
                </label>
                <input
                  id="originZip"
                  type="text"
                  {...register('originZip')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="46201"
                />
                {errors.originZip && (
                  <p className="mt-1 text-sm text-red-600">{errors.originZip.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="destinationZip" className="block text-sm font-medium text-gray-700 mb-1">
                  To ZIP Code
                </label>
                <input
                  id="destinationZip"
                  type="text"
                  {...register('destinationZip')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="90210"
                />
                {errors.destinationZip && (
                  <p className="mt-1 text-sm text-red-600">{errors.destinationZip.message}</p>
                )}
              </div>
            </div>

            {/* Package Details */}
            <div>
              <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
                Weight (lbs)
              </label>
              <input
                id="weight"
                type="number"
                step="0.1"
                {...register('weight', { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="10"
              />
              {errors.weight && (
                <p className="mt-1 text-sm text-red-600">{errors.weight.message}</p>
              )}
            </div>

            {/* Dimensions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Dimensions (inches) - Optional
              </label>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <input
                    type="number"
                    {...register('length', { valueAsNumber: true })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Length"
                  />
                  {errors.length && (
                    <p className="mt-1 text-xs text-red-600">{errors.length.message}</p>
                  )}
                </div>
                <div>
                  <input
                    type="number"
                    {...register('width', { valueAsNumber: true })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Width"
                  />
                  {errors.width && (
                    <p className="mt-1 text-xs text-red-600">{errors.width.message}</p>
                  )}
                </div>
                <div>
                  <input
                    type="number"
                    {...register('height', { valueAsNumber: true })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Height"
                  />
                  {errors.height && (
                    <p className="mt-1 text-xs text-red-600">{errors.height.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Package Type */}
            <div>
              <label htmlFor="packageType" className="block text-sm font-medium text-gray-700 mb-1">
                Package Type
              </label>
              <select
                id="packageType"
                {...register('packageType')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="YOUR_PACKAGING">Your Packaging</option>
                <option value="FEDEX_BOX">FedEx Box</option>
                <option value="FEDEX_TUBE">FedEx Tube</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isCalculating}
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {isCalculating ? 'Calculating...' : 'Calculate Rates'}
              </button>
              <button
                type="button"
                onClick={loadExampleData}
                className="px-4 py-3 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Load Example
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
        </div>

        {/* Rate Results */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            FedEx Shipping Options
          </h2>

          {rates.length === 0 && !isCalculating && (
            <div className="text-center py-12 text-gray-500">
              <TruckIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Enter package details to see shipping rates</p>
            </div>
          )}

          {isCalculating && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Calculating rates...</p>
            </div>
          )}

          {rates.length > 0 && (
            <div className="space-y-4">
              {rates.map((rate, index) => {
                const priority = getPriorityLevel(rate.businessDays)
                return (
                  <div key={index} className={`border rounded-lg p-4 ${getPriorityColor(priority)}`}>
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{getServiceIcon(rate.serviceCode)}</span>
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg">
                            {rate.serviceName}
                          </h3>
                          {rate.deliveryDay && (
                            <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                              <CalendarDaysIcon className="h-4 w-4" />
                              <span>Arrives {rate.deliveryDay}</span>
                              {rate.deliveryTime && (
                                <span className="text-gray-500">• {rate.deliveryTime}</span>
                              )}
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                            <ClockIcon className="h-4 w-4" />
                            <span>{rate.transitTime}</span>
                            {rate.rateType && (
                              <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs font-medium ml-2">
                                {rate.rateType === 'ACCOUNT' ? 'Account Rate' : 'List Rate'}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">
                          {formatCurrency(rate.totalCharge)}
                        </div>
                        {rate.businessDays && (
                          <div className="text-sm text-gray-500">
                            {rate.businessDays} business day{rate.businessDays > 1 ? 's' : ''}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {rates.length > 0 && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-start gap-2">
                <InformationCircleIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                <div className="text-sm text-gray-600">
                  <p className="font-medium mb-1">Important Notes:</p>
                  <ul className="space-y-1 text-xs">
                    <li>• Rates shown may be different than actual charges</li>
                    <li>• Delivery dates are estimates and not guaranteed</li>
                    <li>• Cutoff times apply for same-day pickup</li>
                    <li>• Additional fees may apply for residential delivery</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Call to Action */}
      {rates.length > 0 && (
        <div className="mt-8 text-center">
          <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-6 border border-blue-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Ready to ship with these rates?
            </h3>
            <p className="text-gray-600 mb-4">
              Join our waitlist to get early access to label generation, tracking, and more carriers.
            </p>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors">
              Join Waitlist
            </button>
          </div>
        </div>
      )}
    </div>
  )
}