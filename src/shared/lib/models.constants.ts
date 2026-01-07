/**
 * 3D Model Paths
 * Centralized constants for all 3D model assets used in the application
 */

export const MODEL_PATHS = {
  REGULAR_CASE: '/models/regular-case.glb',
} as const

/**
 * List of models to preload on app initialization
 */
export const PRELOAD_MODELS = [MODEL_PATHS.REGULAR_CASE] as const
