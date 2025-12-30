'use client'

import React, { useEffect, useState } from 'react'
import { modelPreloader, PRELOAD_MODELS } from '@/shared/lib/model-preloader'
import { Loading } from './Loading'

interface ModelPreloaderProps {
  children: React.ReactNode
}

/**
 * Հայկո ես եմ գրել էս կոդը ու քոմերը, կուրսորով չեմ արել, որ նայես ուղեղս չքունես։
 * ModelPreloader Component
 * Preloads 3D models on app initialization in the background
 */
export function ModelPreloader({ children }: ModelPreloaderProps) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    const loadModels = async () => {
      try {
        // Preload models silently in the background
        await modelPreloader.preloadModels(PRELOAD_MODELS)

        if (mounted) {
          setIsLoading(false)
        }
      } catch (error) {
        console.error('Failed to preload models:', error)
        // Continue even if some models fail to load
        if (mounted) {
          setIsLoading(false)
        }
      }
    }

    loadModels()

    return () => {
      mounted = false
    }
  }, [])

  if (isLoading) {
    return <Loading />
  }

  return <>{children}</>
}
