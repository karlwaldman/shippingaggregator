interface USPSCredentials {
  clientId: string
  clientSecret: string
  baseUrl: string
}

interface USPSTokenResponse {
  access_token: string
  token_type: string
  expires_in: number
  scope: string
}

interface USPSAddressRequest {
  streetAddress: string
  city: string
  state: string
  zipCode: string
  country?: string
}

interface USPSAddressResponse {
  address: {
    streetAddress: string
    city: string
    state: string
    zipCode: string
    zipPlus4?: string
  }
  addressAdditionalInfo?: {
    deliveryPoint?: string
    dpvConfirmation?: string
    business?: string
  }
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

// Token cache to avoid unnecessary OAuth calls
let tokenCache: {
  token: string
  expiresAt: number
} | null = null

async function getUSPSCredentials(): Promise<USPSCredentials> {
  const clientId = process.env.USPS_CLIENT_ID
  const clientSecret = process.env.USPS_CLIENT_SECRET
  const baseUrl = process.env.USPS_API_URL || 'https://apis-tem.usps.com' // Default to test environment
  
  if (!clientId || !clientSecret) {
    throw new Error('USPS credentials not configured. Please set USPS_CLIENT_ID and USPS_CLIENT_SECRET environment variables.')
  }
  
  return { clientId, clientSecret, baseUrl }
}

async function getAccessToken(): Promise<string> {
  // Check if we have a valid cached token
  if (tokenCache && tokenCache.expiresAt > Date.now()) {
    return tokenCache.token
  }
  
  const credentials = await getUSPSCredentials()
  
  const tokenRequest = {
    client_id: credentials.clientId,
    client_secret: credentials.clientSecret,
    grant_type: 'client_credentials'
  }
  
  console.log('🔐 Requesting USPS OAuth token...')
  
  const response = await fetch(`${credentials.baseUrl}/oauth2/v3/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(tokenRequest)
  })
  
  if (!response.ok) {
    const errorText = await response.text()
    console.error('USPS OAuth error:', response.status, errorText)
    throw new Error(`USPS OAuth failed: ${response.status} ${response.statusText}`)
  }
  
  const tokenData: USPSTokenResponse = await response.json()
  
  // Cache the token with a 5-minute buffer before expiration
  const expiresAt = Date.now() + ((tokenData.expires_in - 300) * 1000)
  tokenCache = {
    token: tokenData.access_token,
    expiresAt
  }
  
  console.log('✅ USPS OAuth token obtained successfully')
  return tokenData.access_token
}

export async function validateAddressUSPS(request: USPSAddressRequest): Promise<AddressValidationResult> {
  try {
    const token = await getAccessToken()
    const credentials = await getUSPSCredentials()
    
    // USPS API expects URL parameters, not JSON body
    const params = new URLSearchParams({
      streetAddress: request.streetAddress,
      city: request.city,
      state: request.state,
      ZIPCode: request.zipCode
    })
    
    if (request.country && request.country !== 'US') {
      params.append('country', request.country)
    }
    
    console.log('🌐 Validating address with USPS API:', {
      street: request.streetAddress,
      city: request.city,
      state: request.state,
      zip: request.zipCode
    })
    
    const response = await fetch(`${credentials.baseUrl}/addresses/v3/address?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('USPS address validation error:', response.status, errorText)
      
      // Handle specific error cases
      if (response.status === 404) {
        return {
          isValid: false,
          suggestions: [
            'Address not found in USPS database',
            'Please verify the address is correct',
            'Check spelling of street name and city'
          ],
          confidence: 'HIGH'
        }
      }
      
      throw new Error(`USPS address validation failed: ${response.status}`)
    }
    
    const data: USPSAddressResponse = await response.json()
    console.log('USPS API response:', JSON.stringify(data, null, 2))
    
    // Check if address was validated successfully
    const isValidated = data.address && 
                       data.address.streetAddress && 
                       data.address.city && 
                       data.address.state && 
                       data.address.zipCode
    
    // DPV Confirmation indicates deliverability
    const dpvConfirmed = data.addressAdditionalInfo?.dpvConfirmation === 'Y'
    
    if (isValidated && dpvConfirmed) {
      return {
        isValid: true,
        standardized: {
          street: data.address.streetAddress,
          city: data.address.city,
          state: data.address.state,
          zip: data.address.zipPlus4 || data.address.zipCode,
          country: 'US'
        },
        confidence: 'HIGH',
        deliverable: true
      }
    } else if (isValidated) {
      return {
        isValid: true,
        standardized: {
          street: data.address.streetAddress,
          city: data.address.city,
          state: data.address.state,
          zip: data.address.zipPlus4 || data.address.zipCode,
          country: 'US'
        },
        confidence: 'MEDIUM',
        deliverable: dpvConfirmed,
        suggestions: !dpvConfirmed ? [
          'Address is valid but may not be deliverable',
          'Please verify the address with the recipient'
        ] : undefined
      }
    }
    
    return {
      isValid: false,
      suggestions: [
        'Address could not be validated',
        'Please check the address format',
        'Ensure all required fields are complete'
      ],
      confidence: 'LOW'
    }
    
  } catch (error) {
    console.error('USPS address validation error:', error)
    
    // Return a fallback response instead of throwing
    return {
      isValid: false,
      suggestions: [
        'Address validation service temporarily unavailable',
        'Please try again later or verify address manually'
      ],
      confidence: 'LOW'
    }
  }
}

// Mock implementation for development/testing when credentials aren't available
export function getMockUSPSValidation(request: USPSAddressRequest): AddressValidationResult {
  const street = request.streetAddress.toLowerCase()
  const city = request.city.toLowerCase()
  const state = request.state.toUpperCase()
  const zip = request.zipCode
  
  // Check for obviously invalid patterns
  const invalidPatterns = [
    /fake|test|invalid|nowhere|example/i,
    /123.*fake/i,
    /000.*street/i
  ]
  
  const hasInvalidPattern = invalidPatterns.some(pattern => 
    pattern.test(street) || pattern.test(city)
  )
  
  // Known invalid states and zip codes
  const invalidStates = ['ZZ', 'XX', 'AA', '00']
  const invalidZips = ['00000', '99999']
  
  if (hasInvalidPattern || invalidStates.includes(state) || invalidZips.includes(zip)) {
    return {
      isValid: false,
      suggestions: [
        'Address appears to contain invalid data',
        'Please enter a real US address',
        'Check spelling and format'
      ],
      confidence: 'HIGH'
    }
  }
  
  // Mock some known valid addresses
  const knownValidAddresses = [
    { street: '1600 pennsylvania', city: 'washington', state: 'DC', zip: '20500' },
    { street: '1 infinite loop', city: 'cupertino', state: 'CA', zip: '95014' },
    { street: '350 fifth avenue', city: 'new york', state: 'NY', zip: '10118' }
  ]
  
  const isKnownValid = knownValidAddresses.some(addr => 
    street.includes(addr.street.split(' ')[1]) && // Check key street word
    city.includes(addr.city) &&
    state === addr.state
  )
  
  if (isKnownValid) {
    return {
      isValid: true,
      standardized: {
        street: request.streetAddress.toUpperCase(),
        city: request.city.toUpperCase(),
        state: state,
        zip: request.zipCode,
        country: 'US'
      },
      confidence: 'HIGH',
      deliverable: true
    }
  }
  
  // Basic format validation
  const hasBasicFormat = request.streetAddress.length > 3 && 
                        request.city.length > 1 && 
                        request.state.length === 2 && 
                        /^\d{5}(-\d{4})?$/.test(request.zipCode)
  
  if (hasBasicFormat) {
    return {
      isValid: true,
      standardized: {
        street: request.streetAddress.replace(/\b\w/g, l => l.toUpperCase()),
        city: request.city.replace(/\b\w/g, l => l.toUpperCase()),
        state: state,
        zip: request.zipCode,
        country: 'US'
      },
      confidence: 'MEDIUM',
      deliverable: true
    }
  }
  
  return {
    isValid: false,
    suggestions: [
      'Check street address spelling',
      'Verify city and state combination',
      'Ensure ZIP code matches the city/state'
    ],
    confidence: 'LOW'
  }
}