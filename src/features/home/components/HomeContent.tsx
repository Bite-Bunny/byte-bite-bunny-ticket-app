'use client'

import TelegramProvider from '@/shared/components/TelegramProvider'
import { TicketFeedWithData } from '@/shared/components/TicketFeed'

export default function HomeContent() {
  return (
    <TelegramProvider
      fallback={
        <div className="flex items-center justify-center p-4">Loading...</div>
      }
    >
      <TicketFeedWithData count={30} />
    </TelegramProvider>
  )
}
