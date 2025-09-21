'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import React, { PropsWithChildren, useEffect } from 'react'
import { TonConnectUIProvider } from '@tonconnect/ui-react'
import { AppRoot } from '@telegram-apps/telegram-ui'
import {
  initData,
  miniApp,
  useLaunchParams,
  useSignal,
} from '@telegram-apps/sdk-react'

import { getQueryClient } from '@/shared/lib/query-client'

import { setLocale } from '@/core/i18n/locale'
import WebSocketProvider from '@/shared/components/WebSocketProvider'

const Providers = ({ children }: PropsWithChildren) => {
  const queryClient = getQueryClient()
  const lp = useLaunchParams()
  const isDark = useSignal(miniApp.isDark)
  const initDataUser = useSignal(initData.user)

  // Set the user locale.
  useEffect(() => {
    initDataUser && setLocale(initDataUser.language_code)
  }, [initDataUser])

  return (
    <QueryClientProvider client={queryClient}>
      <TonConnectUIProvider manifestUrl="/tonconnect-manifest.json">
        <AppRoot
          appearance={isDark ? 'dark' : 'light'}
          platform={
            ['macos', 'ios'].includes(lp.tgWebAppPlatform) ? 'ios' : 'base'
          }
        >
          <WebSocketProvider>{children}</WebSocketProvider>
        </AppRoot>
      </TonConnectUIProvider>
    </QueryClientProvider>
  )
}

export default Providers
