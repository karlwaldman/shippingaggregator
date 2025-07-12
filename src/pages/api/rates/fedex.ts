import type { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'
import { getFedExRates, getMockFedExRates, type FedExRate } from '@/lib/fedex'
import { logEvent } from '@/lib/analytics'

// Request validation
const rateRequestSchema = z.object({
  originZip: z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code'),
  destinationZip: z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code'),
  weight: z.number().min(0.1).max(150), // FedEx Ground max is 150 lbs
  length: z.number().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  packageType: z.enum(['YOUR_PACKAGING', 'FEDEX_BOX', 'FEDEX_TUBE']).optional(),
  serviceType: z.enum([
    'FEDEX_GROUND',
    'FEDEX_2_DAY',
    'FEDEX_EXPRESS_SAVER',
    'STANDARD_OVERNIGHT',
    'PRIORITY_OVERNIGHT'
  ]).optional()
})

type RateRequest = z.infer<typeof rateRequestSchema>

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Validate request
    const validatedData = rateRequestSchema.parse(req.body)
    
    // Check if we should use mock data
    const useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true' || 
                       !process.env.FEDEX_API_KEY || 
                       !process.env.FEDEX_SECRET_KEY
    
    let rates: FedExRate[]
    
    if (useMockData) {
      console.log('Using mock FedEx rates')
      rates = getMockFedExRates(validatedData)
      
      // Add a flag to indicate this is mock data
      rates = rates.map(rate => ({
        ...rate,
        isMockData: true
      } as FedExRate & { isMockData: boolean }))
    } else {
      console.log('Fetching real FedEx rates')
      rates = await getFedExRates(validatedData)
    }
    
    // Log the rate request
    logEvent('API', 'Rate Request', `FedEx - ${useMockData ? 'Mock' : 'Live'}`, rates.length)
    
    // Sort rates by price
    rates.sort((a, b) => a.totalCharge - b.totalCharge)
    
    res.status(200).json({
      success: true,
      rates,
      request: {
        origin: validatedData.originZip,
        destination: validatedData.destinationZip,
        weight: validatedData.weight
      },
      isMockData: useMockData
    })
    
  } catch (error) {
    console.error('Rate API error:', error)
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request data',
        details: error.errors
      })
    }
    
    // Log API errors
    logEvent('API', 'Error', 'FedEx Rate')
    
    res.status(500).json({
      success: false,
      error: 'Failed to fetch rates',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}