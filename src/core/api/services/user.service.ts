import { apiClient } from '../instance'

// User types matching the /api/me response
export interface User {
  id: number
  cloud_user_id: string | null
  registration: string
  last_login: string
  last_access: string
  coins: number
  credits: number
}

// User API service
export const userService = {
  /**
   * Get current user data from /api/me
   * Requires Authorization header with Telegram init data
   */
  getMe: async (): Promise<User> => {
    const response = await apiClient.get<User>('/api/me')
    return response.data
  },

  /**
   * Update user data
   */
  updateMe: async (data: Partial<User>): Promise<User> => {
    const response = await apiClient.patch<User>('/api/me', data)
    return response.data
  },
}
