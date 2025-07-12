import { GetServerSideProps } from 'next'

// This component doesn't render anything - it just generates XML
function SiteMap() {
  return null
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://shipnode.io').trim()
  
  // Static pages
  const staticPages = [
    '',
    '/calculator',
    '/address-validator',
    '/fedex-progress',
    '/privacy',
    '/terms',
    '/cookies'
  ]

  // Generate sitemap XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${staticPages
  .map((page) => {
    const url = `${baseUrl}${page}`
    const priority = page === '' ? '1.0' : page === '/calculator' ? '0.9' : page === '/address-validator' ? '0.9' : page === '/fedex-progress' ? '0.8' : '0.7'
    const changefreq = page === '' ? 'weekly' : page === '/calculator' ? 'monthly' : page === '/address-validator' ? 'monthly' : page === '/fedex-progress' ? 'weekly' : 'yearly'
    
    return `  <url>
    <loc>${url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
  })
  .join('\n')}
</urlset>`

  res.setHeader('Content-Type', 'text/xml')
  res.write(sitemap)
  res.end()

  return {
    props: {}
  }
}

export default SiteMap