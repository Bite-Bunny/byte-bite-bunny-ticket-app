'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import { PropsWithChildren } from 'react'
// TonConnectUIProvider fetches wallets-v2.json on every load commented out until wallet UI is needed
// import { TonConnectUIProvider } from '@tonconnect/ui-react'
import { getQueryClient } from '@/shared/lib/query-client'
import { useTelegramLocale } from '@/shared/hooks/useTelegramLocale'
import { SessionProvider } from '@/features/session/SessionProvider'

const Providers = ({ children }: PropsWithChildren) => {
  // Automatically set locale from Telegram if no manual preference exists
  useTelegramLocale()

  const queryClient = getQueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        {/* TonConnectUIProvider manifestUrl="/tonconnect-manifest.json" - fetches wallets-v2.json; re-enable when wallet connect is needed */}
        {children}
      </SessionProvider>
    </QueryClientProvider>
  )
}

export default Providers
