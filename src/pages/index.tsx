import type { NextPage } from 'next'
import Head from 'next/head'
import { LandingPage } from '@/components/landing/LandingPage'

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>FreightFlow - Manufacturing Freight Optimization Platform</title>
        <meta 
          name="description" 
          content="Manufacturing SMBs save 15-25% on LTL & FTL shipping with our freight-first aggregation platform. Get instant quotes, ERP integration, and compliance automation." 
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        
        {/* Manufacturing-specific meta tags */}
        <meta name="keywords" content="manufacturing freight, LTL shipping, FTL freight, ERP integration, manufacturing logistics, freight aggregator, industrial shipping" />
        <meta property="og:title" content="FreightFlow - Manufacturing Freight Optimization" />
        <meta property="og:description" content="Save 15-25% on manufacturing freight with our LTL/FTL aggregation platform built for SMB manufacturers." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://freightflow.com" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="FreightFlow - Manufacturing Freight Optimization" />
        <meta name="twitter:description" content="Save 15-25% on manufacturing freight with our LTL/FTL aggregation platform built for SMB manufacturers." />
        
        {/* Schema.org structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "FreightFlow",
              "description": "Manufacturing freight optimization platform for SMB manufacturers",
              "category": "Business Software",
              "operatingSystem": "Web-based",
              "offers": {
                "@type": "Offer",
                "price": "149",
                "priceCurrency": "USD",
                "priceSpecification": {
                  "@type": "UnitPriceSpecification",
                  "billingDuration": "P1M"
                }
              },
              "applicationCategory": "BusinessApplication",
              "audience": {
                "@type": "Audience",
                "audienceType": "Manufacturing SMBs"
              }
            })
          }}
        />
      </Head>
      <LandingPage />
    </>
  )
}

export default Home