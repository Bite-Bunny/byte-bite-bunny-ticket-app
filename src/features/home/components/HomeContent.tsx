'use client'

import { useTranslations } from 'next-intl'
import TelegramProvider from '@/shared/components/TelegramProvider'
import { TicketFeedWithData } from '@/features/ticket-feed'

export default function HomeContent() {
  const t = useTranslations('common')

  return (
    <TelegramProvider
      fallback={
        <div className="flex items-center justify-center p-4">
          {t('loading')}
        </div>
      }
    >
      <TicketFeedWithData count={30} />
    </TelegramProvider>
  )
}
