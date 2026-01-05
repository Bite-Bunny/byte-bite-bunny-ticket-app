'use client'

import * as THREE from 'three'
import React, { useRef, useMemo, useEffect, forwardRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { MODEL_SCALE_FACTOR } from '../config/preview.config'
import type { AnimationConfig, AnimationControls } from '../types'

interface Model3DProps {
  modelPath: string
  animation?: AnimationConfig
  /**
   * Optional callback to receive animation controls
   */
  onControlsReady?: (controls: AnimationControls) => void
}

export interface Model3DRef {
  controls: AnimationControls
}

/**
 * 3D Model component that loads, scales, and centers a GLB/GLTF model
 * Supports animations from Blender-exported GLB/GLTF files
 */
export const Model3D = forwardRef<Model3DRef, Model3DProps>(
  ({ modelPath, animation, onControlsReady }, ref) => {
    const modelRef = useRef<THREE.Group>(null!)
    const mixerRef = useRef<THREE.AnimationMixer | null>(null)
    const actionsRef = useRef<Map<string, THREE.AnimationAction>>(new Map())
    const isPlayingRef = useRef(false)
    const holdAtEndRef = useRef(false)

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

    // Store holdAtEnd setting
    useEffect(() => {
      holdAtEndRef.current = animation?.holdAtEnd ?? false
    }, [animation?.holdAtEnd])

    // Create animation controls
    const controlsRef = useRef<AnimationControls>({
      play: () => {
        const actions = actionsRef.current
        const mixer = mixerRef.current
        if (!mixer || actions.size === 0) return

        const { name, speed = 1, loop = true } = animation ?? {}

        // Determine which animations to play
        const targetActions: THREE.AnimationAction[] = []

        if (name) {
          const targetAction = actions.get(name)
          if (targetAction) targetActions.push(targetAction)
        } else {
          actions.forEach((action) => {
            targetActions.push(action)
          })
        }

        targetActions.forEach((action) => {
          action.setLoop(
            loop ? THREE.LoopRepeat : THREE.LoopOnce,
            loop ? Infinity : 1,
          )
          action.timeScale = speed

          // If loop is false and holdAtEnd is true, set up finished callback
          if (!loop && holdAtEndRef.current) {
            action.clampWhenFinished = true
          }

          action.play()
        })

        isPlayingRef.current = true
      },
      stop: (seekToEnd = false) => {
        const actions = actionsRef.current
        if (actions.size === 0) return

        actions.forEach((action) => {
          if (seekToEnd || holdAtEndRef.current) {
            // Seek to the end before stopping
            action.time = action.getClip().duration
            action.clampWhenFinished = true
          }
          action.stop()
        })

        isPlayingRef.current = false
      },
      pause: () => {
        const actions = actionsRef.current
        actions.forEach((action) => {
          action.paused = true
        })
        isPlayingRef.current = false
      },
      reset: () => {
        const actions = actionsRef.current
        actions.forEach((action) => {
          action.reset()
          action.time = 0
          action.clampWhenFinished = false
        })
        isPlayingRef.current = false
      },
      isPlaying: () => {
        return isPlayingRef.current
      },
    })

    // Expose controls via ref and callback
    useEffect(() => {
      if (ref) {
        if (typeof ref === 'function') {
          ref({ controls: controlsRef.current })
        } else {
          ref.current = { controls: controlsRef.current }
        }
      }
      onControlsReady?.(controlsRef.current)
    }, [ref, onControlsReady])

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
        action.paused = false
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

        // If loop is false and holdAtEnd is true, clamp at end
        if (!loop && holdAtEndRef.current) {
          action.clampWhenFinished = true
        }

        if (autoPlay) {
          action.play()
          isPlayingRef.current = true
        }
      })

      return () => {
        // Stop animations when config changes or component unmounts
        actions.forEach((action) => {
          action.stop()
        })
        isPlayingRef.current = false
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
  },
)

Model3D.displayName = 'Model3D'
