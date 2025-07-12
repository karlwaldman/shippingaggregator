import type { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'
import { getFedExTransitTimes, getMockFedExTransitTimes } from '@/lib/fedex-transit'
import { logEvent } from '@/lib/analytics'

// Request validation
const transitSchema = z.object({
  originZip: z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid origin ZIP code'),
  destinationZip: z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid destination ZIP code'),
  shipDate: z.string().optional() // ISO date string, defaults to tomorrow
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
    const validatedData = transitSchema.parse(req.body)
    
    // Check if we should use mock data
    const useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true' || 
                       !process.env.FEDEX_API_KEY || 
                       !process.env.FEDEX_SECRET_KEY
    
    let transitResult
    
    if (useMockData) {
      console.log('Using mock FedEx transit times for:', validatedData.originZip, '->', validatedData.destinationZip)
      transitResult = getMockFedExTransitTimes(validatedData)
    } else {
      console.log('Using live FedEx transit times API for:', validatedData.originZip, '->', validatedData.destinationZip)
      transitResult = await getFedExTransitTimes(validatedData)
    }
    
    // Log the transit request
    logEvent('API', 'Transit Times', `FedEx - ${useMockData ? 'Mock' : 'Live'} - ${transitResult.services.length} services`)
    
    res.status(200).json({
      success: true,
      transitTimes: transitResult,
      isMockData: useMockData
    })
    
  } catch (error) {
    console.error('FedEx transit times API error:', error)
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request data',
        details: error.errors
      })
    }
    
    // Log API errors
    logEvent('API', 'Error', 'FedEx Transit Times')
    
    res.status(500).json({
      success: false,
      error: 'Failed to get transit times',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}