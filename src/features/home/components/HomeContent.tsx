'use client'

import TelegramProvider from '@/shared/components/TelegramProvider'
import UserData from '@/shared/components/UserData'

export default function HomeContent() {
  return (
    <TelegramProvider
      fallback={
        <div className="flex items-center justify-center p-4">Loading...</div>
      }
    >
      <UserData />
    </TelegramProvider>
  )
}
