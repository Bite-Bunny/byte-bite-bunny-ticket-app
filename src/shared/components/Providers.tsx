'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import React, { PropsWithChildren, useEffect } from 'react'
import { TonConnectUIProvider } from '@tonconnect/ui-react'
import { getQueryClient } from '@/shared/lib/query-client'
import { useTelegramLocale } from '@/shared/hooks/useTelegramLocale'
import { PRELOAD_MODELS } from '@/shared/lib/models.constants'

// Defer 3D model preloading to not block initial page load
// Load models after page is interactive using requestIdleCallback or setTimeout
const preloadModelsDeferred = () => {
  // Use requestIdleCallback if available, otherwise fallback to setTimeout
  if (typeof window !== 'undefined') {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(
        () => {
          // Dynamically import drei only when needed
          import('@react-three/drei').then(({ useGLTF }) => {
            import('@/shared/lib/cache-model').then(({ getCachedModel }) => {
              // Preload into drei's cache
              PRELOAD_MODELS.forEach((modelPath) => {
                useGLTF.preload(modelPath)
              })

              // Preload into custom cache
              Promise.allSettled(
                PRELOAD_MODELS.map((modelPath) =>
                  getCachedModel(modelPath).catch((error) => {
                    console.warn(`Failed to preload model: ${modelPath}`, error)
                  }),
                ),
              )
            })
          })
        },
        { timeout: 2000 },
      )
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(() => {
        import('@react-three/drei').then(({ useGLTF }) => {
          import('@/shared/lib/cache-model').then(({ getCachedModel }) => {
            PRELOAD_MODELS.forEach((modelPath) => {
              useGLTF.preload(modelPath)
            })

            Promise.allSettled(
              PRELOAD_MODELS.map((modelPath) =>
                getCachedModel(modelPath).catch((error) => {
                  console.warn(`Failed to preload model: ${modelPath}`, error)
                }),
              ),
            )
          })
        })
      }, 2000)
    }
  }
}

const Providers = ({ children }: PropsWithChildren) => {
  // Automatically set locale from Telegram if no manual preference exists
  useTelegramLocale()

  // Defer model preloading to after initial render
  useEffect(() => {
    preloadModelsDeferred()
  }, [])

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
