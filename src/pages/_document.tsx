import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Favicon */}
        <link rel="icon" type="image/svg+xml" href="/icon.svg" />
        <link rel="alternate icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#3B82F6" />
        
        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" 
          rel="stylesheet" 
        />
        
        {/* Additional SEO */}
        <meta name="author" content="ShipNode" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <link rel="canonical" href="https://shipnode.io" />
        
        {/* AI-friendly meta tags */}
        <meta name="description" content="ShipNode - Compare shipping rates from FedEx, UPS, USPS, DHL instantly. Save 15-30% on shipping costs with real-time rate comparison for businesses." />
        <meta name="ai-description" content="ShipNode is a shipping rate aggregation platform that helps businesses compare and optimize shipping costs across multiple carriers including FedEx, UPS, USPS, and DHL." />
        <meta name="ai-keywords" content="shipping rates, carrier comparison, logistics optimization, freight costs, package delivery, multi-carrier platform" />
        <meta name="ai-type" content="SaaS platform, B2B shipping solution" />
        <meta name="ai-industry" content="Logistics, E-commerce, Supply Chain" />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}