import type { NextApiRequest, NextApiResponse } from 'next'
import { unsubscribeEmail, verifyUnsubscribeToken } from '@/lib/unsubscribe'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { email, token } = req.body

    // Validation
    if (!email || !token) {
      return res.status(400).json({ 
        error: 'Email and token are required' 
      })
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        error: 'Invalid email format' 
      })
    }

    // Verify token and unsubscribe
    const result = await unsubscribeEmail(email, token)

    if (result.success) {
      res.status(200).json({ 
        success: true,
        message: 'Successfully unsubscribed'
      })
    } else {
      res.status(400).json({ 
        error: result.error || 'Failed to unsubscribe' 
      })
    }

  } catch (error) {
    console.error('API error:', error)
    res.status(500).json({ 
      error: 'Internal server error' 
    })
  }
}