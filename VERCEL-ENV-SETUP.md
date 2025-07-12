# Vercel Environment Variables Setup

## Required Environment Variables

Add these environment variables in your Vercel project dashboard:

### 1. Postmark Email Service
```
POSTMARK_API_TOKEN=24e8278c-f9ea-46e8-bab6-d305cd74121c
POSTMARK_FROM_EMAIL=hello@machineshop.directory
```

### 2. Unsubscribe Security
```
UNSUBSCRIBE_SECRET=manufacturing-freight-unsubscribe-2025-secure-key
```

## How to Add Variables in Vercel

1. Go to your Vercel project: https://vercel.com/karl-waldmans-projects/shippingaggregator
2. Click "Settings" tab
3. Click "Environment Variables" in sidebar
4. Add each variable:
   - **Name**: POSTMARK_API_TOKEN
   - **Value**: 24e8278c-f9ea-46e8-bab6-d305cd74121c
   - **Environment**: All (Production, Preview, Development)
5. Repeat for POSTMARK_FROM_EMAIL and UNSUBSCRIBE_SECRET
6. Click "Save"
7. Redeploy your application (or it will auto-deploy on next commit)

## Testing Production Email Flow

After adding environment variables, test the complete flow:

1. Visit your live site: https://shippingaggregator-[hash].vercel.app
2. Submit the email form with a real email address
3. Check that you receive:
   - Notification email at karl.waldman+shipping@gmail.com
   - Welcome email at the submitted address
4. Click the unsubscribe link in the welcome email
5. Verify unsubscribe page works correctly
6. Try to resubscribe with the same email (should be blocked)

## Security Notes

- Never commit these tokens to git
- The .env.local file is already in .gitignore
- Tokens are now properly secured as environment variables
- Unsubscribe tokens use HMAC for security

## Next Steps After Environment Variables

1. ✅ Legal pages (completed)
2. 🔄 Environment variables (you're doing this now)
3. 📊 Set up Google Analytics
4. 🌐 Configure custom domain (optional)
5. 🔍 Set up Google Search Console
6. 📈 Monitor email performance in Postmark dashboard