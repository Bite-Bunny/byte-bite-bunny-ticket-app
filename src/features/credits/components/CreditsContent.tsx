'use client'

import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Star } from 'lucide-react'
import { Card } from '@/shared/components/ui'
import { Page } from '@/shared/components/Page'

interface CreditPackage {
  credits: number
  stars: number
}

const creditPackages: CreditPackage[] = [
  { credits: 600, stars: 250 },
  { credits: 1200, stars: 500 },
  { credits: 2400, stars: 1000 },
  { credits: 5000, stars: 2000 },
]

export function CreditsContent() {
  const t = useTranslations('credits')

  const handlePurchase = (packageData: CreditPackage) => {
    // TODO: Implement Telegram Stars purchase
    console.log('Purchase:', packageData)
  }

  return (
    <Page>
      <div className="flex flex-col w-full max-w-full min-h-0 py-4">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center text-2xl md:text-3xl font-bold text-white mb-6 md:mb-8 mt-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
        >
          {t('title')}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-center text-white/80 text-sm md:text-base mb-6 px-4"
        >
          {t('description')}
        </motion.p>

        <div className="flex flex-col gap-4 md:gap-5 w-full max-w-md mx-auto pb-24">
          {creditPackages.map((pkg, index) => (
            <motion.div
              key={`${pkg.credits}-${pkg.stars}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
            >
              <Card
                variant="elevated"
                className="p-5 md:p-6 cursor-pointer hover:scale-[1.02] transition-all duration-200 active:scale-[0.98]"
                onClick={() => handlePurchase(pkg)}
              >
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-center gap-3 bg-white/5 backdrop-blur-[10px] rounded-2xl p-4 md:p-5 border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
                    <span className="text-3xl md:text-4xl font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
                      {pkg.credits.toLocaleString()}
                    </span>
                    <div className="relative w-10 h-10 md:w-12 md:h-12 flex-shrink-0">
                      <Image
                        src="/credit-icon.png"
                        alt={t('creditIconAlt')}
                        fill
                        className="object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-3 bg-gradient-to-r from-yellow-500/25 via-yellow-500/20 to-yellow-600/25 backdrop-blur-[10px] rounded-2xl p-4 md:p-5 border border-yellow-400/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_2px_8px_rgba(255,215,0,0.2)] -mt-2 ml-2 mr-2">
                    <span className="text-2xl md:text-3xl font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
                      {pkg.stars.toLocaleString()}
                    </span>
                    <Star
                      className="w-7 h-7 md:w-8 md:h-8 text-yellow-400 fill-yellow-400 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
                      strokeWidth={2.5}
                    />
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </Page>
  )
}
