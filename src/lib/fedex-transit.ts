interface TransitTimeRequest {
  originZip: string
  destinationZip: string
  shipDate?: string // ISO date string, defaults to tomorrow
}

interface TransitTimeService {
  serviceType: string
  serviceName: string
  deliveryDate: string
  deliveryDay: string // "Thu, Jul 17"
  deliveryTime?: string // "by 8:00 AM"
  businessDays: number
  available: boolean
  cutoffTime?: string // "3:00 PM"
  specialInstructions?: string[]
}

interface TransitTimeResult {
  origin: string
  destination: string
  shipDate: string
  services: TransitTimeService[]
  isLive: boolean
  notes?: string[]
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

export async function getFedExTransitTimes(request: TransitTimeRequest): Promise<TransitTimeResult> {
  try {
    const token = await getAccessToken()
    const FEDEX_API_URL = process.env.FEDEX_API_URL || 'https://apis-sandbox.fedex.com'
    
    // Default to tomorrow if no ship date provided
    const shipDate = request.shipDate || (() => {
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      return tomorrow.toISOString().split('T')[0]
    })()
    
    const transitRequest = {
      requestedShipment: {
        shipper: {
          address: {
            postalCode: request.originZip,
            countryCode: "US"
          }
        },
        recipient: {
          address: {
            postalCode: request.destinationZip,
            countryCode: "US"
          }
        },
        pickupType: "DROPOFF_AT_FEDEX_LOCATION",
        shipDateStamp: shipDate
      }
    }

    console.log('🕒 Getting FedEx transit times for:', {
      origin: request.originZip,
      destination: request.destinationZip,
      shipDate
    })

    const response = await fetch(`${FEDEX_API_URL}/availability/v1/transittimes`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'X-Customer-Transaction-Id': `shipnode-transit-${Date.now()}`
      },
      body: JSON.stringify(transitRequest)
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('FedEx transit time error:', response.status, errorText)
      throw new Error(`FedEx transit time API failed: ${response.status}`)
    }

    const data = await response.json()
    console.log('FedEx transit time response:', JSON.stringify(data, null, 2))
    
    const services: TransitTimeService[] = []
    
    if (data.output?.transitTimes) {
      for (const transitTime of data.output.transitTimes) {
        const serviceType = transitTime.serviceType
        const serviceName = transitTime.serviceName || serviceType
        
        // Parse delivery information
        const deliveryDate = transitTime.commit?.dateDetail?.dayFormat
        const deliveryTime = transitTime.commit?.timeDetail?.timeFormat
        const businessDays = transitTime.commit?.dateDetail?.businessDays
        
        services.push({
          serviceType,
          serviceName,
          deliveryDate: deliveryDate || 'Contact carrier',
          deliveryDay: deliveryDate ? new Date(deliveryDate).toLocaleDateString('en-US', { 
            weekday: 'short', month: 'short', day: 'numeric' 
          }) : 'TBD',
          deliveryTime: deliveryTime ? `by ${deliveryTime}` : undefined,
          businessDays: businessDays || 0,
          available: true,
          cutoffTime: transitTime.commit?.timeDetail?.cutOffTime,
          specialInstructions: transitTime.notes || []
        })
      }
    }
    
    return {
      origin: request.originZip,
      destination: request.destinationZip,
      shipDate,
      services: services.sort((a, b) => a.businessDays - b.businessDays),
      isLive: true,
      notes: data.output?.notes || []
    }
    
  } catch (error) {
    console.error('FedEx transit time error:', error)
    throw error
  }
}

// Mock transit times for development/testing
export function getMockFedExTransitTimes(request: TransitTimeRequest): TransitTimeResult {
  const shipDate = request.shipDate || (() => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split('T')[0]
  })()
  
  const baseDate = new Date(shipDate)
  
  const addBusinessDays = (date: Date, days: number): Date => {
    const result = new Date(date)
    let addedDays = 0
    while (addedDays < days) {
      result.setDate(result.getDate() + 1)
      // Skip weekends
      if (result.getDay() !== 0 && result.getDay() !== 6) {
        addedDays++
      }
    }
    return result
  }
  
  const formatDay = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
  }
  
  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0]
  }
  
  // Generate realistic transit times based on ZIP code distance
  const origin = parseInt(request.originZip.substring(0, 3))
  const destination = parseInt(request.destinationZip.substring(0, 3))
  const distance = Math.abs(origin - destination)
  
  // Adjust availability based on distance
  const isLongDistance = distance > 500
  const nextDay = addBusinessDays(baseDate, 1)
  const twoDays = addBusinessDays(baseDate, 2)
  const threeDays = addBusinessDays(baseDate, 3)
  
  const services: TransitTimeService[] = [
    {
      serviceType: 'FIRST_OVERNIGHT',
      serviceName: 'FedEx First Overnight®',
      deliveryDate: formatDate(nextDay),
      deliveryDay: formatDay(nextDay),
      deliveryTime: 'by 8:00 AM',
      businessDays: 1,
      available: !isLongDistance, // Not available for very long distances
      cutoffTime: '3:00 PM',
      specialInstructions: isLongDistance ? ['Not available for this route'] : []
    },
    {
      serviceType: 'PRIORITY_OVERNIGHT',
      serviceName: 'FedEx Priority Overnight®',
      deliveryDate: formatDate(nextDay),
      deliveryDay: formatDay(nextDay),
      deliveryTime: 'by 10:30 AM',
      businessDays: 1,
      available: true,
      cutoffTime: '5:00 PM'
    },
    {
      serviceType: 'STANDARD_OVERNIGHT',
      serviceName: 'FedEx Standard Overnight®',
      deliveryDate: formatDate(nextDay),
      deliveryDay: formatDay(nextDay),
      deliveryTime: 'by 5:00 PM',
      businessDays: 1,
      available: true,
      cutoffTime: '8:00 PM'
    },
    {
      serviceType: 'FEDEX_2_DAY_AM',
      serviceName: 'FedEx 2Day® AM',
      deliveryDate: formatDate(twoDays),
      deliveryDay: formatDay(twoDays),
      deliveryTime: 'by 10:30 AM',
      businessDays: 2,
      available: true,
      cutoffTime: '8:00 PM'
    },
    {
      serviceType: 'FEDEX_2_DAY',
      serviceName: 'FedEx 2Day®',
      deliveryDate: formatDate(twoDays),
      deliveryDay: formatDay(twoDays),
      deliveryTime: 'by 5:00 PM',
      businessDays: 2,
      available: true,
      cutoffTime: '8:00 PM'
    },
    {
      serviceType: 'FEDEX_EXPRESS_SAVER',
      serviceName: 'FedEx Express Saver®',
      deliveryDate: formatDate(threeDays),
      deliveryDay: formatDay(threeDays),
      deliveryTime: 'by 5:00 PM',
      businessDays: 3,
      available: true,
      cutoffTime: '8:00 PM'
    }
  ]
  
  return {
    origin: request.originZip,
    destination: request.destinationZip,
    shipDate,
    services: services.filter(s => s.available),
    isLive: false,
    notes: [
      'Transit times are estimates and not guaranteed',
      'Cutoff times are local to pickup location',
      isLongDistance ? 'Some overnight services may not be available for long distances' : ''
    ].filter(Boolean)
  }
}