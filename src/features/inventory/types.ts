export type InventoryItemType =
  | 'copper'
  | 'silver'
  | 'gold'
  | 'diamond'
  | 'carrot'

export interface InventoryItem {
  id: string
  type: InventoryItemType
  quantity?: number
  price?: number
  quality?: number
}

export interface GroupedInventoryItem {
  type: InventoryItemType
  count: number
  price?: number
  quality?: number
}
