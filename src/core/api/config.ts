export const axiosTimeout = 10000

export const axiosHeaders: Record<string, string> = {
  'Content-Type': 'application/json',
}

export const baseURL = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL
