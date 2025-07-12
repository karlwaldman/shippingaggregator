import type { NextApiRequest, NextApiResponse } from 'next'

interface PostmarkVerificationResponse {
  success: boolean
  message: string
  server: {
    id: number
    name: string
    isLive: boolean
    smtpEnabled: boolean
  }
  capabilities: {
    canSendEmail: boolean
    serverTokenValid: boolean
    accountTokenNeeded: boolean
  }
  dnsStatus: {
    spfRecord: boolean
    dkimRecord: boolean
    dmarcRecord: boolean
  }
  recommendations: string[]
  manualSteps: {
    postmarkDashboard: string
    addDomain: string[]
    verifyDomain: string[]
    createSenders: string[]
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PostmarkVerificationResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed',
      server: { id: 0, name: '', isLive: false, smtpEnabled: false },
      capabilities: { canSendEmail: false, serverTokenValid: false, accountTokenNeeded: true },
      dnsStatus: { spfRecord: false, dkimRecord: false, dmarcRecord: false },
      recommendations: [],
      manualSteps: { postmarkDashboard: '', addDomain: [], verifyDomain: [], createSenders: [] }
    })
  }

  const serverToken = process.env.POSTMARK_API_TOKEN
  let serverInfo: any = null
  let serverTokenValid = false

  // Test server token
  try {
    if (serverToken) {
      const response = await fetch('https://api.postmarkapp.com/server', {
        headers: {
          'X-Postmark-Server-Token': serverToken,
          'Accept': 'application/json'
        }
      })

      if (response.ok) {
        serverInfo = await response.json()
        serverTokenValid = true
      }
    }
  } catch (error) {
    console.error('Server token test failed:', error)
  }

  // Check DNS records
  const dnsStatus = {
    spfRecord: false,
    dkimRecord: false,
    dmarcRecord: false
  }

  try {
    // Check SPF
    const spfResponse = await fetch('https://dns.google/resolve?name=shipnode.io&type=TXT')
    const spfData = await spfResponse.json()
    dnsStatus.spfRecord = spfData.Answer?.some((record: any) => 
      record.data?.includes('v=spf1') && record.data?.includes('include:spf.mtasv.net')
    ) || false

    // Check DKIM
    const dkimResponse = await fetch('https://dns.google/resolve?name=pm._domainkey.shipnode.io&type=CNAME')
    const dkimData = await dkimResponse.json()
    dnsStatus.dkimRecord = dkimData.Status === 0 && dkimData.Answer?.some((record: any) =>
      record.data?.includes('pm.mtasv.net')
    ) || false

    // Check DMARC
    const dmarcResponse = await fetch('https://dns.google/resolve?name=_dmarc.shipnode.io&type=TXT')
    const dmarcData = await dmarcResponse.json()
    dnsStatus.dmarcRecord = dmarcData.Answer?.some((record: any) =>
      record.data?.includes('v=DMARC1')
    ) || false

  } catch (error) {
    console.error('DNS check failed:', error)
  }

  // Generate recommendations
  const recommendations: string[] = []
  
  if (!serverTokenValid) {
    recommendations.push('❌ Server token invalid or missing - check POSTMARK_API_TOKEN')
  } else {
    recommendations.push('✅ Server token valid and working')
  }

  if (dnsStatus.spfRecord && dnsStatus.dkimRecord && dnsStatus.dmarcRecord) {
    recommendations.push('✅ All DNS records configured correctly')
  } else {
    recommendations.push('⚠️ Some DNS records missing - domain verification may be needed')
  }

  if (serverTokenValid && dnsStatus.spfRecord && dnsStatus.dkimRecord) {
    recommendations.push('🚀 Ready for email sending - just need domain verification in Postmark')
  }

  // Manual steps guide
  const manualSteps = {
    postmarkDashboard: 'https://account.postmarkapp.com/',
    addDomain: [
      '1. Go to Postmark Account > Sending > Sender Signatures',
      '2. Click "Add Domain"', 
      '3. Enter: shipnode.io',
      '4. Set Return-Path: bounces.shipnode.io',
      '5. Enable DKIM Signing: ✅'
    ],
    verifyDomain: [
      '1. After adding domain, click "Verify Domain"',
      '2. Postmark will check DNS records automatically',
      '3. Should show ✅ SPF Verified and ✅ DKIM Verified',
      '4. If not verified, wait 5-10 minutes for DNS propagation'
    ],
    createSenders: [
      '1. In Sender Signatures, add these email addresses:',
      '   • hello@shipnode.io (Primary)',
      '   • support@shipnode.io',
      '   • noreply@shipnode.io',
      '   • dmarc@shipnode.io',
      '2. Each sender will be auto-verified if domain is verified'
    ]
  }

  const response: PostmarkVerificationResponse = {
    success: serverTokenValid,
    message: serverTokenValid 
      ? 'Postmark server configuration verified - manual domain setup needed'
      : 'Postmark server token invalid or missing',
    server: {
      id: serverInfo?.ID || 0,
      name: serverInfo?.Name || '',
      isLive: serverInfo?.DeliveryType === 'Live',
      smtpEnabled: serverInfo?.SmtpApiActivated || false
    },
    capabilities: {
      canSendEmail: serverTokenValid && dnsStatus.spfRecord && dnsStatus.dkimRecord,
      serverTokenValid,
      accountTokenNeeded: true // Domain management requires account token
    },
    dnsStatus,
    recommendations,
    manualSteps
  }

  return res.status(200).json(response)
}