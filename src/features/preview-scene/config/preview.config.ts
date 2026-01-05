import type { CameraConfig, LightingConfig, ControlsConfig } from '../types'

/**
 * Default camera configuration for 3D preview
 */
export const DEFAULT_CAMERA_CONFIG: CameraConfig = {
  position: [0, 1.2, 5.5],
  fov: 50,
}

/**
 * Default lighting configuration for 3D preview
 */
export const DEFAULT_LIGHTING_CONFIG: LightingConfig = {
  ambient: {
    intensity: 0.5,
  },
  directional: {
    position: [10, 10, 5],
    intensity: 1,
  },
  point: {
    position: [-10, -10, -10],
    intensity: 0.5,
  },
}

/**
 * Default orbit controls configuration for 3D preview
 */
export const DEFAULT_CONTROLS_CONFIG: ControlsConfig = {
  enableZoom: true,
  enablePan: false,
  minDistance: 3,
  maxDistance: 10,
  autoRotate: false,
}

/**
 * Model scaling configuration
 */
export const MODEL_SCALE_FACTOR = 2 // Scale to fit in a 2-unit space

/**
 * Default animation configuration
 */
export const DEFAULT_ANIMATION_CONFIG = {
  autoPlay: false,
  speed: 1,
  loop: true,
} as const
