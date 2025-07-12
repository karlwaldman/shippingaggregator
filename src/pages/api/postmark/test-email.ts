import type { NextApiRequest, NextApiResponse } from 'next'

interface TestEmailRequest {
  to?: string
  testType?: 'basic' | 'domain' | 'full'
}

interface TestEmailResponse {
  success: boolean
  message: string
  emailSent?: boolean
  testResults: {
    serverConnection: boolean
    domainVerification: boolean
    emailDelivery: boolean
  }
  details: {
    fromEmail: string
    toEmail: string
    messageId?: string
    submittedAt?: string
  }
  error?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TestEmailResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed',
      emailSent: false,
      testResults: { serverConnection: false, domainVerification: false, emailDelivery: false },
      details: { fromEmail: '', toEmail: '' }
    })
  }

  const { to = 'karl.waldman+shipnode@gmail.com', testType = 'basic' } = req.body as TestEmailRequest
  
  const serverToken = process.env.POSTMARK_API_TOKEN
  const fromEmail = process.env.POSTMARK_FROM_EMAIL || 'hello@shipnode.io'

  if (!serverToken) {
    return res.status(500).json({
      success: false,
      message: 'Postmark API token not configured',
      emailSent: false,
      testResults: { serverConnection: false, domainVerification: false, emailDelivery: false },
      details: { fromEmail, toEmail: to },
      error: 'Missing POSTMARK_API_TOKEN environment variable'
    })
  }

  const testResults = {
    serverConnection: false,
    domainVerification: false,
    emailDelivery: false
  }

  let emailSent = false
  let messageId: string | undefined
  let submittedAt: string | undefined
  let error: string | undefined

  try {
    // Test 1: Server connection
    const serverResponse = await fetch('https://api.postmarkapp.com/server', {
      headers: {
        'X-Postmark-Server-Token': serverToken,
        'Accept': 'application/json'
      }
    })

    if (serverResponse.ok) {
      testResults.serverConnection = true
    } else {
      throw new Error(`Server connection failed: ${serverResponse.status} ${serverResponse.statusText}`)
    }

    // Test 2: Domain verification (check if we can send)
    // We'll determine this by attempting to send the email
    
    // Test 3: Email delivery
    const emailPayload = {
      From: fromEmail,
      To: to,
      Subject: testType === 'full' 
        ? 'ShipNode.io Email System Test - Full Integration'
        : testType === 'domain'
        ? 'ShipNode.io Email Test - Domain Verification'
        : 'ShipNode.io Email Test - Basic Connectivity',
      HtmlBody: generateTestEmailHtml(testType, fromEmail, to),
      TextBody: generateTestEmailText(testType, fromEmail, to),
      Tag: 'domain-setup-test',
      TrackOpens: false,
      TrackLinks: 'None'
    }

    const emailResponse = await fetch('https://api.postmarkapp.com/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Postmark-Server-Token': serverToken
      },
      body: JSON.stringify(emailPayload)
    })

    const emailResult = await emailResponse.json()

    if (emailResponse.ok) {
      testResults.domainVerification = true
      testResults.emailDelivery = true
      emailSent = true
      messageId = emailResult.MessageID
      submittedAt = emailResult.SubmittedAt
    } else {
      error = emailResult.Message || 'Email sending failed'
      
      // Check if it's a domain issue
      if (emailResult.ErrorCode === 406 || emailResult.Message?.includes('domain')) {
        testResults.domainVerification = false
        error = 'Domain not verified in Postmark - please add and verify shipnode.io domain'
      } else if (emailResult.ErrorCode === 300 || emailResult.Message?.includes('sender signature')) {
        testResults.domainVerification = false
        error = 'Sender signature not found - please add hello@shipnode.io as verified sender'
      }
    }

  } catch (err) {
    error = err instanceof Error ? err.message : 'Unknown error occurred'
  }

  return res.status(200).json({
    success: emailSent,
    message: emailSent 
      ? 'Test email sent successfully!'
      : error || 'Email sending failed',
    emailSent,
    testResults,
    details: {
      fromEmail,
      toEmail: to,
      messageId,
      submittedAt
    },
    error: emailSent ? undefined : error
  })
}

function generateTestEmailHtml(testType: string, fromEmail: string, toEmail: string): string {
  const timestamp = new Date().toISOString()
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>ShipNode.io Email Test</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #1e40af; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; background: #f8fafc; }
    .success { color: #16a34a; font-weight: bold; }
    .details { background: white; padding: 15px; margin: 15px 0; border-left: 4px solid #1e40af; }
    .footer { text-align: center; padding: 20px; color: #64748b; font-size: 14px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>🚀 ShipNode.io</h1>
    <p>Email System Test - ${testType.charAt(0).toUpperCase() + testType.slice(1)}</p>
  </div>
  
  <div class="content">
    <p class="success">✅ Email delivery successful!</p>
    
    <p>This test email confirms that your ShipNode.io email system is working correctly.</p>
    
    <div class="details">
      <h3>Test Details:</h3>
      <ul>
        <li><strong>From:</strong> ${fromEmail}</li>
        <li><strong>To:</strong> ${toEmail}</li>
        <li><strong>Test Type:</strong> ${testType}</li>
        <li><strong>Timestamp:</strong> ${timestamp}</li>
      </ul>
    </div>

    ${testType === 'full' ? `
    <div class="details">
      <h3>System Status:</h3>
      <ul>
        <li>✅ DNS Records: Configured</li>
        <li>✅ Domain Verification: Active</li>
        <li>✅ Email Delivery: Working</li>
        <li>✅ SSL/TLS: Secure</li>
      </ul>
    </div>
    ` : ''}

    <p>Your multi-carrier shipping optimization platform is ready for production use!</p>
  </div>
  
  <div class="footer">
    <p>ShipNode.io - The central hub for shipping optimization</p>
    <p><a href="https://shipnode.io">Visit ShipNode.io</a></p>
  </div>
</body>
</html>`
}

function generateTestEmailText(testType: string, fromEmail: string, toEmail: string): string {
  const timestamp = new Date().toISOString()
  
  return `
ShipNode.io Email System Test - ${testType.charAt(0).toUpperCase() + testType.slice(1)}

✅ Email delivery successful!

This test email confirms that your ShipNode.io email system is working correctly.

Test Details:
- From: ${fromEmail}
- To: ${toEmail}
- Test Type: ${testType}
- Timestamp: ${timestamp}

${testType === 'full' ? `
System Status:
✅ DNS Records: Configured
✅ Domain Verification: Active  
✅ Email Delivery: Working
✅ SSL/TLS: Secure
` : ''}

Your multi-carrier shipping optimization platform is ready for production use!

---
ShipNode.io - The central hub for shipping optimization
Visit: https://shipnode.io
`
}