import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CheckIcon } from '@heroicons/react/24/outline'
import { logFormSubmission, logEvent } from '@/lib/analytics'

const emailCaptureSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  company: z.string().min(2, 'Company name is required'),
  industry: z.string().min(1, 'Please select your industry'),
  monthlyShipments: z.string().optional(),
})

type EmailCaptureForm = z.infer<typeof emailCaptureSchema>

export function WaitlistSection() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  
  const { register, handleSubmit, formState: { errors } } = useForm<EmailCaptureForm>({
    resolver: zodResolver(emailCaptureSchema),
    defaultValues: {
      industry: '',
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
        logFormSubmission('waitlist', {
          industry: data.industry,
          monthlyShipments: data.monthlyShipments
        })
      } else {
        console.error('Submission error:', result.error)
        logEvent('Form', 'Error', 'waitlist')
      }
    } catch (error) {
      console.error('Submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <section id="waitlist" className="relative isolate bg-gradient-to-br from-blue-600 to-blue-800 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-white/10 backdrop-blur animate-slide-up">
              <CheckIcon className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl animate-slide-up">
              You're on the list!
            </h2>
            <p className="mt-4 text-lg leading-8 text-blue-100 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              We'll notify you as soon as ShipNode launches. Get ready to save on shipping!
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="waitlist" className="relative isolate bg-gradient-to-br from-blue-600 to-blue-800 py-24 sm:py-32">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl text-center">
            Get Early Access
          </h2>
          <p className="mt-4 text-lg leading-8 text-blue-100 text-center">
            Join the waitlist and be first to access our platform when we launch. 
            Plus, get exclusive early-bird pricing.
          </p>
          
          <form onSubmit={handleSubmit(onSubmit)} className="mt-10 space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white">
                  Work Email *
                </label>
                <input
                  type="email"
                  {...register('email')}
                  className="mt-2 block w-full rounded-lg border-0 bg-white/10 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 placeholder:text-blue-200 focus:ring-2 focus:ring-inset focus:ring-white sm:text-sm sm:leading-6"
                  placeholder="you@company.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-300">{errors.email.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-white">
                  Company Name *
                </label>
                <input
                  type="text"
                  {...register('company')}
                  className="mt-2 block w-full rounded-lg border-0 bg-white/10 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 placeholder:text-blue-200 focus:ring-2 focus:ring-inset focus:ring-white sm:text-sm sm:leading-6"
                  placeholder="Your Company Inc."
                />
                {errors.company && (
                  <p className="mt-1 text-sm text-red-300">{errors.company.message}</p>
                )}
              </div>
            </div>
            
            <div>
              <label htmlFor="industry" className="block text-sm font-medium text-white">
                Industry *
              </label>
              <select
                {...register('industry')}
                className="mt-2 block w-full rounded-lg border-0 bg-white/10 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-white sm:text-sm sm:leading-6"
              >
                <option value="" className="text-gray-900">Select your industry</option>
                <option value="manufacturing" className="text-gray-900">Manufacturing</option>
                <option value="ecommerce" className="text-gray-900">E-commerce</option>
                <option value="retail" className="text-gray-900">Retail</option>
                <option value="wholesale" className="text-gray-900">Wholesale/Distribution</option>
                <option value="automotive" className="text-gray-900">Automotive</option>
                <option value="healthcare" className="text-gray-900">Healthcare</option>
                <option value="food" className="text-gray-900">Food & Beverage</option>
                <option value="other" className="text-gray-900">Other</option>
              </select>
              {errors.industry && (
                <p className="mt-1 text-sm text-red-300">{errors.industry.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="monthlyShipments" className="block text-sm font-medium text-white">
                Monthly Shipment Volume (Optional)
              </label>
              <select
                {...register('monthlyShipments')}
                className="mt-2 block w-full rounded-lg border-0 bg-white/10 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-white sm:text-sm sm:leading-6"
              >
                <option value="0-50" className="text-gray-900">0-50 shipments</option>
                <option value="50-100" className="text-gray-900">50-100 shipments</option>
                <option value="100-500" className="text-gray-900">100-500 shipments</option>
                <option value="500-1000" className="text-gray-900">500-1,000 shipments</option>
                <option value="1000+" className="text-gray-900">1,000+ shipments</option>
              </select>
            </div>
            
            <div className="flex items-center justify-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary bg-white text-blue-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed min-w-[200px]"
              >
                {isSubmitting ? 'Joining...' : 'Join Waitlist'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}