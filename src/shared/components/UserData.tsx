'use client'

import { useRawInitData } from '@telegram-apps/sdk-react'
import { useTranslations } from 'next-intl'
import { Button } from '../components/ui/Button'
import { useUser } from '../hooks/api/useUser'

export default function UserData() {
  const t = useTranslations('user')
  const tCommon = useTranslations('common')
  const { data: user, isLoading, error } = useUser()
  const rawData = useRawInitData()

  if (isLoading) {
    return <div>{t('loadingData')}</div>
  }

  if (error) {
    return <div>{tCommon('error')}: </div>
  }

  return (
    <div className="flex flex-col p-4 space-y-4">
      <div>{t('welcome')}</div>
      <div>
        <div className="space-y-1">
          <div>ID: {user?.id ?? 'N/A'}</div>
          <div>Coins: {user?.coins ?? 0}</div>
          <div>Credits: {user?.credits ?? 0}</div>
          <div>
            Registered:{' '}
            {user?.registration
              ? new Date(user.registration).toLocaleDateString()
              : 'N/A'}
          </div>
        </div>
      </div>

      <div>
        <pre className="text-xs overflow-auto">
          {JSON.stringify(rawData, null, 2)}
        </pre>

        {user && (
          <pre className="text-xs overflow-auto">
            {JSON.stringify(user, null, 2)}
          </pre>
        )}

        <Button
          className="px-4 py-2 rounded-lg text-sm"
          onClick={() => {
            navigator.clipboard.writeText(rawData || '')
          }}
        >
          {t('copyRawData')}
        </Button>
      </div>
    </div>
  )
}
