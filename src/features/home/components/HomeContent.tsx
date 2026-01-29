'use client'

import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import dynamic from 'next/dynamic'
import { showDailyCase } from '@/features/daily-case'
import { Button } from '@/shared/components/ui/Button'

// Lazy load components to reduce initial JavaScript execution time
const TicketFeedLive = dynamic(
  () =>
    import('@/features/ticket-feed').then((mod) => ({
      default: mod.TicketFeedLive,
    })),
  {
    ssr: false,
    loading: () => null,
  },
)

const DailyCase = dynamic(
  () =>
    import('@/features/daily-case').then((mod) => ({ default: mod.DailyCase })),
  {
    ssr: false,
    loading: () => null,
  },
)

const CreditsNavigationButton = dynamic(
  () =>
    import('./CreditsNavigationButton').then((mod) => ({
      default: mod.CreditsNavigationButton,
    })),
  {
    ssr: false,
    loading: () => null,
  },
)

// Mock daily case data - replace with real API call when ready
function getDailyCase() {
  return {
    isClaimed: false,
    daysLeft: 2,
  }
}

export default function HomeContent() {
  const [showTickets, setShowTickets] = useState(false)
  const dailyCase = getDailyCase()
  const shouldReduceMotion = useReducedMotion()

  if (showTickets) {
    return (
      <>
        <TicketFeedLive />
        {showDailyCase(dailyCase) && <DailyCase />}
        <CreditsNavigationButton />
      </>
    )
  }

  const breatheScale = shouldReduceMotion ? 1 : [1, 1.04, 1]
  const breatheTransition = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 2.2, repeat: Infinity, ease: 'easeInOut' as const }
  const glowOpacity = shouldReduceMotion ? 0.25 : [0.2, 0.45, 0.2]
  const glowTransition = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 2.2, repeat: Infinity, ease: 'easeInOut' as const }

  return (
    <div className="fixed inset-0 w-screen h-screen flex items-center justify-center">
      <motion.div
        className="relative flex items-center justify-center"
        initial={false}
        animate={{ scale: breatheScale }}
        transition={breatheTransition}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.96 }}
      >
        {/* Pulsing glow behind button */}
        <motion.span
          className="absolute rounded-full bg-white/40 blur-3xl -z-10 pointer-events-none"
          style={{
            width: '160%',
            height: '160%',
            left: '-30%',
            top: '-30%',
          }}
          animate={{ opacity: glowOpacity }}
          transition={glowTransition}
          aria-hidden
        />
        <Button
          onClick={() => setShowTickets(true)}
          className="w-36 h-36 md:w-44 md:h-44 rounded-full text-2xl md:text-3xl font-bold relative z-0"
        >
          Start
        </Button>
      </motion.div>
    </div>
  )
}
