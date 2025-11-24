'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, PanInfo } from 'framer-motion'
import { ChevronUp, ChevronDown } from 'lucide-react'
import { Ticket, type TicketVariant } from './Ticket'
import { cn } from '@/shared/lib/cn'

export interface TicketData {
  id: string
  variant: TicketVariant
  price: number
  quality: number
  showCarrot?: boolean
}

interface TicketFeedProps {
  tickets: TicketData[]
  className?: string
}

// Data generator for demo purposes - replace with real data
const generateTickets = (count: number): TicketData[] => {
  const variants: TicketVariant[] = ['bronze', 'silver', 'gold', 'diamond']
  return Array.from({ length: count }, (_, i) => ({
    id: `ticket-${i}`,
    variant: variants[i % variants.length],
    price: Math.floor(Math.random() * 1000) + 100,
    quality: Number((Math.random() * 5 + 1).toFixed(4)),
    showCarrot: true,
  }))
}

export const TicketFeed = ({ tickets, className }: TicketFeedProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const dragStartScroll = useRef(0)

  // Handle scroll to snap to nearest ticket
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleScroll = () => {
      if (isDragging) return // Don't update during drag
      const scrollTop = container.scrollTop
      const itemHeight = container.clientHeight
      const newIndex = Math.round(scrollTop / itemHeight)
      setCurrentIndex(newIndex)
    }

    container.addEventListener('scroll', handleScroll)
    return () => container.removeEventListener('scroll', handleScroll)
  }, [isDragging])

  // Smooth scroll to specific index
  const scrollToIndex = (index: number) => {
    const container = containerRef.current
    if (!container) return

    const itemHeight = container.clientHeight
    const targetScroll = index * itemHeight

    container.scrollTo({
      top: targetScroll,
      behavior: 'smooth',
    })
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

  // Handle wheel events for smooth scrolling
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let isScrolling = false

    const handleWheel = (e: WheelEvent) => {
      if (isDragging) return // Don't handle wheel during drag
      e.preventDefault()

      if (isScrolling) return
      isScrolling = true

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
        isScrolling = false
      }, 500)
    }

    container.addEventListener('wheel', handleWheel, { passive: false })
    return () => container.removeEventListener('wheel', handleWheel)
  }, [tickets.length, isDragging])

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
    const threshold = itemHeight * 0.25 // 25% of screen height

    if (Math.abs(velocity) > 400) {
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
      <motion.div
        ref={containerRef}
        className={cn(
          'w-full h-full overflow-y-scroll snap-y snap-mandatory scrollbar-none',
          'cursor-grab active:cursor-grabbing',
        )}
        style={{
          scrollBehavior: isDragging ? 'auto' : 'smooth',
          touchAction: 'pan-y',
        }}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0}
        dragMomentum={false}
        dragPropagation={false}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        whileDrag={{ cursor: 'grabbing' }}
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
      </motion.div>

      {/* Scroll indicator - shows current ticket number */}
      <motion.div
        className="fixed top-8 right-8 z-50 bg-black/50 backdrop-blur-md rounded-full px-4 py-2 text-white text-sm font-medium pointer-events-none"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
      >
        <span className="text-white/70">{currentIndex + 1}</span>
        <span className="mx-2 text-white/40">/</span>
        <span className="text-white/70">{tickets.length}</span>
      </motion.div>

      {/* Navigation buttons */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-2 pointer-events-auto">
        <motion.button
          onClick={scrollPrevious}
          disabled={currentIndex === 0}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className={cn(
            'w-8 h-8 rounded-full flex items-center justify-center',
            'bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20',
            'text-white/60 hover:text-white/80 transition-all',
            'disabled:opacity-20 disabled:cursor-not-allowed disabled:hover:bg-white/5',
          )}
          aria-label="Previous ticket"
        >
          <ChevronUp className="w-4 h-4" />
        </motion.button>

        <motion.button
          onClick={scrollNext}
          disabled={currentIndex === tickets.length - 1}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className={cn(
            'w-8 h-8 rounded-full flex items-center justify-center',
            'bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20',
            'text-white/60 hover:text-white/80 transition-all',
            'disabled:opacity-20 disabled:cursor-not-allowed disabled:hover:bg-white/5',
          )}
          aria-label="Next ticket"
        >
          <ChevronDown className="w-4 h-4" />
        </motion.button>
      </div>
    </div>
  )
}

interface TicketSlideProps {
  ticket: TicketData
  index: number
  isActive: boolean
  isDragging?: boolean
}

const TicketSlide = ({
  ticket,
  index,
  isActive,
  isDragging = false,
}: TicketSlideProps) => {
  return (
    <motion.div
      className="h-screen w-full flex items-center justify-center snap-start snap-always relative"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{
        opacity: isActive ? 1 : 0.5,
        scale: isActive ? 1 : 0.8,
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30,
      }}
      style={{
        pointerEvents: isDragging ? 'none' : 'auto',
      }}
    >
      {/* Background glow effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          opacity: isActive ? 0.4 : 0.1,
          scale: isActive ? 1 : 0.95,
        }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <div
          className={cn(
            'absolute inset-0 blur-3xl transition-colors duration-500',
            ticket.variant === 'bronze' && 'bg-amber-500/30',
            ticket.variant === 'silver' && 'bg-gray-400/30',
            ticket.variant === 'gold' && 'bg-yellow-400/30',
            ticket.variant === 'diamond' && 'bg-cyan-400/30',
          )}
        />
      </motion.div>

      {/* Ticket with smooth entrance animation */}
      <motion.div
        initial={{ y: 50, opacity: 0, rotateY: 10 }}
        animate={{
          y: isActive ? 0 : 30,
          opacity: isActive ? 1 : 0.4,
          rotateY: isActive ? 0 : 5,
          scale: isActive ? 1 : 0.9,
        }}
        transition={{
          type: 'spring',
          stiffness: 200,
          damping: 25,
        }}
      >
        <Ticket
          variant={ticket.variant}
          price={ticket.price}
          quality={ticket.quality}
          showCarrot={ticket.showCarrot}
          size="lg"
          className="relative z-10 shadow-2xl"
        />
      </motion.div>

      {/* Floating particles effect for active ticket */}
      {isActive && (
        <motion.div
          className="absolute inset-0 pointer-events-none z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={i}
              className={cn(
                'absolute w-2 h-2 rounded-full',
                ticket.variant === 'bronze' && 'bg-amber-400/40',
                ticket.variant === 'silver' && 'bg-gray-300/40',
                ticket.variant === 'gold' && 'bg-yellow-300/40',
                ticket.variant === 'diamond' && 'bg-cyan-300/40',
              )}
              style={{
                left: `${20 + i * 10}%`,
                top: `${15 + (i % 3) * 25}%`,
              }}
              animate={{
                y: [0, -30, 0],
                x: [0, Math.sin(i) * 20, 0],
                opacity: [0.4, 0.8, 0.4],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 3 + i * 0.3,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.2,
              }}
            />
          ))}
        </motion.div>
      )}
    </motion.div>
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
