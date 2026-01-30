import type { CasesFeedItem, CaseContentItem } from '@/core/api/services/cases.service'

export interface CaseReward {
  id: string
  name: string
  image: string
  chance: number
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
}

export interface CaseItem {
  id: string
  name: string
  credits: number
  image: string
  description: string
  rewards: CaseReward[]
}

const CASE_IMAGE: Record<string, string> = {
  Gold: '/cases/gold-case.png',
  Diamond: '/cases/diamond-case.png',
  Silver: '/cases/silver-case.png',
}

const DEFAULT_CASE_IMAGE = '/cases/silver-case.png'

function ticketImagePath(variant: string): string {
  const slug = variant.toLowerCase().replace(/\s+/g, '-')
  return `/inventory-items/${slug}-ticket.png`
}

function qualityToRarity(quality: number): CaseReward['rarity'] {
  if (quality >= 0.9) return 'legendary'
  if (quality >= 0.7) return 'epic'
  if (quality >= 0.5) return 'rare'
  if (quality >= 0.3) return 'uncommon'
  return 'common'
}

function itemLabel(item: CaseContentItem): string {
  if ('Coins' in item) return `${item.Coins} Coins`
  const { variant } = item.Ticket
  return `${variant} Ticket`
}

function itemImage(item: CaseContentItem): string {
  if ('Coins' in item) return '/credit-icon.png'
  return ticketImagePath(item.Ticket.variant)
}

export function mapCasesFeedItemToCaseItem(feedItem: CasesFeedItem): CaseItem {
  const { id, case: casePayload } = feedItem
  const firstTicket = casePayload.content_slots
    ?.flatMap((s) => s.items)
    .find((i): i is { Ticket: { variant: string; quality: number } } => 'Ticket' in i)
  const variantName = firstTicket?.Ticket.variant ?? 'Case'
  const name = `${variantName} Case`
  const image = CASE_IMAGE[variantName] ?? DEFAULT_CASE_IMAGE

  const rewards: CaseReward[] = []
  ;(casePayload.content_slots ?? []).forEach((slot, slotIndex) => {
    const chance = slot.chance ?? 100
    slot.items.forEach((item, itemIndex) => {
      const label = itemLabel(item)
      const img = itemImage(item)
      const quality = 'Ticket' in item ? item.Ticket.quality : 0.5
      rewards.push({
        id: `slot-${id}-${slotIndex}-${itemIndex}`,
        name: label,
        image: img,
        chance,
        rarity: qualityToRarity(quality),
      })
    })
  })

  return {
    id: String(id),
    name,
    credits: casePayload.price,
    image,
    description: `Case with ${rewards.length} possible reward${rewards.length === 1 ? '' : 's'}.`,
    rewards,
  }
}

export function mapCasesFeedToCaseItems(feed: CasesFeedItem[]): CaseItem[] {
  return feed.map(mapCasesFeedItemToCaseItem)
}
