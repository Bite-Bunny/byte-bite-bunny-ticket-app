/* eslint-disable react/display-name */
'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Ticket } from '@/shared/components/Ticket'
import { TicketSlideProps } from '../types'

export const TicketSlide = React.memo(
  ({ ticket, isActive, isDragging = false }: TicketSlideProps) => {
    return (
      <motion.div
        className="h-screen w-full flex items-center justify-center snap-start snap-always relative"
        initial={false}
        animate={{
          opacity: isActive ? 1 : 0.5,
          scale: isActive ? 1 : 0.8,
        }}
        transition={{
          type: 'tween',
          duration: 0.3,
          ease: 'easeOut',
        }}
        style={{
          pointerEvents: isDragging ? 'none' : 'auto',
          willChange: 'transform, opacity',
        }}
      >
        {/* Ticket with smooth entrance animation */}
        <motion.div
          initial={false}
          animate={{
            y: isActive ? 0 : 30,
            opacity: isActive ? 1 : 0.4,
            rotateY: isActive ? 0 : 5,
            scale: isActive ? 1 : 0.9,
          }}
          transition={{
            type: 'tween',
            duration: 0.3,
            ease: 'easeOut',
          }}
          style={{
            willChange: 'transform, opacity',
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
      </motion.div>
    )
  },
)
