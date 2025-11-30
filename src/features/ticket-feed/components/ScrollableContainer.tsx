'use client'

import { motion, PanInfo } from 'framer-motion'
import { cn } from '@/shared/lib/cn'
import { ScrollableContainerProps } from '../types'

export const ScrollableContainer = ({
  children,
  isDragging,
  onDragStart,
  onDrag,
  onDragEnd,
  containerRef,
}: ScrollableContainerProps) => {
  const handleDrag = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    onDrag(_, info)
  }

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    onDragEnd(_, info)
  }

  return (
    <motion.div
      ref={containerRef}
      className={cn(
        'w-full h-full overflow-y-scroll snap-y snap-mandatory scrollbar-none',
        'cursor-grab active:cursor-grabbing',
      )}
      style={{
        scrollBehavior: isDragging ? 'auto' : 'smooth',
        touchAction: 'pan-y',
      }}
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={0}
      dragMomentum={false}
      dragPropagation={false}
      onDragStart={onDragStart}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      whileDrag={{ cursor: 'grabbing' }}
    >
      {children}
    </motion.div>
  )
}
