import type { NextPage } from 'next'
import Head from 'next/head'
import { FreightWaitlist } from '@/components/waitlist/FreightWaitlist'

const CalculatorPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Manufacturing Freight Calculator Waitlist - FreightFlow</title>
        <meta 
          name="description" 
          content="Join the waitlist for our manufacturing freight calculator launching Q1 2025. Get early access to instant LTL & FTL rates from 20+ carriers." 
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        
        {/* Additional meta for waitlist landing page */}
        <meta name="keywords" content="manufacturing freight calculator, LTL rates, FTL freight, early access, manufacturing logistics" />
        <meta property="og:title" content="Manufacturing Freight Calculator - Early Access Waitlist" />
        <meta property="og:description" content="Join 500+ manufacturing companies waiting for our freight calculator. Launching Q1 2025 with exclusive early pricing." />
      </Head>
      
      <div className="min-h-screen bg-gray-50 py-12">
        <FreightWaitlist />
      </div>
    </>
  )
}

export default CalculatorPage