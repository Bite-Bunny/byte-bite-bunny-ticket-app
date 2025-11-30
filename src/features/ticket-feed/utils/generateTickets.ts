import { TicketData } from '../types'

// Data generator for demo purposes - replace with real data
export const generateTickets = (count: number): TicketData[] => {
  const variants: TicketData['variant'][] = [
    'bronze',
    'silver',
    'gold',
    'diamond',
  ]
  return Array.from({ length: count }, (_, i) => ({
    id: `ticket-${i}`,
    variant: variants[i % variants.length],
    price: Math.floor(Math.random() * 1000) + 100,
    quality: Number((Math.random() * 5 + 1).toFixed(4)),
    showCarrot: true,
  }))
}
