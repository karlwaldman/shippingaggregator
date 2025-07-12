interface AddressValidationRequest {
  street: string
  city: string
  state: string
  zip: string
  country?: string
}

interface AddressValidationResult {
  isValid: boolean
  standardized?: {
    street: string
    city: string
    state: string
    zip: string
    country: string
  }
  suggestions?: string[]
  confidence?: 'HIGH' | 'MEDIUM' | 'LOW'
  deliverable?: boolean
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

export async function validateAddress(request: AddressValidationRequest): Promise<AddressValidationResult> {
  try {
    const token = await getAccessToken()
    const FEDEX_API_URL = process.env.FEDEX_API_URL || 'https://apis-sandbox.fedex.com'
    
    const validationRequest = {
      addressesToValidate: [{
        address: {
          streetLines: [request.street],
          city: request.city,
          stateOrProvinceCode: request.state,
          postalCode: request.zip,
          countryCode: request.country || 'US'
        }
      }]
    }

    const response = await fetch(`${FEDEX_API_URL}/address/v1/addresses/resolve`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'X-Customer-Transaction-Id': `shipnode-address-${Date.now()}`
      },
      body: JSON.stringify(validationRequest)
    })

    if (!response.ok) {
      throw new Error(`Address validation failed: ${response.status}`)
    }

    const data = await response.json()
    
    if (data.output?.resolvedAddresses?.[0]) {
      const resolved = data.output.resolvedAddresses[0]
      const address = resolved.address
      
      return {
        isValid: resolved.classification === 'BUSINESS' || resolved.classification === 'RESIDENTIAL',
        standardized: {
          street: address.streetLines?.[0] || request.street,
          city: address.city || request.city,
          state: address.stateOrProvinceCode || request.state,
          zip: address.postalCode || request.zip,
          country: address.countryCode || 'US'
        },
        confidence: resolved.classification ? 'HIGH' : 'MEDIUM',
        deliverable: resolved.deliverable !== false
      }
    }

    return {
      isValid: false,
      suggestions: ['Please check the address and try again']
    }
  } catch (error) {
    console.error('Address validation error:', error)
    throw error
  }
}

// Mock data for when API is unavailable
export function getMockAddressValidation(request: AddressValidationRequest): AddressValidationResult {
  // Simple validation for demo purposes
  const isValid = request.street.length > 5 && 
                  request.city.length > 2 && 
                  request.state.length === 2 && 
                  /^\d{5}(-\d{4})?$/.test(request.zip)

  if (isValid) {
    return {
      isValid: true,
      standardized: {
        street: request.street.toUpperCase(),
        city: request.city.toUpperCase(),
        state: request.state.toUpperCase(),
        zip: request.zip,
        country: 'US'
      },
      confidence: 'HIGH',
      deliverable: true
    }
  }

  return {
    isValid: false,
    suggestions: [
      'Check street address spelling',
      'Verify city and state combination',
      'Ensure ZIP code is 5 or 9 digits'
    ]
  }
}