import type { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'
import { validateAddress, getMockAddressValidation } from '@/lib/fedex-address'
import { logEvent } from '@/lib/analytics'

// Request validation
const addressSchema = z.object({
  street: z.string().min(1, 'Street address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().regex(/^[A-Z]{2}$/, 'State must be 2 characters'),
  zip: z.string().regex(/^\d{5}(-\d{4})?$/, 'ZIP code must be 5 or 9 digits'),
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
    
    // Check if we should use mock data
    const useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true' || 
                       !process.env.FEDEX_API_KEY || 
                       !process.env.FEDEX_SECRET_KEY
    
    let result
    
    if (useMockData) {
      console.log('Using mock address validation')
      result = getMockAddressValidation(validatedData)
      result = { ...result, isMockData: true }
    } else {
      console.log('Using real FedEx address validation')
      result = await validateAddress(validatedData)
      result = { ...result, isMockData: false }
    }
    
    // Log the validation request
    logEvent('API', 'Address Validation', `${result.isValid ? 'Valid' : 'Invalid'} - ${useMockData ? 'Mock' : 'Live'}`)
    
    res.status(200).json({
      success: true,
      result,
      isMockData: useMockData
    })
    
  } catch (error) {
    console.error('Address validation API error:', error)
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request data',
        details: error.errors
      })
    }
    
    // Log API errors
    logEvent('API', 'Error', 'Address Validation')
    
    res.status(500).json({
      success: false,
      error: 'Failed to validate address',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}