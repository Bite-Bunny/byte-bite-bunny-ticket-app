'use client'

import { useTranslations } from 'next-intl'
import TelegramProvider from '@/shared/components/TelegramProvider'
import UserData from '@/shared/components/UserData'

export default function TestContent() {
  const t = useTranslations('test')
  const tCommon = useTranslations('common')

  return (
    <TelegramProvider
      fallback={
        <div className="flex items-center justify-center p-4">
          {tCommon('loading')}
        </div>
      }
    >
      <div className="flex flex-col space-y-4">
        <div className="p-4 bg-yellow-100 border border-yellow-300 rounded-md">
          <h1 className="text-lg font-semibold text-yellow-800">
            {t('title')}
          </h1>
          <p className="text-yellow-700">{t('description')}</p>
        </div>
        <UserData />
      </div>
    </TelegramProvider>
  )
}
