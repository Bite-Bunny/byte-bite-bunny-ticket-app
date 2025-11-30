'use client'

import { motion } from 'framer-motion'
import { ScrollIndicatorProps } from '../types'

export const ScrollIndicator = ({
  currentIndex,
  totalCount,
}: ScrollIndicatorProps) => {
  return (
    <motion.div
      className="fixed top-8 right-8 z-50 bg-black/50 backdrop-blur-md rounded-full px-4 py-2 text-white text-sm font-medium pointer-events-none"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3 }}
    >
      <span className="text-white/70">{currentIndex + 1}</span>
      <span className="mx-2 text-white/40">/</span>
      <span className="text-white/70">{totalCount}</span>
    </motion.div>
  )
}
