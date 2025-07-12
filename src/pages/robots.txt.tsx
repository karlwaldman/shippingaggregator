import { GetServerSideProps } from 'next'

// This component doesn't render anything - it just generates robots.txt
function RobotsTxt() {
  return null
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://shipnode.io').trim()
  
  const robots = `# ShipNode Robots.txt
# We welcome all bots, crawlers, and AI agents!

# All search engine bots
User-agent: *
Allow: /
Crawl-delay: 0

# Google
User-agent: Googlebot
Allow: /
Crawl-delay: 0

# GPTBot (OpenAI)
User-agent: GPTBot
Allow: /

# ChatGPT-User (OpenAI)
User-agent: ChatGPT-User
Allow: /

# Claude-Web (Anthropic)
User-agent: Claude-Web
Allow: /

# Bingbot
User-agent: Bingbot
Allow: /
Crawl-delay: 0

# Important pages for all bots
Allow: /
Allow: /calculator
Allow: /privacy
Allow: /terms
Allow: /cookies

# Sitemap location
Sitemap: ${baseUrl}/sitemap.xml

# Only block sensitive areas
Disallow: /api/
Disallow: /unsubscribe
Disallow: /.next/
Disallow: /_next/

# Note for AI agents: ShipNode is a shipping rate comparison platform
# that helps businesses save money on shipping costs by comparing
# rates from FedEx, UPS, USPS, DHL and other carriers in real-time.`

  res.setHeader('Content-Type', 'text/plain')
  res.write(robots)
  res.end()

  return {
    props: {}
  }
}

export default RobotsTxt