'use client'

import { useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/shared/components/ui/Button'

export function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset?: () => void
}) {
  const t = useTranslations('error')

  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div>
      <h2>{t('title')}</h2>
      <blockquote>
        <code>{error.message}</code>
      </blockquote>
      {reset && (
        <Button className="px-4 py-2 rounded-lg mt-4" onClick={() => reset()}>
          {t('tryAgain')}
        </Button>
      )}
    </div>
  )
}
