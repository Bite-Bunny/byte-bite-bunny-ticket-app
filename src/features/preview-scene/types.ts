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
  /**
   * Animation configuration for model animations
   * If not provided, animations won't be played
   */
  animation?: AnimationConfig
}

export interface AnimationConfig {
  /**
   * Whether to auto-play animations when model loads
   * @default false
   */
  autoPlay?: boolean
  /**
   * Animation name to play (if model has multiple animations)
   * If not specified, ALL available animations will be played simultaneously
   */
  name?: string
  /**
   * Animation playback speed (1 = normal speed, 2 = double speed, 0.5 = half speed)
   * Applies to all animations
   * @default 1
   */
  speed?: number
  /**
   * Whether to loop the animation(s)
   * Applies to all animations
   * @default true
   */
  loop?: boolean
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

export interface AnimationState {
  /**
   * List of available animation names in the model
   */
  availableAnimations: string[]
  /**
   * Currently playing animation name (if any)
   */
  currentAnimation?: string
  /**
   * Whether any animation is currently playing
   */
  isPlaying: boolean
}
