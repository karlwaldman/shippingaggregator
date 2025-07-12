import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { TruckIcon, CurrencyDollarIcon, ClockIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'

// Form validation schema
const freightCalculatorSchema = z.object({
  originZip: z.string().min(5, 'Origin ZIP code is required'),
  destinationZip: z.string().min(5, 'Destination ZIP code is required'),
  weight: z.number().min(150, 'Minimum weight for freight is 150 lbs'),
  length: z.number().min(1, 'Length is required'),
  width: z.number().min(1, 'Width is required'),
  height: z.number().min(1, 'Height is required'),
  freightClass: z.string().min(1, 'Freight class is required'),
  isHazmat: z.boolean(),
  needsLiftGate: z.boolean(),
  needsInsideDelivery: z.boolean(),
  needsAppointment: z.boolean(),
})

type FreightCalculatorForm = z.infer<typeof freightCalculatorSchema>

interface FreightRate {
  id: string
  carrier: string
  service: string
  totalCost: number
  baseCost: number
  fuelSurcharge: number
  accessorials: number
  transitDays: number
  deliveryDate: string
  savings: number
  savingsPercent: number
}

interface FreightCalculatorProps {
  className?: string
}

export function FreightCalculator({ className = '' }: FreightCalculatorProps) {
  const [isCalculating, setIsCalculating] = useState(false)
  const [rates, setRates] = useState<FreightRate[]>([])
  const [showEmailCapture, setShowEmailCapture] = useState(false)
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm<FreightCalculatorForm>({
    resolver: zodResolver(freightCalculatorSchema),
    defaultValues: {
      freightClass: '65',
      isHazmat: false,
      needsLiftGate: false,
      needsInsideDelivery: false,
      needsAppointment: false,
    }
  })

  const weight = watch('weight')
  const isFTL = weight >= 15000 // Recommend FTL for 15,000+ lbs

  const onSubmit = async (data: FreightCalculatorForm) => {
    setIsCalculating(true)
    try {
      // Mock rate calculation - will integrate with actual APIs later
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const mockRates = generateMockRates(data)
      setRates(mockRates)
      setShowEmailCapture(true)
    } catch (error) {
      console.error('Calculation error:', error)
    } finally {
      setIsCalculating(false)
    }
  }

  return (
    <div className={`max-w-4xl mx-auto ${className}`}>
      <div className="text-center mb-8">
        <h2 className="heading-lg mb-4">Manufacturing Freight Calculator</h2>
        <p className="body-lg text-gray-600">
          Get instant LTL & FTL rates from 20+ carriers. See how much your manufacturing company can save.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Calculator Form */}
        <div className="freight-rate-card">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="originZip" className="block text-sm font-medium text-gray-700 mb-1">
                  Origin ZIP Code
                </label>
                <input
                  id="originZip"
                  type="text"
                  {...register('originZip')}
                  className="manufacturing-input"
                  placeholder="44101"
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
                  placeholder="60601"
                />
                {errors.destinationZip && (
                  <p className="mt-1 text-sm text-destructive">{errors.destinationZip.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
                Weight (lbs)
              </label>
              <input
                id="weight"
                type="number"
                {...register('weight', { valueAsNumber: true })}
                className="manufacturing-input"
                placeholder="2500"
                min="150"
              />
              {errors.weight && (
                <p className="mt-1 text-sm text-destructive">{errors.weight.message}</p>
              )}
              {weight && weight < 150 && (
                <p className="mt-1 text-sm text-warning">
                  Minimum weight for freight is 150 lbs. For lighter shipments, consider parcel shipping.
                </p>
              )}
              {weight >= 15000 && (
                <p className="mt-1 text-sm text-success">
                  FTL recommended for shipments over 15,000 lbs for better rates.
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dimensions (L × W × H inches)
              </label>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="number"
                  {...register('length', { valueAsNumber: true })}
                  className="manufacturing-input"
                  placeholder="48"
                  aria-label="Length in inches"
                />
                <input
                  type="number"
                  {...register('width', { valueAsNumber: true })}
                  className="manufacturing-input"
                  placeholder="40"
                  aria-label="Width in inches"
                />
                <input
                  type="number"
                  {...register('height', { valueAsNumber: true })}
                  className="manufacturing-input"
                  placeholder="36"
                  aria-label="Height in inches"
                />
              </div>
            </div>

            <div>
              <label htmlFor="freightClass" className="block text-sm font-medium text-gray-700 mb-1">
                Freight Class (NMFC)
                <button type="button" className="ml-2 text-primary text-xs hover:underline">
                  Freight Class Help
                </button>
              </label>
              <select
                id="freightClass"
                {...register('freightClass')}
                className="manufacturing-input"
              >
                <option value="">Select freight class</option>
                <option value="50">Class 50 - Dense items (machinery, steel)</option>
                <option value="55">Class 55 - Heavy manufactured goods</option>
                <option value="60">Class 60 - Auto parts, appliances</option>
                <option value="65">Class 65 - Car accessories, bottled beverages</option>
                <option value="70">Class 70 - Food, automobiles, machinery</option>
                <option value="77.5">Class 77.5 - Tires, bathroom fixtures</option>
                <option value="85">Class 85 - Machinery, transmissions</option>
                <option value="92.5">Class 92.5 - Computers, monitors</option>
                <option value="100">Class 100 - Boat covers, wine cases</option>
                <option value="110">Class 110 - Cabinets, framed artwork</option>
                <option value="125">Class 125 - Small household appliances</option>
                <option value="150">Class 150 - Auto sheet metal parts</option>
              </select>
              {errors.freightClass && (
                <p className="mt-1 text-sm text-destructive">{errors.freightClass.message}</p>
              )}
            </div>

            {/* Accessorial Services */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Additional Services (Accessorials)
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    {...register('isHazmat')}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="ml-2 text-sm text-gray-700">Hazardous Materials (HAZMAT)</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    {...register('needsLiftGate')}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="ml-2 text-sm text-gray-700">Lift Gate Service</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    {...register('needsInsideDelivery')}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="ml-2 text-sm text-gray-700">Inside Delivery</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    {...register('needsAppointment')}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="ml-2 text-sm text-gray-700">Appointment Delivery</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={isCalculating}
              className="w-full manufacturing-button large-touch-target text-lg py-4"
            >
              {isCalculating ? 'Calculating Rates...' : 'Calculate Freight Rates'}
            </button>
          </form>

          {/* Manufacturing Examples */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Common Manufacturing Shipments:</h4>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Machinery: 2,500 lbs, Class 65, LTL</li>
              <li>• Raw materials: 15,000+ lbs, Class 55, FTL</li>
              <li>• Manufactured goods: 1,200 lbs, Class 70, LTL</li>
            </ul>
          </div>
        </div>

        {/* Results Section */}
        <div>
          {rates.length > 0 && (
            <RateResults rates={rates} weight={weight} isFTL={isFTL} />
          )}
          
          {showEmailCapture && (
            <EmailCaptureSection />
          )}
          
          {rates.length === 0 && !isCalculating && (
            <div className="freight-rate-card text-center">
              <TruckIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Get Your Freight Rates
              </h3>
              <p className="text-gray-600">
                Fill out the form to see instant rates from 20+ freight carriers and 
                discover how much your manufacturing company can save.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function RateResults({ rates, weight, isFTL }: { rates: FreightRate[], weight: number, isFTL: boolean }) {
  const totalSavings = rates.reduce((sum, rate) => sum + rate.savings, 0)
  const avgSavingsPercent = rates.reduce((sum, rate) => sum + rate.savingsPercent, 0) / rates.length

  return (
    <div className="space-y-4">
      {/* Savings Summary */}
      <div className="freight-rate-card recommended">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            You Could Save Up To
          </h3>
          <div className="savings-display">${Math.max(...rates.map(r => r.savings)).toFixed(2)}</div>
          <div className="percentage-savings">
            {Math.max(...rates.map(r => r.savingsPercent)).toFixed(1)}% savings vs. current rates
          </div>
        </div>
      </div>

      {/* Rate Cards */}
      <div className="space-y-3">
        {rates.map((rate, index) => (
          <div key={rate.id} className={`freight-rate-card ${index === 0 ? 'recommended' : ''}`}>
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="font-semibold text-gray-900">{rate.carrier}</h4>
                <p className="text-sm text-gray-600">{rate.service}</p>
              </div>
              {index === 0 && (
                <span className="savings-badge">Best Value</span>
              )}
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Total Cost:</span>
                <div className="freight-cost">${rate.totalCost.toFixed(2)}</div>
              </div>
              <div>
                <span className="text-gray-600">Transit Time:</span>
                <div className="font-semibold">{rate.transitDays} business days</div>
              </div>
              <div>
                <span className="text-gray-600">You Save:</span>
                <div className="freight-savings">${rate.savings.toFixed(2)}</div>
              </div>
            </div>
            
            {/* Cost Breakdown */}
            <details className="mt-3">
              <summary className="text-sm text-primary cursor-pointer hover:underline">
                View cost breakdown
              </summary>
              <div className="mt-2 text-xs text-gray-600 space-y-1">
                <div className="flex justify-between">
                  <span>Base Rate:</span>
                  <span>${rate.baseCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Fuel Surcharge:</span>
                  <span>${rate.fuelSurcharge.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Accessorials:</span>
                  <span>${rate.accessorials.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold border-t pt-1">
                  <span>Total:</span>
                  <span>${rate.totalCost.toFixed(2)}</span>
                </div>
              </div>
            </details>
          </div>
        ))}
      </div>

      {isFTL && (
        <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
          <div className="flex items-start">
            <ExclamationTriangleIcon className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <strong>FTL Recommended:</strong> For shipments over 15,000 lbs, Full Truckload (FTL) 
              typically offers better rates and faster transit times.
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function EmailCaptureSection() {
  return (
    <div className="mt-6 freight-rate-card">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">Get Detailed Analysis</h3>
      <p className="text-sm text-gray-600 mb-4">
        Enter your email to receive a detailed ROI report and annual savings analysis 
        customized for your manufacturing company.
      </p>
      
      <form className="space-y-3">
        <input
          type="email"
          placeholder="your.email@company.com"
          className="manufacturing-input"
          aria-label="Email address for detailed analysis"
          required
        />
        <button
          type="submit"
          className="w-full manufacturing-button"
        >
          Download ROI Report
        </button>
      </form>
      
      <p className="text-xs text-gray-500 mt-2">
        Includes annual savings analysis, carrier performance comparison, and implementation roadmap.
      </p>
    </div>
  )
}

function generateMockRates(data: FreightCalculatorForm): FreightRate[] {
  const baseRate = data.weight * 0.15 + Math.random() * 100
  const currentRate = baseRate * 1.25 // Assume they're overpaying by 25%
  
  return [
    {
      id: 'fedex-ltl-1',
      carrier: 'FedEx Freight',
      service: 'FedEx Freight Priority',
      totalCost: baseRate * 1.02,
      baseCost: baseRate * 0.85,
      fuelSurcharge: baseRate * 0.12,
      accessorials: baseRate * 0.05,
      transitDays: 2,
      deliveryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      savings: currentRate - (baseRate * 1.02),
      savingsPercent: ((currentRate - (baseRate * 1.02)) / currentRate) * 100,
    },
    {
      id: 'ups-ltl-1',
      carrier: 'UPS Freight',
      service: 'UPS Freight LTL',
      totalCost: baseRate * 1.08,
      baseCost: baseRate * 0.88,
      fuelSurcharge: baseRate * 0.15,
      accessorials: baseRate * 0.05,
      transitDays: 3,
      deliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      savings: currentRate - (baseRate * 1.08),
      savingsPercent: ((currentRate - (baseRate * 1.08)) / currentRate) * 100,
    },
    {
      id: 'xpo-ltl-1',
      carrier: 'XPO Logistics',
      service: 'XPO Direct',
      totalCost: baseRate * 1.05,
      baseCost: baseRate * 0.87,
      fuelSurcharge: baseRate * 0.13,
      accessorials: baseRate * 0.05,
      transitDays: 2,
      deliveryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      savings: currentRate - (baseRate * 1.05),
      savingsPercent: ((currentRate - (baseRate * 1.05)) / currentRate) * 100,
    },
  ].sort((a, b) => a.totalCost - b.totalCost)
}