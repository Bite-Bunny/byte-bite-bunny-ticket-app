'use client'

import TelegramProvider from '@/components/TelegramProvider'
import UserData from '@/components/UserData'

export default function HomeContent() {
  return (
    <TelegramProvider fallback={<div className="page-content">Loading...</div>}>
      <UserData />
    </TelegramProvider>
  )
}
