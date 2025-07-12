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
    
    console.log('FedEx API response:', JSON.stringify(data, null, 2))
    
    if (data.output?.resolvedAddresses?.[0]) {
      const resolved = data.output.resolvedAddresses[0]
      const address = resolved.address
      
      // Check if address was actually resolved/validated
      const isValidAddress = resolved.classification && 
                           (resolved.classification === 'BUSINESS' || 
                            resolved.classification === 'RESIDENTIAL' ||
                            resolved.classification === 'MIXED')
      
      return {
        isValid: isValidAddress,
        standardized: isValidAddress ? {
          street: address.streetLines?.[0] || request.street,
          city: address.city || request.city,
          state: address.stateOrProvinceCode || request.state,
          zip: address.postalCode || request.zip,
          country: address.countryCode || 'US'
        } : undefined,
        confidence: resolved.classification ? 'HIGH' : 'LOW',
        deliverable: resolved.deliverable !== false,
        suggestions: !isValidAddress ? [
          'Address could not be verified',
          'Please check spelling and format',
          'Ensure all required fields are complete'
        ] : undefined
      }
    }

    // Check for errors in response
    if (data.errors && data.errors.length > 0) {
      const errorMessages = data.errors.map((err: any) => err.message || 'Unknown error')
      return {
        isValid: false,
        suggestions: errorMessages
      }
    }

    return {
      isValid: false,
      suggestions: ['Address could not be validated', 'Please verify the address and try again']
    }
  } catch (error) {
    console.error('Address validation error:', error)
    throw error
  }
}

// Mock data for when API is unavailable
export function getMockAddressValidation(request: AddressValidationRequest): AddressValidationResult {
  const street = request.street.toLowerCase()
  const city = request.city.toLowerCase()
  const state = request.state.toUpperCase()
  const zip = request.zip

  // Check for obviously invalid patterns
  const invalidPatterns = [
    /fake|test|invalid|nowhere|example/i,
    /123.*fake/i,
    /000.*street/i
  ]
  
  const invalidStates = ['ZZ', 'XX', 'AA', '00']
  const invalidZips = ['00000', '99999', '12345'] // Common test zips

  // Check for invalid patterns
  const hasInvalidPattern = invalidPatterns.some(pattern => 
    pattern.test(street) || pattern.test(city)
  )
  
  const hasInvalidState = invalidStates.includes(state)
  const hasInvalidZip = invalidZips.includes(zip) || !/^\d{5}(-\d{4})?$/.test(zip)
  
  // Known valid test addresses for demo
  const knownValidAddresses = [
    { street: '123 main st', city: 'indianapolis', state: 'IN', zip: '46201' },
    { street: '1600 pennsylvania ave', city: 'washington', state: 'DC', zip: '20500' },
    { street: '1 infinite loop', city: 'cupertino', state: 'CA', zip: '95014' }
  ]
  
  const isKnownValid = knownValidAddresses.some(addr => 
    street.includes(addr.street.split(' ')[1]) && // Check for "main", "pennsylvania", "infinite"
    city.includes(addr.city) &&
    state === addr.state
  )

  // Basic format validation
  const hasBasicFormat = request.street.length > 3 && 
                        request.city.length > 1 && 
                        request.state.length === 2 && 
                        /^\d{5}(-\d{4})?$/.test(request.zip)

  if (hasInvalidPattern || hasInvalidState || hasInvalidZip) {
    return {
      isValid: false,
      suggestions: [
        hasInvalidPattern ? 'Address appears to contain test/invalid data' : '',
        hasInvalidState ? 'Invalid state code - use 2-letter postal abbreviation' : '',
        hasInvalidZip ? 'Invalid ZIP code format or known test ZIP' : '',
        'Please enter a real US address'
      ].filter(Boolean)
    }
  }

  if (isKnownValid || (hasBasicFormat && !hasInvalidPattern)) {
    return {
      isValid: true,
      standardized: {
        street: request.street.replace(/\b\w/g, l => l.toUpperCase()), // Title case
        city: request.city.replace(/\b\w/g, l => l.toUpperCase()),
        state: state,
        zip: request.zip,
        country: 'US'
      },
      confidence: isKnownValid ? 'HIGH' : 'MEDIUM',
      deliverable: true
    }
  }

  return {
    isValid: false,
    suggestions: [
      'Check street address spelling',
      'Verify city and state combination', 
      'Ensure ZIP code matches the city/state'
    ]
  }
}