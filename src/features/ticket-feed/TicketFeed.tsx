'use client'

import React, { useRef, useMemo } from 'react'
import { cn } from '@/shared/lib/cn'
import { TicketFeedProps } from './types'
import { useTicketScroll } from './hooks/useTicketScroll'
import { ScrollableContainer } from './components/ScrollableContainer'
import { TicketSlide } from './components/TicketSlide'
import { ScrollIndicator } from './components/ScrollIndicator'
import { NavigationButtons } from './components/NavigationButtons'
import { generateTickets } from './utils/generateTickets'

// Only render visible tickets + buffer to reduce TBT
const VISIBLE_BUFFER = 2 // Render 2 tickets before and after visible one

export const TicketFeed = ({ tickets, className }: TicketFeedProps) => {
  const containerRef = useRef<HTMLDivElement>(null)

  const {
    currentIndex,
    isDragging,
    scrollNext,
    scrollPrevious,
    handleDragStart,
    handleDrag,
    handleDragEnd,
  } = useTicketScroll({
    tickets,
    containerRef,
  })

  // Only render visible tickets + buffer to reduce initial render cost
  const visibleTickets = useMemo(() => {
    const start = Math.max(0, currentIndex - VISIBLE_BUFFER)
    const end = Math.min(tickets.length, currentIndex + VISIBLE_BUFFER + 1)
    return tickets.slice(start, end).map((ticket, i) => ({
      ticket,
      index: start + i,
    }))
  }, [tickets, currentIndex])

  return (
    <div
      className={cn(
        'fixed inset-0 w-screen h-screen overflow-hidden',
        className,
      )}
      style={{
        touchAction: 'none',
        background: `
          radial-gradient(at 118% 95%, rgba(255, 161, 10, 0) 0%, rgba(0, 0, 0, 0.2) 100%),
          radial-gradient(at 18% 28%, rgba(255, 9, 9, 0) 0%, rgba(255, 0, 0, 0.2) 100%),
          radial-gradient(at 58% 9%, var(--color-background-gold) 0%, #000000 100%)
        `,
      }}
    >
      <ScrollableContainer
        containerRef={containerRef}
        isDragging={isDragging}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
      >
        {/* Render placeholder divs for non-visible tickets to maintain scroll height */}
        {tickets.map((_, index) => {
          const isVisible =
            index >= currentIndex - VISIBLE_BUFFER &&
            index <= currentIndex + VISIBLE_BUFFER

          if (isVisible) {
            const visibleTicket = visibleTickets.find(
              (vt) => vt.index === index,
            )
            if (visibleTicket) {
              return (
                <TicketSlide
                  key={visibleTicket.ticket.id}
                  ticket={visibleTicket.ticket}
                  index={visibleTicket.index}
                  isActive={visibleTicket.index === currentIndex}
                  isDragging={isDragging}
                />
              )
            }
          }

          // Placeholder to maintain scroll height
          return (
            <div
              key={`placeholder-${index}`}
              className="h-screen w-full snap-start snap-always"
              aria-hidden="true"
            />
          )
        })}
      </ScrollableContainer>

      <ScrollIndicator
        currentIndex={currentIndex}
        totalCount={tickets.length}
      />

      <NavigationButtons
        currentIndex={currentIndex}
        totalCount={tickets.length}
        onPrevious={scrollPrevious}
        onNext={scrollNext}
      />
    </div>
  )
}

// Export with demo data for easy use - replace with real data
// Reduced default count to improve initial load performance
export const TicketFeedWithData = React.memo(
  ({
    count = 10,
    ...props
  }: Omit<TicketFeedProps, 'tickets'> & { count?: number }) => {
    // Use useMemo to avoid regenerating tickets on every render
    const tickets = useMemo(() => generateTickets(count), [count])
    return <TicketFeed tickets={tickets} {...props} />
  },
)
