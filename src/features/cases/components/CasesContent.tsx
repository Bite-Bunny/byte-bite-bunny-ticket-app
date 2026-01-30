'use client'

import { useState, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  Card,
  Button,
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerBody,
  DrawerFooter,
} from '@/shared/components/ui'
import { Page } from '@/shared/components/Page'
import { useCasesFeed, invalidateUserCache } from '@/shared/hooks/api'
import { mapCasesFeedToCaseItems, type CaseItem } from '../utils/map-cases-feed'
import { rarityStyles } from '../config'
import { casesService } from '@/core/api/services/cases.service'
import { getErrorMessage } from '@/core/api/types'

const CASE_OPEN_RESULT_KEY = 'caseOpenResult'

export function CasesContent() {
  const t = useTranslations('cases')
  const router = useRouter()
  const { data: feed, isLoading, isError } = useCasesFeed()
  const casesList = useMemo(
    () => (feed ? mapCasesFeedToCaseItems(feed) : []),
    [feed],
  )
  const [selectedCase, setSelectedCase] = useState<CaseItem | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isOpening, setIsOpening] = useState(false)
  const [openError, setOpenError] = useState<string | null>(null)

  if (isLoading) {
    return (
      <Page>
        <div className="flex flex-col w-full max-w-full min-h-0 py-4 items-center justify-center px-4">
          <h1 className="text-center text-2xl md:text-3xl font-bold text-white mb-6 mt-2">
            {t('title')}
          </h1>
          <p className="text-white/70">Loading cases...</p>
        </div>
      </Page>
    )
  }

  if (isError || !casesList.length) {
    return (
      <Page>
        <div className="flex flex-col w-full max-w-full min-h-0 py-4 items-center justify-center px-4">
          <h1 className="text-center text-2xl md:text-3xl font-bold text-white mb-6 mt-2">
            {t('title')}
          </h1>
          <p className="text-center text-white/80 text-sm">
            {isError ? 'Failed to load cases.' : 'No cases available.'}
          </p>
        </div>
      </Page>
    )
  }

  const handleCaseClick = (caseItem: CaseItem) => {
    setSelectedCase(caseItem)
    setIsDrawerOpen(true)
  }

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false)
  }

  const handleOpenCase = async () => {
    if (!selectedCase) return
    setOpenError(null)
    setIsOpening(true)
    try {
      const result = await casesService.openCase(Number(selectedCase.id))
      sessionStorage.setItem(CASE_OPEN_RESULT_KEY, JSON.stringify(result))
      await invalidateUserCache()
      setIsDrawerOpen(false)
      router.push('/cases/open')
    } catch (err) {
      setOpenError(getErrorMessage(err))
    } finally {
      setIsOpening(false)
    }
  }

  return (
    <Page>
      <div className="flex flex-col w-full max-w-full min-h-0 py-4">
        <motion.h1
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="text-center text-2xl md:text-3xl font-bold text-white mb-6 md:mb-8 mt-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
        >
          {t('title')}
        </motion.h1>

        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
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
                sizes="20px"
                className="object-contain"
                priority
              />
            </div>
            <span className="text-white font-semibold">{t('getCredits')}</span>
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 w-full max-w-4xl mx-auto pb-24">
          {casesList.map((caseItem, index) => (
            <motion.div
              key={caseItem.id}
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.2,
                delay: index < 3 ? index * 0.05 : 0,
                ease: 'easeOut',
              }}
            >
              <Card
                variant="elevated"
                className="p-4 md:p-5 cursor-pointer transition-all duration-200"
                onClick={() => handleCaseClick(caseItem)}
              >
                <div className="flex flex-col gap-4">
                  <div className="flex justify-center items-center h-52 md:h-60">
                    <Image
                      src={caseItem.image}
                      alt={caseItem.name}
                      width={208}
                      height={208}
                      className="object-contain w-52 h-52 md:w-60 md:h-60"
                      loading={index < 3 ? 'eager' : 'lazy'}
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
                        sizes="24px"
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

      {/* Case Details Drawer */}
      <Drawer isOpen={isDrawerOpen} onClose={handleCloseDrawer}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{selectedCase?.name}</DrawerTitle>
            <DrawerDescription>{selectedCase?.description}</DrawerDescription>
          </DrawerHeader>

          <DrawerBody>
            <div className="flex justify-center mb-6 max-h-667:mb-4 max-h-568:mb-3">
              {selectedCase && (
                <Image
                  src={selectedCase.image}
                  alt={selectedCase.name}
                  width={180}
                  height={180}
                  className="object-contain max-h-667:w-[160px] max-h-667:h-[160px] max-h-568:w-[140px] max-h-568:h-[140px]"
                />
              )}
            </div>

            <div className="space-y-3 pb-6 max-h-667:space-y-2 max-h-667:pb-4 max-h-568:space-y-2 max-h-568:pb-3">
              <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wide mb-3">
                Possible Rewards
              </h3>
              {selectedCase?.rewards.map((reward) => {
                const style = rarityStyles[reward.rarity]
                return (
                  <div
                    key={reward.id}
                    className={`flex items-center gap-3 p-3 rounded-xl max-h-568:gap-2 max-h-568:p-2 ${style.bg} border ${style.border}`}
                  >
                    <div className="relative w-12 h-12 max-h-568:w-10 max-h-568:h-10 rounded-lg overflow-hidden bg-white/10 flex-shrink-0">
                      <Image
                        src={reward.image}
                        alt={reward.name}
                        fill
                        className="object-contain p-1"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate">
                        {reward.name}
                      </p>
                      <p className={`text-xs ${style.text}`}>{style.label}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-white/90 font-semibold">
                        {reward.chance}%
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </DrawerBody>

          {openError && (
            <p className="text-red-400 text-sm px-4 pb-2">{openError}</p>
          )}
          <DrawerFooter>
            <Button
              onClick={handleCloseDrawer}
              className="flex-1 py-3 max-h-568:py-2 rounded-xl text-white/70"
              disabled={isOpening}
            >
              Cancel
            </Button>
            <Button
              onClick={handleOpenCase}
              className="flex-1 py-3 max-h-568:py-2 rounded-xl bg-brand/80 hover:bg-brand border-brand/50"
              disabled={isOpening}
            >
              <div className="flex items-center gap-2">
                <div className="relative w-5 h-5">
                  <Image
                    src="/credit-icon.png"
                    alt="Credits"
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="font-semibold text-white">
                  {isOpening
                    ? 'Opening...'
                    : selectedCase?.credits.toLocaleString()}
                </span>
              </div>
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Page>
  )
}
