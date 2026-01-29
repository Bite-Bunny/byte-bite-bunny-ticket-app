import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { userService, type User } from '@/core/api/services/user.service'
import { getErrorMessage } from '@/core/api/types'
import { queryCacheUser } from '@/shared/config'
import { getQueryClient } from '@/shared/lib/query-client'

// Query keys - centralized for consistency
export const userKeys = {
  all: ['user'] as const,
  me: () => [...userKeys.all, 'me'] as const,
}

/**
 * Hook to fetch current user data.
 * Uses React Query for automatic caching, refetching, and deduplication.
 * Cache settings: shared/config/query-cache.ts (user preset).
 */
export function useUser() {
  return useQuery({
    queryKey: userKeys.me(),
    queryFn: userService.getMe,
    staleTime: queryCacheUser.staleTime,
    gcTime: queryCacheUser.gcTime,
    retry: 2,
    refetchOnWindowFocus: queryCacheUser.refetchOnWindowFocus ?? false,
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
    staleTime: queryCacheUser.staleTime,
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
