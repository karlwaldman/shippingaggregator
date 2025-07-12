import type { NextApiRequest, NextApiResponse } from 'next'
import { subscribeToNewsletter } from '@/lib/postmark'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { email, company, industry, monthlyShipments, currentSpend } = req.body

    // Validation
    if (!email || !company || !industry) {
      return res.status(400).json({ 
        error: 'Email, company, and industry are required' 
      })
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        error: 'Invalid email format' 
      })
    }

    // Call Postmark service
    const result = await subscribeToNewsletter({
      email,
      company,
      industry,
      monthlyShipments,
      currentSpend,
    })

    if (result.success) {
      res.status(200).json({ 
        success: true, 
        messageId: result.messageId 
      })
    } else {
      res.status(400).json({ 
        error: result.error || 'Failed to subscribe' 
      })
    }

  } catch (error) {
    console.error('API error:', error)
    res.status(500).json({ 
      error: 'Internal server error' 
    })
  }
}