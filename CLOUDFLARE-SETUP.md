# Cloudflare API Setup for ShipNode.io

## Getting Your Cloudflare API Credentials

### 1. Get API Token
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/profile/api-tokens)
2. Click "Create Token"
3. Use "Custom Token" template
4. **Permissions:**
   - Zone: Zone Settings: Read
   - Zone: Zone: Read  
   - Zone: DNS: Edit
5. **Zone Resources:**
   - Include: Specific zone: shipnode.io
6. **Client IP Address Filtering:** (optional, leave blank for no restrictions)
7. Click "Continue to Summary" → "Create Token"
8. **Copy the token** (you won't see it again!)

### 2. Get Zone ID
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Click on your **shipnode.io** domain
3. In the right sidebar, copy the **Zone ID**

### 3. Get Account ID
1. In Cloudflare Dashboard, look at the right sidebar
2. Copy the **Account ID**

## Environment Variables Setup

Add these to your `.env.local` file:

```bash
# Cloudflare API Configuration
CLOUDFLARE_API_TOKEN=your_api_token_from_step_1
CLOUDFLARE_ZONE_ID=your_zone_id_from_step_2  
CLOUDFLARE_ACCOUNT_ID=your_account_id_from_step_3
```

## Automated DNS Setup

Once configured, you can use the API to automatically setup DNS records:

### Option 1: API Endpoint (Programmatic)
```bash
curl -X POST http://localhost:3000/api/cloudflare/setup-dns \
  -H "Content-Type: application/json"
```

### Option 2: Manual DNS Records

Add these records manually in Cloudflare Dashboard:

#### Vercel Integration
```
Type: CNAME
Name: @
Target: cname.vercel-dns.com
Proxy: ✅ Proxied (orange cloud)

Type: CNAME
Name: www  
Target: cname.vercel-dns.com
Proxy: ✅ Proxied (orange cloud)
```

#### Postmark Email Setup
```
Type: TXT
Name: @
Content: v=spf1 include:spf.mtasv.net ~all
Proxy: ❌ DNS only (gray cloud)

Type: CNAME
Name: pm._domainkey
Target: pm.mtasv.net
Proxy: ❌ DNS only
```

#### DMARC Policy
```
Type: TXT
Name: _dmarc
Content: v=DMARC1; p=quarantine; rua=mailto:dmarc@shipnode.io; ruf=mailto:dmarc@shipnode.io; sp=quarantine; adkim=r; aspf=r;
Proxy: ❌ DNS only
```

#### Google Verification (Optional)
```
Type: TXT
Name: @
Content: google-site-verification=your_verification_code
Proxy: ❌ DNS only
```

## Testing the Setup

1. **Test API Integration:**
   ```bash
   npm run dev
   # Visit: http://localhost:3000/api/cloudflare/setup-dns
   ```

2. **Verify DNS Propagation:**
   ```bash
   dig shipnode.io
   dig www.shipnode.io
   dig TXT shipnode.io
   ```

3. **Check Domain in Vercel:**
   - Add shipnode.io and www.shipnode.io to your Vercel project
   - Vercel should automatically verify the DNS

## Troubleshooting

### Common Issues:

1. **"Zone access failed"**
   - Check Zone ID is correct
   - Verify API token has Zone:Read permissions

2. **"DNS record creation failed"**
   - Ensure API token has DNS:Edit permissions
   - Check if records already exist

3. **"Domain not verified in Vercel"**
   - Wait 5-10 minutes for DNS propagation
   - Check CNAME records are properly set

### Useful Commands:
```bash
# Check DNS records
nslookup shipnode.io
nslookup www.shipnode.io

# Check SPF record
dig TXT shipnode.io | grep spf

# Check DMARC record  
dig TXT _dmarc.shipnode.io
```

## Security Notes

- **Never commit API tokens to git**
- API tokens are environment-specific (use different tokens for dev/prod)
- Consider IP restrictions for production API tokens
- Monitor API token usage in Cloudflare dashboard