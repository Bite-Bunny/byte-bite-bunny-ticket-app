'use client'

import TelegramProvider from '@/shared/components/TelegramProvider'
import UserData from '@/shared/components/UserData'

export default function HomeContent() {
  return (
    <TelegramProvider fallback={<div className="page-content">Loading...</div>}>
      <UserData />
    </TelegramProvider>
  )
}
