# Create GA4 Property for ShipNode

## Quick Manual Setup (5 minutes)

### 1. Go to Google Analytics
- Visit [analytics.google.com](https://analytics.google.com/)
- Sign in with karl.waldman+shipping@gmail.com

### 2. Create New Property
- Click **"Start measuring"** if this is your first property
- OR click the property dropdown (top left) → **"Create property"**

### 3. Property Setup
- **Property name**: `ShipNode Production`
- **Reporting time zone**: `(GMT-05:00) Eastern Time`
- **Currency**: `USD`
- Click **"Next"**

### 4. Business Details
- **Industry category**: `Business & Industrial Markets`
- **Business size**: `Small - 1 to 10 employees`
- Click **"Next"**

### 5. Business Objectives
Select these objectives:
- ✅ Generate leads
- ✅ Examine user behavior
- Click **"Create"**

### 6. Data Collection Setup
- Choose platform: **Web**
- **Website URL**: `https://shipnode.io`
- **Stream name**: `ShipNode Web`
- **Enhanced measurement**: Leave ON (default)
- Click **"Create stream"**

### 7. Get Your Measurement ID
- ✨ Your Measurement ID appears at the top: `G-XXXXXXXXXX`
- Click the copy icon to copy it

### 8. Add to Vercel
1. Go to [Vercel Dashboard](https://vercel.com/karl-waldmans-projects/shippingaggregator/settings/environment-variables)
2. Add new variable:
   - **Key**: `NEXT_PUBLIC_GA_MEASUREMENT_ID`
   - **Value**: `G-XXXXXXXXXX` (paste your ID)
   - **Environment**: Select all (Production, Preview, Development)
3. Click **"Save"**

### 9. Redeploy
- Vercel will automatically redeploy
- OR manually redeploy from the Deployments tab

## Verify It's Working

1. Visit https://shipnode.io after deployment
2. In Google Analytics, go to **Reports** → **Realtime**
3. You should see:
   - 1 user in last 30 minutes (you)
   - Your page views
   - Events firing (form views, etc.)

## What Gets Tracked Automatically

With our integration, you'll track:
- ✅ All page views
- ✅ Waitlist form submissions
- ✅ Calculator form submissions
- ✅ Email unsubscribes
- ✅ Conversion events
- ✅ User engagement metrics

## Troubleshooting

**Don't see data?**
1. Check browser console for errors
2. Verify measurement ID starts with "G-"
3. Try incognito mode (ad blockers can interfere)
4. Wait 5 minutes (initial data can be delayed)

**Still need help?**
- Check [GA4 Debugger](https://chrome.google.com/webstore/detail/google-analytics-debugger/jnkmfdileelhofjcijamephohjechhna)
- View browser Network tab for "collect" requests to google-analytics.com