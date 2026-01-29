import { useQuery } from '@tanstack/react-query'
import {
  creditService,
  type PricingTier,
} from '@/core/api/services/credit.service'
import { queryCachePricing } from '@/shared/config'
import { getQueryClient } from '@/shared/lib/query-client'

export const pricingKeys = {
  all: ['pricing'] as const,
  list: () => [...pricingKeys.all, 'list'] as const,
}

/**
 * Hook to fetch payment pricing (stars -> credits).
 * Uses React Query for caching: reopening the credits page uses cache
 * without refetching while data is fresh (see shared/config/query-cache.ts).
 */
export function usePricing() {
  return useQuery({
    queryKey: pricingKeys.list(),
    queryFn: creditService.getPricing,
    staleTime: queryCachePricing.staleTime,
    gcTime: queryCachePricing.gcTime,
    retry: 2,
    refetchOnWindowFocus: queryCachePricing.refetchOnWindowFocus ?? false,
  })
}

/**
 * Get cached pricing synchronously without triggering a fetch.
 */
export function getCachedPricing(): PricingTier[] | undefined {
  const queryClient = getQueryClient()
  return queryClient.getQueryData<PricingTier[]>(pricingKeys.list())
}

/**
 * Prefetch pricing (e.g. before navigating to credits page).
 */
export async function prefetchPricing(): Promise<void> {
  const queryClient = getQueryClient()
  await queryClient.prefetchQuery({
    queryKey: pricingKeys.list(),
    queryFn: creditService.getPricing,
    staleTime: queryCachePricing.staleTime,
  })
}

export type { PricingTier } from '@/core/api/services/credit.service'
