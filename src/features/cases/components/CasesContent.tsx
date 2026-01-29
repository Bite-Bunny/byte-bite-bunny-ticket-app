'use client'

import { useState } from 'react'
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

interface CaseReward {
  id: string
  name: string
  image: string
  chance: number
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
}

interface CaseItem {
  id: string
  name: string
  credits: number
  image: string
  description: string
  rewards: CaseReward[]
}

const rarityStyles = {
  common: {
    bg: 'bg-gray-500/20',
    border: 'border-gray-400/30',
    text: 'text-gray-300',
    label: 'Common',
  },
  uncommon: {
    bg: 'bg-green-500/20',
    border: 'border-green-400/30',
    text: 'text-green-300',
    label: 'Uncommon',
  },
  rare: {
    bg: 'bg-blue-500/20',
    border: 'border-blue-400/30',
    text: 'text-blue-300',
    label: 'Rare',
  },
  epic: {
    bg: 'bg-purple-500/20',
    border: 'border-purple-400/30',
    text: 'text-purple-300',
    label: 'Epic',
  },
  legendary: {
    bg: 'bg-yellow-500/20',
    border: 'border-yellow-400/30',
    text: 'text-yellow-300',
    label: 'Legendary',
  },
}

const mockCases: CaseItem[] = [
  {
    id: '1',
    name: 'Silver Case',
    credits: 100,
    image: '/cases/silver-case.png',
    description: 'A basic case with common rewards. Great for beginners!',
    rewards: [
      {
        id: 's1',
        name: 'Copper Ticket',
        image: '/inventory-items/copper-ticket.png',
        chance: 45,
        rarity: 'common',
      },
      {
        id: 's2',
        name: 'Silver Ticket',
        image: '/inventory-items/silver-ticket.png',
        chance: 30,
        rarity: 'uncommon',
      },
      {
        id: 's3',
        name: 'Carrot',
        image: '/inventory-items/carrot.png',
        chance: 20,
        rarity: 'rare',
      },
      {
        id: 's4',
        name: 'Gold Ticket',
        image: '/inventory-items/gold-ticket.png',
        chance: 5,
        rarity: 'epic',
      },
    ],
  },
  {
    id: '2',
    name: 'Gold Case',
    credits: 200,
    image: '/cases/gold-case.png',
    description: 'Premium case with better odds for rare items.',
    rewards: [
      {
        id: 'g1',
        name: 'Silver Ticket',
        image: '/inventory-items/silver-ticket.png',
        chance: 35,
        rarity: 'common',
      },
      {
        id: 'g2',
        name: 'Gold Ticket',
        image: '/inventory-items/gold-ticket.png',
        chance: 30,
        rarity: 'uncommon',
      },
      {
        id: 'g3',
        name: 'Carrot',
        image: '/inventory-items/carrot.png',
        chance: 25,
        rarity: 'rare',
      },
      {
        id: 'g4',
        name: 'Diamond Ticket',
        image: '/inventory-items/diamond-ticket.png',
        chance: 10,
        rarity: 'legendary',
      },
    ],
  },
  {
    id: '3',
    name: 'Diamond Case',
    credits: 300,
    image: '/cases/diamond-case.png',
    description: 'The ultimate case with the best chances for legendary items!',
    rewards: [
      {
        id: 'd1',
        name: 'Gold Ticket',
        image: '/inventory-items/gold-ticket.png',
        chance: 30,
        rarity: 'common',
      },
      {
        id: 'd2',
        name: 'Carrot',
        image: '/inventory-items/carrot.png',
        chance: 30,
        rarity: 'uncommon',
      },
      {
        id: 'd3',
        name: 'Diamond Ticket',
        image: '/inventory-items/diamond-ticket.png',
        chance: 25,
        rarity: 'rare',
      },
      {
        id: 'd4',
        name: 'Diamond Ticket x3',
        image: '/inventory-items/diamond-ticket.png',
        chance: 15,
        rarity: 'legendary',
      },
    ],
  },
]

export function CasesContent() {
  const t = useTranslations('cases')
  const router = useRouter()
  const [selectedCase, setSelectedCase] = useState<CaseItem | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const handleCaseClick = (caseItem: CaseItem) => {
    setSelectedCase(caseItem)
    setIsDrawerOpen(true)
  }

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false)
  }

  const handleOpenCase = () => {
    if (selectedCase) {
      // TODO: Implement case opening logic
      console.log('Opening case:', selectedCase)
      setIsDrawerOpen(false)
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
          {mockCases.map((caseItem, index) => (
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
            {/* Case Image */}
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

            {/* Possible Rewards */}
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

          <DrawerFooter>
            <Button
              onClick={handleCloseDrawer}
              className="flex-1 py-3 max-h-568:py-2 rounded-xl text-white/70"
            >
              Cancel
            </Button>
            <Button
              onClick={handleOpenCase}
              className="flex-1 py-3 max-h-568:py-2 rounded-xl bg-brand/80 hover:bg-brand border-brand/50"
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
                  {selectedCase?.credits.toLocaleString()}
                </span>
              </div>
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Page>
  )
}
