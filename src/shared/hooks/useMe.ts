import { useUser } from './api/useUser'

/**
 * @deprecated Use `useUser` from '@/shared/hooks/api/useUser' instead
 * This hook is kept for backward compatibility
 */
const useMe = () => {
  return useUser()
}

export default useMe
