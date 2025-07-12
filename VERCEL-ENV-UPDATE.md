# Vercel Environment Variables Update

Please add these environment variables to your Vercel project:

## FedEx API Configuration (Production & Preview)

```
FEDEX_API_KEY=[Your API key from earlier message]
FEDEX_SECRET_KEY=[Your secret key from earlier message]
FEDEX_API_URL=https://apis-sandbox.fedex.com
NEXT_PUBLIC_USE_MOCK_DATA=false
```

## Steps to Add:

1. Go to https://vercel.com/dashboard
2. Select your ShipNode project
3. Go to Settings → Environment Variables
4. Add each variable above for both Production and Preview environments
5. Redeploy to apply changes

## Important Notes:

- These are sandbox credentials, perfect for testing
- The calculator will now show real FedEx rates
- If API fails, it will fallback to mock data automatically
- Monitor API usage to ensure we stay within sandbox limits

## Testing the Calculator:

Try these test routes:
- Origin: 46201 (Indianapolis, IN)
- Destination: 90210 (Beverly Hills, CA)
- Weight: 10 lbs

You should see 3 FedEx service options with real pricing!