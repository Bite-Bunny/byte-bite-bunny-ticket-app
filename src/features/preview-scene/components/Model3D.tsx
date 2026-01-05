'use client'

import * as THREE from 'three'
import React, { useRef, useMemo, useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import { MODEL_SCALE_FACTOR } from '../config/preview.config'

interface Model3DProps {
  modelPath: string
}

/**
 * 3D Model component that loads, scales, and centers a GLB/GLTF model
 */
export function Model3D({ modelPath }: Model3DProps) {
  const modelRef = useRef<THREE.Group>(null!)
  // Use drei's useGLTF which automatically uses preloaded model if available
  const { scene } = useGLTF(modelPath)

  // Clone and prepare the scene
  const clonedScene = useMemo(() => {
    const cloned = scene.clone()
    // Calculate bounding box to center and scale the model
    const box = new THREE.Box3().setFromObject(cloned)
    const center = box.getCenter(new THREE.Vector3())
    const size = box.getSize(new THREE.Vector3())
    const maxDim = Math.max(size.x, size.y, size.z)
    const scale = MODEL_SCALE_FACTOR / maxDim // Scale to fit in a configurable space

    cloned.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true
        child.receiveShadow = true
        if (child.geometry) {
          child.geometry.computeBoundingBox()
        }
      }
    })

    // Center the model
    cloned.position.x = -center.x * scale
    cloned.position.y = -center.y * scale
    cloned.position.z = -center.z * scale
    cloned.scale.set(scale, scale, scale)

    return cloned
  }, [scene])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (clonedScene) {
        clonedScene.traverse((child) => {
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
    }
  }, [clonedScene])

  if (!clonedScene) return null

  return <primitive object={clonedScene} ref={modelRef} />
}
