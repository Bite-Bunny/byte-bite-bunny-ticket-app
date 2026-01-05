'use client'

import * as THREE from 'three'
import React, { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { MODEL_SCALE_FACTOR } from '../config/preview.config'
import type { AnimationConfig } from '../types'

interface Model3DProps {
  modelPath: string
  animation?: AnimationConfig
}

/**
 * 3D Model component that loads, scales, and centers a GLB/GLTF model
 * Supports animations from Blender-exported GLB/GLTF files
 */
export function Model3D({ modelPath, animation }: Model3DProps) {
  const modelRef = useRef<THREE.Group>(null!)
  const mixerRef = useRef<THREE.AnimationMixer | null>(null)
  const actionsRef = useRef<Map<string, THREE.AnimationAction>>(new Map())

  // Use drei's useGLTF which automatically uses preloaded model if available
  const { scene, animations } = useGLTF(modelPath)

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

  // Setup animation mixer and actions
  useEffect(() => {
    if (!animation || animations.length === 0) {
      return
    }

    // Create mixer if animations exist
    if (!mixerRef.current && clonedScene) {
      mixerRef.current = new THREE.AnimationMixer(clonedScene)

      // Create actions for all animations
      animations.forEach((clip) => {
        const action = mixerRef.current!.clipAction(clip)
        actionsRef.current.set(clip.name, action)
      })
    }

    // Cleanup mixer on unmount
    const mixer = mixerRef.current
    const actions = actionsRef.current

    return () => {
      if (mixer) {
        // Stop all actions
        actions.forEach((action) => {
          action.stop()
        })
        actions.clear()
        mixerRef.current = null
      }
    }
  }, [animations, animation, clonedScene])

  // Handle animation playback
  useEffect(() => {
    if (!animation || !mixerRef.current || actionsRef.current.size === 0) {
      return
    }

    const { name, autoPlay = false, speed = 1, loop = true } = animation
    const actions = actionsRef.current

    // Stop all current actions
    actions.forEach((action) => {
      action.stop()
    })

    // Determine which animations to play
    const targetActions: THREE.AnimationAction[] = []

    if (name) {
      // Play specific animation by name
      const targetAction = actions.get(name)
      if (!targetAction) {
        console.warn(
          `Animation "${name}" not found. Available animations:`,
          Array.from(actions.keys()),
        )
      } else {
        targetActions.push(targetAction)
      }
    } else {
      // Play ALL available animations by default
      actions.forEach((action) => {
        targetActions.push(action)
      })
    }

    // Configure and play all target animations
    targetActions.forEach((action) => {
      action.reset()
      action.setLoop(
        loop ? THREE.LoopRepeat : THREE.LoopOnce,
        loop ? Infinity : 1,
      )
      action.timeScale = speed

      if (autoPlay) {
        action.play()
      }
    })

    return () => {
      // Stop animations when config changes or component unmounts
      actions.forEach((action) => {
        action.stop()
      })
    }
  }, [animation])

  // Update animation mixer each frame
  useFrame((state, delta) => {
    if (mixerRef.current) {
      mixerRef.current.update(delta)
    }
  })

  // Cleanup on unmount
  useEffect(() => {
    const mixer = mixerRef.current
    const actions = actionsRef.current

    return () => {
      // Cleanup animations
      if (mixer) {
        actions.forEach((action) => {
          action.stop()
        })
        actions.clear()
        mixerRef.current = null
      }

      // Cleanup geometry and materials
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
