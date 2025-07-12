// Mock Postmark service for local development
// Will be replaced with actual Postmark integration

interface EmailData {
  email: string
  company: string
  industry: string
  monthlyShipments?: string
}

interface EmailResponse {
  success: boolean
  messageId?: string
  error?: string
}

export async function subscribeToNewsletter(data: EmailData): Promise<EmailResponse> {
  // Mock implementation for local development
  console.log('Mock email subscription:', data)
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))
  
  // Mock validation
  if (!data.email || !data.email.includes('@')) {
    return { success: false, error: 'Invalid email address' }
  }
  
  if (!data.company || data.company.length < 2) {
    return { success: false, error: 'Company name is required' }
  }
  
  // Mock successful response
  return {
    success: true,
    messageId: `mock-${Date.now()}`,
  }
}

export async function sendEmail(to: string, subject: string, content: string): Promise<EmailResponse> {
  // Mock implementation
  console.log('Mock email send:', { to, subject, content: content.substring(0, 100) + '...' })
  
  await new Promise(resolve => setTimeout(resolve, 300))
  
  return {
    success: true,
    messageId: `mock-send-${Date.now()}`,
  }
}