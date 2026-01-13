import { render, screen } from '@testing-library/react'
import { Card } from '../Card'

describe('Card', () => {
  it('should render card with children', () => {
    render(<Card>Card content</Card>)
    expect(screen.getByText('Card content')).toBeTruthy()
  })

  it('should apply custom className', () => {
    const { container } = render(<Card className="custom-class">Test</Card>)
    const card = container.querySelector('div')
    expect(card?.classList.contains('custom-class')).toBe(true)
  })

  it('should use default variant by default', () => {
    const { container } = render(<Card>Test</Card>)
    const card = container.querySelector('div')
    const boxShadow = card?.style.boxShadow
    expect(boxShadow).toContain('0 -8px 32px rgba(0, 0, 0, 0.3)')
  })

  it('should apply elevated variant styles', () => {
    const { container } = render(<Card variant="elevated">Test</Card>)
    const card = container.querySelector('div')
    const boxShadow = card?.style.boxShadow
    expect(boxShadow).toContain('0 12px 48px rgba(0, 0, 0, 0.4)')
  })

  it('should forward other props', () => {
    render(
      <Card data-testid="custom-card" aria-label="Custom">
        Test
      </Card>,
    )
    const card = screen.getByTestId('custom-card')
    expect(card?.getAttribute('aria-label')).toBe('Custom')
  })

  it('should render with complex children', () => {
    render(
      <Card>
        <div>Header</div>
        <div>Body</div>
        <div>Footer</div>
      </Card>,
    )
    expect(screen.getByText('Header')).toBeTruthy()
    expect(screen.getByText('Body')).toBeTruthy()
    expect(screen.getByText('Footer')).toBeTruthy()
  })
})
