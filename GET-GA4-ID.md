# How to Get Your GA4 Measurement ID

## Quick Steps

1. **Go to Google Analytics**
   - Visit [analytics.google.com](https://analytics.google.com/)
   - Sign in with your Google account

2. **Find Your Property**
   - Look for "ShipNode" or your property name in the property selector (top left)
   - If you haven't created a property yet, follow the setup steps below

3. **Get the Measurement ID**
   - Click the gear icon ⚙️ (Admin) in the bottom left
   - In the "Property" column, click "Data Streams"
   - Click on your web stream (should show "shipnode.io")
   - Your Measurement ID is at the top (looks like `G-XXXXXXXXXX`)
   - Click the copy button next to it

## If You Need to Create a New GA4 Property

1. **In Google Analytics Admin**
   - Click "Create" → "Property"
   - Property name: "ShipNode Production"
   - Time zone: Your timezone
   - Currency: USD
   - Click "Next"

2. **Business Information**
   - Industry: "Business & Industrial Markets"
   - Business size: Select appropriate
   - How you intend to use Google Analytics:
     - ✓ Generate leads
     - ✓ Examine user behavior
   - Click "Create"

3. **Set Up Data Stream**
   - Choose "Web"
   - Website URL: `https://shipnode.io`
   - Stream name: "ShipNode Production"
   - Enhanced measurement: Leave ON
   - Click "Create stream"

4. **Copy Your Measurement ID**
   - It appears at the top of the stream details
   - Format: `G-ABC123XYZ`

## Add to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your "shippingaggregator" project
3. Go to Settings → Environment Variables
4. Add:
   - Key: `NEXT_PUBLIC_GA_MEASUREMENT_ID`
   - Value: Your G-XXXXXXXXXX ID
   - Environment: All (Production, Preview, Development)
5. Save and redeploy

## Verify It's Working

After deployment:
1. Visit your site
2. In Google Analytics, go to Reports → Realtime
3. You should see yourself as an active user
4. Click around to verify pageview tracking

## Common IDs You Might See

- **Measurement ID**: `G-XXXXXXXXXX` (this is what you need)
- **Stream ID**: Long number (not needed)
- **Property ID**: 9-digit number (not needed for tracking)