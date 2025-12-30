'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Ticket } from '@/shared/components/Ticket'
import { useHoverSupport } from '@/shared/hooks/useHoverSupport'
import type { GroupedInventoryItem, InventoryItemType } from '../types'
import {
  typeToVariant,
  itemGlowColors,
  BASE_ROTATION,
} from '../config/inventory.config'
import { useRouter } from 'next/navigation'

interface InventoryItemCardProps {
  item: GroupedInventoryItem
  index: number
  isPreview?: boolean
  previewUrl?: string
}

export function InventoryItemCard({
  item,
  index,
  isPreview = false,
  previewUrl,
}: InventoryItemCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const supportsHover = useHoverSupport()
  const glowColor = itemGlowColors[item.type]
  const variant =
    typeToVariant[item.type as Exclude<InventoryItemType, 'carrot'>]
  const shouldShowHover = isHovered && supportsHover
  const showCount = useMemo(() => item.count > 1, [item.count])
  const router = useRouter()

  return (
    <motion.div
      onClick={() => {
        if (isPreview && previewUrl) {
          router.push(previewUrl)
        }
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: Math.min(index * 0.05, 0.5), // Cap animation delay
        ease: 'easeOut',
      }}
      className="relative w-full aspect-square"
      onMouseEnter={() => supportsHover && setIsHovered(true)}
      onMouseLeave={() => supportsHover && setIsHovered(false)}
    >
      <div
        className="relative w-full h-full rounded-3xl p-3 md:p-4 cursor-pointer transition-all duration-300 touch-manipulation select-none"
        style={{
          background: shouldShowHover
            ? 'rgba(255, 255, 255, 0.08)'
            : 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: shouldShowHover
            ? `0 8px 32px ${glowColor}, inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.05)`
            : '0 4px 20px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
          transform: shouldShowHover
            ? 'translateY(-2px) scale(1.02)'
            : 'translateY(0) scale(1)',
        }}
      >
        {/* Count badge - only show if count > 1 */}
        {showCount && (
          <div
            className="absolute bottom-2 right-2 z-20 flex items-center justify-center min-w-[32px] h-8 px-2.5 rounded-full text-white font-bold text-sm bg-white/10 backdrop-blur-[20px] border border-white/15"
            style={{
              boxShadow:
                '0 2px 8px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
            }}
          >
            {item.count}
          </div>
        )}

        {/* Glow effect - only on desktop hover */}
        <motion.div
          className="absolute inset-0 rounded-3xl pointer-events-none -z-10"
          animate={{
            opacity: shouldShowHover ? 0.8 : 0.3,
            scale: shouldShowHover ? 1.2 : 1,
          }}
          transition={{ duration: 0.3 }}
          style={{
            background: `radial-gradient(circle at center, ${glowColor}, transparent 70%)`,
            filter: 'blur(24px)',
          }}
        />

        {/* Ticket container */}
        <div className="relative w-full h-full flex items-center justify-center overflow-visible">
          <motion.div
            className="relative"
            initial={{ rotate: BASE_ROTATION }}
            animate={{
              scale: shouldShowHover ? 1.06 : 1,
              rotate: shouldShowHover ? BASE_ROTATION + 2 : BASE_ROTATION,
            }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            {item.type !== 'carrot' && (
              <div className="transform transition-transform duration-300 scale-75 md:scale-90 lg:scale-75 xl:scale-65">
                <Ticket
                  variant={variant}
                  price={item.price || 100}
                  quality={item.quality || 1.0}
                  showCarrot={true}
                  size="sm"
                />
              </div>
            )}
            {/* TODO: Handle carrot items separately */}
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
