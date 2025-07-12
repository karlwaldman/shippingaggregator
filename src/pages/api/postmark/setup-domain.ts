import type { NextApiRequest, NextApiResponse } from 'next'
import { createPostmarkAdminClient } from '@/lib/postmark-admin'

interface PostmarkSetupResponse {
  success: boolean
  message: string
  domain?: {
    id: number
    name: string
    spfVerified: boolean
    dkimVerified: boolean
    returnPathDomainVerified: boolean
  }
  senderSignatures?: Array<{
    id: number
    email: string
    confirmed: boolean
    spfVerified: boolean
    dkimVerified: boolean
  }>
  steps: Array<{
    step: string
    status: 'success' | 'error' | 'skipped'
    message: string
  }>
  errors?: string[]
  dnsRecords?: {
    spf: string
    dkim: string
    returnPath: string
  }
  nextSteps?: string[]
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PostmarkSetupResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed',
      steps: []
    })
  }

  try {
    const postmark = createPostmarkAdminClient()
    
    if (!postmark) {
      return res.status(500).json({
        success: false,
        message: 'Postmark API not configured. Please check environment variables.',
        steps: [
          {
            step: 'Check configuration',
            status: 'error',
            message: 'Missing POSTMARK_API_TOKEN environment variable'
          }
        ],
        errors: ['Missing POSTMARK_API_TOKEN environment variable']
      })
    }

    // Test API connectivity first
    const serverInfoResult = await postmark.getServerInfo()
    if (!serverInfoResult.success) {
      return res.status(400).json({
        success: false,
        message: 'Unable to connect to Postmark API',
        steps: [
          {
            step: 'Test API connectivity',
            status: 'error',
            message: serverInfoResult.error || 'API connection failed'
          }
        ],
        errors: [serverInfoResult.error || 'API connection failed']
      })
    }

    // Run automated domain setup
    const setupResult = await postmark.setupShipNodeDomain()

    // Get DNS records for reference (if domain was created/exists)
    let dnsRecords
    if (setupResult.domain) {
      const domainDetailsResult = await postmark.getDomainDetails(setupResult.domain.ID)
      if (domainDetailsResult.success) {
        const details = domainDetailsResult.data!
        dnsRecords = {
          spf: `TXT @ "${details.SPFTextValue}"`,
          dkim: `CNAME ${details.DKIMHost} "${details.DKIMTextValue}"`,
          returnPath: `CNAME bounces "${details.ReturnPathDomainCNAMEValue}"`
        }
      }
    }

    // Format response
    const response: PostmarkSetupResponse = {
      success: setupResult.success,
      message: setupResult.success 
        ? 'Postmark domain setup completed successfully'
        : 'Postmark domain setup completed with some errors',
      steps: setupResult.steps,
      errors: setupResult.errors.length > 0 ? setupResult.errors : undefined
    }

    // Add domain info if available
    if (setupResult.domain) {
      response.domain = {
        id: setupResult.domain.ID,
        name: setupResult.domain.Name,
        spfVerified: setupResult.domain.SPFVerified,
        dkimVerified: setupResult.domain.DKIMVerified,
        returnPathDomainVerified: setupResult.domain.ReturnPathDomainVerified
      }
    }

    // Add sender signatures if created
    if (setupResult.senderSignatures && setupResult.senderSignatures.length > 0) {
      response.senderSignatures = setupResult.senderSignatures.map(sig => ({
        id: sig.ID,
        email: sig.EmailAddress,
        confirmed: sig.Confirmed,
        spfVerified: sig.SPFVerified,
        dkimVerified: sig.DKIMVerified
      }))
    }

    // Add DNS records for reference
    if (dnsRecords) {
      response.dnsRecords = dnsRecords
    }

    // Generate next steps
    const nextSteps: string[] = []
    
    if (response.domain) {
      if (!response.domain.spfVerified || !response.domain.dkimVerified) {
        nextSteps.push('DNS records need time to propagate (5-15 minutes)')
        nextSteps.push('Re-run this endpoint to verify DNS records')
      }
      
      if (response.domain.spfVerified && response.domain.dkimVerified) {
        nextSteps.push('✅ Domain fully verified and ready for sending')
        nextSteps.push('Test email sending through your application')
      }
    }

    if (response.senderSignatures && response.senderSignatures.length > 0) {
      const unconfirmed = response.senderSignatures.filter(s => !s.confirmed)
      if (unconfirmed.length > 0) {
        nextSteps.push(`${unconfirmed.length} sender signature(s) need email confirmation`)
      }
    }

    if (nextSteps.length > 0) {
      response.nextSteps = nextSteps
    }

    return res.status(200).json(response)

  } catch (error) {
    console.error('Postmark setup error:', error)
    
    return res.status(500).json({
      success: false,
      message: 'Failed to setup Postmark domain',
      steps: [
        {
          step: 'Setup execution',
          status: 'error',
          message: error instanceof Error ? error.message : 'Unknown error occurred'
        }
      ],
      errors: [error instanceof Error ? error.message : 'Unknown error occurred']
    })
  }
}