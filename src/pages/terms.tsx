import React from 'react'
import Head from 'next/head'
import Link from 'next/link'

export default function TermsOfService() {
  return (
    <>
      <Head>
        <title>Terms of Service - FreightFlow</title>
        <meta name="description" content="FreightFlow Terms of Service - Legal terms and conditions for using our manufacturing freight optimization platform" />
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
            <h1>Terms of Service</h1>
            
            <p className="text-gray-600 text-sm mb-8">
              <strong>Last updated:</strong> July 12, 2025
            </p>

            <h2>1. Agreement to Terms</h2>
            <p>
              By accessing or using FreightFlow ("the Service"), you agree to be bound by these Terms of Service ("Terms"). 
              If you disagree with any part of these terms, then you may not access the Service.
            </p>

            <h2>2. Description of Service</h2>
            <p>
              FreightFlow is a manufacturing freight optimization platform that provides:
            </p>
            <ul>
              <li>Freight rate comparison and optimization tools</li>
              <li>Integration with manufacturing ERP systems</li>
              <li>Analytics and reporting for freight operations</li>
              <li>Carrier relationship management</li>
              <li>Compliance and documentation assistance</li>
            </ul>

            <h2>3. Eligibility</h2>
            <p>
              You must be at least 18 years old and have the legal authority to enter into these Terms on behalf of 
              yourself or your company. By using the Service, you represent and warrant that you meet these requirements.
            </p>

            <h2>4. User Accounts</h2>
            
            <h3>4.1 Account Creation</h3>
            <p>
              To access certain features, you may need to create an account. You agree to:
            </p>
            <ul>
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain and update your account information</li>
              <li>Keep your password secure and confidential</li>
              <li>Notify us immediately of any unauthorized access</li>
            </ul>

            <h3>4.2 Account Responsibility</h3>
            <p>
              You are responsible for all activities that occur under your account. We reserve the right to suspend 
              or terminate accounts that violate these Terms.
            </p>

            <h2>5. Acceptable Use</h2>
            
            <h3>5.1 Permitted Use</h3>
            <p>You may use the Service only for:</p>
            <ul>
              <li>Legitimate business purposes related to freight and shipping</li>
              <li>Optimizing your manufacturing company's logistics operations</li>
              <li>Accessing freight rates and carrier information</li>
            </ul>

            <h3>5.2 Prohibited Use</h3>
            <p>You agree NOT to:</p>
            <ul>
              <li>Use the Service for any illegal or unauthorized purpose</li>
              <li>Violate any applicable laws or regulations</li>
              <li>Interfere with or disrupt the Service or servers</li>
              <li>Attempt to gain unauthorized access to any systems</li>
              <li>Reverse engineer, decompile, or disassemble the Service</li>
              <li>Use automated tools to access the Service without permission</li>
              <li>Share your account credentials with third parties</li>
              <li>Upload malicious code, viruses, or harmful content</li>
            </ul>

            <h2>6. Intellectual Property</h2>
            
            <h3>6.1 Our Intellectual Property</h3>
            <p>
              The Service, including its original content, features, and functionality, is owned by FreightFlow LLC 
              and is protected by international copyright, trademark, patent, trade secret, and other intellectual 
              property laws.
            </p>

            <h3>6.2 Your Content</h3>
            <p>
              You retain ownership of any content you submit to the Service. By submitting content, you grant us a 
              worldwide, non-exclusive, royalty-free license to use, reproduce, and distribute such content solely 
              for providing the Service.
            </p>

            <h2>7. Privacy and Data Protection</h2>
            <p>
              Your privacy is important to us. Our collection and use of personal information is governed by our 
              <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>, 
              which is incorporated into these Terms by reference.
            </p>

            <h2>8. Payment Terms</h2>
            
            <h3>8.1 Pricing</h3>
            <p>
              Current pricing information is available on our website. Prices are subject to change with 30 days' 
              notice to existing subscribers.
            </p>

            <h3>8.2 Billing</h3>
            <ul>
              <li>Subscription fees are billed monthly or annually in advance</li>
              <li>All fees are non-refundable except as required by law</li>
              <li>Failed payments may result in service suspension</li>
              <li>You are responsible for all applicable taxes</li>
            </ul>

            <h3>8.3 Free Trial</h3>
            <p>
              We may offer free trials at our discretion. Trial terms will be specified at signup and are subject 
              to these Terms.
            </p>

            <h2>9. Service Availability</h2>
            
            <h3>9.1 Uptime</h3>
            <p>
              We strive to maintain high service availability but do not guarantee uninterrupted access. The Service 
              may be temporarily unavailable due to maintenance, updates, or technical issues.
            </p>

            <h3>9.2 Modifications</h3>
            <p>
              We reserve the right to modify, suspend, or discontinue the Service at any time with reasonable notice 
              to users.
            </p>

            <h2>10. Disclaimers</h2>
            
            <h3>10.1 Service Disclaimer</h3>
            <p>
              THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR 
              IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR 
              PURPOSE, AND NON-INFRINGEMENT.
            </p>

            <h3>10.2 Freight Information</h3>
            <p>
              Freight rates, carrier information, and shipping estimates are provided for informational purposes only. 
              We do not guarantee the accuracy, completeness, or timeliness of this information. Always verify rates 
              and terms directly with carriers.
            </p>

            <h2>11. Limitation of Liability</h2>
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, FREIGHTFLOW LLC SHALL NOT BE LIABLE FOR ANY INDIRECT, 
              INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO:
            </p>
            <ul>
              <li>Loss of profits, revenue, or business opportunities</li>
              <li>Loss of data or information</li>
              <li>Cost of procurement of substitute services</li>
              <li>Shipping delays or additional costs</li>
            </ul>
            <p>
              Our total liability shall not exceed the amount paid by you for the Service in the 12 months preceding 
              the claim.
            </p>

            <h2>12. Indemnification</h2>
            <p>
              You agree to indemnify, defend, and hold harmless FreightFlow LLC, its officers, directors, employees, 
              and agents from any claims, damages, losses, or expenses arising from:
            </p>
            <ul>
              <li>Your use of the Service</li>
              <li>Your violation of these Terms</li>
              <li>Your violation of any rights of another party</li>
              <li>Your content or data submitted to the Service</li>
            </ul>

            <h2>13. Termination</h2>
            
            <h3>13.1 Termination by You</h3>
            <p>
              You may terminate your account at any time by contacting us or using account settings. Termination 
              does not entitle you to any refund of prepaid fees.
            </p>

            <h3>13.2 Termination by Us</h3>
            <p>
              We may terminate or suspend your account immediately if you:
            </p>
            <ul>
              <li>Violate these Terms</li>
              <li>Fail to pay fees when due</li>
              <li>Engage in fraudulent or illegal activities</li>
              <li>Pose a security risk to the Service</li>
            </ul>

            <h3>13.3 Effect of Termination</h3>
            <p>
              Upon termination, your right to use the Service ceases immediately. We may delete your account and 
              data, though we may retain certain information as required by law or for legitimate business purposes.
            </p>

            <h2>14. Dispute Resolution</h2>
            
            <h3>14.1 Governing Law</h3>
            <p>
              These Terms are governed by the laws of the State of Indiana, without regard to conflict of law principles.
            </p>

            <h3>14.2 Jurisdiction</h3>
            <p>
              Any disputes arising from these Terms or the Service shall be resolved in the state or federal courts 
              located in Indiana.
            </p>

            <h3>14.3 Arbitration</h3>
            <p>
              For disputes involving amounts less than $10,000, either party may elect binding arbitration under the 
              American Arbitration Association's Commercial Arbitration Rules.
            </p>

            <h2>15. Force Majeure</h2>
            <p>
              We shall not be liable for any failure to perform our obligations due to circumstances beyond our 
              reasonable control, including but not limited to acts of God, war, terrorism, pandemic, government 
              actions, or technical failures of third-party services.
            </p>

            <h2>16. Severability</h2>
            <p>
              If any provision of these Terms is found to be unenforceable, the remaining provisions will remain in 
              full force and effect.
            </p>

            <h2>17. Entire Agreement</h2>
            <p>
              These Terms, together with our Privacy Policy and any other legal notices published on the Service, 
              constitute the entire agreement between you and FreightFlow LLC.
            </p>

            <h2>18. Changes to Terms</h2>
            <p>
              We reserve the right to update these Terms at any time. We will notify users of material changes via 
              email or through the Service. Your continued use after changes become effective constitutes acceptance 
              of the updated Terms.
            </p>

            <h2>19. Contact Information</h2>
            <p>For questions about these Terms of Service, contact us:</p>
            
            <div className="bg-gray-50 rounded-lg p-6 my-6">
              <p className="mb-2"><strong>FreightFlow LLC</strong></p>
              <p className="mb-2">123 Manufacturing Blvd<br />Industrial City, IN 46201</p>
              <p className="mb-2"><strong>Email:</strong> hello@machineshop.directory</p>
              <p className="mb-2"><strong>Legal Department:</strong> Karl Waldman</p>
            </div>

            <div className="mt-12 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                These Terms of Service are designed to comply with applicable laws and industry best practices. 
                If you have questions about your rights or obligations, please consult with legal counsel.
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