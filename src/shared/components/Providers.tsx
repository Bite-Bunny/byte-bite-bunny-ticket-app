'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import React, { PropsWithChildren, useEffect } from 'react'
import { TonConnectUIProvider } from '@tonconnect/ui-react'
import { useGLTF } from '@react-three/drei'
import { getQueryClient } from '@/shared/lib/query-client'
import { useTelegramLocale } from '@/shared/hooks/useTelegramLocale'
import WebSocketProvider from '@/shared/components/WebSocketProvider'
import { PRELOAD_MODELS } from '@/shared/lib/models.constants'
import { getCachedModel } from '@/shared/lib/cache-model'

// Preload 3D models into drei's cache on app initialization (module level)
PRELOAD_MODELS.forEach((modelPath) => {
  useGLTF.preload(modelPath)
})

const Providers = ({ children }: PropsWithChildren) => {
  // Automatically set locale from Telegram if no manual preference exists
  useTelegramLocale()

  // Preload models into custom cache on component mount
  useEffect(() => {
    const preloadModels = async () => {
      await Promise.allSettled(
        PRELOAD_MODELS.map((modelPath) =>
          getCachedModel(modelPath).catch((error) => {
            console.warn(`Failed to preload model: ${modelPath}`, error)
          }),
        ),
      )
    }

    preloadModels()
  }, [])

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
