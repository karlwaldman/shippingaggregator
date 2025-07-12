// Real Postmark service integration
import { generateEmailFooter, isUnsubscribed } from './unsubscribe'

interface EmailData {
  email: string
  company: string
  industry: string
  monthlyShipments?: string
  currentSpend?: string
}

interface EmailResponse {
  success: boolean
  messageId?: string
  error?: string
}

const POSTMARK_API_TOKEN = process.env.POSTMARK_API_TOKEN
const FROM_EMAIL = process.env.POSTMARK_FROM_EMAIL || 'noreply@freightflow.com'

export async function subscribeToNewsletter(data: EmailData): Promise<EmailResponse> {
  try {
    // Check if Postmark token is configured
    if (!POSTMARK_API_TOKEN) {
      return { success: false, error: 'Email service not configured' }
    }

    // Validation
    if (!data.email || !data.email.includes('@')) {
      return { success: false, error: 'Invalid email address' }
    }
    
    if (!data.company || data.company.length < 2) {
      return { success: false, error: 'Company name is required' }
    }

    // Check if email is unsubscribed
    if (await isUnsubscribed(data.email)) {
      return { success: false, error: 'This email address has unsubscribed from our communications' }
    }

    // Send notification email to us
    const notificationResponse = await fetch('https://api.postmarkapp.com/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Postmark-Server-Token': POSTMARK_API_TOKEN,
      },
      body: JSON.stringify({
        From: FROM_EMAIL,
        To: 'karl.waldman+shipping@gmail.com',
        Subject: `New Manufacturing Lead: ${data.company}`,
        TextBody: `
New freight calculator waitlist signup:

Company: ${data.company}
Email: ${data.email}
Industry: ${data.industry}
Monthly Shipments: ${data.monthlyShipments || 'Not specified'}
Current Spend: ${data.currentSpend || 'Not specified'}

Signed up at: ${new Date().toISOString()}
        `,
      }),
    })

    if (!notificationResponse.ok) {
      console.error('Postmark notification error:', await notificationResponse.text())
      return { success: false, error: 'Failed to send notification' }
    }

    // Send welcome email to user
    const welcomeResponse = await fetch('https://api.postmarkapp.com/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Postmark-Server-Token': POSTMARK_API_TOKEN,
      },
      body: JSON.stringify({
        From: FROM_EMAIL,
        To: data.email,
        Subject: 'Welcome to FreightFlow - Manufacturing Freight Calculator Waitlist',
        TextBody: `Hi there,

Thanks for joining the FreightFlow waitlist! You're now in line to get early access to our manufacturing freight calculator launching in Q1 2025.

What you can expect:
• Early access notification 2 weeks before public launch
• 6 months free pricing for early adopters
• Priority ERP integration setup
• Manufacturing freight optimization tips

We'll keep you updated on our progress. In the meantime, if you have any questions about freight optimization for ${data.company}, feel free to reply to this email.

Best regards,
The FreightFlow Team${generateEmailFooter(data.email)}`,
      }),
    })

    if (!welcomeResponse.ok) {
      console.error('Postmark welcome email error:', await welcomeResponse.text())
      // Don't fail the signup if welcome email fails
    }

    const result = await notificationResponse.json()
    return {
      success: true,
      messageId: result.MessageID,
    }

  } catch (error) {
    console.error('Email service error:', error)
    return { 
      success: false, 
      error: 'Failed to process signup. Please try again.' 
    }
  }
}

export async function sendEmail(to: string, subject: string, content: string): Promise<EmailResponse> {
  try {
    const response = await fetch('https://api.postmarkapp.com/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Postmark-Server-Token': POSTMARK_API_TOKEN,
      },
      body: JSON.stringify({
        From: FROM_EMAIL,
        To: to,
        Subject: subject,
        TextBody: content,
      }),
    })

    if (!response.ok) {
      throw new Error(`Postmark API error: ${response.status}`)
    }

    const result = await response.json()
    return {
      success: true,
      messageId: result.MessageID,
    }

  } catch (error) {
    console.error('Send email error:', error)
    return { 
      success: false, 
      error: 'Failed to send email' 
    }
  }
}