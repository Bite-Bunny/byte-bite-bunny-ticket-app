'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import React, { PropsWithChildren } from 'react'
import { TonConnectUIProvider } from '@tonconnect/ui-react'
import { useGLTF } from '@react-three/drei'
import { getQueryClient } from '@/shared/lib/query-client'
import { useTelegramLocale } from '@/shared/hooks/useTelegramLocale'
import WebSocketProvider from '@/shared/components/WebSocketProvider'
import { PRELOAD_MODELS } from '@/shared/lib/models.constants'

// Preload 3D models on app initialization using drei's built-in preloading
PRELOAD_MODELS.forEach((modelPath) => {
  useGLTF.preload(modelPath)
})

const Providers = ({ children }: PropsWithChildren) => {
  // Automatically set locale from Telegram if no manual preference exists
  useTelegramLocale()

  const queryClient = getQueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <TonConnectUIProvider manifestUrl="/tonconnect-manifest.json">
        <WebSocketProvider>{children}</WebSocketProvider>
      </TonConnectUIProvider>
    </QueryClientProvider>
  )
}

export default Providers
