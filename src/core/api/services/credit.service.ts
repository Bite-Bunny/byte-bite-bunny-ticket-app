import { apiClient } from '../instance'

/** Pricing tier from /api/payment/pricing */
export interface PricingTier {
  star: number
  credit: number
}

export const creditService = {
  /**
   * Get payment pricing tiers (stars -> credits).
   * Requires Authorization header with Telegram init data.
   */
  getPricing: async (): Promise<PricingTier[]> => {
    const response = await apiClient.get<PricingTier[]>('/api/payment/pricing')
    return response.data
  },
}
