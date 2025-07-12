import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { logEmailInteraction } from '@/lib/analytics'

interface UnsubscribePageProps {
  className?: string
}

export default function UnsubscribePage({ className = '' }: UnsubscribePageProps) {
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'invalid'>('loading')
  const [errorMessage, setErrorMessage] = useState('')
  const [email, setEmail] = useState('')

  useEffect(() => {
    const { email: emailParam, token } = router.query

    if (emailParam && token) {
      setEmail(emailParam as string)
      handleUnsubscribe(emailParam as string, token as string)
    } else if (router.isReady) {
      setStatus('invalid')
    }
  }, [router.query, router.isReady])

  const handleUnsubscribe = async (email: string, token: string) => {
    setIsProcessing(true)
    try {
      const response = await fetch('/api/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, token }),
      })

      const result = await response.json()

      if (result.success) {
        setStatus('success')
        // Track successful unsubscribe
        logEmailInteraction('unsubscribe')
      } else {
        setStatus('error')
        setErrorMessage(result.error || 'Failed to unsubscribe')
      }
    } catch (error) {
      console.error('Unsubscribe error:', error)
      setStatus('error')
      setErrorMessage('Network error. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <>
      <Head>
        <title>Unsubscribe - FreightFlow</title>
        <meta name="description" content="Unsubscribe from FreightFlow email communications" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className={`min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 ${className}`}>
        <div className="max-w-md w-full space-y-8">
          <div>
            <h1 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              FreightFlow
            </h1>
            <h2 className="mt-2 text-center text-xl text-gray-600">
              Email Unsubscribe
            </h2>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8">
            {status === 'loading' && (
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-gray-600">
                  {isProcessing ? 'Processing your unsubscribe request...' : 'Loading...'}
                </p>
              </div>
            )}

            {status === 'success' && (
              <div className="text-center">
                <CheckIcon className="h-16 w-16 text-success mx-auto mb-6" />
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Successfully Unsubscribed
                </h3>
                <p className="text-gray-600 mb-6">
                  <strong>{email}</strong> has been removed from our mailing list. 
                  You will no longer receive marketing emails from FreightFlow.
                </p>
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h4 className="font-semibold text-gray-900 mb-2">What this means:</h4>
                  <ul className="text-sm text-gray-600 space-y-1 text-left">
                    <li>• No more waitlist updates</li>
                    <li>• No early access notifications</li>
                    <li>• No manufacturing freight optimization tips</li>
                    <li>• Transactional emails (if you have an account) will still be sent</li>
                  </ul>
                </div>
                <p className="text-sm text-gray-500 mb-6">
                  Changed your mind? You can rejoin our waitlist anytime by visiting our homepage.
                </p>
                <a 
                  href="/"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark transition-colors"
                >
                  Return to Homepage
                </a>
              </div>
            )}

            {status === 'error' && (
              <div className="text-center">
                <XMarkIcon className="h-16 w-16 text-destructive mx-auto mb-6" />
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Unsubscribe Failed
                </h3>
                <p className="text-gray-600 mb-6">
                  We encountered an error processing your unsubscribe request:
                </p>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <p className="text-red-700 text-sm">{errorMessage}</p>
                </div>
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">
                    If you continue to have issues, please contact us directly:
                  </p>
                  <a 
                    href="mailto:hello@machineshop.directory?subject=Unsubscribe Request"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  >
                    Contact Support
                  </a>
                </div>
              </div>
            )}

            {status === 'invalid' && (
              <div className="text-center">
                <XMarkIcon className="h-16 w-16 text-warning mx-auto mb-6" />
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Invalid Unsubscribe Link
                </h3>
                <p className="text-gray-600 mb-6">
                  This unsubscribe link is invalid or has expired. This can happen if:
                </p>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-left">
                  <ul className="text-sm text-yellow-800 space-y-1">
                    <li>• The link was copied incorrectly</li>
                    <li>• The email containing the link is very old</li>
                    <li>• You've already unsubscribed</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">
                    To unsubscribe, please contact us directly:
                  </p>
                  <a 
                    href="mailto:hello@machineshop.directory?subject=Manual Unsubscribe Request"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  >
                    Email Us to Unsubscribe
                  </a>
                </div>
              </div>
            )}
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              FreightFlow - Manufacturing Freight Optimization<br />
              Built specifically for manufacturing SMBs
            </p>
          </div>
        </div>
      </div>
    </>
  )
}