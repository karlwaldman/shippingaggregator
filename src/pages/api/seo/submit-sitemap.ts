import type { NextApiRequest, NextApiResponse } from 'next'

interface SitemapSubmissionResponse {
  success: boolean
  message: string
  sitemapUrl: string
  submissionUrls: {
    google: string
    bing: string
  }
  steps: string[]
  verification: {
    sitemapAccessible: boolean
    robotsAccessible: boolean
    gscVerified: boolean
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SitemapSubmissionResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed',
      sitemapUrl: '',
      submissionUrls: { google: '', bing: '' },
      steps: [],
      verification: { sitemapAccessible: false, robotsAccessible: false, gscVerified: false }
    })
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://shipnode.io'
  const sitemapUrl = `${baseUrl}/sitemap.xml`
  const robotsUrl = `${baseUrl}/robots.txt`

  // Test sitemap and robots.txt accessibility
  let sitemapAccessible = false
  let robotsAccessible = false

  try {
    const sitemapResponse = await fetch(sitemapUrl)
    sitemapAccessible = sitemapResponse.ok && 
      sitemapResponse.headers.get('content-type')?.includes('xml') || false
  } catch (error) {
    console.error('Sitemap accessibility test failed:', error)
  }

  try {
    const robotsResponse = await fetch(robotsUrl)
    robotsAccessible = robotsResponse.ok && 
      robotsResponse.headers.get('content-type')?.includes('text/plain') || false
  } catch (error) {
    console.error('Robots.txt accessibility test failed:', error)
  }

  // Generate submission URLs
  const submissionUrls = {
    google: `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`,
    bing: `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`
  }

  // Submit to Google (ping)
  let googleSubmitted = false
  try {
    const googleResponse = await fetch(submissionUrls.google)
    googleSubmitted = googleResponse.ok
  } catch (error) {
    console.error('Google sitemap submission failed:', error)
  }

  // Submit to Bing (ping)
  let bingSubmitted = false
  try {
    const bingResponse = await fetch(submissionUrls.bing)
    bingSubmitted = bingResponse.ok
  } catch (error) {
    console.error('Bing sitemap submission failed:', error)
  }

  // Generate manual steps
  const steps = [
    '1. Verify sitemap is accessible: ' + sitemapUrl,
    '2. Check robots.txt is working: ' + robotsUrl,
    '3. Google Search Console:',
    '   - Go to https://search.google.com/search-console',
    '   - Select shipnode.io property', 
    '   - Go to Sitemaps section',
    '   - Add new sitemap: sitemap.xml',
    '4. Bing Webmaster Tools:',
    '   - Go to https://www.bing.com/webmasters',
    '   - Add sitemap: ' + sitemapUrl,
    '5. Monitor indexing status in both consoles'
  ]

  if (googleSubmitted) {
    steps.splice(3, 0, '✅ Google sitemap ping submitted automatically')
  }

  if (bingSubmitted) {
    steps.splice(-1, 0, '✅ Bing sitemap ping submitted automatically')  
  }

  const success = sitemapAccessible && robotsAccessible

  return res.status(200).json({
    success,
    message: success 
      ? 'Sitemap and robots.txt are ready for submission'
      : 'Some issues found - check sitemap/robots accessibility',
    sitemapUrl,
    submissionUrls,
    steps,
    verification: {
      sitemapAccessible,
      robotsAccessible,
      gscVerified: false // Would need GSC API for this
    }
  })
}