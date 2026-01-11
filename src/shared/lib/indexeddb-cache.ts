// Copyright 2026 Byte Bite Bunny Authors. All rights reserved.
// src/shared/lib/indexeddb-cache.ts
/**
 * IndexedDB-based persistent cache for 3D model files
 * This cache persists across browser sessions, unlike in-memory caches
 */

const DB_NAME = 'byte-bite-bunny-models'
const DB_VERSION = 1
const STORE_NAME = 'models'

interface ModelCacheEntry {
  path: string
  data: ArrayBuffer
  timestamp: number
  version: string
}

/**
 * Check if IndexedDB is available in the current environment
 */
function isIndexedDBAvailable(): boolean {
  return (
    typeof window !== 'undefined' &&
    'indexedDB' in window &&
    indexedDB !== null &&
    indexedDB !== undefined
  )
}

/**
 * Initialize IndexedDB database for model caching
 */
function openDatabase(): Promise<IDBDatabase> {
  if (!isIndexedDBAvailable()) {
    return Promise.reject(
      new Error('IndexedDB is not available in this environment'),
    )
  }

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result

      // Create object store if it doesn't exist
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const objectStore = db.createObjectStore(STORE_NAME, {
          keyPath: 'path',
        })
        objectStore.createIndex('timestamp', 'timestamp', { unique: false })
        objectStore.createIndex('version', 'version', { unique: false })
      }
    }
  })
}

/**
 * Get cached model data from IndexedDB
 * @param modelPath - Path to the model file
 * @returns ArrayBuffer if found in cache, null otherwise
 */
export async function getCachedModelData(
  modelPath: string,
): Promise<ArrayBuffer | null> {
  try {
    const db = await openDatabase()
    const transaction = db.transaction([STORE_NAME], 'readonly')
    const store = transaction.objectStore(STORE_NAME)

    return new Promise((resolve, reject) => {
      const request = store.get(modelPath)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        const entry = request.result as ModelCacheEntry | undefined
        resolve(entry?.data || null)
      }
    })
  } catch (error) {
    console.warn('IndexedDB cache read failed:', error)
    return null
  }
}

/**
 * Store model data in IndexedDB cache
 * @param modelPath - Path to the model file
 * @param data - ArrayBuffer of the model file
 */
export async function setCachedModelData(
  modelPath: string,
  data: ArrayBuffer,
): Promise<void> {
  try {
    const db = await openDatabase()
    const transaction = db.transaction([STORE_NAME], 'readwrite')
    const store = transaction.objectStore(STORE_NAME)

    const entry: ModelCacheEntry = {
      path: modelPath,
      data,
      timestamp: Date.now(),
      version: '1.0', // Can be used for cache invalidation in the future
    }

    return new Promise((resolve, reject) => {
      const request = store.put(entry)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  } catch (error) {
    console.warn('IndexedDB cache write failed:', error)
    // Don't throw - cache write failure shouldn't break the app
  }
}

/**
 * Check if a model exists in IndexedDB cache
 * @param modelPath - Path to the model file
 * @returns true if model is cached, false otherwise
 */
export async function hasCachedModel(modelPath: string): Promise<boolean> {
  try {
    const data = await getCachedModelData(modelPath)
    return data !== null
  } catch {
    return false
  }
}

/**
 * Clear all cached models from IndexedDB
 */
export async function clearModelCache(): Promise<void> {
  try {
    const db = await openDatabase()
    const transaction = db.transaction([STORE_NAME], 'readwrite')
    const store = transaction.objectStore(STORE_NAME)

    return new Promise((resolve, reject) => {
      const request = store.clear()

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  } catch (error) {
    console.warn('Failed to clear model cache:', error)
    throw error
  }
}

/**
 * Get the size of the cache in bytes (approximate)
 */
export async function getCacheSize(): Promise<number> {
  try {
    const db = await openDatabase()
    const transaction = db.transaction([STORE_NAME], 'readonly')
    const store = transaction.objectStore(STORE_NAME)

    return new Promise((resolve, reject) => {
      const request = store.getAll()

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        const entries = request.result as ModelCacheEntry[]
        const totalSize = entries.reduce(
          (sum, entry) => sum + (entry.data?.byteLength || 0),
          0,
        )
        resolve(totalSize)
      }
    })
  } catch (error) {
    console.warn('Failed to get cache size:', error)
    return 0
  }
}
