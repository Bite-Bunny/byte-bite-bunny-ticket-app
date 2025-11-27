'use client'

import { useRawInitData } from '@telegram-apps/sdk-react'
import { useTranslations } from 'next-intl'
import { Button } from '../components/ui/Button'
import useMe from '../hooks/useMe'

export default function UserData() {
  const t = useTranslations('user')
  const tCommon = useTranslations('common')
  const { data: me, isLoading, error } = useMe()
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
          {t('coins')}: {me.coins}
        </div>
      </div>

      <div>
        <pre>{JSON.stringify(rawData, null, 2)}</pre>

        <pre>{JSON.stringify(me, null, 2)}</pre>

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
