import { apiClient } from '../instance'
import type { ApiResponse } from '../types'

// User types
export interface User {
  id: string
  username?: string
  firstName?: string
  lastName?: string
  // Add other user fields as needed
}

// User API service
export const userService = {
  /**
   * Get current user data
   */
  getMe: async (): Promise<User> => {
    const response = await apiClient.get<ApiResponse<User>>('/api/me')
    return response.data.data
  },

  /**
   * Update user data
   */
  updateMe: async (data: Partial<User>): Promise<User> => {
    const response = await apiClient.patch<ApiResponse<User>>('/api/me', data)
    return response.data.data
  },
}
