/**
 * Model Preloader
 * Preloads 3D models on app initialization to prevent loading delays
 * Similar to how major companies (Unity, Unreal, Roblox) handle asset loading
 */

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import * as THREE from 'three'

export interface ModelCache {
  [key: string]: {
    scene: THREE.Group
    loaded: boolean
    error: Error | null
  }
}

class ModelPreloader {
  private cache: ModelCache = {}
  private loader: GLTFLoader
  private loadingPromises: Map<string, Promise<THREE.Group>> = new Map()

  constructor() {
    this.loader = new GLTFLoader()
  }

  /**
   * Preload a model and cache it
   */
  async preloadModel(url: string): Promise<THREE.Group> {
    // Return cached model if already loaded
    if (this.cache[url]?.loaded && this.cache[url].scene) {
      return this.cache[url].scene.clone()
    }

    // Return existing promise if already loading
    if (this.loadingPromises.has(url)) {
      const scene = await this.loadingPromises.get(url)!
      return scene.clone()
    }

    // Start loading
    const promise = new Promise<THREE.Group>((resolve, reject) => {
      this.loader.load(
        url,
        (gltf) => {
          const scene = gltf.scene
          this.cache[url] = {
            scene: scene,
            loaded: true,
            error: null,
          }
          this.loadingPromises.delete(url)
          resolve(scene)
        },
        undefined,
        (error) => {
          this.cache[url] = {
            scene: null as any,
            loaded: false,
            error: error as Error,
          }
          this.loadingPromises.delete(url)
          reject(error)
        },
      )
    })

    this.loadingPromises.set(url, promise)
    return promise.then((scene) => scene.clone())
  }

  /**
   * Preload multiple models with progress tracking
   */
  async preloadModels(
    urls: string[],
    onProgress?: (progress: number) => void,
  ): Promise<void> {
    const total = urls.length
    let loaded = 0

    const promises = urls.map(async (url) => {
      try {
        await this.preloadModel(url)
        loaded++
        onProgress?.((loaded / total) * 100)
      } catch (error) {
        console.error(`Failed to load model: ${url}`, error)
        loaded++
        onProgress?.((loaded / total) * 100)
      }
    })

    await Promise.all(promises)
  }

  /**
   * Get a cached model (returns clone to avoid mutations)
   */
  getModel(url: string): THREE.Group | null {
    if (this.cache[url]?.loaded && this.cache[url].scene) {
      return this.cache[url].scene.clone()
    }
    return null
  }

  /**
   * Check if a model is loaded
   */
  isLoaded(url: string): boolean {
    return this.cache[url]?.loaded === true
  }

  /**
   * Clear cache (useful for memory management)
   */
  clearCache(): void {
    Object.values(this.cache).forEach((entry) => {
      if (entry.scene) {
        entry.scene.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.geometry?.dispose()
            if (Array.isArray(child.material)) {
              child.material.forEach((mat) => mat.dispose())
            } else {
              child.material?.dispose()
            }
          }
        })
      }
    })
    this.cache = {}
    this.loadingPromises.clear()
  }
}

// Singleton instance
export const modelPreloader = new ModelPreloader()

// List of models to preload on app start
export const PRELOAD_MODELS = ['/models/regular-case.glb']
