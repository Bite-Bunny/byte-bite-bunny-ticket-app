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
  /** When user requests "next" at the last ticket (swipe or down button). */
  onRequestNext?: () => void
  /** True while waiting for the next ticket from the backend. */
  isLoadingNext?: boolean
}

/** Props for the live ticket feed when session is owned by parent (e.g. HomeContent). */
export interface TicketFeedLiveProps {
  tickets: TicketData[]
  status: 'idle' | 'connecting' | 'open' | 'closed' | 'error'
  error: string | null
  requestNextTicket: () => void
  isRequestingNext: boolean
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
  /** When at last ticket, next button requests a new ticket instead of scrolling. */
  onRequestNext?: () => void
  isLoadingNext?: boolean
}

export interface ScrollableContainerProps {
  children: React.ReactNode
  isDragging: boolean
  onDragStart: () => void
  onDrag: (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => void
  onDragEnd: (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => void
  containerRef: React.RefObject<HTMLDivElement>
}
