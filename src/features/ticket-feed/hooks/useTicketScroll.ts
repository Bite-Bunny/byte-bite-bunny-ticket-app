import { useEffect, useRef, useState } from 'react'
import { PanInfo } from 'framer-motion'
import { TicketData } from '../types'
import {
  SCROLL_POSITION_THRESHOLD,
  MAX_SCROLL_ANIMATION_FRAMES,
  SCROLL_COMPLETION_THRESHOLD,
  SCROLL_COMPLETION_CHECK_DELAY,
  WHEEL_SCROLL_TIMEOUT,
  FAST_SWIPE_VELOCITY_THRESHOLD,
  DRAG_DISTANCE_THRESHOLD,
} from '../config'

interface UseTicketScrollProps {
  tickets: TicketData[]
  containerRef: React.RefObject<HTMLDivElement>
}

interface UseTicketScrollReturn {
  currentIndex: number
  isDragging: boolean
  scrollToIndex: (index: number) => void
  scrollNext: () => void
  scrollPrevious: () => void
  handleDragStart: () => void
  handleDrag: (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => void
  handleDragEnd: (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => void
}

export const useTicketScroll = ({
  tickets,
  containerRef,
}: UseTicketScrollProps): UseTicketScrollReturn => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const dragStartScroll = useRef(0)
  const isScrollingRef = useRef(false)
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const isMountedRef = useRef(true)

  // Handle scroll to snap to nearest ticket
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleScroll = () => {
      if (isDragging || isScrollingRef.current) return // Don't update during drag or smooth scroll

      const scrollTop = container.scrollTop
      const itemHeight = container.clientHeight
      const newIndex = Math.round(scrollTop / itemHeight)

      // Only update if we're close enough to the target position
      const targetScroll = newIndex * itemHeight
      const distance = Math.abs(scrollTop - targetScroll)

      if (distance < SCROLL_POSITION_THRESHOLD) {
        setCurrentIndex(newIndex)
      }
    }

    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => container.removeEventListener('scroll', handleScroll)
  }, [isDragging, containerRef])

  // Smooth scroll to specific index
  const scrollToIndex = (index: number) => {
    const container = containerRef.current
    if (!container || !isMountedRef.current) return

    const itemHeight = container.clientHeight
    const targetScroll = index * itemHeight

    // Clear any existing timeout and animation frame
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current)
      scrollTimeoutRef.current = null
    }
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }

    // Mark as scrolling to prevent premature index updates
    isScrollingRef.current = true

    container.scrollTo({
      top: targetScroll,
      behavior: 'smooth',
    })

    // Use requestAnimationFrame to detect when scroll animation completes
    let lastScrollTop = container.scrollTop
    let frameCount = 0

    const checkScrollComplete = () => {
      // CRITICAL FIX: Stop animation loop if component unmounted
      if (!isMountedRef.current || !containerRef.current) {
        isScrollingRef.current = false
        animationFrameRef.current = null
        return
      }

      const container = containerRef.current
      if (!container) {
        isScrollingRef.current = false
        animationFrameRef.current = null
        return
      }

      const currentScrollTop = container.scrollTop
      frameCount++

      // If scroll position hasn't changed significantly, consider it complete
      if (
        Math.abs(currentScrollTop - lastScrollTop) <
          SCROLL_COMPLETION_THRESHOLD ||
        frameCount >= MAX_SCROLL_ANIMATION_FRAMES
      ) {
        isScrollingRef.current = false
        animationFrameRef.current = null
        if (isMountedRef.current) {
          const finalScroll = container.scrollTop
          const finalIndex = Math.round(finalScroll / itemHeight)
          setCurrentIndex(finalIndex)
        }
      } else {
        lastScrollTop = currentScrollTop
        animationFrameRef.current = requestAnimationFrame(checkScrollComplete)
      }
    }

    // Start checking after a short delay to allow scroll to begin
    scrollTimeoutRef.current = setTimeout(() => {
      if (isMountedRef.current && containerRef.current) {
        animationFrameRef.current = requestAnimationFrame(checkScrollComplete)
      }
    }, SCROLL_COMPLETION_CHECK_DELAY)
  }

  // Navigate to next ticket
  const scrollNext = () => {
    if (currentIndex < tickets.length - 1) {
      scrollToIndex(currentIndex + 1)
    }
  }

  // Navigate to previous ticket
  const scrollPrevious = () => {
    if (currentIndex > 0) {
      scrollToIndex(currentIndex - 1)
    }
  }

  // Cleanup timeout and animation frame on unmount
  useEffect(() => {
    return () => {
      // CRITICAL FIX: Mark as unmounted to stop all ongoing operations
      isMountedRef.current = false

      // Cancel any pending timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
        scrollTimeoutRef.current = null
      }

      // Cancel any pending animation frame (prevents infinite CPU usage)
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = null
      }

      // Reset scrolling state
      isScrollingRef.current = false
    }
  }, [])

  // Handle wheel events for smooth scrolling
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let wheelScrolling = false

    const handleWheel = (e: WheelEvent) => {
      if (isDragging || isScrollingRef.current) return // Don't handle wheel during drag or smooth scroll
      e.preventDefault()

      if (wheelScrolling) return
      wheelScrolling = true

      const delta = e.deltaY
      const itemHeight = container.clientHeight
      const currentScroll = container.scrollTop
      const currentIndex = Math.round(currentScroll / itemHeight)

      let newIndex = currentIndex
      if (delta > 0 && currentIndex < tickets.length - 1) {
        newIndex = currentIndex + 1
      } else if (delta < 0 && currentIndex > 0) {
        newIndex = currentIndex - 1
      }

      scrollToIndex(newIndex)

      setTimeout(() => {
        wheelScrolling = false
      }, WHEEL_SCROLL_TIMEOUT)
    }

    container.addEventListener('wheel', handleWheel, { passive: false })
    return () => container.removeEventListener('wheel', handleWheel)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tickets.length, isDragging, containerRef])

  // Handle drag gesture
  const handleDragStart = () => {
    setIsDragging(true)
    const container = containerRef.current
    if (container) {
      dragStartScroll.current = container.scrollTop
    }
  }

  const handleDrag = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    const container = containerRef.current
    if (!container) return

    // Apply drag to scroll position (inverse because dragging down should scroll down)
    const newScroll = dragStartScroll.current - info.offset.y
    const maxScroll = (tickets.length - 1) * container.clientHeight
    container.scrollTop = Math.max(0, Math.min(newScroll, maxScroll))
  }

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    setIsDragging(false)
    const container = containerRef.current
    if (!container) return

    const itemHeight = container.clientHeight
    const currentScroll = container.scrollTop
    const currentIndex = Math.round(currentScroll / itemHeight)
    const velocity = info.velocity.y

    // Determine target index based on drag distance and velocity
    let targetIndex = currentIndex
    const dragDistance = -info.offset.y
    const threshold = itemHeight * DRAG_DISTANCE_THRESHOLD

    if (Math.abs(velocity) > FAST_SWIPE_VELOCITY_THRESHOLD) {
      // Fast swipe - go to next/previous based on velocity direction
      if (velocity < 0 && currentIndex < tickets.length - 1) {
        targetIndex = currentIndex + 1
      } else if (velocity > 0 && currentIndex > 0) {
        targetIndex = currentIndex - 1
      }
    } else if (Math.abs(dragDistance) > threshold) {
      // Slow drag but past threshold
      if (dragDistance > 0 && currentIndex < tickets.length - 1) {
        targetIndex = currentIndex + 1
      } else if (dragDistance < 0 && currentIndex > 0) {
        targetIndex = currentIndex - 1
      }
    }

    scrollToIndex(targetIndex)
  }

  return {
    currentIndex,
    isDragging,
    scrollToIndex,
    scrollNext,
    scrollPrevious,
    handleDragStart,
    handleDrag,
    handleDragEnd,
  }
}
