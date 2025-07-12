import type { NextPage } from 'next'
import Head from 'next/head'
import { FreightWaitlist } from '@/components/waitlist/FreightWaitlist'

const CalculatorPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Free Shipping Rate Calculator - ShipNode</title>
        <meta 
          name="description" 
          content="Free shipping rate calculator - Compare rates from FedEx, UPS, USPS, DHL and more carriers instantly. No signup required." 
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        
        {/* Additional meta for free calculator */}
        <meta name="keywords" content="free shipping calculator, shipping rates, FedEx UPS USPS rates, shipping cost calculator, carrier comparison" />
        <meta property="og:title" content="Free Shipping Rate Calculator - ShipNode" />
        <meta property="og:description" content="Compare shipping rates from all major carriers instantly. Free shipping calculator with no signup required." />
      </Head>
      
      <div className="min-h-screen bg-gray-50 py-12">
        <FreightWaitlist />
      </div>
    </>
  )
}

export default CalculatorPage