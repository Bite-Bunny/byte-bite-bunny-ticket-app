'use client'

import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Card } from '@/shared/components/ui'
import { Button } from '@/shared/components/ui/Button'
import { Page } from '@/shared/components/Page'

interface CaseItem {
  id: string
  name: string
  credits: number
  image: string
}

const mockCases: CaseItem[] = [
  { id: '1', name: 'Wood Case', credits: 100, image: '/cases/wood-case.png' },
  { id: '2', name: 'Wood Case', credits: 200, image: '/cases/wood-case.png' },
  { id: '3', name: 'Wood Case', credits: 300, image: '/cases/wood-case.png' },
  { id: '4', name: 'Wood Case', credits: 500, image: '/cases/wood-case.png' },
  { id: '5', name: 'Wood Case', credits: 1000, image: '/cases/wood-case.png' },
]

export function CasesContent() {
  const t = useTranslations('cases')
  const router = useRouter()

  const handleOpenCase = (caseItem: CaseItem) => {
    // TODO: Implement case opening logic
    console.log('Opening case:', caseItem)
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex justify-center mb-6"
        >
          <Button
            onClick={() => router.push('/credits')}
            className="px-6 py-3 rounded-xl flex items-center gap-2"
          >
            <div className="relative w-5 h-5">
              <Image
                src="/credit-icon.png"
                alt={t('creditIconAlt')}
                fill
                className="object-contain"
              />
            </div>
            <span className="text-white font-semibold">{t('getCredits')}</span>
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 w-full max-w-4xl mx-auto pb-24">
          {mockCases.map((caseItem, index) => (
            <motion.div
              key={caseItem.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 + index * 0.1 }}
            >
              <Card
                variant="elevated"
                className="p-4 md:p-5 cursor-pointer hover:scale-[1.02] transition-all duration-200 active:scale-[0.98]"
                onClick={() => handleOpenCase(caseItem)}
              >
                <div className="flex flex-col gap-4">
                  <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-white/5 border border-white/10">
                    <Image
                      src={caseItem.image}
                      alt={caseItem.name}
                      fill
                      className="object-contain p-4"
                    />
                  </div>

                  <h3 className="text-lg font-semibold text-white text-center">
                    {caseItem.name}
                  </h3>

                  <div className="flex items-center justify-center gap-2 bg-white/5 backdrop-blur-[10px] rounded-xl p-3 border border-white/10">
                    <div className="relative w-6 h-6 flex-shrink-0">
                      <Image
                        src="/credit-icon.png"
                        alt={t('creditIconAlt')}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <span className="text-xl font-bold text-white">
                      {caseItem.credits.toLocaleString()}
                    </span>
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
