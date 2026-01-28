import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { userService, type User } from '@/core/api/services/user.service'
import { getErrorMessage } from '@/core/api/types'
import { getQueryClient } from '@/shared/lib/query-client'

// Query keys - centralized for consistency
export const userKeys = {
  all: ['user'] as const,
  me: () => [...userKeys.all, 'me'] as const,
}

// Cache duration constants
const STALE_TIME = 5 * 60 * 1000 // 5 minutes - data considered fresh
const GC_TIME = 30 * 60 * 1000 // 30 minutes - keep in cache

/**
 * Hook to fetch current user data.
 * Uses React Query for automatic caching, refetching, and deduplication.
 *
 * The data is cached and will be reused across the app without refetching
 * as long as it's within the stale time (5 minutes).
 */
export function useUser() {
  return useQuery({
    queryKey: userKeys.me(),
    queryFn: userService.getMe,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    retry: 2,
    refetchOnWindowFocus: false,
  })
}

/**
 * Get the cached user data synchronously without triggering a fetch.
 * Returns undefined if user is not in cache.
 *
 * Useful for accessing user data outside of React components or
 * when you know the data should already be cached.
 */
export function getCachedUser(): User | undefined {
  const queryClient = getQueryClient()
  return queryClient.getQueryData<User>(userKeys.me())
}

/**
 * Prefetch user data - useful for preloading before navigation.
 */
export async function prefetchUser(): Promise<void> {
  const queryClient = getQueryClient()
  await queryClient.prefetchQuery({
    queryKey: userKeys.me(),
    queryFn: userService.getMe,
    staleTime: STALE_TIME,
  })
}

/**
 * Invalidate user cache - forces refetch on next useUser call.
 */
export function invalidateUserCache(): Promise<void> {
  const queryClient = getQueryClient()
  return queryClient.invalidateQueries({ queryKey: userKeys.me() })
}

/**
 * Hook to update user data
 */
export function useUpdateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: userService.updateMe,
    onSuccess: (data) => {
      // Update cache directly with new data
      queryClient.setQueryData<User>(userKeys.me(), data)
    },
    onError: (error) => {
      console.error('Failed to update user:', getErrorMessage(error))
    },
  })
}

// Re-export User type for convenience
export type { User } from '@/core/api/services/user.service'
