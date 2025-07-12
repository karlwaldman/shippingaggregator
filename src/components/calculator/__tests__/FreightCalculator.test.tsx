import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { FreightCalculator } from '../FreightCalculator'

describe('FreightCalculator', () => {
  describe('Form Inputs', () => {
    it('renders all required shipping inputs', () => {
      render(<FreightCalculator />)
      
      expect(screen.getByLabelText(/origin zip/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/destination zip/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/weight/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/dimensions/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/freight class/i)).toBeInTheDocument()
    })

    it('includes manufacturing-specific options', () => {
      render(<FreightCalculator />)
      
      expect(screen.getByText(/LTL/i)).toBeInTheDocument()
      expect(screen.getByText(/FTL/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/hazmat/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/lift gate/i)).toBeInTheDocument()
    })

    it('validates weight for manufacturing ranges', async () => {
      render(<FreightCalculator />)
      
      const weightInput = screen.getByLabelText(/weight/i)
      fireEvent.change(weightInput, { target: { value: '50' } })
      
      await waitFor(() => {
        expect(screen.getByText(/minimum.*150.*lbs/i)).toBeInTheDocument()
      })
    })

    it('provides freight class helper', () => {
      render(<FreightCalculator />)
      
      expect(screen.getByText(/freight class.*help/i)).toBeInTheDocument()
      expect(screen.getByText(/class.*65/i)).toBeInTheDocument()
      expect(screen.getByText(/class.*85/i)).toBeInTheDocument()
    })
  })

  describe('Rate Calculation', () => {
    it('calculates LTL rates for manufacturing shipments', async () => {
      render(<FreightCalculator />)
      
      // Fill out form
      fireEvent.change(screen.getByLabelText(/origin zip/i), { target: { value: '44101' } })
      fireEvent.change(screen.getByLabelText(/destination zip/i), { target: { value: '60601' } })
      fireEvent.change(screen.getByLabelText(/weight/i), { target: { value: '2500' } })
      fireEvent.change(screen.getByLabelText(/freight class/i), { target: { value: '65' } })
      
      fireEvent.click(screen.getByRole('button', { name: /calculate rates/i }))
      
      await waitFor(() => {
        expect(screen.getByText(/FedEx Freight/i)).toBeInTheDocument()
        expect(screen.getByText(/UPS Freight/i)).toBeInTheDocument()
        expect(screen.getByText(/\$.*\..*\d+/)).toBeInTheDocument() // Price format
      })
    })

    it('shows cost savings compared to current rates', async () => {
      render(<FreightCalculator />)
      
      // Fill form and calculate
      fireEvent.change(screen.getByLabelText(/weight/i), { target: { value: '2500' } })
      fireEvent.click(screen.getByRole('button', { name: /calculate rates/i }))
      
      await waitFor(() => {
        expect(screen.getByText(/you could save/i)).toBeInTheDocument()
        expect(screen.getByText(/\$.*saved/i)).toBeInTheDocument()
        expect(screen.getByText(/.*%.*savings/i)).toBeInTheDocument()
      })
    })

    it('handles FTL calculations for large shipments', async () => {
      render(<FreightCalculator />)
      
      fireEvent.change(screen.getByLabelText(/weight/i), { target: { value: '25000' } })
      fireEvent.click(screen.getByRole('button', { name: /calculate rates/i }))
      
      await waitFor(() => {
        expect(screen.getByText(/FTL.*recommended/i)).toBeInTheDocument()
        expect(screen.getByText(/full truckload/i)).toBeInTheDocument()
      })
    })
  })

  describe('Manufacturing Context', () => {
    it('displays freight-specific terminology', () => {
      render(<FreightCalculator />)
      
      expect(screen.getByText(/freight class/i)).toBeInTheDocument()
      expect(screen.getByText(/NMFC/i)).toBeInTheDocument()
      expect(screen.getByText(/accessorial/i)).toBeInTheDocument()
    })

    it('includes common manufacturing accessorials', () => {
      render(<FreightCalculator />)
      
      expect(screen.getByText(/lift gate/i)).toBeInTheDocument()
      expect(screen.getByText(/inside delivery/i)).toBeInTheDocument()
      expect(screen.getByText(/appointment/i)).toBeInTheDocument()
    })

    it('shows manufacturing industry examples', () => {
      render(<FreightCalculator />)
      
      expect(screen.getByText(/machinery/i)).toBeInTheDocument()
      expect(screen.getByText(/raw materials/i)).toBeInTheDocument()
      expect(screen.getByText(/manufactured goods/i)).toBeInTheDocument()
    })
  })

  describe('Results Display', () => {
    it('emphasizes cost savings with visual indicators', async () => {
      render(<FreightCalculator />)
      
      fireEvent.change(screen.getByLabelText(/weight/i), { target: { value: '2500' } })
      fireEvent.click(screen.getByRole('button', { name: /calculate rates/i }))
      
      await waitFor(() => {
        const savingsElements = screen.getAllByText(/save/i)
        expect(savingsElements.length).toBeGreaterThan(0)
        
        // Check for savings styling
        const savingsAmount = screen.getByText(/\$.*saved/i)
        expect(savingsAmount).toHaveClass('text-success')
      })
    })

    it('includes detailed cost breakdown', async () => {
      render(<FreightCalculator />)
      
      fireEvent.change(screen.getByLabelText(/weight/i), { target: { value: '2500' } })
      fireEvent.click(screen.getByRole('button', { name: /calculate rates/i }))
      
      await waitFor(() => {
        expect(screen.getByText(/base rate/i)).toBeInTheDocument()
        expect(screen.getByText(/fuel surcharge/i)).toBeInTheDocument()
        expect(screen.getByText(/accessorials/i)).toBeInTheDocument()
        expect(screen.getByText(/total cost/i)).toBeInTheDocument()
      })
    })

    it('shows transit time for manufacturing planning', async () => {
      render(<FreightCalculator />)
      
      fireEvent.change(screen.getByLabelText(/weight/i), { target: { value: '2500' } })
      fireEvent.click(screen.getByRole('button', { name: /calculate rates/i }))
      
      await waitFor(() => {
        expect(screen.getByText(/\d+.*business days/i)).toBeInTheDocument()
        expect(screen.getByText(/estimated delivery/i)).toBeInTheDocument()
      })
    })
  })

  describe('Lead Generation Integration', () => {
    it('prompts for email after calculation', async () => {
      render(<FreightCalculator />)
      
      fireEvent.change(screen.getByLabelText(/weight/i), { target: { value: '2500' } })
      fireEvent.click(screen.getByRole('button', { name: /calculate rates/i }))
      
      await waitFor(() => {
        expect(screen.getByText(/get detailed analysis/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
      })
    })

    it('offers ROI report download', async () => {
      render(<FreightCalculator />)
      
      fireEvent.change(screen.getByLabelText(/weight/i), { target: { value: '2500' } })
      fireEvent.click(screen.getByRole('button', { name: /calculate rates/i }))
      
      await waitFor(() => {
        expect(screen.getByText(/download.*ROI.*report/i)).toBeInTheDocument()
        expect(screen.getByText(/annual savings analysis/i)).toBeInTheDocument()
      })
    })
  })

  describe('Accessibility', () => {
    it('has proper form labels and structure', () => {
      render(<FreightCalculator />)
      
      const weightInput = screen.getByLabelText(/weight/i)
      expect(weightInput).toBeInTheDocument()
      expect(weightInput).toHaveAttribute('type', 'number')
      
      const classSelect = screen.getByLabelText(/freight class/i)
      expect(classSelect).toBeInTheDocument()
    })

    it('provides helpful error messages', async () => {
      render(<FreightCalculator />)
      
      fireEvent.click(screen.getByRole('button', { name: /calculate rates/i }))
      
      await waitFor(() => {
        expect(screen.getByText(/origin.*required/i)).toBeInTheDocument()
        expect(screen.getByText(/weight.*required/i)).toBeInTheDocument()
      })
    })
  })
})