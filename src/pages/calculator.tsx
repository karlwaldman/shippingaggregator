import type { NextPage } from 'next'
import Head from 'next/head'
import { RateCalculator } from '@/components/calculator/RateCalculator'
import Link from 'next/link'
import Image from 'next/image'

const CalculatorPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Shipping Rate Calculator Coming Soon - Join Waitlist | ShipNode</title>
        <meta 
          name="description" 
          content="Join the waitlist for ShipNode's comprehensive shipping rate calculator. Compare rates from FedEx, UPS, USPS and more in one place." 
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        
        {/* Additional meta for waitlist */}
        <meta name="keywords" content="shipping rate calculator, multi-carrier shipping, FedEx UPS USPS rates, shipping comparison tool" />
        <meta property="og:title" content="Shipping Rate Calculator Coming Soon - Join Waitlist | ShipNode" />
        <meta property="og:description" content="Be the first to access our powerful shipping rate comparison tool. Join the waitlist today!" />
      </Head>
      
      <div className="min-h-screen bg-gray-50">
        {/* Simple Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center">
                <Image src="/logo.svg" alt="ShipNode" width={150} height={40} className="h-8 w-auto" />
              </Link>
              <Link href="/" className="text-sm font-medium text-blue-600 hover:text-blue-700">
                ← Back to Home
              </Link>
            </div>
          </div>
        </header>

        {/* Calculator */}
        <div className="py-12">
          <RateCalculator />
        </div>
      </div>
    </>
  )
}

export default CalculatorPage