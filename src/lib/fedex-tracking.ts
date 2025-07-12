interface TrackingRequest {
  trackingNumber: string
  includeDetailedScans?: boolean
}

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

// Get OAuth token (reuse from existing fedex.ts)
async function getAccessToken(): Promise<string> {
  const FEDEX_API_URL = process.env.FEDEX_API_URL || 'https://apis-sandbox.fedex.com'
  const FEDEX_API_KEY = process.env.FEDEX_API_KEY || ''
  const FEDEX_SECRET_KEY = process.env.FEDEX_SECRET_KEY || ''

  const authUrl = `${FEDEX_API_URL}/oauth/token`
  
  const params = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: FEDEX_API_KEY,
    client_secret: FEDEX_SECRET_KEY
  })

  const response = await fetch(authUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: params.toString()
  })

  if (!response.ok) {
    throw new Error(`FedEx OAuth failed: ${response.status}`)
  }

  const data = await response.json()
  return data.access_token
}

export async function trackFedExPackage(request: TrackingRequest): Promise<TrackingResult> {
  try {
    const token = await getAccessToken()
    const FEDEX_API_URL = process.env.FEDEX_API_URL || 'https://apis-sandbox.fedex.com'
    
    const trackingRequest = {
      includeDetailedScans: request.includeDetailedScans || true,
      trackingInfo: [
        {
          trackingNumberInfo: {
            trackingNumber: request.trackingNumber
          }
        }
      ]
    }

    console.log('🔍 Tracking FedEx package:', request.trackingNumber)

    const response = await fetch(`${FEDEX_API_URL}/track/v1/trackingnumbers`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'X-Customer-Transaction-Id': `shipnode-track-${Date.now()}`
      },
      body: JSON.stringify(trackingRequest)
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('FedEx tracking error:', response.status, errorText)
      
      // If tracking number not found, return appropriate response
      if (response.status === 404) {
        return {
          trackingNumber: request.trackingNumber,
          status: 'UNKNOWN',
          statusDescription: 'Tracking number not found',
          events: [],
          isLive: true
        }
      }
      
      throw new Error(`FedEx tracking failed: ${response.status}`)
    }

    const data = await response.json()
    console.log('FedEx tracking response:', JSON.stringify(data, null, 2))
    
    if (data.output?.completeTrackResults?.[0]) {
      const trackResult = data.output.completeTrackResults[0]
      const trackingDetails = trackResult.trackResults?.[0]
      
      if (trackingDetails) {
        // Parse tracking events
        const events: TrackingEvent[] = []
        
        if (trackingDetails.scanEvents) {
          for (const scan of trackingDetails.scanEvents) {
            events.push({
              timestamp: scan.date || scan.timestamp,
              eventType: scan.eventType || 'SCAN',
              eventDescription: scan.eventDescription || scan.scanDescription,
              location: scan.scanLocation ? {
                city: scan.scanLocation.city,
                stateOrProvinceCode: scan.scanLocation.stateOrProvinceCode,
                countryCode: scan.scanLocation.countryCode
              } : undefined
            })
          }
        }
        
        // Determine status
        let status: TrackingResult['status'] = 'IN_TRANSIT'
        if (trackingDetails.latestStatusDetail?.code === 'DL') {
          status = 'DELIVERED'
        } else if (trackingDetails.latestStatusDetail?.code === 'PU') {
          status = 'PICKED_UP'
        } else if (trackingDetails.latestStatusDetail?.description?.includes('Exception')) {
          status = 'EXCEPTION'
        }
        
        return {
          trackingNumber: request.trackingNumber,
          status,
          statusDescription: trackingDetails.latestStatusDetail?.description || 'In Transit',
          estimatedDeliveryDate: trackingDetails.dateAndTimes?.find(d => d.type === 'ESTIMATED_DELIVERY')?.dateTime,
          actualDeliveryDate: trackingDetails.dateAndTimes?.find(d => d.type === 'ACTUAL_DELIVERY')?.dateTime,
          deliverySignedBy: trackingDetails.deliveryDetails?.deliveryAttempts?.[0]?.deliveryOptionEligibilityDetails?.signedBy,
          currentLocation: trackingDetails.scanEvents?.[0]?.scanLocation ? 
            `${trackingDetails.scanEvents[0].scanLocation.city}, ${trackingDetails.scanEvents[0].scanLocation.stateOrProvinceCode}` : undefined,
          events: events.reverse(), // Show most recent first
          isLive: true
        }
      }
    }
    
    // If no tracking details found
    return {
      trackingNumber: request.trackingNumber,
      status: 'UNKNOWN',
      statusDescription: 'No tracking information available',
      events: [],
      isLive: true
    }
    
  } catch (error) {
    console.error('FedEx tracking error:', error)
    throw error
  }
}

// Mock tracking data for development/testing
export function getMockFedExTracking(trackingNumber: string): TrackingResult {
  // Generate different scenarios based on tracking number pattern
  const lastDigit = parseInt(trackingNumber.slice(-1)) || 0
  
  const baseEvents: TrackingEvent[] = [
    {
      timestamp: '2025-07-10T09:30:00Z',
      eventType: 'PICKUP',
      eventDescription: 'Shipment picked up',
      location: { city: 'Indianapolis', stateOrProvinceCode: 'IN', countryCode: 'US' }
    },
    {
      timestamp: '2025-07-10T14:20:00Z', 
      eventType: 'DEPARTURE',
      eventDescription: 'Left FedEx origin facility',
      location: { city: 'Indianapolis', stateOrProvinceCode: 'IN', countryCode: 'US' }
    },
    {
      timestamp: '2025-07-11T03:45:00Z',
      eventType: 'ARRIVAL',
      eventDescription: 'Arrived at FedEx location',
      location: { city: 'Memphis', stateOrProvinceCode: 'TN', countryCode: 'US' }
    }
  ]
  
  // Different scenarios based on last digit
  if (lastDigit === 0) {
    // Delivered package
    return {
      trackingNumber,
      status: 'DELIVERED',
      statusDescription: 'Delivered',
      actualDeliveryDate: '2025-07-12T16:30:00Z',
      deliverySignedBy: 'J.SMITH',
      currentLocation: 'Los Angeles, CA',
      events: [
        ...baseEvents,
        {
          timestamp: '2025-07-12T08:15:00Z',
          eventType: 'ON_VEHICLE',
          eventDescription: 'On FedEx vehicle for delivery',
          location: { city: 'Los Angeles', stateOrProvinceCode: 'CA', countryCode: 'US' }
        },
        {
          timestamp: '2025-07-12T16:30:00Z',
          eventType: 'DELIVERY',
          eventDescription: 'Delivered - Signed for by: J.SMITH',
          location: { city: 'Los Angeles', stateOrProvinceCode: 'CA', countryCode: 'US' }
        }
      ],
      isLive: false
    }
  } else if (lastDigit === 1) {
    // Exception scenario
    return {
      trackingNumber,
      status: 'EXCEPTION',
      statusDescription: 'Delivery exception - Customer not available',
      estimatedDeliveryDate: '2025-07-13T17:00:00Z',
      currentLocation: 'Los Angeles, CA',
      events: [
        ...baseEvents,
        {
          timestamp: '2025-07-12T10:30:00Z',
          eventType: 'EXCEPTION',
          eventDescription: 'Customer not available or business closed',
          location: { city: 'Los Angeles', stateOrProvinceCode: 'CA', countryCode: 'US' }
        }
      ],
      isLive: false
    }
  } else {
    // In transit package
    return {
      trackingNumber,
      status: 'IN_TRANSIT',
      statusDescription: 'In transit',
      estimatedDeliveryDate: '2025-07-13T17:00:00Z',
      currentLocation: 'Memphis, TN',
      events: baseEvents,
      isLive: false
    }
  }
}