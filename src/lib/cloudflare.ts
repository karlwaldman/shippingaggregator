/**
 * Cloudflare API Integration
 * Handles DNS record management and domain configuration
 */

interface CloudflareConfig {
  apiToken: string
  zoneId: string
  accountId: string
}

interface DNSRecord {
  type: 'A' | 'AAAA' | 'CNAME' | 'MX' | 'TXT' | 'SRV'
  name: string
  content: string
  ttl?: number
  priority?: number
  proxied?: boolean
}

interface CloudflareResponse<T = any> {
  success: boolean
  errors: Array<{ code: number; message: string }>
  messages: Array<{ code: number; message: string }>
  result: T
}

class CloudflareAPI {
  private config: CloudflareConfig
  private baseURL = 'https://api.cloudflare.com/client/v4'

  constructor(config: CloudflareConfig) {
    this.config = config
  }

  private async request<T = any>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    data?: any
  ): Promise<CloudflareResponse<T>> {
    const url = `${this.baseURL}${endpoint}`
    
    const response = await fetch(url, {
      method,
      headers: {
        'Authorization': `Bearer ${this.config.apiToken}`,
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : undefined,
    })

    if (!response.ok) {
      throw new Error(`Cloudflare API error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  /**
   * List all DNS records for the zone
   */
  async listDNSRecords(): Promise<CloudflareResponse<DNSRecord[]>> {
    return this.request(`/zones/${this.config.zoneId}/dns_records`)
  }

  /**
   * Create a new DNS record
   */
  async createDNSRecord(record: DNSRecord): Promise<CloudflareResponse<DNSRecord>> {
    return this.request(`/zones/${this.config.zoneId}/dns_records`, 'POST', record)
  }

  /**
   * Update an existing DNS record
   */
  async updateDNSRecord(recordId: string, record: Partial<DNSRecord>): Promise<CloudflareResponse<DNSRecord>> {
    return this.request(`/zones/${this.config.zoneId}/dns_records/${recordId}`, 'PUT', record)
  }

  /**
   * Delete a DNS record
   */
  async deleteDNSRecord(recordId: string): Promise<CloudflareResponse<{ id: string }>> {
    return this.request(`/zones/${this.config.zoneId}/dns_records/${recordId}`, 'DELETE')
  }

  /**
   * Get zone information
   */
  async getZoneInfo(): Promise<CloudflareResponse<{ id: string; name: string; status: string }>> {
    return this.request(`/zones/${this.config.zoneId}`)
  }

  /**
   * Setup common DNS records for shipnode.io
   */
  async setupShipNodeDNS(): Promise<{
    success: boolean
    records: Array<{ type: string; name: string; status: 'created' | 'exists' | 'error'; error?: string }>
  }> {
    const records = [
      // Vercel setup
      { type: 'CNAME', name: '@', content: 'cname.vercel-dns.com', proxied: true },
      { type: 'CNAME', name: 'www', content: 'cname.vercel-dns.com', proxied: true },
      
      // Postmark email setup
      { type: 'TXT', name: '@', content: 'v=spf1 include:spf.mtasv.net ~all', proxied: false },
      { type: 'CNAME', name: 'pm._domainkey', content: 'pm.mtasv.net', proxied: false },
      
      // DMARC policy
      { 
        type: 'TXT', 
        name: '_dmarc', 
        content: 'v=DMARC1; p=quarantine; rua=mailto:dmarc@shipnode.io; ruf=mailto:dmarc@shipnode.io; sp=quarantine; adkim=r; aspf=r;',
        proxied: false 
      },
    ]

    const results = []

    for (const record of records) {
      try {
        // Check if record already exists
        const existingRecords = await this.listDNSRecords()
        const exists = existingRecords.result?.find(
          r => r.type === record.type && r.name === record.name
        )

        if (exists) {
          results.push({
            type: record.type,
            name: record.name,
            status: 'exists' as const
          })
        } else {
          await this.createDNSRecord(record as DNSRecord)
          results.push({
            type: record.type,
            name: record.name,
            status: 'created' as const
          })
        }
      } catch (error) {
        results.push({
          type: record.type,
          name: record.name,
          status: 'error' as const,
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }

    return {
      success: results.every(r => r.status !== 'error'),
      records: results
    }
  }
}

/**
 * Initialize Cloudflare API client
 */
export function createCloudflareClient(): CloudflareAPI | null {
  const apiToken = process.env.CLOUDFLARE_API_TOKEN
  const zoneId = process.env.CLOUDFLARE_ZONE_ID
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID

  if (!apiToken || !zoneId || !accountId) {
    console.warn('Cloudflare API credentials not configured')
    return null
  }

  return new CloudflareAPI({ apiToken, zoneId, accountId })
}

export type { DNSRecord, CloudflareResponse, CloudflareConfig }
export { CloudflareAPI }