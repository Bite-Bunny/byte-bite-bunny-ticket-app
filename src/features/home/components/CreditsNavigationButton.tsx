'use client'

import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/shared/components/ui'

export function CreditsNavigationButton() {
  const t = useTranslations('credits')
  const router = useRouter()

  return (
    <div className="fixed top-28 md:top-32 right-5 z-50 pointer-events-auto">
      <Button
        onClick={() => router.push('/credits')}
        className="px-4 py-3 rounded-xl flex items-center gap-2 text-sm"
      >
        <div className="relative w-6 h-6">
          <Image
            src="/credit-icon.png"
            alt={t('creditIconAlt')}
            fill
            className="object-contain"
          />
        </div>
        <span className="text-white font-semibold text-base">
          {t('purchaseCredits')}
        </span>
      </Button>
    </div>
  )
}
