import { sessionLogin, type SessionUser } from './services/session.service'

let sessionPromise: Promise<SessionUser> | null = null

/**
 * Ensures the session is established by calling POST /api/session/login.
 * Runs once per app lifecycle. Resolves with user data once cookies are set.
 * The server's Set-Cookie response will be stored by the browser (withCredentials).
 *
 * Call this before opening the ticket-session WebSocket.
 */
export function ensureSession(): Promise<SessionUser> {
  if (!sessionPromise) {
    sessionPromise = sessionLogin().catch((err) => {
      sessionPromise = null
      throw err
    })
  }
  return sessionPromise
}
