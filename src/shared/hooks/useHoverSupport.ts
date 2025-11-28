import { useEffect, useState } from 'react'

/**
 * Detects if the device supports hover (i.e., desktop/trackpad, not touch-only mobile)
 * @return True if hover is supported
 */
export function useHoverSupport(): boolean {
  const [supportsHover, setSupportsHover] = useState(false)

  useEffect(() => {
    // Check if hover is supported
    const mediaQuery = window.matchMedia('(hover: hover)')
    setSupportsHover(mediaQuery.matches)

    // Listen for changes (e.g., device orientation, external monitor connection)
    const handleChange = (e: MediaQueryListEvent) => {
      setSupportsHover(e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)

    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  return supportsHover
}
