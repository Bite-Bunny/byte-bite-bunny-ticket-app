'use client'

import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Coins } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/shared/components/ui'

export function CreditsNavigationButton() {
  const t = useTranslations('credits')
  const router = useRouter()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="fixed bottom-32 md:bottom-36 left-1/2 -translate-x-1/2 z-50 pointer-events-auto px-5"
    >
      <Button
        onClick={() => router.push('/credits')}
        className="px-6 py-4 rounded-2xl flex items-center gap-3 min-w-[200px] justify-center"
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
        <Coins className="w-5 h-5 text-white" />
      </Button>
    </motion.div>
  )
}
