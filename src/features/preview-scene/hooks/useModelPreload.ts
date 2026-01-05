'use client'

import { useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import { getCachedModel } from '@/shared/lib/cache-model'

/**
 * Hook to preload a 3D model using the custom cache utility for better performance.
 * This preloads models both in the custom cache and drei's cache.
 *
 * @param modelPath - Path to the 3D model file (GLB/GLTF)
 *
 * @example
 * ```tsx
 * // In a component that renders before PreviewScene
 * useModelPreload('/models/regular-case.glb')
 * ```
 */
export function useModelPreload(modelPath: string) {
  useEffect(() => {
    // Preload into custom cache for app-wide caching
    getCachedModel(modelPath).catch((error) => {
      console.warn(`Failed to preload model: ${modelPath}`, error)
    })

    // Also preload into drei's cache for drei components
    useGLTF.preload(modelPath)
  }, [modelPath])
}
