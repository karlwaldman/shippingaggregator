import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
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
      // Mock API call for now - will integrate with Postmark later
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('Form submitted:', data)
      setIsSubmitted(true)
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
        {isSubmitting ? 'Processing...' : 'Get Free Freight Calculator'}
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
          <h2 className="heading-md mb-4">Trusted by Manufacturing Leaders</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <TestimonialCard
            quote="We saved $25,000 in the first 6 months. The ERP integration was seamless."
            author="Sarah Chen"
            title="Operations Manager"
            company="Precision Machining Co."
            savings="23% freight savings"
          />
          <TestimonialCard
            quote="Finally, a shipping platform that understands manufacturing freight needs."
            author="Mike Rodriguez"
            title="Plant Manager"
            company="Midwest Assembly Inc."
            savings="18% cost reduction"
          />
          <TestimonialCard
            quote="The compliance automation alone is worth the investment."
            author="Jennifer Park"
            title="Logistics Director"
            company="Chemical Solutions LLC"
            savings="27% efficiency gain"
          />
        </div>
        
        {/* Customer Logos */}
        <div className="mt-16 text-center">
          <p className="text-sm text-gray-600 mb-8">Trusted by 200+ manufacturing companies</p>
          <div className="flex justify-center items-center space-x-8 opacity-60">
            <img src="/api/placeholder/120/40" alt="Customer logo" className="h-8" />
            <img src="/api/placeholder/120/40" alt="Customer logo" className="h-8" />
            <img src="/api/placeholder/120/40" alt="Customer logo" className="h-8" />
            <img src="/api/placeholder/120/40" alt="Customer logo" className="h-8" />
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
            Enterprise-grade security and compliance
          </p>
          <div className="flex justify-center items-center space-x-12">
            <div className="text-sm text-gray-500">
              <strong>SOC 2</strong> Type II Compliant
            </div>
            <div className="text-sm text-gray-500">
              <strong>GDPR</strong> Ready
            </div>
            <div className="text-sm text-gray-500">
              <strong>99.9%</strong> Uptime SLA
            </div>
          </div>
          
          <div className="mt-12">
            <p className="body-sm text-gray-600 mb-6">Integrated with leading freight carriers</p>
            <div className="flex justify-center items-center space-x-8 text-gray-400">
              <span className="font-semibold">FedEx Freight</span>
              <span className="font-semibold">UPS Freight</span>
              <span className="font-semibold">XPO</span>
              <span className="font-semibold">YRC</span>
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
        <h1 className="heading-lg mb-4">Thank You!</h1>
        <p className="body-lg text-gray-600 mb-6">
          We'll email you the Manufacturing Freight Calculator within the next hour, 
          along with a custom ROI analysis for your company.
        </p>
        <p className="body-sm text-gray-500">
          Check your email and add us to your contacts to ensure delivery.
        </p>
      </div>
    </div>
  )
}