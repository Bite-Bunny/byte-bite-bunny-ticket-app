'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { showDailyCase } from '@/features/case'

// Lazy load components to reduce initial JavaScript execution time
const TicketFeedWithData = dynamic(
  () =>
    import('@/features/ticket-feed').then((mod) => ({
      default: mod.TicketFeedWithData,
    })),
  {
    ssr: false,
    loading: () => null,
  },
)

const DailyCase = dynamic(
  () => import('@/features/case').then((mod) => ({ default: mod.DailyCase })),
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

  if (showTickets) {
    return (
      <>
        <TicketFeedWithData count={10} />
        {showDailyCase(dailyCase) && <DailyCase />}
        <CreditsNavigationButton />
      </>
    )
  }

  return (
    <div className="fixed inset-0 w-screen h-screen flex items-center justify-center">
      <button
        onClick={() => setShowTickets(true)}
        className="px-16 py-8 text-3xl font-bold rounded-2xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 active:from-amber-800 active:to-amber-900 text-white shadow-2xl transition-all duration-200 hover:scale-105 active:scale-95 border-2 border-amber-500/50 hover:border-amber-400/70"
        style={{
          WebkitTapHighlightColor: 'transparent',
        }}
      >
        Start
      </button>
    </div>
  )
}
