# Google Analytics Setup Guide

## Overview
Google Analytics 4 (GA4) is now integrated into the ShipNode platform. This guide will help you set up your GA4 property and configure tracking.

## Step 1: Create Google Analytics Account

1. Go to [Google Analytics](https://analytics.google.com/)
2. Sign in with karl.waldman+shipping@gmail.com
3. Click "Start measuring"
4. Enter account name: "ShipNode"
5. Configure data sharing settings as desired
6. Click "Next"

## Step 2: Create GA4 Property

1. Property name: "ShipNode - Production"
2. Select reporting time zone: Your local timezone
3. Select currency: USD
4. Click "Next"
5. Business information:
   - Industry category: "Business & Industrial Markets"
   - Business size: Select appropriate
6. Select business objectives:
   - Generate leads
   - Examine user behavior
   - Drive online sales
7. Click "Create"

## Step 3: Set Up Data Stream

1. Choose platform: "Web"
2. Website URL: `https://shipnode.io`
3. Stream name: "ShipNode Production"
4. Enhanced measurement: Leave all options enabled
5. Click "Create stream"

## Step 4: Get Measurement ID

1. In the Web stream details, find your "Measurement ID"
2. It will look like: `G-XXXXXXXXXX`
3. Copy this ID

## Step 5: Add to Vercel Environment Variables

1. Go to your [Vercel Dashboard](https://vercel.com/karl-waldmans-projects/shippingaggregator/settings/environment-variables)
2. Add new variable:
   - Name: `NEXT_PUBLIC_GA_MEASUREMENT_ID`
   - Value: Your measurement ID (e.g., `G-ABC123XYZ`)
   - Environment: All (Production, Preview, Development)
3. Click "Save"
4. Redeploy your application

## Step 6: Verify Installation

1. Visit your live site
2. In Google Analytics, go to "Reports" → "Realtime"
3. You should see yourself as an active user
4. Navigate between pages to verify pageview tracking

## What's Being Tracked

The integration automatically tracks:

### Page Views
- Every page navigation
- Page titles and paths
- Referrer information

### Custom Events
1. **Form Submissions**
   - Waitlist signups (main page)
   - Calculator waitlist signups
   - Industry and shipment volume data

2. **Conversions**
   - Waitlist signups marked as conversions
   - Email interactions (signup, unsubscribe)

3. **Calculator Usage** (when launched)
   - Shipment type selected
   - Weight entered
   - Estimated costs calculated

4. **Engagement Metrics**
   - Time on page
   - Scroll depth (via Enhanced Measurement)
   - Outbound clicks

## Setting Up Goals & Conversions

1. In GA4, go to "Configure" → "Conversions"
2. Mark these events as conversions:
   - `Waitlist Signup` (already tracked)
   - `form_submit` (for any form submission)

## Creating Custom Reports

Recommended reports for manufacturing/shipping focus:

1. **Industry Breakdown Report**
   - Dimension: Event Parameter `industry`
   - Metrics: Users, Events, Engagement rate

2. **Shipment Volume Analysis**
   - Dimension: Event Parameter `monthlyShipments`
   - Metrics: Users, Conversions

3. **Lead Quality Score**
   - Combine industry + monthly shipments
   - Track progression through funnel

## Google Search Console Integration

1. In GA4, go to "Admin" → "Product Links" → "Search Console"
2. Link your Search Console property
3. This enables:
   - Organic search queries report
   - Landing page performance
   - Search position tracking

## Next Steps

1. Set up custom audiences for remarketing
2. Configure Google Ads integration (if using)
3. Set up weekly email reports
4. Create custom dashboards for key metrics

## Debugging

If tracking isn't working:

1. Check browser console for errors
2. Install [Google Analytics Debugger Chrome Extension](https://chrome.google.com/webstore/detail/google-analytics-debugger/jnkmfdileelhofjcijamephohjechhna)
3. Verify measurement ID is correct in Vercel
4. Check that ad blockers aren't interfering

## Privacy Compliance

The implementation respects:
- Cookie consent (when implemented)
- IP anonymization (enabled by default in GA4)
- User privacy choices
- GDPR compliance through Google's data processing terms