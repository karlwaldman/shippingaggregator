# Postmark Domain Configuration for ShipNode.io

## ✅ DNS Status: Ready
Your email DNS records are already configured:
- **SPF Record**: `v=spf1 include:spf.mtasv.net ~all` ✅
- **DKIM Record**: `pm._domainkey.shipnode.io` → `pm.mtasv.net` ✅  
- **DMARC Policy**: Configured for email security ✅

## 🚀 Configure Postmark Domain

### Step 1: Access Postmark Account
1. Go to [Postmark Account](https://account.postmarkapp.com/)
2. Log in to your account
3. Select your **Server** (the one with API token: `24e8278c-f9ea-46e8-bab6-d305cd74121c`)

### Step 2: Add Sender Signature Domain
1. Go to **Sending** → **Sender Signatures**
2. Click **Add Domain**
3. Enter domain information:

```
Domain: shipnode.io
Return-Path: bounces.shipnode.io (Postmark will suggest this)
DKIM Signing: ✅ Enable
```

### Step 3: Verify DNS Records
Postmark will show you the required DNS records. **They should already match** what we configured:

#### ✅ Expected Records (Should show as verified):
```
SPF Record:
Type: TXT
Host: @  
Value: v=spf1 include:spf.mtasv.net ~all

DKIM Record:
Type: CNAME
Host: [postmark-selector]._domainkey
Value: [postmark-value].pmta.io

Return-Path (if using):
Type: CNAME  
Host: bounces
Value: pm.mtasv.net
```

### Step 4: Verify Domain
1. Click **Verify Domain** in Postmark
2. Postmark will check the DNS records
3. Should show ✅ **Verified** for all records
4. If not verified immediately, wait 5-10 minutes and try again

### Step 5: Update From Address
1. In **Sender Signatures**, click on your verified domain
2. Add sender addresses:

```
✅ hello@shipnode.io (Primary)
✅ support@shipnode.io  
✅ noreply@shipnode.io
✅ dmarc@shipnode.io (for DMARC reports)
```

## 🔧 Update Application Configuration

Your application is already configured to use Postmark, but let's verify the settings:

### Current Environment Variables:
```
POSTMARK_API_TOKEN=24e8278c-f9ea-46e8-bab6-d305cd74121c ✅
POSTMARK_FROM_EMAIL=hello@shipnode.io ✅
```

### Email Configuration Location:
- File: `src/lib/postmark.ts`
- API Endpoint: `src/pages/api/subscribe.ts`

## 📧 Test Email Functionality

### Method 1: Test via Application
1. Go to your live site: `https://shipnode.io`
2. Submit the email signup form
3. Check that emails are sent from `hello@shipnode.io`

### Method 2: Test via Postmark Dashboard  
1. Go to **Activity** → **Outbound**
2. Click **Send Test Email**
3. Use `hello@shipnode.io` as sender
4. Send to your personal email

### Method 3: API Test (Advanced)
```bash
curl -X POST "https://api.postmarkapp.com/email" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -H "X-Postmark-Server-Token: 24e8278c-f9ea-46e8-bab6-d305cd74121c" \
  -d '{
    "From": "hello@shipnode.io",
    "To": "your-email@example.com",
    "Subject": "ShipNode.io Email Test",
    "TextBody": "This is a test email from ShipNode.io domain setup!"
  }'
```

## 🔒 Email Security Features

Your domain is configured with advanced email security:

### ✅ SPF (Sender Policy Framework)
- **Status**: Configured
- **Purpose**: Prevents email spoofing
- **Record**: `v=spf1 include:spf.mtasv.net ~all`

### ✅ DKIM (DomainKeys Identified Mail)  
- **Status**: Configured
- **Purpose**: Email authenticity verification
- **Selector**: `pm._domainkey.shipnode.io`

### ✅ DMARC (Domain-based Message Authentication)
- **Status**: Configured  
- **Policy**: Quarantine suspicious emails
- **Reports**: Sent to `dmarc@shipnode.io`

## 📊 Monitor Email Performance

### Postmark Dashboard Metrics:
1. **Delivery Rate**: Should be >99%
2. **Bounce Rate**: Should be <2%  
3. **Spam Complaints**: Should be <0.1%
4. **Open/Click Rates**: Track engagement

### DMARC Reports:
- Check `dmarc@shipnode.io` for weekly reports
- Monitor for unauthorized use of your domain
- Adjust DMARC policy based on reports

## ✅ Verification Checklist

After setup, verify these work:

- [ ] Domain shows as ✅ **Verified** in Postmark
- [ ] Test email sent successfully from `hello@shipnode.io`
- [ ] Email received without spam folder placement
- [ ] SPF, DKIM, and DMARC all pass authentication
- [ ] Application email forms work with new domain
- [ ] DMARC reports are being generated

## 🚨 Troubleshooting

**If domain verification fails:**
1. Wait 10-15 minutes for DNS propagation  
2. Check DNS records in Cloudflare dashboard
3. Ensure CNAME records are not proxied (gray cloud ☁️)
4. Try **Re-verify** in Postmark

**If emails go to spam:**
1. Verify SPF, DKIM, and DMARC are all passing
2. Check email content for spam triggers
3. Warm up the domain with gradual sending increase
4. Monitor sender reputation

**If DMARC reports show failures:**
1. Review unauthorized sending sources
2. Tighten DMARC policy from `quarantine` to `reject`
3. Add authorized senders to SPF record

## 🎯 Expected Results

After successful configuration:
- **Sender Email**: hello@shipnode.io ✅
- **Domain Status**: Verified ✅  
- **Email Security**: SPF + DKIM + DMARC ✅
- **Delivery Rate**: >99% ✅
- **Professional**: Branded email domain ✅

Your email system should be fully operational and secure!