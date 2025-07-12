import { z } from 'zod'

// FedEx API configuration
const FEDEX_API_URL = process.env.FEDEX_API_URL || 'https://apis-sandbox.fedex.com'
const FEDEX_API_KEY = process.env.FEDEX_API_KEY || ''
const FEDEX_SECRET_KEY = process.env.FEDEX_SECRET_KEY || ''

// Types for FedEx API
export interface FedExRateRequest {
  originZip: string
  destinationZip: string
  weight: number
  length?: number
  width?: number
  height?: number
  packageType?: 'YOUR_PACKAGING' | 'FEDEX_BOX' | 'FEDEX_TUBE'
  serviceType?: 'FEDEX_GROUND' | 'FEDEX_2_DAY' | 'FEDEX_2_DAY_AM' | 'FEDEX_EXPRESS_SAVER' | 'STANDARD_OVERNIGHT' | 'PRIORITY_OVERNIGHT' | 'FIRST_OVERNIGHT'
}

export interface FedExRate {
  carrier: 'FedEx'
  serviceName: string
  serviceCode: string
  totalCharge: number
  currency: string
  transitTime: string
  deliveryDate?: string
  deliveryDay?: string // "Thu, Jul 17"
  deliveryTime?: string // "by 8:00 AM"
  rateType?: 'ACCOUNT' | 'LIST' // Account-specific vs List rates
  businessDays?: number // 1, 2, 3 etc
}

// OAuth token management
let accessToken: string | null = null
let tokenExpiry: Date | null = null

async function getAccessToken(): Promise<string> {
  // Check if we have a valid token
  if (accessToken && tokenExpiry && tokenExpiry > new Date()) {
    return accessToken
  }

  // Get new token
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
    const error = await response.text()
    throw new Error(`FedEx OAuth failed: ${response.status} - ${error}`)
  }

  const data = await response.json()
  accessToken = data.access_token
  
  // Set expiry with 5 minute buffer
  tokenExpiry = new Date(Date.now() + (data.expires_in - 300) * 1000)
  
  return accessToken!
}

export async function getFedExRates(request: FedExRateRequest): Promise<FedExRate[]> {
  try {
    const token = await getAccessToken()
    
    // Build FedEx API request
    const rateRequest = {
      accountNumber: {
        value: "740561073" // Sandbox account number
      },
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
        serviceType: request.serviceType,
        packagingType: request.packageType || "YOUR_PACKAGING",
        rateRequestType: ["LIST", "PREFERRED"],
        requestedPackageLineItems: [{
          weight: {
            units: "LB",
            value: request.weight
          },
          dimensions: request.length && request.width && request.height ? {
            length: request.length,
            width: request.width,
            height: request.height,
            units: "IN"
          } : undefined
        }]
      }
    }

    const response = await fetch(`${FEDEX_API_URL}/rate/v1/rates/quotes`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'X-Customer-Transaction-Id': `shipnode-${Date.now()}`
      },
      body: JSON.stringify(rateRequest)
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('FedEx rate error:', error)
      throw new Error(`FedEx API error: ${response.status}`)
    }

    const data = await response.json()
    
    // Parse FedEx response
    const rates: FedExRate[] = []
    
    if (data.output?.rateReplyDetails) {
      for (const detail of data.output.rateReplyDetails) {
        const serviceType = detail.serviceType
        const serviceName = detail.serviceName || serviceType
        
        // Get the preferred rate
        const ratedShipmentDetails = detail.ratedShipmentDetails || []
        const preferredRate = ratedShipmentDetails.find((r: any) => r.shipmentRateDetail?.rateType === 'PREFERRED_ACCOUNT_SHIPMENT') 
          || ratedShipmentDetails[0]
        
        if (preferredRate?.totalNetCharge) {
          rates.push({
            carrier: 'FedEx',
            serviceName,
            serviceCode: serviceType,
            totalCharge: parseFloat(preferredRate.totalNetCharge),
            currency: preferredRate.currency || 'USD',
            transitTime: detail.commit?.dateDetail?.dayFormat || 'Contact carrier',
            deliveryDate: detail.commit?.dateDetail?.dayOfWeek
          })
        }
      }
    }
    
    return rates
  } catch (error) {
    console.error('FedEx rate request failed:', error)
    throw error
  }
}

// Mock data for when API is unavailable or in demo mode
export function getMockFedExRates(request: FedExRateRequest): FedExRate[] {
  // Calculate base rate more realistically based on weight and distance
  const baseWeight = Math.max(1, request.weight)
  const groundRate = Math.max(25, baseWeight * 3.5 + Math.random() * 5)
  
  // Calculate realistic delivery dates
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)
  const dayAfter = new Date(today)
  dayAfter.setDate(today.getDate() + 2)
  const threeDays = new Date(today)
  threeDays.setDate(today.getDate() + 3)
  const fiveDays = new Date(today)
  fiveDays.setDate(today.getDate() + 5)
  
  const formatDay = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
  }
  
  return [
    {
      carrier: 'FedEx',
      serviceName: 'FedEx First Overnight®',
      serviceCode: 'FIRST_OVERNIGHT',
      totalCharge: Math.round(groundRate * 5.8 * 100) / 100,
      currency: 'USD',
      transitTime: 'Next business day',
      deliveryDate: tomorrow.toISOString(),
      deliveryDay: formatDay(tomorrow),
      deliveryTime: 'by 8:00 AM',
      rateType: 'ACCOUNT',
      businessDays: 1
    },
    {
      carrier: 'FedEx',
      serviceName: 'FedEx Priority Overnight®',
      serviceCode: 'PRIORITY_OVERNIGHT',
      totalCharge: Math.round(groundRate * 3.4 * 100) / 100,
      currency: 'USD',
      transitTime: 'Next business day',
      deliveryDate: tomorrow.toISOString(),
      deliveryDay: formatDay(tomorrow),
      deliveryTime: 'by 10:30 AM',
      rateType: 'ACCOUNT',
      businessDays: 1
    },
    {
      carrier: 'FedEx',
      serviceName: 'FedEx Standard Overnight®',
      serviceCode: 'STANDARD_OVERNIGHT',
      totalCharge: Math.round(groundRate * 3.3 * 100) / 100,
      currency: 'USD',
      transitTime: 'Next business day',
      deliveryDate: tomorrow.toISOString(),
      deliveryDay: formatDay(tomorrow),
      deliveryTime: 'by 5:00 PM',
      rateType: 'ACCOUNT',
      businessDays: 1
    },
    {
      carrier: 'FedEx',
      serviceName: 'FedEx 2Day® AM',
      serviceCode: 'FEDEX_2_DAY_AM',
      totalCharge: Math.round(groundRate * 1.55 * 100) / 100,
      currency: 'USD',
      transitTime: '2 business days',
      deliveryDate: dayAfter.toISOString(),
      deliveryDay: formatDay(dayAfter),
      deliveryTime: 'by 10:30 AM',
      rateType: 'ACCOUNT',
      businessDays: 2
    },
    {
      carrier: 'FedEx',
      serviceName: 'FedEx 2Day®',
      serviceCode: 'FEDEX_2_DAY',
      totalCharge: Math.round(groundRate * 1.25 * 100) / 100,
      currency: 'USD',
      transitTime: '2 business days',
      deliveryDate: dayAfter.toISOString(),
      deliveryDay: formatDay(dayAfter),
      deliveryTime: 'by 5:00 PM',
      rateType: 'ACCOUNT',
      businessDays: 2
    },
    {
      carrier: 'FedEx',
      serviceName: 'FedEx Express Saver®',
      serviceCode: 'FEDEX_EXPRESS_SAVER',
      totalCharge: Math.round(groundRate * 1.04 * 100) / 100,
      currency: 'USD',
      transitTime: '3 business days',
      deliveryDate: threeDays.toISOString(),
      deliveryDay: formatDay(threeDays),
      deliveryTime: 'by 5:00 PM',
      rateType: 'ACCOUNT',
      businessDays: 3
    }
  ]
}