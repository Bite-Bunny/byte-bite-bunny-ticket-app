'use client'

import { useEffect, useState } from 'react'
import { useGLTF } from '@react-three/drei'

/**
 * Hook to get available animations from a 3D model
 * Useful for discovering animation names in models
 *
 * @param modelPath - Path to the 3D model file (GLB/GLTF)
 * @returns Array of animation names available in the model
 *
 * @example
 * ```tsx
 * const animations = useModelAnimations('/models/character.glb')
 * // Returns: ['Idle', 'Wave', 'Jump', 'Run']
 * ```
 */
export function useModelAnimations(modelPath: string): string[] {
  const { animations } = useGLTF(modelPath)
  const [animationNames, setAnimationNames] = useState<string[]>([])

  useEffect(() => {
    const names = animations.map((clip) => clip.name)
    setAnimationNames(names)
  }, [animations])

  return animationNames
}

