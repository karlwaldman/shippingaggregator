/**
 * Postmark Administrative API Integration
 * Handles domain verification, sender signature setup, and server configuration
 */

interface PostmarkConfig {
  accountToken: string
  serverToken: string
}

interface PostmarkDomain {
  ID: number
  Name: string
  SPFVerified: boolean
  DKIMVerified: boolean
  WeakDKIM: boolean
  ReturnPathDomainVerified: boolean
  SafeToRemoveRevokedKeyFromDNS: boolean
  DKIMRevokedKeyCount: number
}

interface PostmarkSenderSignature {
  ID: number
  Domain: string
  EmailAddress: string
  Name: string
  ReplyToEmailAddress: string
  Confirmed: boolean
  SPFVerified: boolean
  DKIMVerified: boolean
  ReturnPathDomainVerified: boolean
  SafeToRemoveRevokedKeyFromDNS: boolean
  DKIMRevokedKeyCount: number
}

interface PostmarkDomainDetails {
  SPFHost: string
  SPFTextValue: string
  DKIMHost: string
  DKIMTextValue: string
  DKIMPendingHost: string
  DKIMPendingTextValue: string
  DKIMRevokedHost: string
  DKIMRevokedTextValue: string
  WeakDKIM: boolean
  ReturnPathDomain: string
  ReturnPathDomainCNAMEValue: string
}

interface PostmarkResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  code?: number
}

class PostmarkAdminAPI {
  private config: PostmarkConfig
  private baseURL = 'https://api.postmarkapp.com'

  constructor(config: PostmarkConfig) {
    this.config = config
  }

  private async request<T = any>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    data?: any,
    useAccountToken = false
  ): Promise<PostmarkResponse<T>> {
    const url = `${this.baseURL}${endpoint}`
    
    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          ...(useAccountToken 
            ? { 'X-Postmark-Account-Token': this.config.accountToken }
            : { 'X-Postmark-Server-Token': this.config.serverToken }
          ),
        },
        body: data ? JSON.stringify(data) : undefined,
      })

      if (!response.ok) {
        const errorText = await response.text()
        return {
          success: false,
          error: `Postmark API error: ${response.status} ${response.statusText} - ${errorText}`,
          code: response.status
        }
      }

      const result = await response.json()
      return {
        success: true,
        data: result
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }

  /**
   * Get list of domains
   */
  async getDomains(): Promise<PostmarkResponse<PostmarkDomain[]>> {
    return this.request('/domains?count=100&offset=0', 'GET', undefined, true)
  }

  /**
   * Get domain details including DNS records
   */
  async getDomainDetails(domainId: number): Promise<PostmarkResponse<PostmarkDomainDetails>> {
    return this.request(`/domains/${domainId}`, 'GET', undefined, true)
  }

  /**
   * Add a new domain
   */
  async addDomain(domain: string, returnPathDomain?: string): Promise<PostmarkResponse<PostmarkDomain>> {
    const payload = {
      Name: domain,
      ReturnPathDomain: returnPathDomain || `bounces.${domain}`
    }
    
    return this.request('/domains', 'POST', payload, true)
  }

  /**
   * Verify domain DKIM and SPF records
   */
  async verifyDomain(domainId: number): Promise<PostmarkResponse<PostmarkDomain>> {
    return this.request(`/domains/${domainId}/verifydkim`, 'PUT', {}, true)
  }

  /**
   * Get sender signatures
   */
  async getSenderSignatures(): Promise<PostmarkResponse<PostmarkSenderSignature[]>> {
    return this.request('/senders?count=100&offset=0', 'GET', undefined, true)
  }

  /**
   * Create sender signature
   */
  async createSenderSignature(
    name: string,
    email: string,
    replyToEmail?: string
  ): Promise<PostmarkResponse<PostmarkSenderSignature>> {
    const payload = {
      Name: name,
      FromEmail: email,
      ReplyToEmail: replyToEmail || email,
      ReturnPathDomain: `bounces.${email.split('@')[1]}`
    }

    return this.request('/senders', 'POST', payload, true)
  }

  /**
   * Get server information
   */
  async getServerInfo(): Promise<PostmarkResponse<any>> {
    return this.request('/server', 'GET', undefined, false)
  }

  /**
   * Complete automated domain setup for shipnode.io
   */
  async setupShipNodeDomain(): Promise<{
    success: boolean
    domain?: PostmarkDomain
    senderSignatures?: PostmarkSenderSignature[]
    errors: string[]
    steps: Array<{ step: string; status: 'success' | 'error' | 'skipped'; message: string }>
  }> {
    const errors: string[] = []
    const steps: Array<{ step: string; status: 'success' | 'error' | 'skipped'; message: string }> = []
    let domain: PostmarkDomain | undefined
    let senderSignatures: PostmarkSenderSignature[] = []

    // Step 1: Check if domain already exists
    const existingDomainsResult = await this.getDomains()
    if (!existingDomainsResult.success) {
      errors.push(`Failed to get existing domains: ${existingDomainsResult.error}`)
      steps.push({ step: 'Check existing domains', status: 'error', message: existingDomainsResult.error! })
      return { success: false, errors, steps }
    }

    const existingDomain = existingDomainsResult.data?.find(d => d.Name === 'shipnode.io')
    
    if (existingDomain) {
      domain = existingDomain
      steps.push({ step: 'Check existing domain', status: 'skipped', message: 'Domain already exists' })
    } else {
      // Step 2: Add domain
      const addDomainResult = await this.addDomain('shipnode.io', 'bounces.shipnode.io')
      if (!addDomainResult.success) {
        errors.push(`Failed to add domain: ${addDomainResult.error}`)
        steps.push({ step: 'Add domain', status: 'error', message: addDomainResult.error! })
        return { success: false, errors, steps }
      }
      
      domain = addDomainResult.data!
      steps.push({ step: 'Add domain', status: 'success', message: 'Domain added successfully' })
    }

    // Step 3: Verify domain
    if (domain && (!domain.SPFVerified || !domain.DKIMVerified)) {
      const verifyResult = await this.verifyDomain(domain.ID)
      if (verifyResult.success) {
        domain = verifyResult.data!
        steps.push({ 
          step: 'Verify domain', 
          status: 'success', 
          message: `SPF: ${domain.SPFVerified ? '✅' : '❌'}, DKIM: ${domain.DKIMVerified ? '✅' : '❌'}` 
        })
      } else {
        errors.push(`Domain verification failed: ${verifyResult.error}`)
        steps.push({ step: 'Verify domain', status: 'error', message: verifyResult.error! })
      }
    } else {
      steps.push({ step: 'Verify domain', status: 'skipped', message: 'Domain already verified' })
    }

    // Step 4: Create sender signatures
    const senderEmails = [
      { name: 'ShipNode Support', email: 'hello@shipnode.io' },
      { name: 'ShipNode Support', email: 'support@shipnode.io' },
      { name: 'ShipNode System', email: 'noreply@shipnode.io' },
      { name: 'ShipNode DMARC', email: 'dmarc@shipnode.io' }
    ]

    const existingSignaturesResult = await this.getSenderSignatures()
    const existingEmails = existingSignaturesResult.success 
      ? existingSignaturesResult.data?.map(s => s.EmailAddress) || []
      : []

    for (const sender of senderEmails) {
      if (existingEmails.includes(sender.email)) {
        steps.push({ 
          step: `Create sender ${sender.email}`, 
          status: 'skipped', 
          message: 'Sender already exists' 
        })
        continue
      }

      const createResult = await this.createSenderSignature(sender.name, sender.email)
      if (createResult.success) {
        senderSignatures.push(createResult.data!)
        steps.push({ 
          step: `Create sender ${sender.email}`, 
          status: 'success', 
          message: 'Sender signature created' 
        })
      } else {
        errors.push(`Failed to create sender ${sender.email}: ${createResult.error}`)
        steps.push({ 
          step: `Create sender ${sender.email}`, 
          status: 'error', 
          message: createResult.error! 
        })
      }
    }

    return {
      success: errors.length === 0,
      domain,
      senderSignatures,
      errors,
      steps
    }
  }
}

/**
 * Initialize Postmark Admin API client
 */
export function createPostmarkAdminClient(): PostmarkAdminAPI | null {
  const serverToken = process.env.POSTMARK_API_TOKEN
  const accountToken = process.env.POSTMARK_ACCOUNT_TOKEN

  if (!serverToken || !accountToken) {
    console.warn('Postmark API credentials not configured - need both server and account tokens')
    return null
  }

  return new PostmarkAdminAPI({ 
    accountToken, 
    serverToken 
  })
}

export type { 
  PostmarkDomain, 
  PostmarkSenderSignature, 
  PostmarkDomainDetails, 
  PostmarkResponse 
}
export { PostmarkAdminAPI }