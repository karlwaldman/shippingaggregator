// Simple file-based unsubscribe tracking for MVP
// In production, replace with database storage

import fs from 'fs/promises'
import path from 'path'
import crypto from 'crypto'

const UNSUBSCRIBE_FILE = path.join(process.cwd(), 'data', 'unsubscribed.json')

interface UnsubscribeRecord {
  email: string
  unsubscribedAt: string
  token: string
}

// Generate secure unsubscribe token
export function generateUnsubscribeToken(email: string): string {
  const secret = process.env.UNSUBSCRIBE_SECRET || 'default-secret-change-in-production'
  return crypto.createHash('sha256').update(`${email}-${secret}`).digest('hex').substring(0, 32)
}

// Verify unsubscribe token
export function verifyUnsubscribeToken(email: string, token: string): boolean {
  const expectedToken = generateUnsubscribeToken(email)
  return crypto.timingSafeEqual(Buffer.from(token), Buffer.from(expectedToken))
}

// Load unsubscribed emails
async function loadUnsubscribed(): Promise<UnsubscribeRecord[]> {
  try {
    // Ensure data directory exists
    await fs.mkdir(path.dirname(UNSUBSCRIBE_FILE), { recursive: true })
    
    const data = await fs.readFile(UNSUBSCRIBE_FILE, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    // File doesn't exist yet, return empty array
    return []
  }
}

// Save unsubscribed emails
async function saveUnsubscribed(records: UnsubscribeRecord[]): Promise<void> {
  await fs.mkdir(path.dirname(UNSUBSCRIBE_FILE), { recursive: true })
  await fs.writeFile(UNSUBSCRIBE_FILE, JSON.stringify(records, null, 2))
}

// Check if email is unsubscribed
export async function isUnsubscribed(email: string): Promise<boolean> {
  const records = await loadUnsubscribed()
  return records.some(record => record.email.toLowerCase() === email.toLowerCase())
}

// Add email to unsubscribe list
export async function unsubscribeEmail(email: string, token: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Verify token
    if (!verifyUnsubscribeToken(email, token)) {
      return { success: false, error: 'Invalid unsubscribe token' }
    }

    const records = await loadUnsubscribed()
    
    // Check if already unsubscribed
    if (records.some(record => record.email.toLowerCase() === email.toLowerCase())) {
      return { success: true } // Already unsubscribed, treat as success
    }

    // Add to unsubscribe list
    const newRecord: UnsubscribeRecord = {
      email: email.toLowerCase(),
      unsubscribedAt: new Date().toISOString(),
      token
    }

    records.push(newRecord)
    await saveUnsubscribed(records)

    return { success: true }

  } catch (error) {
    console.error('Unsubscribe error:', error)
    return { success: false, error: 'Failed to process unsubscribe request' }
  }
}

// Generate compliant email footer
export function generateEmailFooter(email: string, baseUrl: string = 'https://freightflow.com'): string {
  const token = generateUnsubscribeToken(email)
  const unsubscribeUrl = `${baseUrl}/unsubscribe?email=${encodeURIComponent(email)}&token=${token}`
  
  return `

---

FreightFlow - Manufacturing Freight Optimization
Built specifically for manufacturing SMBs

Our mailing address:
FreightFlow LLC
123 Manufacturing Blvd
Industrial City, IN 46201

You received this email because you signed up for our manufacturing freight calculator waitlist.

To unsubscribe from future emails, click here: ${unsubscribeUrl}

This email was sent to ${email}. If you believe you received this email in error, please contact us at hello@machineshop.directory.`
}