'use client'

import { cn } from '@/shared/lib/cn'
import { motion, AnimatePresence } from 'framer-motion'
import {
  createContext,
  useContext,
  type ComponentProps,
  type ReactNode,
} from 'react'
import { X } from 'lucide-react'

interface DrawerContextValue {
  isOpen: boolean
  onClose: () => void
}

const DrawerContext = createContext<DrawerContextValue | null>(null)

const useDrawerContext = () => {
  const context = useContext(DrawerContext)
  if (!context) {
    throw new Error('Drawer components must be used within a Drawer')
  }
  return context
}

export interface DrawerProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
}

export const Drawer = ({ isOpen, onClose, children }: DrawerProps) => {
  return (
    <DrawerContext.Provider value={{ isOpen, onClose }}>
      <AnimatePresence>{isOpen && children}</AnimatePresence>
    </DrawerContext.Provider>
  )
}

export const DrawerOverlay = ({ className }: { className?: string }) => {
  const { onClose } = useDrawerContext()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'fixed inset-0 bg-black/60 backdrop-blur-sm z-50',
        className,
      )}
      onClick={onClose}
    />
  )
}

export interface DrawerContentProps {
  className?: string
  children: ReactNode
}

export const DrawerContent = ({ className, children }: DrawerContentProps) => {
  const { onClose } = useDrawerContext()

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: { offset: { y: number }; velocity: { y: number } },
  ) => {
    // Close if dragged down more than 100px or with high velocity
    if (info.offset.y > 100 || info.velocity.y > 500) {
      onClose()
    }
  }

  return (
    <>
      <DrawerOverlay />
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.5 }}
        onDragEnd={handleDragEnd}
        className={cn(
          'fixed bottom-0 left-0 right-0 z-50',
          'max-h-[85vh] overflow-hidden',
          'bg-white/10 backdrop-blur-[20px] border border-white/15 border-b-0',
          'rounded-t-3xl',
          className,
        )}
        style={{
          boxShadow:
            '0 -8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle indicator */}
        <div className="flex justify-center pt-4 pb-2 cursor-grab active:cursor-grabbing touch-none">
          <div className="w-12 h-1.5 rounded-full bg-white/30" />
        </div>
        {children}
      </motion.div>
    </>
  )
}

export interface DrawerHeaderProps {
  className?: string
  children: ReactNode
  showCloseButton?: boolean
}

export const DrawerHeader = ({
  className,
  children,
  showCloseButton = true,
}: DrawerHeaderProps) => {
  const { onClose } = useDrawerContext()

  return (
    <div
      className={cn(
        'flex items-center justify-between px-6 py-4 border-b border-white/10',
        className,
      )}
    >
      <div className="flex-1">{children}</div>
      {showCloseButton && (
        <button
          onClick={onClose}
          className={cn(
            'p-2 rounded-xl',
            'bg-white/10 backdrop-blur-[20px] border border-white/15',
            'text-white/70 hover:text-white',
            'hover:bg-white/15 hover:border-white/20',
            'transition-all',
            'focus-visible:outline-none',
          )}
          style={{
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  )
}

export const DrawerTitle = ({
  className,
  children,
  ...props
}: ComponentProps<'h2'>) => {
  return (
    <h2
      className={cn(
        'text-xl font-semibold text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]',
        className,
      )}
      {...props}
    >
      {children}
    </h2>
  )
}

export const DrawerDescription = ({
  className,
  children,
  ...props
}: ComponentProps<'p'>) => {
  return (
    <p className={cn('text-sm text-white/70 mt-1', className)} {...props}>
      {children}
    </p>
  )
}

export const DrawerBody = ({
  className,
  children,
  ...props
}: ComponentProps<'div'>) => {
  return (
    <div
      className={cn('px-6 py-4 overflow-y-auto max-h-[60vh]', className)}
      {...props}
    >
      {children}
    </div>
  )
}

export const DrawerFooter = ({
  className,
  children,
  ...props
}: ComponentProps<'div'>) => {
  return (
    <div
      className={cn('px-6 py-4 border-t border-white/10 flex gap-3', className)}
      {...props}
    >
      {children}
    </div>
  )
}
