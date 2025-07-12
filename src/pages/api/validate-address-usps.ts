import type { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'
import { validateAddressUSPS, getMockUSPSValidation } from '@/lib/usps'
import { logEvent } from '@/lib/analytics'

// Request validation schema
const addressSchema = z.object({
  streetAddress: z.string().min(1, 'Street address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().regex(/^[A-Z]{2}$/, 'State must be 2 characters'),
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, 'ZIP code must be 5 or 9 digits'),
  country: z.string().optional().default('US')
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Validate request
    const validatedData = addressSchema.parse(req.body)
    
    // Check if we have USPS API credentials
    const hasCredentials = process.env.USPS_CLIENT_ID && process.env.USPS_CLIENT_SECRET
    
    if (!hasCredentials) {
      console.log('🔄 Using mock USPS validation (credentials not configured)')
      const result = getMockUSPSValidation(validatedData)
      
      // Log the validation request
      logEvent('API', 'Address Validation', `${result.isValid ? 'Valid' : 'Invalid'} - USPS Mock`)
      
      return res.status(200).json({
        success: true,
        result,
        isMockData: true,
        provider: 'USPS'
      })
    }
    
    console.log('🌐 Using real USPS address validation for:', {
      street: validatedData.streetAddress,
      city: validatedData.city,
      state: validatedData.state,
      zip: validatedData.zipCode
    })
    
    const result = await validateAddressUSPS(validatedData)
    
    // Log the validation request
    logEvent('API', 'Address Validation', `${result.isValid ? 'Valid' : 'Invalid'} - USPS Live`)
    
    res.status(200).json({
      success: true,
      result,
      isMockData: false,
      provider: 'USPS'
    })
    
  } catch (error) {
    console.error('USPS address validation API error:', error)
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request data',
        details: error.errors
      })
    }
    
    // Log API errors
    logEvent('API', 'Error', 'USPS Address Validation')
    
    res.status(500).json({
      success: false,
      error: 'Failed to validate address',
      message: error instanceof Error ? error.message : 'Unknown error',
      provider: 'USPS'
    })
  }
}