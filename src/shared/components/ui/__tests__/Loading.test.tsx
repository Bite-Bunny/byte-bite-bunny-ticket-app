import { render, screen } from '@testing-library/react'
import { Loading } from '../Loading'

describe('Loading', () => {
  it('should render loading component', () => {
    const { container } = render(<Loading />)
    const loadingContainer = container.firstChild as HTMLElement
    expect(loadingContainer).toBeTruthy()
    expect(loadingContainer.tagName).toBe('DIV')
  })

  it('should render with absolute positioning', () => {
    const { container } = render(<Loading />)
    const loadingContainer = container.querySelector('div')
    expect(loadingContainer?.classList.contains('absolute')).toBe(true)
  })

  it('should render logo image', () => {
    render(<Loading />)
    const image = screen.getByAltText('Bite Bunny Logo')
    expect(image).toBeTruthy()
  })

  it('should have correct image attributes', () => {
    render(<Loading />)
    const image = screen.getByAltText('Bite Bunny Logo')
    expect(image.getAttribute('src')).toContain('logo-short.png')
    expect(image.getAttribute('width')).toBe('120')
    expect(image.getAttribute('height')).toBe('120')
  })

  it('should apply pulse animation class', () => {
    render(<Loading />)
    const image = screen.getByAltText('Bite Bunny Logo')
    expect(image.classList.contains('animate-pulse-smooth')).toBe(true)
  })

  it('should have full width and height container', () => {
    const { container } = render(<Loading />)
    const loadingContainer = container.querySelector('div')
    expect(loadingContainer?.classList.contains('w-full')).toBe(true)
    expect(loadingContainer?.classList.contains('h-full')).toBe(true)
  })

  it('should center content with flex', () => {
    const { container } = render(<Loading />)
    const loadingContainer = container.querySelector('div')
    expect(loadingContainer?.classList.contains('flex')).toBe(true)
    expect(loadingContainer?.classList.contains('items-center')).toBe(true)
    expect(loadingContainer?.classList.contains('justify-center')).toBe(true)
  })
})
