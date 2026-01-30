import { apiClient } from '../instance'

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

export interface OpenCaseResult {
  items: CaseContentItem[]
  chance: number
}

export const casesService = {
  getFeed: async (): Promise<CasesFeedItem[]> => {
    const response = await apiClient.get<CasesFeedItem[]>('/api/cases/feed')
    return response.data
  },

  openCase: async (caseId: number): Promise<OpenCaseResult> => {
    const response = await apiClient.get<OpenCaseResult>(
      `/api/cases/open/${caseId}`,
    )
    return response.data
  },
}
