import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { AddressValidator } from '@/components/tools/AddressValidator'
import { Footer } from '@/components/Footer'

const AddressValidatorPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Free Address Validation Tool - ShipNode</title>
        <meta 
          name="description" 
          content="Free shipping address validation tool powered by FedEx API. Verify, standardize, and check deliverability of addresses instantly."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        
        {/* SEO */}
        <meta name="keywords" content="address validation, address verification, shipping address checker, FedEx address validation, USPS address validation" />
        <meta property="og:title" content="Free Address Validation Tool - ShipNode" />
        <meta property="og:description" content="Validate and standardize shipping addresses instantly with our free tool powered by FedEx API." />
        <meta property="og:type" content="website" />
      </Head>
      
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center">
                <Image src="/logo.svg" alt="ShipNode" width={150} height={40} className="h-8 w-auto" />
              </Link>
              
              <nav className="hidden md:flex items-center gap-6">
                <Link href="/calculator" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
                  Rate Calculator
                </Link>
                <Link href="/address-validator" className="text-sm font-medium text-blue-600">
                  Address Validator
                </Link>
                <Link href="/fedex-progress" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
                  Build Progress
                </Link>
                <Link href="/" className="btn-primary text-sm">
                  Join Waitlist
                </Link>
              </nav>

              <Link href="/" className="md:hidden text-sm font-medium text-blue-600 hover:text-blue-700">
                ← Home
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="py-12">
          <AddressValidator />
        </main>

        {/* Call to Action */}
        <section className="py-16 bg-blue-50">
          <div className="max-w-4xl mx-auto text-center px-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Need More Shipping Tools?
            </h2>
            <p className="text-gray-600 mb-6">
              This address validator is just one of many shipping tools we're building. 
              Join our waitlist to get early access to rate comparison, label generation, and more.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/" className="btn-primary">
                Join the Waitlist
              </Link>
              <Link href="/calculator" className="btn-outline">
                Try Rate Calculator
              </Link>
              <Link href="/fedex-progress" className="btn-outline">
                See What's Coming
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  )
}

export default AddressValidatorPage