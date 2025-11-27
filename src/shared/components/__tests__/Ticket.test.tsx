import { render, screen } from '@testing-library/react'
import { Ticket } from '../Ticket'

describe('Ticket', () => {
  it('should render with default props', () => {
    render(<Ticket />)
    // Check that price and quality are displayed (using translation keys)
    expect(screen.getByText('price')).toBeTruthy()
    expect(screen.getByText('quality')).toBeTruthy()
  })

  it('should render with custom price', () => {
    render(<Ticket price={500} />)
    expect(screen.getByText('500')).toBeTruthy()
  })

  it('should render with custom quality', () => {
    render(<Ticket quality={5.5} />)
    expect(screen.getByText('5.5')).toBeTruthy()
  })

  it('should render bronze variant by default', () => {
    const { container } = render(<Ticket />)
    const ticket = container.firstChild as HTMLElement
    expect(ticket.classList.contains('from-amber-600')).toBe(true)
  })

  it('should render silver variant', () => {
    const { container } = render(<Ticket variant="silver" />)
    const ticket = container.firstChild as HTMLElement
    expect(ticket.classList.contains('from-gray-300')).toBe(true)
  })

  it('should render gold variant', () => {
    const { container } = render(<Ticket variant="gold" />)
    const ticket = container.firstChild as HTMLElement
    expect(ticket.classList.contains('from-yellow-400')).toBe(true)
  })

  it('should render diamond variant', () => {
    const { container } = render(<Ticket variant="diamond" />)
    const ticket = container.firstChild as HTMLElement
    expect(ticket.classList.contains('from-cyan-400')).toBe(true)
  })

  it('should render small size', () => {
    const { container } = render(<Ticket size="sm" />)
    const ticket = container.firstChild as HTMLElement
    expect(ticket.classList.contains('w-32')).toBe(true)
  })

  it('should render medium size by default', () => {
    const { container } = render(<Ticket />)
    const ticket = container.firstChild as HTMLElement
    expect(ticket.classList.contains('w-40')).toBe(true)
  })

  it('should render large size', () => {
    const { container } = render(<Ticket size="lg" />)
    const ticket = container.firstChild as HTMLElement
    expect(ticket.classList.contains('w-48')).toBe(true)
  })

  it('should show carrot emoji when showCarrot is true', () => {
    render(<Ticket showCarrot={true} />)
    expect(screen.getByText('🥕')).toBeTruthy()
  })

  it('should not show carrot emoji when showCarrot is false', () => {
    render(<Ticket showCarrot={false} />)
    expect(screen.queryByText('🥕')).not.toBeTruthy()
  })

  it('should apply custom className', () => {
    const { container } = render(<Ticket className="custom-class" />)
    const ticket = container.firstChild as HTMLElement
    expect(ticket.classList.contains('custom-class')).toBe(true)
  })

  it('should forward other props', () => {
    const { container } = render(
      <Ticket data-testid="ticket" aria-label="Bronze Ticket" />,
    )
    const ticket = container.firstChild as HTMLElement
    expect(ticket.getAttribute('data-testid')).toBeTruthy()
    expect(ticket.getAttribute('aria-label')).toBeTruthy()
  })
})
