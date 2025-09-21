import { useQuery } from '@tanstack/react-query'
import { useRawInitData } from '@telegram-apps/sdk-react'
import { fetchMe } from '@/core/api'

const useMe = () => {
  const initRaw = useRawInitData()

  return useQuery({
    queryKey: ['me', initRaw],
    queryFn: fetchMe,
    enabled: !!initRaw,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export default useMe
