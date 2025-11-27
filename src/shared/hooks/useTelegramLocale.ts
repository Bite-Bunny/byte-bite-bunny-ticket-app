import { useEffect } from 'react'
import { initData, useSignal } from '@telegram-apps/sdk-react'
import { setLocale, hasLocaleCookie } from '@/core/i18n/locale'

/**
 * Hook that automatically sets the locale from Telegram user's language code
 * if no manual locale preference has been set by the user.
 */
export function useTelegramLocale() {
  const initDataUser = useSignal(initData.user)

  useEffect(() => {
    const checkAndSetLocale = async () => {
      if (!initDataUser) return

      const hasManualLocale = await hasLocaleCookie()

      // Only set locale from Telegram if user hasn't manually selected one
      if (!hasManualLocale) {
        await setLocale(initDataUser.language_code)
      }
    }

    checkAndSetLocale()
  }, [initDataUser])
}
