'use client'

import { motion } from 'framer-motion'
import { ChevronUp, ChevronDown } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { cn } from '@/shared/lib/cn'
import { NavigationButtonsProps } from '../types'

export const NavigationButtons = ({
  currentIndex,
  totalCount,
  onPrevious,
  onNext,
  onRequestNext,
  isLoadingNext,
}: NavigationButtonsProps) => {
  const t = useTranslations('ticketFeed')
  const isAtLast = currentIndex === totalCount - 1
  const nextDisabled = (isAtLast && !onRequestNext) || isLoadingNext === true

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-2 pointer-events-auto">
      <motion.button
        onClick={onPrevious}
        disabled={currentIndex === 0}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
        className={cn(
          'relative w-8 h-8 rounded-full flex items-center justify-center',
          'bg-white/10 backdrop-blur-[20px] border border-white/15',
          'text-white/90 hover:text-white',
          'hover:bg-white/15 hover:border-white/20',
          'transition-all touch-manipulation',
          'disabled:opacity-20 disabled:cursor-not-allowed disabled:hover:bg-white/10 disabled:hover:border-white/15',
        )}
        style={{
          WebkitTapHighlightColor: 'transparent',
          boxShadow:
            '0 -8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
        }}
        aria-label={t('previousTicket')}
      >
        <ChevronUp className="w-4 h-4" />
      </motion.button>

      <motion.button
        onClick={onNext}
        disabled={nextDisabled}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        className={cn(
          'relative w-8 h-8 rounded-full flex items-center justify-center',
          'bg-white/10 backdrop-blur-[20px] border border-white/15',
          'text-white/90 hover:text-white',
          'hover:bg-white/15 hover:border-white/20',
          'transition-all touch-manipulation',
          'disabled:opacity-20 disabled:cursor-not-allowed disabled:hover:bg-white/10 disabled:hover:border-white/15',
        )}
        style={{
          WebkitTapHighlightColor: 'transparent',
          boxShadow:
            '0 -8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
        }}
        aria-label={t('nextTicket')}
      >
        <ChevronDown className="w-4 h-4" />
      </motion.button>
    </div>
  )
}
