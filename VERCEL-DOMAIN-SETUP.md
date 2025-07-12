# Vercel Domain Configuration for ShipNode.io

## ✅ DNS Status: Ready
Your DNS records are already configured and propagating:
- `shipnode.io` → Cloudflare (✅ Ready)
- `www.shipnode.io` → Cloudflare (✅ Ready)

## 🚀 Configure Vercel Domain

### Step 1: Access Your Vercel Project
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Find your **shippingaggregator** project (or similar name)
3. Click on the project to open it

### Step 2: Add Custom Domains
1. Click **Settings** tab
2. Click **Domains** in the left sidebar
3. Add these domains one by one:

#### Domain 1: shipnode.io
```
Domain: shipnode.io
Leave all other fields as default
Click "Add"
```

#### Domain 2: www.shipnode.io  
```
Domain: www.shipnode.io
Leave all other fields as default
Click "Add"
```

### Step 3: Verification (Should be automatic)
- Vercel will automatically detect the CNAME records
- You should see ✅ **Valid Configuration** within 1-2 minutes
- If not, wait 5-10 minutes for DNS propagation

### Step 4: Set Primary Domain (Recommended)
1. After both domains are verified
2. Click the **⋯** menu next to `shipnode.io`
3. Select **"Set as Primary Domain"**
4. This makes `shipnode.io` the canonical URL

### Step 5: Configure Redirects (Optional but Recommended)
1. In **Settings** → **Domains**
2. Click the **⋯** menu next to `www.shipnode.io`
3. Select **"Redirect to shipnode.io"**
4. Choose **301 Permanent Redirect**

## 🔧 Environment Variables for Production

Add these to your Vercel project environment variables:

### Required Variables:
```
POSTMARK_API_TOKEN=24e8278c-f9ea-46e8-bab6-d305cd74121c
POSTMARK_FROM_EMAIL=hello@shipnode.io  
UNSUBSCRIBE_SECRET=manufacturing-freight-unsubscribe-2025-secure-key
NEXT_PUBLIC_SITE_URL=https://shipnode.io
```

### Optional (for advanced features):
```
CLOUDFLARE_API_TOKEN=0zZo-tPrLei1ljlh06rAZjtJIRc9VgBZXzJMO72w
CLOUDFLARE_ZONE_ID=dc72c04373db590227ad2efe656ad2b5
CLOUDFLARE_ACCOUNT_ID=fad68799311b3ae4dbc044750cb7f701
```

## 📋 Environment Variables Setup Steps:
1. In your Vercel project, go to **Settings** → **Environment Variables**
2. Add each variable:
   - **Name**: Variable name (e.g., `POSTMARK_API_TOKEN`)
   - **Value**: The actual value
   - **Environments**: Select **All** (Production, Preview, Development)
3. Click **Save** for each variable
4. Deploy your project (or it will auto-deploy on next commit)

## ✅ Verification Checklist

After setup, verify these work:

- [ ] `https://shipnode.io` loads your site
- [ ] `https://www.shipnode.io` redirects to `shipnode.io` 
- [ ] SSL certificate is working (🔒 in browser)
- [ ] Email forms work with new domain
- [ ] Environment variables are accessible in production

## 🚨 Troubleshooting

**If domains show "Invalid Configuration":**
1. Wait 10-15 minutes for DNS propagation
2. Check DNS records in Cloudflare dashboard
3. Verify CNAME records point to `cname.vercel-dns.com`

**If SSL certificate fails:**
1. Domains must be verified first
2. SSL provisioning can take 5-10 minutes
3. Try removing and re-adding the domain

**If environment variables don't work:**
1. Ensure they're set for "All" environments
2. Redeploy your project after adding variables
3. Check variable names match exactly (case-sensitive)

## 🎯 Expected Results

After successful configuration:
- **Primary URL**: https://shipnode.io
- **Redirect**: https://www.shipnode.io → https://shipnode.io
- **SSL**: ✅ Automatic HTTPS
- **Email**: Working with @shipnode.io sender
- **Performance**: Cloudflare CDN + Vercel Edge

Your site should be live and fully functional within 15 minutes!