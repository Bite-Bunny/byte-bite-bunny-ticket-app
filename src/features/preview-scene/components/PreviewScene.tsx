'use client'

import React, { Suspense, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Model3D, type Model3DRef } from './Model3D'
import type { PreviewSceneProps, AnimationControls } from '../types'
import {
  DEFAULT_CAMERA_CONFIG,
  DEFAULT_LIGHTING_CONFIG,
  DEFAULT_CONTROLS_CONFIG,
} from '../config/preview.config'
import '@/css/preview.css'

/**
 * Reusable 3D Preview Scene component
 *
 * @example
 * ```tsx
 * <PreviewScene modelPath="/models/regular-case.glb" />
 * ```
 */
export default function PreviewScene({
  modelPath,
  fallback = null,
  className = 'w-full h-full relative',
  animation,
  onAnimationControlsReady,
}: PreviewSceneProps) {
  const modelRef = useRef<Model3DRef>(null)

  return (
    <div className={className}>
      <Suspense fallback={fallback}>
        <Canvas
          camera={{
            position: DEFAULT_CAMERA_CONFIG.position,
            fov: DEFAULT_CAMERA_CONFIG.fov,
          }}
          gl={{ antialias: true, alpha: true }}
          dpr={[1, 2]}
          performance={{ min: 0.5 }}
        >
          <ambientLight intensity={DEFAULT_LIGHTING_CONFIG.ambient.intensity} />
          <directionalLight
            position={DEFAULT_LIGHTING_CONFIG.directional.position}
            intensity={DEFAULT_LIGHTING_CONFIG.directional.intensity}
          />
          <pointLight
            position={DEFAULT_LIGHTING_CONFIG.point.position}
            intensity={DEFAULT_LIGHTING_CONFIG.point.intensity}
          />
          <Model3D
            ref={modelRef}
            modelPath={modelPath}
            animation={animation}
            onControlsReady={onAnimationControlsReady}
          />
          <OrbitControls
            enableZoom={DEFAULT_CONTROLS_CONFIG.enableZoom}
            enablePan={DEFAULT_CONTROLS_CONFIG.enablePan}
            minDistance={DEFAULT_CONTROLS_CONFIG.minDistance}
            maxDistance={DEFAULT_CONTROLS_CONFIG.maxDistance}
            autoRotate={DEFAULT_CONTROLS_CONFIG.autoRotate}
          />
        </Canvas>
      </Suspense>
    </div>
  )
}
