import type { TicketVariant } from '@/shared/components/Ticket'
import type { InventoryItemType } from '../types'

/**
 * Map inventory item types to ticket variants
 */
export const typeToVariant: Record<
  Exclude<InventoryItemType, 'carrot'>,
  TicketVariant
> = {
  copper: 'bronze',
  silver: 'silver',
  gold: 'gold',
  diamond: 'diamond',
}

/**
 * Glow colors for each inventory item type (used for hover effects)
 */
export const itemGlowColors: Record<InventoryItemType, string> = {
  copper: 'rgba(180, 83, 9, 0.5)',
  silver: 'rgba(209, 213, 219, 0.5)',
  gold: 'rgba(234, 179, 8, 0.5)',
  diamond: 'rgba(34, 211, 238, 0.6)',
  carrot: 'rgba(251, 146, 60, 0.5)',
}

/**
 * Base rotation angle for all tickets (slight tilt for visual interest)
 */
export const BASE_ROTATION = 3

/**
 * Base prices for each ticket type
 */
export const basePrices: Record<InventoryItemType, number> = {
  copper: 100,
  silver: 250,
  gold: 500,
  diamond: 1000,
  carrot: 0,
}

/**
 * Base quality values for each ticket type
 */
export const baseQualities: Record<InventoryItemType, number> = {
  copper: 1.5,
  silver: 3.2,
  gold: 5.8,
  diamond: 9.5,
  carrot: 0,
}
