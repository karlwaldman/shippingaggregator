import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { TruckIcon, ClockIcon, CheckIcon } from '@heroicons/react/24/outline'
import { logFormSubmission, logEvent } from '@/lib/analytics'

// Form validation schema
const waitlistSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  company: z.string().min(2, 'Company name is required'),
  industry: z.string().min(1, 'Please select your industry'),
  monthlyShipments: z.string().min(1, 'Please select shipment volume'),
  currentSpend: z.string().optional(),
})

type WaitlistForm = z.infer<typeof waitlistSchema>

interface FreightWaitlistProps {
  className?: string
}

export function FreightWaitlist({ className = '' }: FreightWaitlistProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  
  const { register, handleSubmit, formState: { errors } } = useForm<WaitlistForm>({
    resolver: zodResolver(waitlistSchema),
    defaultValues: {
      industry: '',
      monthlyShipments: '',
    }
  })

  const onSubmit = async (data: WaitlistForm) => {
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
        // Track calculator waitlist submission
        logFormSubmission('calculator', {
          industry: data.industry,
          monthlyShipments: data.monthlyShipments,
          currentSpend: data.currentSpend
        })
      } else {
        console.error('Submission error:', result.error)
        logEvent('Form', 'Error', 'calculator')
        // Could show error state here
      }
    } catch (error) {
      console.error('Submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return <WaitlistThankYou />
  }

  return (
    <div className={`max-w-4xl mx-auto ${className}`}>
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <TruckIcon className="h-16 w-16 text-primary" />
            <ClockIcon className="h-6 w-6 text-warning absolute -top-1 -right-1 bg-white rounded-full p-1" />
          </div>
        </div>
        <h1 className="heading-xl mb-4">Manufacturing Freight Calculator</h1>
        <p className="heading-sm text-primary mb-4">Launching August 2025</p>
        <p className="body-lg text-gray-600 max-w-2xl mx-auto">
          Get instant LTL & FTL rates from 20+ carriers with our manufacturing-first freight platform. 
          Join the waitlist to be first to access the calculator and exclusive early pricing.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Waitlist Form */}
        <div className="freight-rate-card">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Join the Waitlist</h3>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Work Email Address *
              </label>
              <input
                id="email"
                type="email"
                {...register('email')}
                className="manufacturing-input"
                placeholder="ops@yourcompany.com"
                required
              />
              {errors.email && (
                <p className="mt-1 text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                Company Name *
              </label>
              <input
                id="company"
                type="text"
                {...register('company')}
                className="manufacturing-input"
                placeholder="Precision Manufacturing Inc."
                required
              />
              {errors.company && (
                <p className="mt-1 text-sm text-destructive">{errors.company.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1">
                Manufacturing Industry *
              </label>
              <select
                id="industry"
                {...register('industry')}
                className="manufacturing-input"
                required
              >
                <option value="">Select your industry</option>
                <option value="machining">Machining & Custom Manufacturing</option>
                <option value="assembly">Assembly & Fabrication</option>
                <option value="food-processing">Food Processing</option>
                <option value="chemical">Chemical Manufacturing</option>
                <option value="automotive">Automotive Suppliers</option>
                <option value="aerospace">Aerospace Components</option>
                <option value="electronics">Electronics Manufacturing</option>
                <option value="textiles">Textiles & Apparel</option>
                <option value="packaging">Packaging & Converting</option>
                <option value="other">Other Manufacturing</option>
              </select>
              {errors.industry && (
                <p className="mt-1 text-sm text-destructive">{errors.industry.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="monthlyShipments" className="block text-sm font-medium text-gray-700 mb-1">
                Monthly Freight Shipments *
              </label>
              <select
                id="monthlyShipments"
                {...register('monthlyShipments')}
                className="manufacturing-input"
                required
              >
                <option value="">Select shipment volume</option>
                <option value="1-10">1-10 shipments</option>
                <option value="11-50">11-50 shipments</option>
                <option value="51-200">51-200 shipments</option>
                <option value="201-500">201-500 shipments</option>
                <option value="500+">500+ shipments</option>
              </select>
              {errors.monthlyShipments && (
                <p className="mt-1 text-sm text-destructive">{errors.monthlyShipments.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="currentSpend" className="block text-sm font-medium text-gray-700 mb-1">
                Estimated Monthly Freight Spend (Optional)
              </label>
              <select
                id="currentSpend"
                {...register('currentSpend')}
                className="manufacturing-input"
              >
                <option value="">Select range</option>
                <option value="<5k">Less than $5,000</option>
                <option value="5k-15k">$5,000 - $15,000</option>
                <option value="15k-50k">$15,000 - $50,000</option>
                <option value="50k-100k">$50,000 - $100,000</option>
                <option value="100k+">$100,000+</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full manufacturing-button large-touch-target text-lg py-4"
            >
              {isSubmitting ? 'Joining Waitlist...' : 'Join Waitlist - Get Early Access'}
            </button>
            
            <p className="text-xs text-gray-500">
              Join our early access waitlist. No spam, unsubscribe anytime.
            </p>
          </form>
        </div>

        {/* Benefits & Timeline */}
        <div className="space-y-6">
          <WaitlistBenefits />
          <LaunchTimeline />
        </div>
      </div>
    </div>
  )
}

function WaitlistBenefits() {
  const benefits = [
    {
      title: 'Early Access Pricing',
      description: 'Get 6 months free when you join in the first 30 days of launch',
    },
    {
      title: 'Beta Testing Opportunity',
      description: 'Help shape the platform with direct feedback and feature requests',
    },
    {
      title: 'Priority Implementation',
      description: 'First priority for ERP integration and custom carrier connections',
    },
    {
      title: 'Manufacturing Expertise',
      description: 'Free freight audit and optimization consultation for early adopters',
    },
  ]

  return (
    <div className="freight-rate-card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Waitlist Benefits</h3>
      <div className="space-y-4">
        {benefits.map((benefit, index) => (
          <div key={index} className="flex items-start">
            <CheckIcon className="h-5 w-5 text-success mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-gray-900">{benefit.title}</h4>
              <p className="text-sm text-gray-600">{benefit.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function LaunchTimeline() {
  const timeline = [
    {
      date: 'August 2025',
      title: 'Beta Launch',
      description: 'Waitlist members get first access to calculator and rate comparison',
      status: 'upcoming',
    },
    {
      date: 'September 2025',
      title: 'ERP Integration',
      description: 'NetSuite, Dynamics, and SAP Business One integrations go live',
      status: 'upcoming',
    },
    {
      date: 'October 2025',
      title: 'Full Platform',
      description: 'Complete freight management platform with advanced analytics',
      status: 'upcoming',
    },
  ]

  return (
    <div className="freight-rate-card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Launch Timeline</h3>
      <div className="space-y-4">
        {timeline.map((item, index) => (
          <div key={index} className="flex">
            <div className="flex-shrink-0 w-20 text-sm text-gray-500 font-medium">
              {item.date}
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">{item.title}</h4>
              <p className="text-sm text-gray-600">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function WaitlistThankYou() {
  return (
    <div className="max-w-2xl mx-auto text-center">
      <CheckIcon className="h-16 w-16 text-success mx-auto mb-6" />
      <h1 className="heading-lg mb-4">Welcome to the Waitlist!</h1>
      <p className="body-lg text-gray-600 mb-6">
        You're now on our waitlist. 
        We'll email you as soon as the freight calculator launches in August 2025.
      </p>
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-2">What happens next?</h3>
        <ul className="text-sm text-gray-600 space-y-1 text-left">
          <li>• You'll receive a welcome email with manufacturing freight optimization tips</li>
          <li>• We'll send monthly updates on development progress</li>
          <li>• Early access notification 2 weeks before public launch</li>
          <li>• Exclusive beta testing invitation for qualifying companies</li>
        </ul>
      </div>
      <div className="mt-8">
        <a 
          href="/"
          className="manufacturing-button-secondary"
        >
          Return to Homepage
        </a>
      </div>
    </div>
  )
}