import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { FedExCapabilities } from '@/components/fedex/FedExCapabilities'
import { Footer } from '@/components/Footer'

const FedExProgressPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>FedEx API Integration Progress - ShipNode</title>
        <meta 
          name="description" 
          content="Track our live progress integrating FedEx shipping APIs. Building in public - see which features are live, in testing, and coming soon."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        
        {/* SEO and social */}
        <meta name="keywords" content="FedEx API integration, shipping API progress, build in public, FedEx features" />
        <meta property="og:title" content="FedEx API Integration Progress - ShipNode" />
        <meta property="og:description" content="Watch us build the most comprehensive FedEx integration for manufacturers. Live progress updates!" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://shipnode.io/og-fedex-progress.png" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="FedEx API Integration Progress - ShipNode" />
        <meta name="twitter:description" content="Building in public: Track our FedEx API integration progress" />
      </Head>
      
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link href="/" className="flex items-center">
                <Image src="/logo.svg" alt="ShipNode" width={150} height={40} className="h-8 w-auto" />
              </Link>
              
              <nav className="hidden md:flex items-center gap-6">
                <Link href="/calculator" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
                  Calculator
                </Link>
                <Link href="/fedex-progress" className="text-sm font-medium text-blue-600">
                  FedEx Progress
                </Link>
                <Link href="/" className="btn-primary text-sm">
                  Join Waitlist
                </Link>
              </nav>

              {/* Mobile menu button */}
              <button className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main>
          <FedExCapabilities />
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </>
  )
}

export default FedExProgressPage