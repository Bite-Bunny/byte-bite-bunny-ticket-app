import { getCachedModel } from '@/shared/lib/cache-model'
import { useGLTF } from '@react-three/drei'

/**
 * Preload a single model into both caches (custom cache and drei cache)
 * This can be called outside React components
 *
 * @param modelPath - Path to the 3D model file (GLB/GLTF)
 * @returns Promise that resolves when the model is preloaded
 *
 * @example
 * ```tsx
 * // Preload before component renders
 * await preloadModel('/models/regular-case.glb')
 * ```
 */
export async function preloadModel(modelPath: string): Promise<void> {
  try {
    // Preload into custom cache
    await getCachedModel(modelPath)
    // Also preload into drei's cache
    useGLTF.preload(modelPath)
  } catch (error) {
    console.warn(`Failed to preload model: ${modelPath}`, error)
    throw error
  }
}

/**
 * Preload multiple models efficiently
 *
 * @param modelPaths - Array of paths to 3D model files (GLB/GLTF)
 * @returns Promise that resolves when all models are preloaded, with results for each
 *
 * @example
 * ```tsx
 * const results = await preloadModels([
 *   '/models/model1.glb',
 *   '/models/model2.glb'
 * ])
 * ```
 */
export async function preloadModels(
  modelPaths: string[],
): Promise<Array<{ path: string; success: boolean; error?: Error }>> {
  const results = await Promise.allSettled(
    modelPaths.map((path) => preloadModel(path)),
  )

  return results.map((result, index) => ({
    path: modelPaths[index],
    success: result.status === 'fulfilled',
    error: result.status === 'rejected' ? result.reason : undefined,
  }))
}
