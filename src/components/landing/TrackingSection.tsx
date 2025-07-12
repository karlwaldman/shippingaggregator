import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { 
  MagnifyingGlassIcon, 
  TruckIcon, 
  ClockIcon, 
  MapPinIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'

const trackingSchema = z.object({
  trackingNumber: z.string().min(1, 'Tracking number is required').max(30, 'Invalid tracking number')
})

type TrackingForm = z.infer<typeof trackingSchema>

interface TrackingEvent {
  timestamp: string
  eventType: string
  eventDescription: string
  location?: {
    city: string
    stateOrProvinceCode: string
    countryCode: string
  }
}

interface TrackingResult {
  trackingNumber: string
  status: 'DELIVERED' | 'IN_TRANSIT' | 'PICKED_UP' | 'EXCEPTION' | 'UNKNOWN'
  statusDescription: string
  estimatedDeliveryDate?: string
  actualDeliveryDate?: string
  deliverySignedBy?: string
  currentLocation?: string
  events: TrackingEvent[]
  isLive: boolean
}

export function TrackingSection() {
  const [result, setResult] = useState<TrackingResult | null>(null)
  const [isTracking, setIsTracking] = useState(false)
  const [isMockData, setIsMockData] = useState(false)

  const { register, handleSubmit, formState: { errors }, reset } = useForm<TrackingForm>({
    resolver: zodResolver(trackingSchema),
    defaultValues: {
      trackingNumber: ''
    }
  })

  const onSubmit = async (data: TrackingForm) => {
    setIsTracking(true)
    setResult(null)

    try {
      const response = await fetch('/api/track/fedex', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      const apiResult = await response.json()

      if (apiResult.success) {
        setResult(apiResult.tracking)
        setIsMockData(apiResult.isMockData)
      } else {
        setResult({
          trackingNumber: data.trackingNumber,
          status: 'UNKNOWN',
          statusDescription: apiResult.error || 'Failed to track package',
          events: [],
          isLive: false
        })
      }
    } catch (error) {
      setResult({
        trackingNumber: data.trackingNumber,
        status: 'UNKNOWN', 
        statusDescription: 'Unable to connect to tracking service. Please try again.',
        events: [],
        isLive: false
      })
    } finally {
      setIsTracking(false)
    }
  }

  const tryExampleTracking = () => {
    reset({ trackingNumber: '1234567890' })
    setResult(null)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return <CheckCircleIcon className="h-6 w-6 text-green-600" />
      case 'EXCEPTION':
        return <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
      case 'IN_TRANSIT':
      case 'PICKED_UP':
        return <TruckIcon className="h-6 w-6 text-blue-600" />
      default:
        return <ClockIcon className="h-6 w-6 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return 'bg-green-50 border-green-200 text-green-800'
      case 'EXCEPTION':
        return 'bg-red-50 border-red-200 text-red-800'
      case 'IN_TRANSIT':
      case 'PICKED_UP':
        return 'bg-blue-50 border-blue-200 text-blue-800'
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800'
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return null
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short', 
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
      })
    } catch {
      return dateString
    }
  }

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200">
              <SparklesIcon className="h-4 w-4" />
              NEW: Live FedEx Tracking
            </span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Track Any FedEx Package Instantly
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Demo tracking functionality using FedEx sandbox API. In production, this would 
            track real packages with live delivery status, scan events, and confirmations.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Tracking Input */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <MagnifyingGlassIcon className="h-6 w-6 text-blue-600" />
                Track Your Package
              </h3>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label htmlFor="trackingNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    FedEx Tracking Number
                  </label>
                  <input
                    id="trackingNumber"
                    type="text"
                    {...register('trackingNumber')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter tracking number..."
                  />
                  {errors.trackingNumber && (
                    <p className="mt-1 text-sm text-red-600">{errors.trackingNumber.message}</p>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={isTracking}
                    className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                    {isTracking ? 'Tracking...' : 'Track Package'}
                  </button>
                  <button
                    type="button"
                    onClick={tryExampleTracking}
                    className="px-4 py-3 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Try Example
                  </button>
                </div>
              </form>

              {/* SEO-focused features list */}
              <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Tracking Features</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Real-time delivery status updates</li>
                  <li>• Detailed scan events and locations</li>
                  <li>• Estimated and actual delivery dates</li>
                  <li>• Delivery confirmation with signatures</li>
                  <li>• Exception handling and notifications</li>
                </ul>
              </div>
            </div>

            {/* Tracking Results */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Tracking Results</h3>
              
              {!result && (
                <div className="text-center py-12 text-gray-500">
                  <TruckIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Enter a tracking number to see live results</p>
                </div>
              )}

              {result && (
                <div className="space-y-6">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Sandbox Demo:</strong> {isMockData ? 'Using sample data for demo.' : 'FedEx test API returns test tracking data, not real package info.'} 
                      Production API would track real packages.
                    </p>
                  </div>

                  {/* Status Overview */}
                  <div className={`p-4 rounded-lg border ${getStatusColor(result.status)}`}>
                    <div className="flex items-start gap-4">
                      {getStatusIcon(result.status)}
                      <div className="flex-1">
                        <p className="font-semibold text-lg">{result.statusDescription}</p>
                        <p className="text-sm opacity-80">Tracking: {result.trackingNumber}</p>
                        
                        {result.currentLocation && (
                          <p className="text-sm mt-1">
                            <MapPinIcon className="h-4 w-4 inline mr-1" />
                            Current location: {result.currentLocation}
                          </p>
                        )}
                        
                        {result.estimatedDeliveryDate && (
                          <p className="text-sm mt-1">
                            <ClockIcon className="h-4 w-4 inline mr-1" />
                            Estimated delivery: {formatDate(result.estimatedDeliveryDate)}
                          </p>
                        )}
                        
                        {result.deliverySignedBy && (
                          <p className="text-sm mt-1">
                            <CheckCircleIcon className="h-4 w-4 inline mr-1" />
                            Signed by: {result.deliverySignedBy}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Tracking Events */}
                  {result.events.length > 0 && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-3">Tracking Events</h4>
                      <div className="space-y-3 max-h-40 overflow-y-auto">
                        {result.events.slice(0, 5).map((event, index) => (
                          <div key={index} className="flex gap-3 text-sm">
                            <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{event.eventDescription}</p>
                              <p className="text-gray-600">
                                {formatDate(event.timestamp)}
                                {event.location && (
                                  <span className="ml-2">
                                    • {event.location.city}, {event.location.stateOrProvinceCode}
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-6">
              Need package tracking integrated into your shipping workflow?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/fedex-progress" className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                View All FedEx Features
                <SparklesIcon className="h-4 w-4" />
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