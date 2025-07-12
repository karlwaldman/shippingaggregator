import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
  
  res.status(200).json({
    measurementId: measurementId || 'NOT SET',
    isConfigured: !!measurementId,
    expectedValue: 'G-69KPYPT8CC',
    matches: measurementId === 'G-69KPYPT8CC'
  })
}