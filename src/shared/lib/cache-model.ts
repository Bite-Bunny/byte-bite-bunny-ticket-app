// Copyright 2026 Byte Bite Bunny Authors. All rights reserved.
// src/shared/lib/cache-model.ts
import { getCachedModelData, setCachedModelData } from './indexeddb-cache'

// Lazy load THREE.js to avoid blocking initial bundle
let THREE: typeof import('three') | null = null
let GLTFLoader:
  | typeof import('three/addons/loaders/GLTFLoader.js').GLTFLoader
  | null = null

const loadThree = async () => {
  if (!THREE) {
    THREE = await import('three')
    const loaderModule = await import('three/addons/loaders/GLTFLoader.js')
    GLTFLoader = loaderModule.GLTFLoader
  }
  return { THREE: THREE!, GLTFLoader: GLTFLoader! }
}

// In-memory cache for faster access within the same session
// Using any for now since THREE is lazy loaded
//
// MEMORY WARNING: 3D models can consume significant RAM (10-50MB+ per model when loaded).
// This cache stores the original models. Each call to getCachedModel() clones the model,
// which creates a full copy in memory. Be mindful of memory usage in production.
// Consider calling clearMemoryCache() if memory becomes an issue.
const modelCache = new Map<string, any>()
let loader: any = null

/**
 * Load model from ArrayBuffer using GLTFLoader
 * Creates a Blob URL from the ArrayBuffer for compatibility with GLTFLoader
 */
async function loadModelFromArrayBuffer(
  arrayBuffer: ArrayBuffer,
  modelPath: string,
): Promise<any> {
  const { GLTFLoader: Loader } = await loadThree()

  // Initialize loader if not already done
  if (!loader) {
    loader = new Loader()
  }

  return new Promise((resolve, reject) => {
    // Determine MIME type based on file extension
    const isGLB = modelPath.toLowerCase().endsWith('.glb')
    const mimeType = isGLB ? 'model/gltf-binary' : 'model/gltf+json'

    // Create a Blob URL from the ArrayBuffer with proper MIME type
    const blob = new Blob([arrayBuffer], { type: mimeType })
    const blobUrl = URL.createObjectURL(blob)

    loader.load(
      blobUrl,
      (gltf: { scene: unknown }) => {
        // Clean up the Blob URL after loading
        URL.revokeObjectURL(blobUrl)
        resolve(gltf.scene)
      },
      undefined,
      (error: any) => {
        URL.revokeObjectURL(blobUrl)
        reject(error)
      },
    )
  })
}

/**
 * Fetch model from network and cache it
 */
async function fetchAndCacheModel(modelPath: string): Promise<any> {
  try {
    // Fetch the model file
    const response = await fetch(modelPath)
    if (!response.ok) {
      throw new Error(`Failed to fetch model: ${response.statusText}`)
    }

    const arrayBuffer = await response.arrayBuffer()

    // Store in IndexedDB cache for persistence across sessions (browser only)
    if (typeof window !== 'undefined' && 'indexedDB' in window) {
      await setCachedModelData(modelPath, arrayBuffer).catch((error) => {
        // Log but don't fail - cache write failure shouldn't break loading
        console.warn('Failed to cache model to IndexedDB:', error)
      })
    }

    // Parse and store in memory cache
    const model = await loadModelFromArrayBuffer(arrayBuffer, modelPath)
    modelCache.set(modelPath, model)

    return model
  } catch (error) {
    throw new Error(`Failed to load model from network: ${error}`)
  }
}

/**
 * Get a cached 3D model with persistent storage across sessions.
 * Uses a three-tier caching strategy:
 * 1. In-memory cache (fastest, session-only)
 * 2. IndexedDB cache (persistent across sessions)
 * 3. Network fetch (if not in either cache)
 *
 * @param modelPath - Path to the 3D model file (GLB/GLTF)
 * @returns Promise that resolves to a cloned THREE.Group of the model
 *
 * @example
 * ```ts
 * const model = await getCachedModel('/models/regular-case.glb')
 * scene.add(model)
 * ```
 */
export const getCachedModel = async (modelPath: string): Promise<any> => {
  // Tier 1: Check in-memory cache (fastest)
  if (modelCache.has(modelPath)) {
    return modelCache.get(modelPath)!.clone()
  }

  // Tier 2: Check IndexedDB cache (persistent, browser only)
  if (typeof window !== 'undefined' && 'indexedDB' in window) {
    try {
      const cachedData = await getCachedModelData(modelPath)
      if (cachedData) {
        // Parse from cached ArrayBuffer
        const model = await loadModelFromArrayBuffer(cachedData, modelPath)
        // Store in memory cache for faster subsequent access
        modelCache.set(modelPath, model)
        return model.clone()
      }
    } catch (error) {
      // If IndexedDB read fails, fall through to network fetch
      console.warn('IndexedDB cache read failed, fetching from network:', error)
    }
  }

  // Tier 3: Fetch from network and cache
  const model = await fetchAndCacheModel(modelPath)
  return model.clone()
}

/**
 * Preload a model into both caches without returning it
 * Useful for background loading before the model is needed
 *
 * @param modelPath - Path to the 3D model file (GLB/GLTF)
 */
export const preloadModel = async (modelPath: string): Promise<void> => {
  try {
    await getCachedModel(modelPath)
  } catch (error) {
    console.warn(`Failed to preload model: ${modelPath}`, error)
    throw error
  }
}

/**
 * Clear the in-memory cache (IndexedDB cache persists)
 * Useful for memory management in long-running applications
 *
 * WARNING: This will force models to be reloaded from IndexedDB or network on next access.
 * Only call this if you're experiencing memory issues and models are no longer needed.
 */
export const clearMemoryCache = (): void => {
  // Dispose of Three.js resources before clearing cache to free memory
  modelCache.forEach((model) => {
    if (model && typeof model.traverse === 'function') {
      model.traverse((child: any) => {
        if (child.geometry) {
          child.geometry.dispose()
        }
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach((mat: any) => mat.dispose())
          } else {
            child.material.dispose()
          }
        }
      })
    }
  })
  modelCache.clear()
}

/**
 * Check if a model is cached in memory (session-only check)
 */
export const isModelCachedInMemory = (modelPath: string): boolean => {
  return modelCache.has(modelPath)
}
