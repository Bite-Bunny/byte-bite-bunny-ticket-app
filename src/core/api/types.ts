import { AxiosError } from 'axios'

// Generic API response type
export interface ApiResponse<T = unknown> {
  data: T
  message?: string
}

// API error response structure
export interface ApiErrorResponse {
  message: string
  errors?: Record<string, string[]>
  statusCode?: number
}

// Type guard for API error response
export function isApiErrorResponse(
  error: unknown,
): error is AxiosError<ApiErrorResponse> {
  return (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    typeof (error as AxiosError).response?.data === 'object'
  )
}

// Extract error message from various error types
export function getErrorMessage(error: unknown): string {
  if (isApiErrorResponse(error)) {
    return error.response?.data?.message || 'An error occurred'
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'An unexpected error occurred'
}
