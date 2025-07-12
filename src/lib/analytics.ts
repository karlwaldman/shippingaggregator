import ReactGA from 'react-ga4'

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

export const initGA = () => {
  if (GA_MEASUREMENT_ID && typeof window !== 'undefined') {
    ReactGA.initialize(GA_MEASUREMENT_ID)
  }
}

export const logPageView = (path: string) => {
  if (GA_MEASUREMENT_ID && typeof window !== 'undefined') {
    ReactGA.send({ hitType: 'pageview', page: path })
  }
}

export const logEvent = (category: string, action: string, label?: string, value?: number) => {
  if (GA_MEASUREMENT_ID && typeof window !== 'undefined') {
    ReactGA.event({
      category,
      action,
      label,
      value
    })
  }
}

export const logFormSubmission = (formName: string, formData?: Record<string, any>) => {
  logEvent('Form', 'Submit', formName)
  
  // Log additional form-specific events
  if (formName === 'waitlist') {
    logEvent('Conversion', 'Waitlist Signup')
  } else if (formName === 'calculator') {
    logEvent('Engagement', 'Calculator Used', formData?.shipmentType)
  }
}

export const logCalculatorUsage = (data: {
  shipmentType: string
  weight: number
  estimatedCost?: number
}) => {
  logEvent('Calculator', 'Calculate', data.shipmentType, Math.round(data.weight))
  
  if (data.estimatedCost) {
    logEvent('Calculator', 'Cost Estimated', data.shipmentType, Math.round(data.estimatedCost))
  }
}

export const logEmailInteraction = (action: 'signup' | 'unsubscribe' | 'click') => {
  logEvent('Email', action)
}

export const setUserProperties = (properties: Record<string, any>) => {
  if (GA_MEASUREMENT_ID && typeof window !== 'undefined') {
    ReactGA.gtag('set', 'user_properties', properties)
  }
}