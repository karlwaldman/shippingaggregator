import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { CheckIcon, TruckIcon, CogIcon, ChartBarIcon } from '@heroicons/react/24/outline'

// Form validation schema
const emailCaptureSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  company: z.string().min(2, 'Company name is required'),
  industry: z.string().min(1, 'Please select your industry'),
  monthlyShipments: z.string().optional(),
})

type EmailCaptureForm = z.infer<typeof emailCaptureSchema>

interface LandingPageProps {
  className?: string
}

export function LandingPage({ className = '' }: LandingPageProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  
  const { register, handleSubmit, formState: { errors } } = useForm<EmailCaptureForm>({
    resolver: zodResolver(emailCaptureSchema),
    defaultValues: {
      industry: 'machining',
      monthlyShipments: '100-500',
    }
  })

  const onSubmit = async (data: EmailCaptureForm) => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()
      
      if (result.success) {
        setIsSubmitted(true)
      } else {
        console.error('Submission error:', result.error)
        // Could show error state here
      }
    } catch (error) {
      console.error('Submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return <ThankYouSection />
  }

  return (
    <div className={`min-h-screen bg-white ${className}`}>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 to-white">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="heading-xl text-balance mb-6">
              Stop Overpaying for Manufacturing Freight
            </h1>
            <p className="body-lg mb-8 text-balance">
              Manufacturing SMBs save <span className="font-bold text-success">15-25%</span> on 
              LTL & FTL shipping with our freight-first aggregation platform. 
              Get instant quotes, ERP integration, and compliance automation.
            </p>
            
            {/* ROI Preview */}
            <div className="mx-auto max-w-lg mb-8 p-6 bg-white rounded-lg shadow-freight-card">
              <h3 className="text-lg font-semibold mb-4">Sample Monthly Savings</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Current Spend:</span>
                  <div className="text-xl font-bold">$25,000</div>
                </div>
                <div>
                  <span className="text-gray-600">Estimated Savings:</span>
                  <div className="text-xl font-bold text-success">$4,500</div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t">
                <span className="text-gray-600">Annual ROI:</span>
                <div className="text-2xl font-bold text-success">216%</div>
              </div>
            </div>
            
            <EmailCaptureForm onSubmit={handleSubmit(onSubmit)} isSubmitting={isSubmitting} errors={errors} register={register} />
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <SocialProofSection />

      {/* Problem/Solution Section */}
      <ProblemSolutionSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* Trust Indicators */}
      <TrustSection />

      {/* Footer */}
      <FooterSection />
    </div>
  )
}

function EmailCaptureForm({ onSubmit, isSubmitting, errors, register }: any) {
  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-md space-y-4" role="form">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Work Email Address
        </label>
        <input
          id="email"
          type="email"
          {...register('email')}
          className="manufacturing-input large-touch-target"
          placeholder="ops@yourcompany.com"
          required
        />
        {errors.email && (
          <p className="mt-1 text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
          Company Name
        </label>
        <input
          id="company"
          type="text"
          {...register('company')}
          className="manufacturing-input large-touch-target"
          placeholder="Precision Manufacturing Inc."
          required
        />
        {errors.company && (
          <p className="mt-1 text-sm text-destructive">{errors.company.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1">
          Manufacturing Industry
        </label>
        <select
          id="industry"
          {...register('industry')}
          className="manufacturing-input large-touch-target"
          required
        >
          <option value="machining">Machining & Custom Manufacturing</option>
          <option value="assembly">Assembly & Fabrication</option>
          <option value="food-processing">Food Processing</option>
          <option value="chemical">Chemical Manufacturing</option>
          <option value="automotive">Automotive Suppliers</option>
          <option value="aerospace">Aerospace Components</option>
          <option value="other">Other Manufacturing</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full manufacturing-button large-touch-target text-lg py-4"
      >
        {isSubmitting ? 'Processing...' : 'Join Waitlist - Get Early Access'}
      </button>
      
      <p className="text-xs text-gray-500 text-center">
        No spam. Unsubscribe anytime. SOC 2 compliant.
      </p>
    </form>
  )
}

function SocialProofSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-12">
          <h2 className="heading-md mb-4">Built for Manufacturing</h2>
          <p className="body-lg text-gray-600">
            Designed specifically for the unique freight needs of manufacturing SMBs
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="freight-rate-card text-center">
            <h3 className="heading-sm mb-3 text-primary">15-25% Savings Potential</h3>
            <p className="body-base text-gray-600">
              Industry benchmarks show manufacturing SMBs typically overpay for freight by 15-25% 
              due to limited carrier relationships and manual processes.
            </p>
          </div>
          <div className="freight-rate-card text-center">
            <h3 className="heading-sm mb-3 text-primary">Freight-First Architecture</h3>
            <p className="body-base text-gray-600">
              Unlike parcel-focused aggregators, our platform is built specifically 
              for LTL, FTL, and specialized manufacturing freight requirements.
            </p>
          </div>
          <div className="freight-rate-card text-center">
            <h3 className="heading-sm mb-3 text-primary">Manufacturing ERP Ready</h3>
            <p className="body-base text-gray-600">
              Native integration capabilities for NetSuite, SAP Business One, 
              Microsoft Dynamics, and other manufacturing ERP systems.
            </p>
          </div>
        </div>
        
        {/* Manufacturing Focus */}
        <div className="mt-16 text-center">
          <p className="text-sm text-gray-600 mb-8">Designed for manufacturing companies like yours</p>
          <div className="flex justify-center items-center space-x-8 text-gray-400">
            <span className="text-sm">Discrete Manufacturing</span>
            <span className="text-sm">•</span>
            <span className="text-sm">Process Manufacturing</span>
            <span className="text-sm">•</span>
            <span className="text-sm">Mixed-Mode Operations</span>
          </div>
        </div>
      </div>
    </section>
  )
}

function TestimonialCard({ quote, author, title, company, savings }: any) {
  return (
    <div className="freight-rate-card">
      <blockquote className="text-gray-700 mb-4">"{quote}"</blockquote>
      <div className="flex items-center justify-between">
        <div>
          <div className="font-semibold text-gray-900">{author}</div>
          <div className="text-sm text-gray-600">{title}</div>
          <div className="text-sm text-gray-500">{company}</div>
        </div>
        <div className="savings-badge">{savings}</div>
      </div>
    </div>
  )
}

function ProblemSolutionSection() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="heading-md mb-6">Manufacturing Shipping is Broken</h2>
            <ul className="space-y-4 text-gray-700">
              <li className="flex items-start">
                <span className="text-destructive mr-3">✗</span>
                Multiple carriers requiring separate relationships and systems
              </li>
              <li className="flex items-start">
                <span className="text-destructive mr-3">✗</span>
                Manual processes eating up 10+ hours per week
              </li>
              <li className="flex items-start">
                <span className="text-destructive mr-3">✗</span>
                No ERP integration forcing double data entry
              </li>
              <li className="flex items-start">
                <span className="text-destructive mr-3">✗</span>
                Complex compliance requirements for hazmat and documentation
              </li>
              <li className="flex items-start">
                <span className="text-destructive mr-3">✗</span>
                Limited visibility into freight costs and performance
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="heading-sm mb-6 text-primary">Our Freight-First Solution</h3>
            <ul className="space-y-4 text-gray-700">
              <li className="flex items-start">
                <CheckIcon className="h-5 w-5 text-success mr-3 mt-0.5 flex-shrink-0" />
                LTL & FTL rate shopping across 20+ freight carriers
              </li>
              <li className="flex items-start">
                <CheckIcon className="h-5 w-5 text-success mr-3 mt-0.5 flex-shrink-0" />
                Native ERP integration with NetSuite, SAP, Dynamics
              </li>
              <li className="flex items-start">
                <CheckIcon className="h-5 w-5 text-success mr-3 mt-0.5 flex-shrink-0" />
                Automated freight class determination and compliance
              </li>
              <li className="flex items-start">
                <CheckIcon className="h-5 w-5 text-success mr-3 mt-0.5 flex-shrink-0" />
                B2B workflows: drop shipping, blind shipping, recurring orders
              </li>
              <li className="flex items-start">
                <CheckIcon className="h-5 w-5 text-success mr-3 mt-0.5 flex-shrink-0" />
                Advanced analytics and landed cost optimization
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

function FeaturesSection() {
  const features = [
    {
      icon: TruckIcon,
      title: 'Freight-First Architecture',
      description: 'Built for LTL, FTL, and specialized freight - not just parcel shipping.',
    },
    {
      icon: CogIcon,
      title: 'Deep ERP Integration', 
      description: 'Native connectors for manufacturing ERPs with real-time sync.',
    },
    {
      icon: ChartBarIcon,
      title: 'Advanced Analytics',
      description: 'Freight spend analysis, carrier performance, and ROI tracking.',
    },
  ]

  return (
    <section className="py-24 bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="heading-md mb-4">Built for Manufacturing</h2>
          <p className="body-lg text-gray-600">
            Unlike e-commerce shipping platforms, we understand manufacturing logistics.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="freight-rate-card text-center">
              <feature.icon className="h-12 w-12 mx-auto text-primary mb-4" />
              <h3 className="heading-sm mb-3">{feature.title}</h3>
              <p className="body-base text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function TrustSection() {
  return (
    <section className="py-16 border-t border-gray-200">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center">
          <p className="body-sm text-gray-600 mb-8">
            Built with enterprise-grade security standards
          </p>
          <div className="flex justify-center items-center space-x-12">
            <div className="text-sm text-gray-500">
              <strong>SOC 2</strong> Specification Standards
            </div>
            <div className="text-sm text-gray-500">
              <strong>GDPR</strong> Compliant Design
            </div>
            <div className="text-sm text-gray-500">
              <strong>Enterprise</strong> Security Architecture
            </div>
          </div>
          
          <div className="mt-12">
            <p className="body-sm text-gray-600 mb-6">Designed for integration with major freight carriers</p>
            <div className="flex justify-center items-center space-x-8 text-gray-400">
              <span className="font-semibold">FedEx Freight</span>
              <span className="font-semibold">UPS Freight</span>
              <span className="font-semibold">XPO Logistics</span>
              <span className="font-semibold">Regional Carriers</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function ThankYouSection() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-success/10 to-white flex items-center justify-center">
      <div className="max-w-md text-center">
        <CheckIcon className="h-16 w-16 text-success mx-auto mb-6" />
        <h1 className="heading-lg mb-4">Welcome to the Waitlist!</h1>
        <p className="body-lg text-gray-600 mb-6">
          You're now on our exclusive waitlist for the Manufacturing Freight Calculator 
          launching Q1 2025. We'll email you as soon as early access begins.
        </p>
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-gray-900 mb-2">What happens next?</h3>
          <ul className="text-sm text-gray-600 space-y-1 text-left">
            <li>• Welcome email with freight optimization tips</li>
            <li>• Monthly development updates</li>
            <li>• Early access notification (2 weeks before launch)</li>
            <li>• Exclusive 6 months free pricing for early adopters</li>
          </ul>
        </div>
        <a 
          href="/calculator"
          className="manufacturing-button-secondary"
        >
          View Waitlist Details
        </a>
      </div>
    </div>
  )
}

function FooterSection() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="md:col-span-2">
            <h3 className="text-xl font-bold mb-4">FreightFlow</h3>
            <p className="text-gray-300 mb-4">
              Manufacturing freight optimization platform built specifically for SMB manufacturers. 
              Save 15-25% on LTL & FTL shipping with our freight-first aggregation platform.
            </p>
            <div className="text-gray-400 text-sm">
              <p>FreightFlow LLC</p>
              <p>123 Manufacturing Blvd</p>
              <p>Industrial City, IN 46201</p>
              <p className="mt-2">hello@machineshop.directory</p>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-gray-300">
              <li><Link href="/calculator" className="hover:text-white transition-colors">Freight Calculator</Link></li>
              <li><span className="text-gray-500">ERP Integration (Q1 2025)</span></li>
              <li><span className="text-gray-500">Analytics (Q1 2025)</span></li>
              <li><span className="text-gray-500">API Access (Q2 2025)</span></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-gray-300">
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/cookies" className="hover:text-white transition-colors">Cookie Policy</Link></li>
              <li><a href="mailto:hello@machineshop.directory" className="hover:text-white transition-colors">Contact Us</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2025 FreightFlow LLC. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm text-gray-400">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
              <Link href="/cookies" className="hover:text-white transition-colors">Cookies</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}