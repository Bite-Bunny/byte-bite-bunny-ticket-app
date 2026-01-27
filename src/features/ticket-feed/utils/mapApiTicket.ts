import { TicketData } from '../types'

type ApiTicket = {
  id: string
  variant: string
  quality: number
  owner: number
}

const VARIANT_MAP: Record<string, TicketData['variant']> = {
  bronze: 'bronze',
  Bronze: 'bronze',
  silver: 'silver',
  Silver: 'silver',
  gold: 'gold',
  Gold: 'gold',
  diamond: 'diamond',
  Diamond: 'diamond',
}

const BASE_PRICE_BY_VARIANT: Record<TicketData['variant'], number> = {
  bronze: 100,
  silver: 300,
  gold: 600,
  diamond: 1000,
}

/**
 * Maps raw API ticket payload into internal TicketData shape.
 * Keeps all formatting / defaults in one place so we can easily
 * adjust pricing or quality presentation later.
 */
export const mapApiTicketToTicketData = (
  payload: ApiTicket,
): TicketData | null => {
  const variant =
    VARIANT_MAP[payload.variant] ?? VARIANT_MAP[payload.variant.toLowerCase()]

  if (!variant) {
    console.warn('Unsupported ticket variant from API:', payload.variant)
    return null
  }

  const basePrice = BASE_PRICE_BY_VARIANT[variant]

  // Simple pricing strategy: scale around the base price using quality
  const price = Math.max(
    1,
    Math.round(basePrice * (1 + Number(payload.quality || 0))),
  )

  return {
    id: payload.id,
    variant,
    price,
    quality: Number(payload.quality.toFixed(4)),
    showCarrot: true,
  }
}
