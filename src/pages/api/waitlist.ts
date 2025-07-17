import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { email, company, shippingVolume } = req.body

  // Validate email
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email is required' })
  }

  try {
    // For now, we'll just log the submission
    // In production, you would save this to a database or send to an email service
    console.log('Waitlist submission:', {
      email,
      company: company || 'Not provided',
      shippingVolume: shippingVolume || 'Not provided',
      timestamp: new Date().toISOString()
    })

    // In production, you might want to:
    // 1. Save to database (Supabase, PostgreSQL, etc.)
    // 2. Send to email marketing service (SendGrid, Mailchimp, etc.)
    // 3. Send a confirmation email to the user

    return res.status(200).json({ 
      success: true,
      message: 'Successfully added to waitlist' 
    })
  } catch (error) {
    console.error('Waitlist submission error:', error)
    return res.status(500).json({ error: 'Failed to process submission' })
  }
}