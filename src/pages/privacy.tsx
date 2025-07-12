import React from 'react'
import Head from 'next/head'
import Link from 'next/link'

export default function PrivacyPolicy() {
  return (
    <>
      <Head>
        <title>Privacy Policy - FreightFlow</title>
        <meta name="description" content="FreightFlow Privacy Policy - How we collect, use, and protect your personal information" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
      </Head>

      <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <Link href="/" className="text-2xl font-bold text-primary">
                FreightFlow
              </Link>
              <Link 
                href="/"
                className="text-gray-600 hover:text-primary transition-colors"
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="prose prose-lg max-w-none">
            <h1>Privacy Policy</h1>
            
            <p className="text-gray-600 text-sm mb-8">
              <strong>Last updated:</strong> July 12, 2025
            </p>

            <h2>1. Introduction</h2>
            <p>
              FreightFlow LLC ("we," "our," or "us") operates the FreightFlow website and manufacturing freight optimization platform. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website 
              or use our services.
            </p>

            <h2>2. Information We Collect</h2>
            
            <h3>2.1 Information You Provide</h3>
            <ul>
              <li><strong>Contact Information:</strong> Email address, company name, phone number</li>
              <li><strong>Business Information:</strong> Industry type, shipping volume, current freight spend</li>
              <li><strong>Account Information:</strong> Username, password, preferences (when you create an account)</li>
              <li><strong>Communication:</strong> Messages, feedback, and support requests</li>
            </ul>

            <h3>2.2 Information Automatically Collected</h3>
            <ul>
              <li><strong>Usage Data:</strong> Pages visited, time spent, clicks, and navigation patterns</li>
              <li><strong>Device Information:</strong> IP address, browser type, operating system, device identifiers</li>
              <li><strong>Cookies:</strong> Session cookies, preference cookies, and analytics cookies</li>
            </ul>

            <h2>3. How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul>
              <li>Provide and improve our freight optimization services</li>
              <li>Send you updates about our platform and manufacturing freight insights</li>
              <li>Respond to your inquiries and provide customer support</li>
              <li>Analyze usage patterns to enhance user experience</li>
              <li>Comply with legal obligations and protect our rights</li>
              <li>Send marketing communications (with your consent)</li>
            </ul>

            <h2>4. Information Sharing and Disclosure</h2>
            
            <h3>4.1 We DO NOT sell your personal information.</h3>
            
            <h3>4.2 We may share information with:</h3>
            <ul>
              <li><strong>Service Providers:</strong> Email service providers (Postmark), analytics providers (Google Analytics), hosting providers (Vercel)</li>
              <li><strong>Business Partners:</strong> Freight carriers and logistics providers (only with your explicit consent)</li>
              <li><strong>Legal Requirements:</strong> When required by law, court order, or to protect our rights</li>
              <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets</li>
            </ul>

            <h2>5. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your personal information against 
              unauthorized access, alteration, disclosure, or destruction. These measures include:
            </p>
            <ul>
              <li>Encryption of data in transit and at rest</li>
              <li>Regular security assessments and updates</li>
              <li>Access controls and authentication mechanisms</li>
              <li>Employee training on data protection</li>
            </ul>

            <h2>6. Data Retention</h2>
            <p>
              We retain your personal information for as long as necessary to provide our services and comply with legal obligations. 
              Specifically:
            </p>
            <ul>
              <li><strong>Waitlist Data:</strong> Until you unsubscribe or our platform launches</li>
              <li><strong>Account Data:</strong> Until you delete your account</li>
              <li><strong>Usage Data:</strong> Up to 2 years for analytics purposes</li>
              <li><strong>Legal Records:</strong> As required by applicable law</li>
            </ul>

            <h2>7. Your Rights and Choices</h2>
            
            <h3>7.1 Under GDPR (EU residents):</h3>
            <ul>
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Rectification:</strong> Correct inaccurate or incomplete data</li>
              <li><strong>Erasure:</strong> Request deletion of your data</li>
              <li><strong>Portability:</strong> Receive your data in a structured format</li>
              <li><strong>Objection:</strong> Object to processing for marketing purposes</li>
            </ul>

            <h3>7.2 Under CCPA (California residents):</h3>
            <ul>
              <li><strong>Know:</strong> What personal information we collect and how it's used</li>
              <li><strong>Delete:</strong> Request deletion of your personal information</li>
              <li><strong>Opt-out:</strong> Opt-out of the sale of personal information (we don't sell data)</li>
              <li><strong>Non-discrimination:</strong> Equal service regardless of privacy choices</li>
            </ul>

            <h3>7.3 Email Communications:</h3>
            <p>
              You can unsubscribe from marketing emails at any time by clicking the unsubscribe link in any email 
              or contacting us directly. This will not affect transactional emails related to your account or services.
            </p>

            <h2>8. Cookies and Tracking</h2>
            <p>
              We use cookies and similar technologies to enhance your experience. You can control cookies through your 
              browser settings. For detailed information, see our <Link href="/cookies" className="text-primary hover:underline">Cookie Policy</Link>.
            </p>

            <h2>9. Third-Party Services</h2>
            <p>Our website may contain links to third-party services:</p>
            <ul>
              <li><strong>Postmark:</strong> Email delivery service</li>
              <li><strong>Google Analytics:</strong> Website analytics</li>
              <li><strong>Vercel:</strong> Website hosting</li>
            </ul>
            <p>
              These services have their own privacy policies. We encourage you to review their policies before 
              providing any information.
            </p>

            <h2>10. International Data Transfers</h2>
            <p>
              Your information may be transferred and processed in countries other than your own. We ensure appropriate 
              safeguards are in place for international transfers, including Standard Contractual Clauses and adequacy decisions.
            </p>

            <h2>11. Children's Privacy</h2>
            <p>
              Our services are not intended for children under 16. We do not knowingly collect personal information 
              from children under 16. If you believe we have collected information from a child, please contact us immediately.
            </p>

            <h2>12. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any material changes by 
              posting the new policy on our website and updating the "Last updated" date. Your continued use of our 
              services after changes become effective constitutes acceptance of the updated policy.
            </p>

            <h2>13. Contact Information</h2>
            <p>For questions about this Privacy Policy or to exercise your rights, contact us:</p>
            
            <div className="bg-gray-50 rounded-lg p-6 my-6">
              <p className="mb-2"><strong>FreightFlow LLC</strong></p>
              <p className="mb-2">123 Manufacturing Blvd<br />Industrial City, IN 46201</p>
              <p className="mb-2"><strong>Email:</strong> hello@machineshop.directory</p>
              <p className="mb-2"><strong>Privacy Officer:</strong> Karl Waldman</p>
            </div>

            <h2>14. Legal Basis for Processing (GDPR)</h2>
            <p>Our legal basis for processing your personal information includes:</p>
            <ul>
              <li><strong>Consent:</strong> For marketing communications and cookies</li>
              <li><strong>Contract:</strong> To provide our services and fulfill agreements</li>
              <li><strong>Legitimate Interest:</strong> For analytics, security, and business operations</li>
              <li><strong>Legal Obligation:</strong> To comply with applicable laws</li>
            </ul>

            <div className="mt-12 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                This Privacy Policy is designed to comply with GDPR, CCPA, CAN-SPAM Act, and other applicable privacy laws. 
                If you have concerns about our privacy practices, you may file a complaint with your local data protection authority.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-gray-50 border-t border-gray-200 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <p className="text-sm text-gray-600">
                © 2025 FreightFlow LLC. All rights reserved. |{' '}
                <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link> |{' '}
                <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link> |{' '}
                <Link href="/cookies" className="text-primary hover:underline">Cookie Policy</Link>
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}