import { useState, useEffect, useRef, useCallback } from 'react'
import { useRawInitData } from '@telegram-apps/sdk-react'
import { fetchMe } from '@/core/api'

type UseMeReturn = {
  id: number
  cloud_user_id?: number
  registration: string
  last_login: string
  last_access: string
  coins: number
}

// Cache to store API responses across hook instances
const cache = new Map<string, UseMeReturn>()

const useMe = (): UseMeReturn => {
  const initRaw = useRawInitData()
  const cacheKeyRef = useRef<string | null>(null)
  const [state, setState] = useState<UseMeReturn>({
    id: 0,
    cloud_user_id: 0,
    registration: '',
    last_login: '',
    last_access: '',
    coins: 0,
  })

  const fetchUserData = useCallback(async () => {
    // If no raw data, return loading state
    if (!initRaw) {
      setState({
        id: 0,
        cloud_user_id: 0,
        registration: '',
        last_login: '',
        last_access: '',
        coins: 0,
      })
      return
    }

    // Check if we have cached data for this exact raw string
    if (cacheKeyRef.current === initRaw && cache.has(initRaw)) {
      const cachedData = cache.get(initRaw)!
      setState({
        ...cachedData,
      })
      return
    }

    try {
      const response = await fetchMe()

      const successResult = {
        id: response.id,
        cloud_user_id: response.cloud_user_id,
        registration: response.registration,
        last_login: response.last_login,
        last_access: response.last_access,
        coins: response.coins,
      }

      // Cache the successful result
      cache.set(initRaw, successResult)
      cacheKeyRef.current = initRaw
      setState(successResult)
    } catch (error) {
      const errorResult = {
        id: 0,
        cloud_user_id: 0,
        registration: '',
        last_login: '',
        last_access: '',
        coins: 0,
      }
      cache.set(initRaw, errorResult)
      cacheKeyRef.current = initRaw
      setState(errorResult)
    }
  }, [initRaw])

  useEffect(() => {
    fetchUserData()
  }, [initRaw, fetchUserData])

  return state
}

export default useMe
