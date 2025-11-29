import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useRawInitData } from '@telegram-apps/sdk-react'
import { userService, type User } from '@/core/api/services/user.service'
import { getErrorMessage } from '@/core/api/types'

// Query keys - centralized for consistency
export const userKeys = {
  all: ['user'] as const,
  me: () => [...userKeys.all, 'me'] as const,
  meWithAuth: (auth: string) => [...userKeys.me(), auth] as const,
}

/**
 * Hook to fetch current user data
 */
export function useUser() {
  const initRaw = useRawInitData()

  return useQuery({
    queryKey: userKeys.meWithAuth(initRaw || ''),
    queryFn: userService.getMe,
    enabled: !!initRaw,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  })
}

/**
 * Hook to update user data
 */
export function useUpdateUser() {
  const queryClient = useQueryClient()
  const initRaw = useRawInitData()

  return useMutation({
    mutationFn: userService.updateMe,
    onSuccess: (data) => {
      // Invalidate and refetch user data
      queryClient.invalidateQueries({
        queryKey: userKeys.meWithAuth(initRaw || ''),
      })
      // Optionally update cache directly
      queryClient.setQueryData<User>(userKeys.meWithAuth(initRaw || ''), data)
    },
    onError: (error) => {
      console.error('Failed to update user:', getErrorMessage(error))
    },
  })
}
