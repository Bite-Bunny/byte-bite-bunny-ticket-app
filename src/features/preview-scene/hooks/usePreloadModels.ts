'use client'

import { useEffect, useState } from 'react'
import { useGLTF } from '@react-three/drei'
import { getCachedModel } from '@/shared/lib/cache-model'

/**
 * Hook to preload multiple 3D models efficiently
 * 
 * @param modelPaths - Array of paths to 3D model files (GLB/GLTF)
 * @returns Object with loading state and preloaded status for each model
 * 
 * @example
 * ```tsx
 * const { isLoading, preloadedModels } = usePreloadModels([
 *   '/models/model1.glb',
 *   '/models/model2.glb'
 * ])
 * ```
 */
export function usePreloadModels(modelPaths: string[]) {
  const [isLoading, setIsLoading] = useState(true)
  const [preloadedModels, setPreloadedModels] = useState<boolean[]>([])

  useEffect(() => {
    const preloadAllModels = async () => {
      const loadedStatus = await Promise.all(
        modelPaths.map(async (modelPath) => {
          try {
            // Preload into custom cache
            await getCachedModel(modelPath)
            // Also preload into drei's cache
            useGLTF.preload(modelPath)
            return true
          } catch (error) {
            console.warn(`Failed to preload model: ${modelPath}`, error)
            return false
          }
        }),
      )
      setPreloadedModels(loadedStatus)
      setIsLoading(false)
    }

    preloadAllModels()
  }, [modelPaths])

  return { isLoading, preloadedModels }
}

