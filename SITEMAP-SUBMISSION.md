# Sitemap Submission Guide

## Prerequisites
- ✅ Google Search Console verified for shipnode.io
- ✅ Sitemap.xml endpoint created (will be live after deployment)
- ✅ Robots.txt configured

## After Deployment

### 1. Verify Sitemap is Live
Once deployed, verify the sitemap is accessible:
```
https://shipnode.io/sitemap.xml
https://shipnode.io/robots.txt
```

### 2. Submit to Google Search Console

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Select the `shipnode.io` property
3. Navigate to **Sitemaps** in the left sidebar
4. In the "Add a new sitemap" field, enter: `sitemap.xml`
5. Click **Submit**
6. Google will validate and begin crawling

### 3. Submit to Bing Webmaster Tools

1. Go to [Bing Webmaster Tools](https://www.bing.com/webmasters)
2. Add site if not already added
3. Navigate to **Sitemaps**
4. Click **Submit sitemap**
5. Enter: `https://shipnode.io/sitemap.xml`
6. Click **Submit**

### 4. Automatic Ping (Optional)

After deployment, you can also ping search engines directly:

```bash
# Google
curl "https://www.google.com/ping?sitemap=https://shipnode.io/sitemap.xml"

# Bing
curl "https://www.bing.com/ping?sitemap=https://shipnode.io/sitemap.xml"
```

Or use the API endpoint:
```bash
curl -X POST https://shipnode.io/api/seo/submit-sitemap
```

## What the Sitemap Contains

- Homepage (`/`)
- Calculator page (`/calculator`)
- Privacy Policy (`/privacy`)
- Terms of Service (`/terms`)
- Cookie Policy (`/cookies`)

## Monitoring

### In Google Search Console:
- Check **Coverage** report for indexing status
- Monitor **Performance** for search impressions
- Review **Sitemaps** for processing status

### Expected Timeline:
- Sitemap processing: 1-2 days
- Initial indexing: 3-7 days
- Full indexing: 1-2 weeks

## Troubleshooting

If sitemap shows errors:
1. Verify all URLs return 200 status
2. Check robots.txt isn't blocking pages
3. Ensure sitemap XML is valid
4. Confirm HTTPS is working properly

## Next Steps After Submission

1. Set up Google Analytics goals for conversions
2. Configure Search Console insights in GA4
3. Monitor organic traffic growth
4. Set up email alerts for crawl errors