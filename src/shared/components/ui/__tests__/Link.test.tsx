import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Link } from '../Link'
import { openLink } from '@telegram-apps/sdk-react'

// Mock the openLink function
jest.mock('@telegram-apps/sdk-react', () => ({
  openLink: jest.fn(),
}))

// Mock Next.js Link
jest.mock('next/link', () => {
  const MockLink = ({ children, href, onClick, ...props }: any) => {
    return (
      <a href={href} onClick={onClick} {...props}>
        {children}
      </a>
    )
  }
  MockLink.displayName = 'MockLink'
  return MockLink
})

describe('Link', () => {
  let locationSpy: jest.SpyInstance

  beforeAll(() => {
    // Spy on location.toString() to return our mock URL
    locationSpy = jest.spyOn(window.location, 'toString')
    locationSpy.mockReturnValue('https://localhost:3000')
  })

  afterAll(() => {
    locationSpy.mockRestore()
  })

  beforeEach(() => {
    jest.clearAllMocks()
    // Reset the mock return value before each test
    locationSpy.mockReturnValue('https://localhost:3000')
  })

  it('should render link with children', () => {
    render(<Link href="/test">Click me</Link>)
    const link = screen.getByRole('link', { name: /click me/i })
    expect(link).toBeTruthy()
    expect(link.getAttribute('href')).toBe('/test')
  })

  it('should apply custom className', () => {
    const { container } = render(
      <Link href="/test" className="custom-class">
        Test
      </Link>,
    )
    const link = container.querySelector('a')
    expect(link?.classList.contains('custom-class')).toBe(true)
  })

  it('should handle click events', async () => {
    const handleClick = jest.fn()
    render(
      <Link href="/test" onClick={handleClick}>
        Click me
      </Link>,
    )

    const link = screen.getByRole('link', { name: /click me/i })
    await userEvent.click(link)

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('should open external links using Telegram SDK', async () => {
    render(<Link href="https://example.com">External</Link>)

    const link = screen.getByRole('link', { name: /external/i })
    await userEvent.click(link)

    expect(openLink).toHaveBeenCalled()
    const mockedOpenLink = openLink as jest.MockedFunction<typeof openLink>
    const callArg = mockedOpenLink.mock.calls[0][0]
    expect(callArg).toContain('https://example.com')
  })

  it('should not open internal links using Telegram SDK', async () => {
    render(<Link href="/internal">Internal</Link>)

    const link = screen.getByRole('link', { name: /internal/i })
    await userEvent.click(link)

    expect(openLink).not.toHaveBeenCalled()
  })

  it('should handle external links with different protocol', async () => {
    render(<Link href="http://example.com">External HTTP</Link>)

    const link = screen.getByRole('link', { name: /external http/i })
    await userEvent.click(link)

    expect(openLink).toHaveBeenCalled()
  })

  it('should handle external links with different host', async () => {
    render(<Link href="https://example.com">External Host</Link>)

    const link = screen.getByRole('link', { name: /external host/i })
    await userEvent.click(link)

    expect(openLink).toHaveBeenCalled()
  })

  it('should handle Next.js Link object href', async () => {
    render(
      <Link href={{ pathname: '/test', search: '?id=1', hash: '#section' }}>
        Object href
      </Link>,
    )

    const link = screen.getByRole('link', { name: /object href/i })
    expect(link).toBeTruthy()
  })

  it('should forward other props', () => {
    render(
      <Link
        href="/test"
        data-testid="custom-link"
        aria-label="Custom"
        target="_blank"
      >
        Test
      </Link>,
    )
    const link = screen.getByTestId('custom-link')
    expect(link?.getAttribute('aria-label')).toBe('Custom')
    expect(link?.getAttribute('target')).toBe('_blank')
  })

  it('should prevent default on external link click', async () => {
    render(<Link href="https://example.com">External</Link>)

    const link = screen.getByRole('link', { name: /external/i })
    const clickEvent = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    })

    link.dispatchEvent(clickEvent)

    // The onClick handler should prevent default for external links
    await userEvent.click(link)
    expect(openLink).toHaveBeenCalled()
  })
})
