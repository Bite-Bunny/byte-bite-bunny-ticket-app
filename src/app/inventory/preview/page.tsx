'use client'

import * as THREE from 'three'
import React, { useRef, useMemo, Suspense, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'
import { modelPreloader } from '@/shared/lib/model-preloader'
import '@/css/preview.css'

// Preload model using drei's system for better integration
useGLTF.preload('/models/regular-case.glb')

function Model() {
  const modelRef = useRef<THREE.Group>(null!)
  // Use drei's useGLTF which automatically uses preloaded model if available
  const { scene } = useGLTF('/models/regular-case.glb')

  // Clone and prepare the scene
  const clonedScene = useMemo(() => {
    const cloned = scene.clone()
    // Calculate bounding box to center and scale the model
    const box = new THREE.Box3().setFromObject(cloned)
    const center = box.getCenter(new THREE.Vector3())
    const size = box.getSize(new THREE.Vector3())
    const maxDim = Math.max(size.x, size.y, size.z)
    const scale = 2 / maxDim // Scale to fit in a 2-unit space

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

export default function PreviewPage() {
  return (
    <div className="w-full h-full relative">
      <Suspense fallback={null}>
        <Canvas
          camera={{ position: [0, 1.2, 5.5], fov: 50 }}
          gl={{ antialias: true, alpha: true }}
          dpr={[1, 2]}
          performance={{ min: 0.5 }}
        >
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
          <Model />
          <OrbitControls
            enableZoom={true}
            enablePan={false}
            minDistance={3}
            maxDistance={10}
            autoRotate={false}
          />
        </Canvas>
      </Suspense>
    </div>
  )
}
