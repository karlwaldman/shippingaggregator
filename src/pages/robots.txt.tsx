import { GetServerSideProps } from 'next'

// This component doesn't render anything - it just generates robots.txt
function RobotsTxt() {
  return null
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://shipnode.io'
  
  const robots = `User-agent: *
Allow: /

# Important pages
Allow: /calculator
Allow: /privacy
Allow: /terms

# Sitemap
Sitemap: ${baseUrl}/sitemap.xml

# Crawl-delay for respectful crawling
Crawl-delay: 1

# Block API endpoints from indexing
Disallow: /api/

# Block unsubscribe pages from indexing
Disallow: /unsubscribe`

  res.setHeader('Content-Type', 'text/plain')
  res.write(robots)
  res.end()

  return {
    props: {}
  }
}

export default RobotsTxt