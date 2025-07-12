import type { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'
import { trackFedExPackage, getMockFedExTracking } from '@/lib/fedex-tracking'
import { logEvent } from '@/lib/analytics'

// Request validation
const trackingSchema = z.object({
  trackingNumber: z.string().min(1, 'Tracking number is required').max(30, 'Invalid tracking number'),
  includeDetailedScans: z.boolean().optional().default(true)
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
    const validatedData = trackingSchema.parse(req.body)
    
    // Check if we should use mock data
    const useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true' || 
                       !process.env.FEDEX_API_KEY || 
                       !process.env.FEDEX_SECRET_KEY
    
    let trackingResult
    
    if (useMockData) {
      console.log('Using mock FedEx tracking for:', validatedData.trackingNumber)
      trackingResult = getMockFedExTracking(validatedData.trackingNumber)
    } else {
      console.log('Using live FedEx tracking API for:', validatedData.trackingNumber)
      trackingResult = await trackFedExPackage(validatedData)
    }
    
    // Log the tracking request
    logEvent('API', 'Package Tracking', `FedEx - ${useMockData ? 'Mock' : 'Live'} - ${trackingResult.status}`)
    
    res.status(200).json({
      success: true,
      tracking: trackingResult,
      isMockData: useMockData
    })
    
  } catch (error) {
    console.error('FedEx tracking API error:', error)
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request data',
        details: error.errors
      })
    }
    
    // Log API errors
    logEvent('API', 'Error', 'FedEx Tracking')
    
    res.status(500).json({
      success: false,
      error: 'Failed to track package',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}