'use client'

import { useRef } from 'react'
import { cn } from '@/shared/lib/cn'
import { TicketFeedProps } from './types'
import { useTicketScroll } from './hooks/useTicketScroll'
import { ScrollableContainer } from './components/ScrollableContainer'
import { TicketSlide } from './components/TicketSlide'
import { ScrollIndicator } from './components/ScrollIndicator'
import { NavigationButtons } from './components/NavigationButtons'
import { generateTickets } from './utils/generateTickets'

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

  return (
    <div
      className={cn(
        'fixed inset-0 w-screen h-screen overflow-hidden',
        'bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900',
        className,
      )}
      style={{
        touchAction: 'none',
      }}
    >
      <ScrollableContainer
        containerRef={containerRef}
        isDragging={isDragging}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
      >
        {tickets.map((ticket, index) => (
          <TicketSlide
            key={ticket.id}
            ticket={ticket}
            index={index}
            isActive={index === currentIndex}
            isDragging={isDragging}
          />
        ))}
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
export const TicketFeedWithData = ({
  count = 20,
  ...props
}: Omit<TicketFeedProps, 'tickets'> & { count?: number }) => {
  const tickets = generateTickets(count)
  return <TicketFeed tickets={tickets} {...props} />
}
