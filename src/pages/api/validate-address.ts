import type { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'
import { validateAddress } from '@/lib/fedex-address'
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
    
    // Check if we have FedEx API credentials
    if (!process.env.FEDEX_API_KEY || !process.env.FEDEX_SECRET_KEY) {
      return res.status(503).json({
        success: false,
        error: 'Address validation service unavailable',
        message: 'FedEx API credentials not configured'
      })
    }
    
    console.log('🌐 Using real FedEx address validation for:', {
      street: validatedData.street,
      city: validatedData.city,
      state: validatedData.state,
      zip: validatedData.zip
    })
    
    const result = await validateAddress(validatedData)
    
    // Log the validation request
    logEvent('API', 'Address Validation', `${result.isValid ? 'Valid' : 'Invalid'} - Live`)
    
    res.status(200).json({
      success: true,
      result,
      isMockData: false
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