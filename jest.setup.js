import '@testing-library/jest-dom'

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '/',
      query: {},
      asPath: '/',
      push: jest.fn(),
      pop: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn().mockResolvedValue(undefined),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
      isFallback: false,
    }
  },
}))

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    return <img {...props} />
  },
}))

// Mock environment variables
process.env.NODE_ENV = 'test'
process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000'

// Mock Postmark (email service) - using relative path for setup
jest.mock('./src/lib/postmark', () => ({
  sendEmail: jest.fn().mockResolvedValue({ MessageID: 'test-id' }),
  subscribeToNewsletter: jest.fn().mockResolvedValue({ success: true }),
}))

// Mock Vercel Analytics - not needed for local testing
// jest.mock('@vercel/analytics/react', () => ({
//   Analytics: () => null,
//   track: jest.fn(),
// }))

// Global test utilities
global.mockFreightRates = [
  {
    id: 'fedex-ltl-1',
    carrier: 'FedEx Freight',
    service: 'FedEx Freight Priority',
    totalCost: 485.67,
    baseCost: 425.00,
    fuelSurcharge: 45.67,
    accessorials: 15.00,
    transitDays: 2,
    deliveryDate: '2024-01-15',
    freightClass: '65',
    savings: 89.33,
    savingsPercent: 15.5,
  },
  {
    id: 'ups-ltl-1', 
    carrier: 'UPS Freight',
    service: 'UPS Freight LTL',
    totalCost: 512.45,
    baseCost: 445.00,
    fuelSurcharge: 52.45,
    accessorials: 15.00,
    transitDays: 3,
    deliveryDate: '2024-01-16',
    freightClass: '65',
    savings: 62.55,
    savingsPercent: 10.9,
  },
]

global.mockManufacturingCompany = {
  name: 'Precision Manufacturing Inc.',
  industry: 'Machining',
  employees: 125,
  monthlyShipments: 180,
  averageWeight: 2500,
  currentSpend: 25000,
  estimatedSavings: 4500,
  location: 'Cleveland, OH',
}