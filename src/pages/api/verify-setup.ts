import type { NextApiRequest, NextApiResponse } from 'next'

interface SetupStatus {
  dns: {
    domain: boolean
    www: boolean
    spf: boolean
    dkim: boolean
    dmarc: boolean
  }
  environment: {
    postmarkToken: boolean
    postmarkEmail: boolean
    unsubscribeSecret: boolean
    cloudflareToken: boolean
    siteUrl: boolean
  }
  services: {
    postmarkReachable: boolean
    cloudflareReachable: boolean
  }
}

interface VerificationResponse {
  success: boolean
  timestamp: string
  domain: string
  status: SetupStatus
  summary: {
    dnsConfigured: boolean
    environmentConfigured: boolean
    servicesReachable: boolean
    overallReady: boolean
  }
  nextSteps: string[]
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<VerificationResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      timestamp: new Date().toISOString(),
      domain: 'shipnode.io',
      status: {} as SetupStatus,
      summary: {
        dnsConfigured: false,
        environmentConfigured: false, 
        servicesReachable: false,
        overallReady: false
      },
      nextSteps: ['Method not allowed']
    })
  }

  const status: SetupStatus = {
    dns: {
      domain: false,
      www: false,
      spf: false,
      dkim: false,
      dmarc: false
    },
    environment: {
      postmarkToken: !!process.env.POSTMARK_API_TOKEN,
      postmarkEmail: !!process.env.POSTMARK_FROM_EMAIL,
      unsubscribeSecret: !!process.env.UNSUBSCRIBE_SECRET,
      cloudflareToken: !!process.env.CLOUDFLARE_API_TOKEN,
      siteUrl: !!process.env.NEXT_PUBLIC_SITE_URL
    },
    services: {
      postmarkReachable: false,
      cloudflareReachable: false
    }
  }

  // Check DNS records
  try {
    // Check main domain
    const domainResponse = await fetch('https://dns.google/resolve?name=shipnode.io&type=A')
    const domainData = await domainResponse.json()
    status.dns.domain = domainData.Status === 0 && domainData.Answer?.length > 0

    // Check www subdomain  
    const wwwResponse = await fetch('https://dns.google/resolve?name=www.shipnode.io&type=A')
    const wwwData = await wwwResponse.json()
    status.dns.www = wwwData.Status === 0 && wwwData.Answer?.length > 0

    // Check SPF record
    const spfResponse = await fetch('https://dns.google/resolve?name=shipnode.io&type=TXT')
    const spfData = await spfResponse.json()
    status.dns.spf = spfData.Answer?.some((record: any) => 
      record.data?.includes('v=spf1') && record.data?.includes('include:spf.mtasv.net')
    ) || false

    // Check DKIM record
    const dkimResponse = await fetch('https://dns.google/resolve?name=pm._domainkey.shipnode.io&type=CNAME')
    const dkimData = await dkimResponse.json()
    status.dns.dkim = dkimData.Status === 0 && dkimData.Answer?.some((record: any) =>
      record.data?.includes('pm.mtasv.net')
    ) || false

    // Check DMARC record
    const dmarcResponse = await fetch('https://dns.google/resolve?name=_dmarc.shipnode.io&type=TXT')
    const dmarcData = await dmarcResponse.json()
    status.dns.dmarc = dmarcData.Answer?.some((record: any) =>
      record.data?.includes('v=DMARC1')
    ) || false

  } catch (error) {
    console.error('DNS check failed:', error)
  }

  // Check service reachability
  try {
    // Test Postmark API
    if (process.env.POSTMARK_API_TOKEN) {
      const postmarkResponse = await fetch('https://api.postmarkapp.com/server', {
        headers: {
          'X-Postmark-Server-Token': process.env.POSTMARK_API_TOKEN,
          'Accept': 'application/json'
        }
      })
      status.services.postmarkReachable = postmarkResponse.ok
    }

    // Test Cloudflare API
    if (process.env.CLOUDFLARE_API_TOKEN) {
      const cloudflareResponse = await fetch('https://api.cloudflare.com/client/v4/user/tokens/verify', {
        headers: {
          'Authorization': `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`
        }
      })
      status.services.cloudflareReachable = cloudflareResponse.ok
    }
  } catch (error) {
    console.error('Service check failed:', error)
  }

  // Calculate summary
  const dnsConfigured = Object.values(status.dns).every(Boolean)
  const environmentConfigured = status.environment.postmarkToken && 
                               status.environment.postmarkEmail && 
                               status.environment.unsubscribeSecret
  const servicesReachable = status.services.postmarkReachable
  const overallReady = dnsConfigured && environmentConfigured && servicesReachable

  // Generate next steps
  const nextSteps: string[] = []
  
  if (!dnsConfigured) {
    const missingDns = Object.entries(status.dns)
      .filter(([_, value]) => !value)
      .map(([key, _]) => key)
    nextSteps.push(`Configure missing DNS records: ${missingDns.join(', ')}`)
  }

  if (!environmentConfigured) {
    const missingEnv = Object.entries(status.environment)
      .filter(([_, value]) => !value)
      .map(([key, _]) => key)
    nextSteps.push(`Set missing environment variables: ${missingEnv.join(', ')}`)
  }

  if (!status.services.postmarkReachable) {
    nextSteps.push('Verify Postmark API token and server configuration')
  }

  if (overallReady) {
    nextSteps.push('✅ Setup complete! Configure Vercel and Postmark domains manually')
  }

  return res.status(200).json({
    success: true,
    timestamp: new Date().toISOString(),
    domain: 'shipnode.io',
    status,
    summary: {
      dnsConfigured,
      environmentConfigured,
      servicesReachable,
      overallReady
    },
    nextSteps
  })
}