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
  serviceType?: 'FEDEX_GROUND' | 'FEDEX_2_DAY' | 'FEDEX_EXPRESS_SAVER' | 'STANDARD_OVERNIGHT' | 'PRIORITY_OVERNIGHT'
}

export interface FedExRate {
  carrier: 'FedEx'
  serviceName: string
  serviceCode: string
  totalCharge: number
  currency: string
  transitTime: string
  deliveryDate?: string
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
  const baseRate = Math.max(20, request.weight * 1.5)
  
  return [
    {
      carrier: 'FedEx',
      serviceName: 'FedEx Ground',
      serviceCode: 'FEDEX_GROUND',
      totalCharge: baseRate,
      currency: 'USD',
      transitTime: '3-5 business days'
    },
    {
      carrier: 'FedEx',
      serviceName: 'FedEx 2Day',
      serviceCode: 'FEDEX_2_DAY',
      totalCharge: baseRate * 1.5,
      currency: 'USD',
      transitTime: '2 business days'
    },
    {
      carrier: 'FedEx',
      serviceName: 'FedEx Standard Overnight',
      serviceCode: 'STANDARD_OVERNIGHT',
      totalCharge: baseRate * 2.2,
      currency: 'USD',
      transitTime: 'Next business day by 3pm'
    }
  ]
}