'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import { PropsWithChildren } from 'react'
import { TonConnectUIProvider } from '@tonconnect/ui-react'
import { getQueryClient } from '@/shared/lib/query-client'
import { useTelegramLocale } from '@/shared/hooks/useTelegramLocale'

const Providers = ({ children }: PropsWithChildren) => {
  // Automatically set locale from Telegram if no manual preference exists
  useTelegramLocale()

  const queryClient = getQueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <TonConnectUIProvider manifestUrl="/tonconnect-manifest.json">
        {children}
      </TonConnectUIProvider>
    </QueryClientProvider>
  )
}

export default Providers
