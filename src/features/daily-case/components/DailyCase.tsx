'use client'

import { useState, useEffect } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import Image from 'next/image'

export function DailyCase() {
  const t = useTranslations('dailyCrate')
  const [isHovered, setIsHovered] = useState(false)
  const [isPageVisible, setIsPageVisible] = useState(true)
  const shouldReduceMotion = useReducedMotion()

  // CRITICAL FIX: Pause animations when page is not visible to save CPU
  // This prevents continuous CPU usage that triggers "crypto mining" detection
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsPageVisible(!document.hidden)
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  const handleClick = () => {
    // TODO: Implement claim logic - open modal or navigate to claim page
    console.log('Open daily case')
  }

  // Pause animations if page is hidden or user prefers reduced motion
  const shouldAnimate = isPageVisible && !shouldReduceMotion

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="fixed bottom-32 right-5 z-[999]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <motion.button
        className="relative w-16 h-16 md:w-20 md:h-20 rounded-full cursor-pointer touch-manipulation select-none"
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          border: '2px solid rgba(255, 215, 0, 0.4)',
          boxShadow:
            '0 8px 32px rgba(255, 215, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Pulsing golden glow background */}
        <motion.div
          className="absolute inset-0 rounded-full pointer-events-none -z-10"
          animate={
            shouldAnimate
              ? {
                  opacity: [0.4, 0.7, 0.4],
                  scale: [1, 1.2, 1],
                }
              : {
                  opacity: 0.5,
                  scale: 1,
                }
          }
          transition={
            shouldAnimate
              ? {
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }
              : {
                  duration: 0,
                }
          }
          style={{
            background:
              'radial-gradient(circle at center, rgba(255, 215, 0, 0.5), transparent 70%)',
            filter: 'blur(12px)',
          }}
        />

        {/* Daily case Image */}
        <div className="relative w-full h-full flex items-center justify-center">
          <motion.div
            animate={
              shouldAnimate
                ? {
                    y: [0, -4, 0],
                  }
                : {
                    y: 0,
                  }
            }
            transition={
              shouldAnimate
                ? {
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }
                : {
                    duration: 0,
                  }
            }
            className="relative w-12 h-12 md:w-14 md:h-14"
          >
            <Image
              src="/cases/daily.png"
              alt={t('crateAlt')}
              fill
              className="object-contain drop-shadow-[0_2px_8px_rgba(255,215,0,0.5)] mt-1"
              priority
            />
          </motion.div>
        </div>

        {/* Notification dot/badge */}
        <div
          className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 border-2 border-black/50"
          style={{
            boxShadow: '0 2px 8px rgba(239, 68, 68, 0.6)',
          }}
        />
      </motion.button>
    </motion.div>
  )
}
