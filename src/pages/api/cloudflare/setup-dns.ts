import type { NextApiRequest, NextApiResponse } from 'next'
import { createCloudflareClient } from '@/lib/cloudflare'

interface SetupDNSResponse {
  success: boolean
  message: string
  records?: Array<{
    type: string
    name: string
    status: 'created' | 'exists' | 'error'
    error?: string
  }>
  error?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SetupDNSResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    })
  }

  try {
    const cloudflare = createCloudflareClient()
    
    if (!cloudflare) {
      return res.status(500).json({
        success: false,
        message: 'Cloudflare API not configured. Please check environment variables.',
        error: 'Missing CLOUDFLARE_API_TOKEN, CLOUDFLARE_ZONE_ID, or CLOUDFLARE_ACCOUNT_ID'
      })
    }

    // Verify zone access first
    const zoneInfo = await cloudflare.getZoneInfo()
    if (!zoneInfo.success) {
      return res.status(400).json({
        success: false,
        message: 'Unable to access Cloudflare zone',
        error: zoneInfo.errors?.[0]?.message || 'Zone access failed'
      })
    }

    // Setup DNS records
    const result = await cloudflare.setupShipNodeDNS()

    return res.status(200).json({
      success: result.success,
      message: result.success 
        ? 'DNS records setup completed successfully'
        : 'DNS setup completed with some errors',
      records: result.records
    })

  } catch (error) {
    console.error('DNS setup error:', error)
    
    return res.status(500).json({
      success: false,
      message: 'Failed to setup DNS records',
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    })
  }
}