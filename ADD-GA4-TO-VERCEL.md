# Add Your GA4 Measurement ID to Vercel

## Your Measurement ID
`G-69KPYPT8CC`

## Steps to Add to Vercel

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/karl-waldmans-projects/shippingaggregator/settings/environment-variables

2. **Add New Environment Variable**
   - Click "Add New"
   - **Key**: `NEXT_PUBLIC_GA_MEASUREMENT_ID`
   - **Value**: `G-69KPYPT8CC`
   - **Environment**: Select all three:
     - ✅ Production
     - ✅ Preview  
     - ✅ Development

3. **Save**
   - Click "Save"

4. **Redeploy**
   - Go to the Deployments tab
   - Click "..." on the latest deployment
   - Select "Redeploy"
   - OR just push any commit and it will auto-deploy

## Verify It's Working

After deployment completes:

1. Visit https://shipnode.io
2. Open your Google Analytics dashboard
3. Go to **Reports** → **Realtime**
4. You should see:
   - Your visit showing as an active user
   - Page views being tracked
   - Events firing when you interact with forms

## What's Already Set Up

✅ Analytics library integrated (`/lib/analytics.ts`)
✅ Page view tracking in `_app.tsx`
✅ Event tracking on all forms:
  - Waitlist signups
  - Calculator form submissions
  - Unsubscribe actions
✅ Conversion tracking ready

## Quick Test

After adding the environment variable, you can also test locally:
```bash
# Add to your .env.local file
echo "NEXT_PUBLIC_GA_MEASUREMENT_ID=G-69KPYPT8CC" >> .env.local

# Restart your dev server
npm run dev

# Visit localhost:3000 and check browser console
# You should see GA events being sent
```

## Troubleshooting

If not seeing data:
1. Check browser Network tab for requests to `google-analytics.com/g/collect`
2. Make sure ad blockers are disabled
3. Try incognito mode
4. Check browser console for errors
5. Wait 5-10 minutes (initial data can be delayed)