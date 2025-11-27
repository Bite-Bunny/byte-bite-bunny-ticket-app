import { renderHook } from '@testing-library/react'
import { act } from 'react'
import { useDidMount } from '../useDidMount'

describe('useDidMount', () => {
  it('should return true after component mounts (useEffect runs after render)', () => {
    const { result } = renderHook(() => useDidMount())

    // React Testing Library's renderHook waits for effects to complete,
    // so by the time we check, the effect has already run
    expect(result.current).toBe(true)
  })

  it('should remain true after multiple rerenders', () => {
    const { result, rerender } = renderHook(() => useDidMount())

    // After mount, should be true
    expect(result.current).toBe(true)

    // After rerenders, should still be true
    rerender()
    expect(result.current).toBe(true)

    rerender()
    expect(result.current).toBe(true)
  })

  it('should set didMount to true only once', () => {
    const { result, rerender } = renderHook(() => useDidMount())

    const initialValue = result.current
    expect(initialValue).toBe(true)

    // Multiple rerenders should not change the value
    act(() => {
      rerender()
    })
    expect(result.current).toBe(true)

    act(() => {
      rerender()
    })
    expect(result.current).toBe(true)
  })
})
