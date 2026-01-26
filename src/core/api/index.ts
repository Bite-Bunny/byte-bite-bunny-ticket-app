// Core API exports
export { apiClient } from './instance'

// API types and utilities
export * from './types'

// API services
export * from './services'

// Legacy export for backward compatibility
export const fetchMe = async () => {
  const { userService } = await import('./services/user.service')
  return userService.getMe()
}
