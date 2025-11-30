'use client'

import { motion } from 'framer-motion'
import { Ticket } from '@/shared/components/Ticket'
import { cn } from '@/shared/lib/cn'
import { TicketSlideProps } from '../types'

export const TicketSlide = ({
  ticket,
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
