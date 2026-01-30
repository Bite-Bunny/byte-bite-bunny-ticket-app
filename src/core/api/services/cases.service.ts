import { apiClient } from '../instance'

/** Single item in a content slot (Coins or Ticket). */
export interface CaseContentCoins {
  Coins: number
}

export interface CaseContentTicket {
  Ticket: { variant: string; quality: number }
}

export type CaseContentItem = CaseContentCoins | CaseContentTicket

export interface CaseContentSlot {
  items: CaseContentItem[]
  chance: number
}

export interface CasePayload {
  content_slots: CaseContentSlot[]
  price: number
  can_be_bought_over: string
}

export interface CasesFeedItem {
  id: number
  case: CasePayload
}

/** Cases feed from /api/cases/feed. */
export const casesService = {
  getFeed: async (): Promise<CasesFeedItem[]> => {
    const response = await apiClient.get<CasesFeedItem[]>('/api/cases/feed')
    return response.data
  },
}
