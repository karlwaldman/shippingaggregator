import type { NextPage } from 'next'
import Head from 'next/head'
import { RateCalculator } from '@/components/calculator/RateCalculator'
import Link from 'next/link'
import Image from 'next/image'

const CalculatorPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Free Shipping Rate Calculator - ShipNode</title>
        <meta 
          name="description" 
          content="Free shipping rate calculator - Get instant FedEx shipping rates. More carriers coming soon!" 
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        
        {/* Additional meta for free calculator */}
        <meta name="keywords" content="free shipping calculator, shipping rates, FedEx rates, shipping cost calculator" />
        <meta property="og:title" content="Free Shipping Rate Calculator - ShipNode" />
        <meta property="og:description" content="Get instant FedEx shipping rates with our free calculator. No signup required." />
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