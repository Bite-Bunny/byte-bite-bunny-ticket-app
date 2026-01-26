'use client'

import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { generateMockItems, groupItemsByType } from '../utils/inventory.utils'
import { InventoryItemCard } from './InventoryItemCard'

// Mock data - 24 items total, then grouped by type
const mockInventoryItems = generateMockItems(24)
const groupedInventoryItems = groupItemsByType(mockInventoryItems)

export default function InventoryContent() {
  const t = useTranslations('inventory')

  return (
    <div className="flex flex-col w-full max-w-full min-h-0">
      <div className="flex justify-center items-center px-5 py-[10px] flex-shrink-0 max-sm:px-5 max-sm:py-[30px] max-sm:pb-[20px] max-h-667:px-5 max-h-667:py-8 max-h-667:pb-4">
        <Image
          src="/logo.svg"
          alt="Bite Bunny Logo"
          width={99}
          height={20}
          sizes="99px"
          className="brightness-0 invert opacity-90"
          priority
        />
      </div>

      {/* Title */}
      <motion.h1
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="text-center text-2xl md:text-3xl font-bold text-white mb-4 md:mb-6 mt-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] flex-shrink-0"
      >
        {t('title')}
      </motion.h1>

      {/* Grid - responsive: 2 columns on mobile, 3 on tablet, 4+ on desktop */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4 lg:gap-5 w-full pb-24 md:pb-28 max-w-7xl mx-auto">
        {groupedInventoryItems.map((item, index) => (
          <InventoryItemCard
            key={item.type}
            item={item}
            index={index}
            isPreview={true}
            previewUrl="/inventory/preview"
          />
        ))}
      </div>
    </div>
  )
}
