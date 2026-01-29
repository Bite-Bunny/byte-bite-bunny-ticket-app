/**
 * Central query cache configuration for React Query.
 */

const MIN = 60 * 1000

export type QueryCachePreset = {
  /** Data considered fresh (no refetch). */
  staleTime: number
  /** How long unused data stays in cache before GC. */
  gcTime: number
  /** Optional: refetch when window regains focus. */
  refetchOnWindowFocus?: boolean
}

/** Default cache for queries that don't specify a preset. */
export const queryCacheDefault: QueryCachePreset = {
  staleTime: 2 * MIN,
  gcTime: 5 * MIN,
  refetchOnWindowFocus: false,
}

/** Pricing (stars → credits). Rarely changes. */
export const queryCachePricing: QueryCachePreset = {
  staleTime: 10 * MIN,
  gcTime: 30 * MIN,
  refetchOnWindowFocus: false,
}

/** Current user. Reuse across app moderate freshness. */
export const queryCacheUser: QueryCachePreset = {
  staleTime: 5 * MIN,
  gcTime: 30 * MIN,
  refetchOnWindowFocus: false,
}

/** Lookup by module name for programmatic use. */
export const queryCacheByModule = {
  default: queryCacheDefault,
  pricing: queryCachePricing,
  user: queryCacheUser,
} as const
