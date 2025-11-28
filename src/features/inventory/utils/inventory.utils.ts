import type {
  InventoryItem,
  GroupedInventoryItem,
  InventoryItemType,
} from '../types'
import { basePrices, baseQualities } from '../config/inventory.config'

/**
 * Generate mock inventory items with variety
 */
export function generateMockItems(count: number): InventoryItem[] {
  const types: InventoryItemType[] = ['copper', 'silver', 'gold', 'diamond']
  const items: InventoryItem[] = []

  for (let i = 1; i <= count; i++) {
    const typeIndex = (i - 1) % types.length
    const type = types[typeIndex]

    items.push({
      id: String(i),
      type,
      price: basePrices[type] + Math.floor(Math.random() * 100),
      quality: Number((baseQualities[type] + Math.random() * 2).toFixed(2)),
    })
  }

  return items
}

/**
 * Group items by type and count them
 */
export function groupItemsByType(
  items: InventoryItem[],
): GroupedInventoryItem[] {
  const grouped = new Map<InventoryItemType, GroupedInventoryItem>()

  items.forEach((item) => {
    if (item.type === 'carrot') return // Skip carrots for now

    if (grouped.has(item.type)) {
      const existing = grouped.get(item.type)!
      existing.count += 1
      // Keep the first item's price/quality for display
    } else {
      grouped.set(item.type, {
        type: item.type,
        count: 1,
        price: item.price,
        quality: item.quality,
      })
    }
  })

  return Array.from(grouped.values())
}
