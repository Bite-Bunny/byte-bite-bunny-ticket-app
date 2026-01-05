/**
 * Preview Scene Types
 */

export interface PreviewSceneProps {
  /**
   * Path to the 3D model file (GLB/GLTF)
   */
  modelPath: string
  /**
   * Optional fallback component to show while loading
   */
  fallback?: React.ReactNode
  /**
   * Optional className for the container
   */
  className?: string
}

export interface CameraConfig {
  position: [number, number, number]
  fov: number
}

export interface LightingConfig {
  ambient: {
    intensity: number
  }
  directional: {
    position: [number, number, number]
    intensity: number
  }
  point: {
    position: [number, number, number]
    intensity: number
  }
}

export interface ControlsConfig {
  enableZoom: boolean
  enablePan: boolean
  minDistance: number
  maxDistance: number
  autoRotate: boolean
}
