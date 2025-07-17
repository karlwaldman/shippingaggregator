import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { LandingPage } from '../LandingPage'

// Mock the email service
const mockSubscribeToNewsletter = jest.fn()
jest.mock('@/lib/postmark', () => ({
  subscribeToNewsletter: mockSubscribeToNewsletter,
}))

describe('LandingPage', () => {
  beforeEach(() => {
    mockSubscribeToNewsletter.mockClear()
  })

  describe('Hero Section', () => {
    it('displays compelling manufacturing-focused headline', () => {
      render(<LandingPage />)
      
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
      expect(screen.getByText(/manufacturing/i)).toBeInTheDocument()
      expect(screen.getByText(/freight/i)).toBeInTheDocument()
    })

    it('shows cost savings emphasis in hero', () => {
      render(<LandingPage />)
      
      expect(screen.getByText(/15-25%/i)).toBeInTheDocument()
      expect(screen.getByText(/save/i)).toBeInTheDocument()
    })

    it('includes manufacturing-specific value proposition', () => {
      render(<LandingPage />)
      
      expect(screen.getByText(/LTL.*FTL/i)).toBeInTheDocument()
      expect(screen.getByText(/ERP/i)).toBeInTheDocument()
    })
  })

  describe('Email Capture Form', () => {
    it('renders email input with proper labels', () => {
      render(<LandingPage />)
      
      const emailInput = screen.getByLabelText(/email/i)
      expect(emailInput).toBeInTheDocument()
      expect(emailInput).toHaveAttribute('type', 'email')
      expect(emailInput).toBeRequired()
    })

    it('renders company name input for B2B context', () => {
      render(<LandingPage />)
      
      const companyInput = screen.getByLabelText(/company/i)
      expect(companyInput).toBeInTheDocument()
      expect(companyInput).toBeRequired()
    })

    it('includes manufacturing industry selector', () => {
      render(<LandingPage />)
      
      const industrySelect = screen.getByLabelText(/industry/i)
      expect(industrySelect).toBeInTheDocument()
      expect(screen.getByText(/machining/i)).toBeInTheDocument()
      expect(screen.getByText(/assembly/i)).toBeInTheDocument()
    })

    it('validates email format before submission', async () => {
      render(<LandingPage />)
      
      const emailInput = screen.getByLabelText(/email/i)
      const submitButton = screen.getByRole('button', { name: /get.*calculator/i })
      
      fireEvent.change(emailInput, { target: { value: 'invalid-email' } })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText(/valid email/i)).toBeInTheDocument()
      })
    })

    it('submits form with valid data', async () => {
      mockSubscribeToNewsletter.mockResolvedValue({ success: true })
      render(<LandingPage />)
      
      const emailInput = screen.getByLabelText(/email/i)
      const companyInput = screen.getByLabelText(/company/i)
      const submitButton = screen.getByRole('button', { name: /get.*calculator/i })
      
      fireEvent.change(emailInput, { target: { value: 'ops@manufacturing.com' } })
      fireEvent.change(companyInput, { target: { value: 'Precision Manufacturing Inc.' } })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(mockSubscribeToNewsletter).toHaveBeenCalledWith({
          email: 'ops@manufacturing.com',
          company: 'Precision Manufacturing Inc.',
          industry: expect.any(String),
        })
      })
    })
  })

  describe('Social Proof Section', () => {
    it('shows cost savings potential', () => {
      render(<LandingPage />)
      
      expect(screen.getByText(/15-25%/i)).toBeInTheDocument()
      expect(screen.getByText(/savings potential/i)).toBeInTheDocument()
    })
  })

  describe('Problem/Solution Section', () => {
    it('highlights manufacturing shipping problems', () => {
      render(<LandingPage />)
      
      expect(screen.getByText(/multiple carriers/i)).toBeInTheDocument()
      expect(screen.getByText(/manual processes/i)).toBeInTheDocument()
      expect(screen.getByText(/ERP integration/i)).toBeInTheDocument()
    })

    it('emphasizes freight-specific solutions', () => {
      render(<LandingPage />)
      
      expect(screen.getByText(/LTL.*FTL/i)).toBeInTheDocument()
      expect(screen.getByText(/freight class/i)).toBeInTheDocument()
      expect(screen.getByText(/compliance/i)).toBeInTheDocument()
    })
  })

  describe('ROI Calculator Preview', () => {
    it('shows sample ROI calculation', () => {
      render(<LandingPage />)
      
      expect(screen.getByText(/current spend/i)).toBeInTheDocument()
      expect(screen.getByText(/estimated savings/i)).toBeInTheDocument()
      expect(screen.getByText(/annual ROI/i)).toBeInTheDocument()
    })

    it('uses manufacturing-realistic numbers', () => {
      render(<LandingPage />)
      
      expect(screen.getByText(/\$25,000/i)).toBeInTheDocument() // Monthly spend
      expect(screen.getByText(/\$4,500/i)).toBeInTheDocument() // Monthly savings
    })
  })

  describe('Trust Indicators', () => {
    it('displays security and compliance badges', () => {
      render(<LandingPage />)
      
      expect(screen.getByText(/enterprise-grade/i)).toBeInTheDocument()
      expect(screen.getByText(/enterprise-grade/i)).toBeInTheDocument()
    })

    it('shows carrier partnership logos', () => {
      render(<LandingPage />)
      
      expect(screen.getByText(/FedEx/i)).toBeInTheDocument()
      expect(screen.getByText(/UPS/i)).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('has proper heading hierarchy', () => {
      render(<LandingPage />)
      
      const h1 = screen.getByRole('heading', { level: 1 })
      const h2s = screen.getAllByRole('heading', { level: 2 })
      
      expect(h1).toBeInTheDocument()
      expect(h2s.length).toBeGreaterThan(0)
    })

    it('has alt text for all images', () => {
      render(<LandingPage />)
      
      const images = screen.getAllByRole('img')
      images.forEach(img => {
        expect(img).toHaveAttribute('alt')
        expect(img.getAttribute('alt')).not.toBe('')
      })
    })

    it('has proper form labels', () => {
      render(<LandingPage />)
      
      const emailInput = screen.getByLabelText(/email/i)
      const companyInput = screen.getByLabelText(/company/i)
      
      expect(emailInput).toBeInTheDocument()
      expect(companyInput).toBeInTheDocument()
    })
  })

  describe('Mobile Responsiveness', () => {
    it('renders mobile-friendly form', () => {
      render(<LandingPage />)
      
      const form = screen.getByRole('form')
      expect(form).toHaveClass('space-y-4') // Proper mobile spacing
    })

    it('has touch-friendly button sizes', () => {
      render(<LandingPage />)
      
      const submitButton = screen.getByRole('button', { name: /get.*calculator/i })
      expect(submitButton).toHaveClass('large-touch-target')
    })
  })
})