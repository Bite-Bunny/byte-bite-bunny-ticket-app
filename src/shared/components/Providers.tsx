'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import React, { PropsWithChildren } from 'react'
import { TonConnectUIProvider } from '@tonconnect/ui-react'
import { getQueryClient } from '@/shared/lib/query-client'
import { useTelegramLocale } from '@/shared/hooks/useTelegramLocale'
import WebSocketProvider from '@/shared/components/WebSocketProvider'
import { ModelPreloader } from '@/shared/components/ModelPreloader'

const Providers = ({ children }: PropsWithChildren) => {
  // Automatically set locale from Telegram if no manual preference exists
  useTelegramLocale()

  const queryClient = getQueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <TonConnectUIProvider manifestUrl="/tonconnect-manifest.json">
        <ModelPreloader>
          <WebSocketProvider>{children}</WebSocketProvider>
        </ModelPreloader>
      </TonConnectUIProvider>
    </QueryClientProvider>
  )
}

export default Providers
