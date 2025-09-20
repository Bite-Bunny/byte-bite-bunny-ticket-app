import { useMemo, useRef } from 'react'
import { parseQueryString } from '@/utils/parse-query-string'
import { useRawInitData } from '@telegram-apps/sdk-react'

type MeInit = {
  auth_date: number
  hash: string
  user: {
    id: number
    first_name: string
    last_name: string
  }
}

type UseMeReturn = {
  data: MeInit | null
  isLoading: boolean
  error: string | null
}

// Cache to store parsed data across hook instances
const cache = new Map<string, UseMeReturn>()

const useMe = (): UseMeReturn => {
  const initRaw = useRawInitData()
  const cacheKeyRef = useRef<string | null>(null)

  const result = useMemo(() => {
    // If no raw data, return loading state
    if (!initRaw) {
      return {
        data: null,
        isLoading: true,
        error: null,
      }
    }

    // Check if we have cached data for this exact raw string
    if (cacheKeyRef.current === initRaw && cache.has(initRaw)) {
      return cache.get(initRaw)!
    }

    try {
      const parsed = parseQueryString<MeInit>(initRaw)

      // Validate that we have the required user data
      if (!parsed.user || !parsed.user.id) {
        const errorResult = {
          data: null,
          isLoading: false,
          error: 'Invalid user data in init data',
        }
        cache.set(initRaw, errorResult)
        cacheKeyRef.current = initRaw
        return errorResult
      }

      const successResult = {
        data: parsed,
        isLoading: false,
        error: null,
      }

      // Cache the successful result
      cache.set(initRaw, successResult)
      cacheKeyRef.current = initRaw

      return successResult
    } catch (error) {
      const errorResult = {
        data: null,
        isLoading: false,
        error:
          error instanceof Error ? error.message : 'Failed to parse init data',
      }
      cache.set(initRaw, errorResult)
      cacheKeyRef.current = initRaw
      return errorResult
    }
  }, [initRaw])

  return result
}

export default useMe
