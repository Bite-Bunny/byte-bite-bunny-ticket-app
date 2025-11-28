import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '../Button'

describe('Button', () => {
  it('should render button with children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: /click me/i })).toBeTruthy()
  })

  it('should apply custom className', () => {
    const { container } = render(<Button className="custom-class">Test</Button>)
    const button = container.querySelector('button')
    expect(button?.classList.contains('custom-class')).toBe(true)
  })

  it('should handle click events', async () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)

    const button = screen.getByRole('button', { name: /click me/i })
    await userEvent.click(button)

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>)
    const button = screen.getByRole('button', { name: /disabled/i })
    expect(button.hasAttribute('disabled')).toBe(true)
  })

  it('should not call onClick when disabled', async () => {
    const handleClick = jest.fn()
    render(
      <Button disabled onClick={handleClick}>
        Disabled
      </Button>,
    )

    const button = screen.getByRole('button', { name: /disabled/i })
    await userEvent.click(button)

    expect(handleClick).not.toHaveBeenCalled()
  })

  it('should have type="button" by default', () => {
    render(<Button>Test</Button>)
    const button = screen.getByRole('button')
    expect(button?.getAttribute('type')).toBe('button')
  })

  it('should forward other props', () => {
    render(
      <Button data-testid="custom-button" aria-label="Custom">
        Test
      </Button>,
    )
    const button = screen.getByTestId('custom-button')
    expect(button?.getAttribute('aria-label')).toBe('Custom')
  })
})
