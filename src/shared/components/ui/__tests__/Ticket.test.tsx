import { render, screen } from '@testing-library/react'
import { Ticket } from '../Ticket'

describe('Ticket', () => {
  it('should render ticket with default props', () => {
    render(<Ticket />)
    const ticket = screen.getByText(/price/i)
    expect(ticket).toBeTruthy()
  })

  it('should render with bronze variant by default', () => {
    const { container } = render(<Ticket />)
    const ticket = container.querySelector('div')
    expect(ticket?.classList.toString()).toContain('from-amber-600')
  })

  it('should render bronze variant', () => {
    const { container } = render(<Ticket variant="bronze" />)
    const ticket = container.querySelector('div')
    expect(ticket?.classList.toString()).toContain('from-amber-600')
  })

  it('should render silver variant', () => {
    const { container } = render(<Ticket variant="silver" />)
    const ticket = container.querySelector('div')
    expect(ticket?.classList.toString()).toContain('from-gray-300')
  })

  it('should render gold variant', () => {
    const { container } = render(<Ticket variant="gold" />)
    const ticket = container.querySelector('div')
    expect(ticket?.classList.toString()).toContain('from-yellow-400')
  })

  it('should render diamond variant', () => {
    const { container } = render(<Ticket variant="diamond" />)
    const ticket = container.querySelector('div')
    expect(ticket?.classList.toString()).toContain('from-cyan-400')
  })

  it('should display default price', () => {
    render(<Ticket />)
    expect(screen.getByText('300')).toBeTruthy()
  })

  it('should display custom price', () => {
    render(<Ticket price={500} />)
    expect(screen.getByText('500')).toBeTruthy()
  })

  it('should display default quality', () => {
    render(<Ticket />)
    expect(screen.getByText('3.1554')).toBeTruthy()
  })

  it('should display custom quality', () => {
    render(<Ticket quality={5.5} />)
    expect(screen.getByText('5.5')).toBeTruthy()
  })

  it('should show carrot by default', () => {
    render(<Ticket />)
    expect(screen.getByText('🥕')).toBeTruthy()
  })

  it('should hide carrot when showCarrot is false', () => {
    render(<Ticket showCarrot={false} />)
    expect(screen.queryByText('🥕')).toBeFalsy()
  })

  it('should render small size', () => {
    const { container } = render(<Ticket size="sm" />)
    const ticket = container.querySelector('div')
    expect(ticket?.classList.toString()).toContain('w-32')
    expect(ticket?.classList.toString()).toContain('h-48')
  })

  it('should render medium size by default', () => {
    const { container } = render(<Ticket />)
    const ticket = container.querySelector('div')
    expect(ticket?.classList.toString()).toContain('w-40')
    expect(ticket?.classList.toString()).toContain('h-60')
  })

  it('should render large size', () => {
    const { container } = render(<Ticket size="lg" />)
    const ticket = container.querySelector('div')
    expect(ticket?.classList.toString()).toContain('w-48')
    expect(ticket?.classList.toString()).toContain('h-72')
  })

  it('should apply custom className', () => {
    const { container } = render(<Ticket className="custom-class" />)
    const ticket = container.querySelector('div')
    expect(ticket?.classList.contains('custom-class')).toBe(true)
  })

  it('should forward other props', () => {
    render(<Ticket data-testid="custom-ticket" aria-label="Custom" />)
    const ticket = screen.getByTestId('custom-ticket')
    expect(ticket?.getAttribute('aria-label')).toBe('Custom')
  })

  it('should render ticket logo', () => {
    render(<Ticket />)
    const logo = screen.getByAltText('Bite Bunny Logo')
    expect(logo).toBeTruthy()
  })

  it('should render price label', () => {
    render(<Ticket />)
    const priceLabel = screen.getByText(/price/i)
    expect(priceLabel).toBeTruthy()
  })

  it('should render quality label', () => {
    render(<Ticket />)
    const qualityLabel = screen.getByText(/quality/i)
    expect(qualityLabel).toBeTruthy()
  })

  it('should render all variant styles correctly', () => {
    const variants = ['bronze', 'silver', 'gold', 'diamond'] as const

    variants.forEach((variant) => {
      const { container } = render(<Ticket variant={variant} />)
      const ticket = container.querySelector('div')
      expect(ticket).toBeTruthy()
    })
  })

  it('should render all size styles correctly', () => {
    const sizes = ['sm', 'md', 'lg'] as const

    sizes.forEach((size) => {
      const { container } = render(<Ticket size={size} />)
      const ticket = container.querySelector('div')
      expect(ticket).toBeTruthy()
    })
  })

  it('should combine variant and size correctly', () => {
    const { container } = render(<Ticket variant="gold" size="lg" />)
    const ticket = container.querySelector('div')
    expect(ticket?.classList.toString()).toContain('from-yellow-400')
    expect(ticket?.classList.toString()).toContain('w-48')
    expect(ticket?.classList.toString()).toContain('h-72')
  })
})
