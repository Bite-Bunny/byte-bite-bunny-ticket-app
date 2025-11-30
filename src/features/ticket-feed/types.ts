import { PanInfo } from 'framer-motion'
import { TicketVariant } from '@/shared/components/Ticket'

export interface TicketData {
  id: string
  variant: TicketVariant
  price: number
  quality: number
  showCarrot?: boolean
}

export interface TicketFeedProps {
  tickets: TicketData[]
  className?: string
}

export interface TicketSlideProps {
  ticket: TicketData
  index: number
  isActive: boolean
  isDragging?: boolean
}

export interface ScrollIndicatorProps {
  currentIndex: number
  totalCount: number
}

export interface NavigationButtonsProps {
  currentIndex: number
  totalCount: number
  onPrevious: () => void
  onNext: () => void
}

export interface ScrollableContainerProps {
  children: React.ReactNode
  isDragging: boolean
  onDragStart: () => void
  onDrag: (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => void
  onDragEnd: (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => void
  containerRef: React.RefObject<HTMLDivElement>
}
