import axios, { AxiosError, AxiosResponse } from 'axios'
import { axiosHeaders, axiosTimeout, baseURL } from './config'
import { retrieveRawInitData } from '@telegram-apps/sdk-react'

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
    // Get initDataRaw on each request (handles client-side only)
    if (typeof window !== 'undefined') {
      const initDataRaw = retrieveRawInitData()
      const authHeader = process.env.NEXT_PUBLIC_MOCK_INIT_AUTH || initDataRaw

      if (authHeader && config.headers) {
        config.headers.Authorization = authHeader
      }
    } else if (process.env.MOCK_INIT_AUTH && config.headers) {
      // Server-side fallback
      config.headers.Authorization = process.env.MOCK_INIT_AUTH
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
