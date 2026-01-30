import { useQuery } from '@tanstack/react-query'
import { casesService, type CasesFeedItem } from '@/core/api/services/cases.service'
import { queryCacheCasesFeed } from '@/shared/config'
import { getQueryClient } from '@/shared/lib/query-client'

export const casesFeedKeys = {
  all: ['cases', 'feed'] as const,
  feed: () => [...casesFeedKeys.all] as const,
}

/**
 * Hook to fetch cases feed from /api/cases/feed.
 * Uses React Query for caching so re-entering the tab does not refetch
 * while data is fresh (see shared/config/query-cache.ts casesFeed preset).
 */
export function useCasesFeed() {
  return useQuery({
    queryKey: casesFeedKeys.feed(),
    queryFn: casesService.getFeed,
    staleTime: queryCacheCasesFeed.staleTime,
    gcTime: queryCacheCasesFeed.gcTime,
    retry: 2,
    refetchOnWindowFocus: queryCacheCasesFeed.refetchOnWindowFocus ?? false,
  })
}

/**
 * Get the cached cases feed synchronously without triggering a fetch.
 */
export function getCachedCasesFeed(): CasesFeedItem[] | undefined {
  const queryClient = getQueryClient()
  return queryClient.getQueryData<CasesFeedItem[]>(casesFeedKeys.feed())
}

/**
 * Prefetch cases feed (e.g. before navigating to cases tab).
 */
export async function prefetchCasesFeed(): Promise<void> {
  const queryClient = getQueryClient()
  await queryClient.prefetchQuery({
    queryKey: casesFeedKeys.feed(),
    queryFn: casesService.getFeed,
    staleTime: queryCacheCasesFeed.staleTime,
  })
}

export type { CasesFeedItem } from '@/core/api/services/cases.service'
