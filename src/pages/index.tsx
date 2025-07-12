import type { NextPage } from 'next'
import Head from 'next/head'
import { Hero } from '@/components/Hero'
import { Features } from '@/components/landing/Features'
import { TrackingSection } from '@/components/landing/TrackingSection'
import { AddressValidationSection } from '@/components/landing/AddressValidationSection'
import { BuildInPublic } from '@/components/landing/BuildInPublic'
import { WaitlistSection } from '@/components/landing/WaitlistSection'
import { Footer } from '@/components/Footer'

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>ShipNode - Multi-Carrier Shipping Optimization Platform</title>
        <meta 
          name="description" 
          content="Track packages and compare shipping rates across FedEx, UPS, USPS, DHL from one platform. Real-time package tracking, address validation, and rate comparison to save 15-30% on shipping costs." 
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        
        {/* Shipping optimization meta tags */}
        <meta name="keywords" content="shipping rates, carrier comparison, FedEx UPS USPS DHL, shipping optimization, multi-carrier platform, shipping aggregator, ecommerce shipping" />
        <meta property="og:title" content="ShipNode - Multi-Carrier Shipping Optimization" />
        <meta property="og:description" content="Compare shipping rates across all major carriers and save 15-30% on shipping costs with ShipNode's optimization platform." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://shipnode.io" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="ShipNode - Multi-Carrier Shipping Optimization" />
        <meta name="twitter:description" content="Compare shipping rates across all major carriers and save 15-30% on shipping costs with ShipNode." />
        
        {/* Schema.org structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "ShipNode",
              "description": "Multi-carrier shipping optimization platform for businesses of all sizes",
              "url": "https://shipnode.io",
              "category": "Business Software",
              "operatingSystem": "Web-based",
              "applicationCategory": "BusinessApplication",
              "softwareVersion": "1.0.0",
              "publisher": {
                "@type": "Organization",
                "name": "MetiriLabs, LLC",
                "url": "https://shipnode.io",
                "logo": "https://shipnode.io/logo.png",
                "contactPoint": {
                  "@type": "ContactPoint",
                  "contactType": "customer service",
                  "email": "hello@shipnode.io"
                }
              },
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD",
                "description": "Free tier with generous limits",
                "availability": "https://schema.org/InStock"
              },
              "featureList": [
                "Real-time package tracking",
                "Multi-carrier rate comparison",
                "Address validation and standardization",
                "FedEx, UPS, USPS, DHL integration", 
                "Shipping cost optimization",
                "Free tracking and rate tools"
              ],
              "audience": {
                "@type": "Audience",
                "audienceType": "E-commerce & SMB Businesses"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "5.0",
                "ratingCount": "1",
                "bestRating": "5",
                "worstRating": "1"
              }
            })
          }}
        />
      </Head>
      <main>
        <Hero />
        <Features />
        <TrackingSection />
        <AddressValidationSection />
        <BuildInPublic />
        <WaitlistSection />
      </main>
      <Footer />
    </>
  )
}

export default Home