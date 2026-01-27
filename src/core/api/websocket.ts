import { baseURL } from './config'
import { getAuthHeader } from './instance'

/**
 * Build the WebSocket URL for the session stream based on the HTTP base URL.
 * Falls back to the provided ws URL if something goes wrong.
 *
 * Default HTTP base URL is https://api.bbt-tg.xyz, which becomes
 * wss://api.bbt-tg.xyz/api/session for WebSocket connections.
 */
const getSessionWebSocketUrl = (): string => {
  try {
    const url = new URL(baseURL)

    // Translate HTTP(S) to WS(S)
    if (url.protocol === 'https:') {
      url.protocol = 'wss:'
    } else if (url.protocol === 'http:') {
      url.protocol = 'ws:'
    }

    url.pathname = '/api/session'
    url.search = ''

    return url.toString()
  } catch {
    // Hard fallback in case baseURL is misconfigured
    return 'ws://api.bbt-tg.xyz/api/session'
  }
}

/**
 * Creates an authenticated WebSocket connection to the ticket session endpoint.
 *
 * We can't set custom headers in browser WebSockets, so we pass the same
 * Authorization value that Axios uses as a query parameter. The backend
 * should read this and validate it in the same way.
 */
export const createSessionWebSocket = (): WebSocket | null => {
  if (typeof window === 'undefined') {
    return null
  }

  const rawUrl = getSessionWebSocketUrl()
  const authHeader = getAuthHeader()

  const url = new URL(rawUrl)

  if (authHeader) {
    url.searchParams.set('auth', authHeader)
  }

  return new WebSocket(url.toString())
}
