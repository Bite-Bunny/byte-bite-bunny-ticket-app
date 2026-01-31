import { apiClient } from '../instance'

export interface SessionUser {
  id: number
  cloud_user_id: string | null
  registration: string
  last_login: string
  last_access: string
  coins: number
  credits: number
  max_energy: number
}

/**
 * Session login - establishes server-side session and receives Set-Cookie.
 * Must run on every app open (init). Cookies from the response are used
 * for authenticated requests including the ticket-session WebSocket.
 *
 * Requires Authorization header with Telegram init data (set by apiClient).
 * Uses withCredentials so the browser stores cookies from Set-Cookie.
 */
export async function sessionLogin(): Promise<SessionUser> {
  const response = await apiClient.post<SessionUser>('/api/session/login')
  return response.data
}
