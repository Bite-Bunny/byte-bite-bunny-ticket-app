'use client'

import { useRawInitData } from '@telegram-apps/sdk-react'
import { useTranslations } from 'next-intl'
import { Button } from '../components/ui/Button'
import { useUser } from '../hooks/api/useUser'

export default function UserData() {
  const t = useTranslations('user')
  const tCommon = useTranslations('common')
  const { data: me, isLoading, error } = useUser()
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
        <div>
          {t('username')}: {me?.username || 'N/A'}
          {t('firstName')}: {me?.firstName || 'N/A'}
          {t('lastName')}: {me?.lastName || 'N/A'}
        </div>
      </div>

      <div>
        <pre>{JSON.stringify(rawData, null, 2)}</pre>

        {me && <pre>{JSON.stringify(me, null, 2)}</pre>}

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
