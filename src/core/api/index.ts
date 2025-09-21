export { apiClient } from './instance'
export { webSocketService } from './websocket'
export type { WebSocketMessage, WebSocketService } from './websocket'

// API endpoints
export const fetchMe = async () => {
  const { apiClient } = await import('./instance')
  const response = await apiClient.get('/api/me')
  return response.data
}
