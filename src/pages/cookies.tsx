import React from 'react'
import Head from 'next/head'
import Link from 'next/link'

export default function CookiePolicy() {
  return (
    <>
      <Head>
        <title>Cookie Policy - FreightFlow</title>
        <meta name="description" content="FreightFlow Cookie Policy - How we use cookies and tracking technologies on our website" />
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
            <h1>Cookie Policy</h1>
            
            <p className="text-gray-600 text-sm mb-8">
              <strong>Last updated:</strong> July 12, 2025
            </p>

            <h2>1. What Are Cookies?</h2>
            <p>
              Cookies are small text files that are stored on your device (computer, tablet, or mobile) when you visit 
              our website. They help us provide you with a better experience by remembering your preferences and 
              understanding how you use our site.
            </p>

            <h2>2. How We Use Cookies</h2>
            <p>
              FreightFlow uses cookies and similar tracking technologies to:
            </p>
            <ul>
              <li>Ensure our website functions properly</li>
              <li>Remember your preferences and settings</li>
              <li>Analyze website traffic and user behavior</li>
              <li>Improve our services and user experience</li>
              <li>Provide personalized content and recommendations</li>
              <li>Measure the effectiveness of our marketing campaigns</li>
            </ul>

            <h2>3. Types of Cookies We Use</h2>

            <h3>3.1 Essential Cookies</h3>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <p className="text-green-800 font-semibold mb-2">Always Active - Cannot be disabled</p>
              <p className="text-green-700">
                These cookies are necessary for the website to function and cannot be switched off. They are usually 
                set in response to actions you make, such as setting your privacy preferences or filling in forms.
              </p>
            </div>
            
            <table className="w-full border border-gray-300 mb-6">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 px-4 py-2 text-left">Cookie Name</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Purpose</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Duration</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">__vercel_live_token</td>
                  <td className="border border-gray-300 px-4 py-2">Website hosting and security</td>
                  <td className="border border-gray-300 px-4 py-2">Session</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">next-auth.session-token</td>
                  <td className="border border-gray-300 px-4 py-2">User authentication (when available)</td>
                  <td className="border border-gray-300 px-4 py-2">30 days</td>
                </tr>
              </tbody>
            </table>

            <h3>3.2 Analytics Cookies</h3>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-blue-800 font-semibold mb-2">Can be disabled</p>
              <p className="text-blue-700">
                These cookies help us understand how visitors interact with our website by collecting and reporting 
                information anonymously.
              </p>
            </div>

            <table className="w-full border border-gray-300 mb-6">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 px-4 py-2 text-left">Cookie Name</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Provider</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Purpose</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Duration</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">_ga</td>
                  <td className="border border-gray-300 px-4 py-2">Google Analytics</td>
                  <td className="border border-gray-300 px-4 py-2">Distinguishes unique users</td>
                  <td className="border border-gray-300 px-4 py-2">2 years</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">_ga_*</td>
                  <td className="border border-gray-300 px-4 py-2">Google Analytics</td>
                  <td className="border border-gray-300 px-4 py-2">Stores session state</td>
                  <td className="border border-gray-300 px-4 py-2">2 years</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">_gid</td>
                  <td className="border border-gray-300 px-4 py-2">Google Analytics</td>
                  <td className="border border-gray-300 px-4 py-2">Distinguishes unique users</td>
                  <td className="border border-gray-300 px-4 py-2">24 hours</td>
                </tr>
              </tbody>
            </table>

            <h3>3.3 Functional Cookies</h3>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
              <p className="text-purple-800 font-semibold mb-2">Can be disabled</p>
              <p className="text-purple-700">
                These cookies enable enhanced functionality and personalization, such as remembering your preferences 
                and choices.
              </p>
            </div>

            <table className="w-full border border-gray-300 mb-6">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 px-4 py-2 text-left">Cookie Name</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Purpose</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Duration</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">theme-preference</td>
                  <td className="border border-gray-300 px-4 py-2">Remembers dark/light mode preference</td>
                  <td className="border border-gray-300 px-4 py-2">1 year</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">language-preference</td>
                  <td className="border border-gray-300 px-4 py-2">Remembers language selection</td>
                  <td className="border border-gray-300 px-4 py-2">1 year</td>
                </tr>
              </tbody>
            </table>

            <h2>4. Third-Party Cookies</h2>
            <p>
              Some cookies are set by third-party services that appear on our pages:
            </p>

            <h3>4.1 Google Analytics</h3>
            <p>
              We use Google Analytics to analyze website traffic and user behavior. Google Analytics uses cookies to 
              collect information about how visitors use our site. This information is used to compile reports and 
              improve our website.
            </p>
            <ul>
              <li><strong>Data collected:</strong> Pages visited, time spent, bounce rate, geographic location (country/city level)</li>
              <li><strong>Purpose:</strong> Website optimization and performance analysis</li>
              <li><strong>Privacy policy:</strong> <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Privacy Policy</a></li>
            </ul>

            <h3>4.2 Postmark (Email Service)</h3>
            <p>
              When you interact with our email subscription forms, Postmark may set cookies to ensure proper 
              functionality and delivery.
            </p>
            <ul>
              <li><strong>Purpose:</strong> Email delivery and tracking</li>
              <li><strong>Privacy policy:</strong> <a href="https://postmarkapp.com/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Postmark Privacy Policy</a></li>
            </ul>

            <h2>5. Managing Your Cookie Preferences</h2>

            <h3>5.1 Browser Settings</h3>
            <p>
              You can control and manage cookies through your browser settings. Most browsers allow you to:
            </p>
            <ul>
              <li>View what cookies are stored on your device</li>
              <li>Delete cookies</li>
              <li>Block cookies from specific websites</li>
              <li>Block all cookies</li>
              <li>Get a warning before a cookie is stored</li>
            </ul>

            <h3>5.2 Browser-Specific Instructions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
              <div className="border border-gray-300 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Chrome</h4>
                <p className="text-sm">Settings → Privacy and Security → Cookies and other site data</p>
              </div>
              <div className="border border-gray-300 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Firefox</h4>
                <p className="text-sm">Settings → Privacy & Security → Cookies and Site Data</p>
              </div>
              <div className="border border-gray-300 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Safari</h4>
                <p className="text-sm">Preferences → Privacy → Manage Website Data</p>
              </div>
              <div className="border border-gray-300 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Edge</h4>
                <p className="text-sm">Settings → Cookies and site permissions → Manage and delete cookies</p>
              </div>
            </div>

            <h3>5.3 Opt-Out Links</h3>
            <ul>
              <li><strong>Google Analytics:</strong> <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Analytics Opt-out Browser Add-on</a></li>
              <li><strong>All Google Services:</strong> <a href="https://adssettings.google.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Ad Settings</a></li>
            </ul>

            <h2>6. Impact of Disabling Cookies</h2>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <p className="text-amber-800">
                <strong>Please note:</strong> Disabling certain cookies may impact your experience on our website. 
                Essential cookies cannot be disabled without affecting basic functionality.
              </p>
            </div>

            <p>If you disable cookies, you may experience:</p>
            <ul>
              <li>Reduced website functionality</li>
              <li>Need to re-enter information repeatedly</li>
              <li>Inability to save preferences</li>
              <li>Less personalized experience</li>
            </ul>

            <h2>7. Mobile App Tracking</h2>
            <p>
              When we launch our mobile application, we will use similar tracking technologies. You can control 
              tracking through your device's privacy settings:
            </p>
            <ul>
              <li><strong>iOS:</strong> Settings → Privacy & Security → Tracking</li>
              <li><strong>Android:</strong> Settings → Privacy → Ads</li>
            </ul>

            <h2>8. Do Not Track Signals</h2>
            <p>
              Some browsers include a "Do Not Track" feature. Currently, there is no industry standard for how 
              websites should respond to these signals. We do not currently respond to Do Not Track signals, 
              but you can use the cookie controls described above to manage tracking.
            </p>

            <h2>9. Cookie Policy Updates</h2>
            <p>
              We may update this Cookie Policy from time to time to reflect changes in our practices or for other 
              operational, legal, or regulatory reasons. We will notify you of any material changes by posting the 
              updated policy on our website.
            </p>

            <h2>10. Contact Us</h2>
            <p>
              If you have questions about our use of cookies or this Cookie Policy, please contact us:
            </p>
            
            <div className="bg-gray-50 rounded-lg p-6 my-6">
              <p className="mb-2"><strong>FreightFlow LLC</strong></p>
              <p className="mb-2">123 Manufacturing Blvd<br />Industrial City, IN 46201</p>
              <p className="mb-2"><strong>Email:</strong> hello@machineshop.directory</p>
              <p className="mb-2"><strong>Privacy Officer:</strong> Karl Waldman</p>
            </div>

            <h2>11. Consent and Legal Basis</h2>
            <p>
              By continuing to use our website, you consent to our use of cookies as described in this policy. 
              For users in the European Union, our legal basis for processing personal data through cookies includes:
            </p>
            <ul>
              <li><strong>Consent:</strong> For analytics and marketing cookies</li>
              <li><strong>Legitimate Interest:</strong> For functional cookies that improve user experience</li>
              <li><strong>Necessary for Service:</strong> For essential cookies required for website operation</li>
            </ul>

            <div className="mt-12 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                This Cookie Policy complements our <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link> 
                and is designed to comply with GDPR, CCPA, and other applicable privacy laws.
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