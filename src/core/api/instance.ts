import axios, { AxiosError, AxiosResponse } from 'axios'
import { axiosHeaders, axiosTimeout, baseURL } from './config'
import { retrieveRawInitData } from '@telegram-apps/sdk-react'

/**
 * Returns the authorization value that should be used for both
 * HTTP requests and WebSocket connections.
 *
 * This centralizes the logic so our Axios instance and any
 * real-time transports stay perfectly in sync.
 */
export const getAuthHeader = (): string | undefined => {
  // Browser: prefer mock auth when running locally, otherwise use real Telegram data
  if (typeof window !== 'undefined') {
    const isLocalhost =
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1'

    if (isLocalhost && process.env.NEXT_PUBLIC_MOCK_INIT_AUTH) {
      return process.env.NEXT_PUBLIC_MOCK_INIT_AUTH
    }

    const initDataRaw = retrieveRawInitData()
    if (initDataRaw) {
      return initDataRaw
    }
  }

  // Server-side / test fallback
  if (process.env.MOCK_INIT_AUTH) {
    return process.env.MOCK_INIT_AUTH
  }

  return undefined
}

// Create axios instance
export const apiClient = axios.create({
  baseURL: baseURL,
  headers: {
    ...axiosHeaders,
  },
  timeout: axiosTimeout,
})

// Request interceptor - add auth token dynamically
apiClient.interceptors.request.use(
  (config) => {
    const authHeader = getAuthHeader()

    if (authHeader && config.headers) {
      config.headers.Authorization = authHeader
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor - handle errors globally
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  (error: AxiosError) => {
    // Handle common error cases
    if (error.response) {
      // Server responded with error status
      const status = error.response.status

      switch (status) {
        case 401:
          // Unauthorized - could trigger logout or redirect
          console.error('Unauthorized request')
          break
        case 403:
          console.error('Forbidden request')
          break
        case 404:
          console.error('Resource not found')
          break
        case 500:
          console.error('Server error')
          break
        default:
          console.error(`Request failed with status ${status}`)
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error('No response received from server')
    } else {
      // Something else happened
      console.error('Error setting up request:', error.message)
    }

    return Promise.reject(error)
  },
)
