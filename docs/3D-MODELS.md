# 3D Model Rendering Documentation

Complete guide to working with 3D models in the application.

## Table of Contents

1. [Overview](#overview)
2. [Quick Start](#quick-start)
3. [Components](#components)
4. [Hooks](#hooks)
5. [Utilities](#utilities)
6. [Caching System](#caching-system)
7. [Configuration](#configuration)
8. [Examples](#examples)
9. [Best Practices](#best-practices)

---

## Overview

The application uses a robust 3D model rendering system built on top of:

- **React Three Fiber** - React renderer for Three.js
- **@react-three/drei** - Useful helpers for R3F
- **Custom caching system** - Optimized model loading and caching

### Key Features

- ✅ **Dual caching system** - Custom cache + drei cache for optimal performance
- ✅ **Automatic model centering and scaling** - Models are automatically positioned correctly
- ✅ **Interactive controls** - Users can rotate, zoom, and pan models
- ✅ **Animation support** - Play animations from Blender-exported GLB/GLTF files
- ✅ **Preloading support** - Preload models for instant loading
- ✅ **Type-safe** - Full TypeScript support
- ✅ **Reusable components** - Easy to use in any part of the application

---

## Quick Start

### Basic Usage

The simplest way to render a 3D model:

```tsx
import { PreviewScene } from '@/features/preview-scene'

export default function MyPage() {
  return <PreviewScene modelPath="/models/regular-case.glb" />
}
```

That's it! The model will be loaded, centered, scaled, and rendered with interactive controls.

### With Preloading

For better performance, preload the model before rendering:

```tsx
import { PreviewScene, useModelPreload } from '@/features/preview-scene'

export default function MyPage() {
  useModelPreload('/models/regular-case.glb')

  return <PreviewScene modelPath="/models/regular-case.glb" />
}
```

---

## Components

### PreviewScene

The main component for rendering 3D models. Handles the Canvas setup, lighting, camera, and controls.

#### Props

```tsx
interface PreviewSceneProps {
  modelPath: string // Path to GLB/GLTF file (required)
  fallback?: React.ReactNode // Component shown while loading (optional)
  className?: string // CSS class for container (optional, default: 'w-full h-full relative')
}
```

#### Example

```tsx
import { PreviewScene } from '@/features/preview-scene'

function MyComponent() {
  return (
    <PreviewScene
      modelPath="/models/regular-case.glb"
      fallback={<div>Loading 3D model...</div>}
      className="w-full h-[600px] rounded-lg shadow-xl"
    />
  )
}
```

#### With Animation

```tsx
import { PreviewScene } from '@/features/preview-scene'

function AnimatedComponent() {
  return (
    <PreviewScene
      modelPath="/models/animated-model.glb"
      animation={{
        autoPlay: true, // Start animation automatically
        loop: true, // Loop the animation
        speed: 1, // Normal speed (1 = normal, 2 = double, 0.5 = half)
        name: 'Idle', // Optional: specify animation name
      }}
    />
  )
}
```

#### What It Does

1. Sets up a Three.js Canvas with optimized settings
2. Configures camera position and field of view
3. Adds ambient, directional, and point lights
4. Renders the model using `Model3D` component
5. Provides OrbitControls for user interaction

---

### Model3D

Low-level component that handles model loading, processing, and rendering. Usually used internally by `PreviewScene`, but can be used directly for custom setups.

#### Props

```tsx
interface Model3DProps {
  modelPath: string // Path to GLB/GLTF file
}
```

#### Features

- Automatically clones the model scene
- Calculates bounding box for centering
- Scales model to fit in a configurable space (default: 2 units)
- Enables shadow casting and receiving
- Properly disposes resources on unmount

#### Example

```tsx
import { Model3D } from '@/features/preview-scene'
import { Canvas } from '@react-three/fiber'

function CustomScene() {
  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <Model3D modelPath="/models/regular-case.glb" />
      <OrbitControls />
    </Canvas>
  )
}
```

---

## Hooks

### useModelPreload

Preloads a single model into both caches (custom cache and drei cache).

#### Signature

```tsx
function useModelPreload(modelPath: string): void
```

#### Example

```tsx
import { useModelPreload } from '@/features/preview-scene'

function MyComponent() {
  // Preload model when component mounts
  useModelPreload('/models/regular-case.glb')

  return <div>Model is being preloaded...</div>
}
```

#### When to Use

- Preload models before navigating to a preview page
- Preload on hover/focus for better UX
- Preload critical models early in the app lifecycle

---

### useModelAnimations

Discover available animations in a 3D model. Useful when you don't know animation names.

#### Signature

```tsx
function useModelAnimations(modelPath: string): string[]
```

#### Example

```tsx
import { useModelAnimations } from '@/features/preview-scene'

function AnimationDiscovery() {
  const animations = useModelAnimations('/models/character.glb')

  // animations = ['Idle', 'Wave', 'Jump', 'Run']

  return (
    <div>
      <p>Available animations:</p>
      <ul>
        {animations.map((name) => (
          <li key={name}>{name}</li>
        ))}
      </ul>
    </div>
  )
}
```

#### When to Use

- Debug which animations are available in a model
- Build UI to let users select animations
- Verify animation names match your expectations

---

### usePreloadModels

Preloads multiple models and tracks loading state for each.

#### Signature

```tsx
function usePreloadModels(modelPaths: string[]): {
  isLoading: boolean
  preloadedModels: boolean[]
}
```

#### Example

```tsx
import { usePreloadModels, PreviewScene } from '@/features/preview-scene'
import { useState } from 'react'

const MODELS = [
  '/models/model1.glb',
  '/models/model2.glb',
  '/models/model3.glb',
]

function Gallery() {
  const [activeIndex, setActiveIndex] = useState(0)
  const { isLoading, preloadedModels } = usePreloadModels(MODELS)

  if (isLoading) {
    return <div>Preloading models...</div>
  }

  return (
    <div>
      <PreviewScene modelPath={MODELS[activeIndex]} />
      <button
        onClick={() => setActiveIndex((prev) => prev + 1)}
        disabled={!preloadedModels[activeIndex + 1]}
      >
        Next
      </button>
    </div>
  )
}
```

#### Return Values

- `isLoading`: `true` while any model is still loading
- `preloadedModels`: Array of booleans indicating which models have loaded

---

## Utilities

### preloadModel

Async function to preload a single model outside of React components.

#### Signature

```tsx
async function preloadModel(modelPath: string): Promise<void>
```

#### Example

```tsx
import { preloadModel } from '@/features/preview-scene'

// In an async function or event handler
async function handleNavigation() {
  await preloadModel('/models/regular-case.glb')
  router.push('/preview') // Model is now cached
}
```

---

### preloadModels

Preload multiple models with error handling.

#### Signature

```tsx
async function preloadModels(modelPaths: string[]): Promise<
  Array<{
    path: string
    success: boolean
    error?: Error
  }>
>
```

#### Example

```tsx
import { preloadModels } from '@/features/preview-scene'

async function preloadGallery() {
  const results = await preloadModels([
    '/models/model1.glb',
    '/models/model2.glb',
    '/models/model3.glb',
  ])

  results.forEach((result) => {
    if (result.success) {
      console.log(`✓ Loaded: ${result.path}`)
    } else {
      console.error(`✗ Failed: ${result.path}`, result.error)
    }
  })
}
```

---

## Caching System

The application uses a **dual caching strategy** for optimal performance:

### 1. Custom Cache (`getCachedModel`)

- Location: `src/shared/lib/cache-model.ts`
- Purpose: App-wide model caching
- Features:
  - Stores models in a `Map<string, THREE.Group>`
  - Automatically clones models to prevent mutation
  - Can be used outside React components

### 2. drei Cache (`useGLTF`)

- Built into `@react-three/drei`
- Purpose: React Three Fiber integration
- Features:
  - Automatic caching for drei components
  - Works seamlessly with `Model3D` component

### How It Works

```
1. Model is preloaded → Stored in both caches
2. Component renders → Checks drei cache first (fastest)
3. If not in drei cache → Checks custom cache
4. If not in custom cache → Fetches from network
5. After loading → Stores in both caches for next time
```

### Preloading Strategy

Models are loaded **on-demand** when visiting pages that use them (e.g. `/inventory/preview`). Each page calls `useModelPreload(modelPath)` when it mounts, so the 3D asset (e.g. `regular-case.glb`) is only fetched when that page is actually used—not on every app load or refresh.

---

## Configuration

### Default Settings

All configuration is in `src/features/preview-scene/config/preview.config.ts`.

#### Camera Configuration

```tsx
DEFAULT_CAMERA_CONFIG = {
  position: [0, 1.2, 5.5], // [x, y, z] camera position
  fov: 50, // Field of view in degrees
}
```

#### Lighting Configuration

```tsx
DEFAULT_LIGHTING_CONFIG = {
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
```

#### Controls Configuration

```tsx
DEFAULT_CONTROLS_CONFIG = {
  enableZoom: true,
  enablePan: false,
  minDistance: 3,
  maxDistance: 10,
  autoRotate: false,
}
```

#### Model Scaling

```tsx
MODEL_SCALE_FACTOR = 2 // Models are scaled to fit in 2-unit space
```

### Customizing Configuration

To customize these settings, modify the config file or create your own `Canvas` setup using `Model3D` directly.

---

## Animation Support

### Overview

The preview-scene feature supports animations from Blender-exported GLB/GLTF files. Animations can be played automatically on load or controlled programmatically.

### Animation Configuration

```tsx
interface AnimationConfig {
  autoPlay?: boolean // Auto-play animation when model loads (default: false)
  name?: string // Animation name to play (uses first animation if not specified)
  speed?: number // Playback speed (1 = normal, 2 = double, 0.5 = half) (default: 1)
  loop?: boolean // Loop animation (default: true)
}
```

### Basic Animation Examples

#### Auto-play All Animations (No Name Needed)

**You don't need to know animation names!** If you omit the `name` property, it will automatically play **ALL available animations simultaneously**.

```tsx
<PreviewScene
  modelPath="/models/animated-model.glb"
  animation={{ autoPlay: true }}
/>
// Plays ALL animations found in the model at the same time
```

This is perfect when:

- You don't know the animation names
- Your model has multiple animations and you want them all to play
- You want to play whatever animations are available
- Animations don't have names (common with Blender exports)

#### Play Specific Animation

```tsx
<PreviewScene
  modelPath="/models/animated-model.glb"
  animation={{
    autoPlay: true,
    name: 'Wave', // Play animation named "Wave"
    loop: true,
    speed: 1.5, // Play at 1.5x speed
  }}
/>
```

#### Control Animation Speed

```tsx
<PreviewScene
  modelPath="/models/animated-model.glb"
  animation={{
    autoPlay: true,
    speed: 0.5, // Play at half speed
    loop: true,
  }}
/>
```

#### Play Once (No Loop)

```tsx
<PreviewScene
  modelPath="/models/animated-model.glb"
  animation={{
    autoPlay: true,
    loop: false, // Play once and stop
  }}
/>
```

### Working with Multiple Animations

If your Blender model has multiple animations, you can switch between them by changing the `name` property:

```tsx
import { useState } from 'react'
import { PreviewScene } from '@/features/preview-scene'

function AnimationSelector() {
  const [currentAnimation, setCurrentAnimation] = useState('Idle')

  const animations = ['Idle', 'Wave', 'Jump', 'Run']

  return (
    <div>
      <PreviewScene
        modelPath="/models/character.glb"
        animation={{
          autoPlay: true,
          name: currentAnimation,
          loop: true,
        }}
      />

      <div className="flex gap-2 mt-4">
        {animations.map((anim) => (
          <button
            key={anim}
            onClick={() => setCurrentAnimation(anim)}
            className={currentAnimation === anim ? 'active' : ''}
          >
            {anim}
          </button>
        ))}
      </div>
    </div>
  )
}
```

### Notes

- **Animations only work if the GLB/GLTF file contains animation data**
- **If no animations are present in the model, the component will render normally without errors**
- **Animation names are optional** - If you don't specify a name, **ALL available animations will play simultaneously**
- **All animations share the same speed and loop settings** - You can't configure them individually yet
- **Animation names must match exactly with the names exported from Blender** (if you specify a name)
- If an animation name is not found, a warning is logged to the console with available animation names
- **Playing all animations** is useful when:
  - Your model has multiple unnamed animations (common with Blender)
  - You want to see all animations at once
  - You don't know which specific animation to play

### How Blender Animations Work

In Blender, animations are created as **Actions** (also called Animation Data). When you export to GLB/GLTF:

1. **Each animation action gets a name** - Usually the name you gave it in Blender's Action Editor
2. **Default names** - If you didn't name them, Blender might use default names like "Action" or "Action.001"
3. **Multiple animations** - A single model can have multiple named animations

#### Finding Animation Names

You can discover animation names in several ways:

1. **Use the hook:**

```tsx
import { useModelAnimations } from '@/features/preview-scene'

const animations = useModelAnimations('/models/character.glb')
console.log(animations) // ['Idle', 'Wave', 'Jump']
```

2. **Check the console** - If you try to play a non-existent animation, the console will warn you and list available names

3. **Check Blender** - In Blender, open the Action Editor and look at action names before exporting

4. **Just omit the name** - The code will automatically use the first animation!

## Examples

### Example 1: Simple Preview Page

```tsx
'use client'

import { PreviewScene, useModelPreload } from '@/features/preview-scene'
import { MODEL_PATHS } from '@/shared/lib/models.constants'

export default function PreviewPage() {
  useModelPreload(MODEL_PATHS.REGULAR_CASE)

  return <PreviewScene modelPath={MODEL_PATHS.REGULAR_CASE} />
}
```

### Example 2: Product Gallery with Navigation

```tsx
'use client'

import { useState } from 'react'
import { PreviewScene, usePreloadModels } from '@/features/preview-scene'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const PRODUCTS = [
  { id: 1, model: '/models/product1.glb', name: 'Product 1' },
  { id: 2, model: '/models/product2.glb', name: 'Product 2' },
  { id: 3, model: '/models/product3.glb', name: 'Product 3' },
]

export default function ProductGallery() {
  const [activeIndex, setActiveIndex] = useState(0)
  const { isLoading, preloadedModels } = usePreloadModels(
    PRODUCTS.map((p) => p.model),
  )

  const handleNext = () => {
    if (activeIndex < PRODUCTS.length - 1) {
      setActiveIndex((prev) => prev + 1)
    }
  }

  const handlePrev = () => {
    if (activeIndex > 0) {
      setActiveIndex((prev) => prev - 1)
    }
  }

  return (
    <div className="relative w-full aspect-square">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
        </div>
      )}

      <PreviewScene
        modelPath={PRODUCTS[activeIndex].model}
        fallback={<div>Loading {PRODUCTS[activeIndex].name}...</div>}
      />

      <div className="absolute inset-0 flex items-center justify-between px-4 pointer-events-none">
        <button
          onClick={handlePrev}
          disabled={activeIndex === 0 || isLoading}
          className="pointer-events-auto p-2 rounded-full bg-white/80 shadow-md disabled:opacity-50"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={handleNext}
          disabled={activeIndex === PRODUCTS.length - 1 || isLoading}
          className="pointer-events-auto p-2 rounded-full bg-white/80 shadow-md disabled:opacity-50"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {PRODUCTS.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIndex(idx)}
            className={`w-3 h-3 rounded-full transition-all ${
              idx === activeIndex ? 'bg-blue-500 scale-125' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
```

### Example 3: Preload on Hover

```tsx
'use client'

import { useState } from 'react'
import { PreviewScene, useModelPreload } from '@/features/preview-scene'
import Link from 'next/link'

function InventoryItem({
  item,
}: {
  item: { id: string; model: string; name: string }
}) {
  const [isHovered, setIsHovered] = useState(false)

  // Preload when hovered
  if (isHovered) {
    useModelPreload(item.model)
  }

  return (
    <Link
      href={`/inventory/preview?id=${item.id}`}
      onMouseEnter={() => setIsHovered(true)}
      className="block p-4 border rounded-lg hover:shadow-lg transition-shadow"
    >
      <h3>{item.name}</h3>
      <p className="text-sm text-gray-500">Hover to preload 3D model</p>
    </Link>
  )
}
```

### Example 4: Preload Before Navigation

```tsx
'use client'

import { preloadModel } from '@/features/preview-scene'
import { useRouter } from 'next/navigation'

function ProductCard({ product }: { product: { model: string; id: string } }) {
  const router = useRouter()

  const handleClick = async () => {
    // Preload model before navigating
    await preloadModel(product.model)
    router.push(`/products/${product.id}/preview`)
  }

  return <button onClick={handleClick}>View 3D Preview</button>
}
```

### Example 5: Custom Canvas Setup

```tsx
'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Model3D } from '@/features/preview-scene'

function CustomPreview() {
  return (
    <Canvas camera={{ position: [0, 2, 8], fov: 45 }}>
      {/* Custom lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={1.5} />
      <pointLight position={[-5, -5, -5]} intensity={0.8} color="#ff6b6b" />

      {/* Model */}
      <Model3D modelPath="/models/regular-case.glb" />

      {/* Custom controls */}
      <OrbitControls
        enableZoom={true}
        enablePan={true}
        minDistance={2}
        maxDistance={15}
        autoRotate={true}
        autoRotateSpeed={1}
      />
    </Canvas>
  )
}
```

### Example 6: Animated Model with Controls

```tsx
'use client'

import { useState } from 'react'
import { PreviewScene } from '@/features/preview-scene'

export default function AnimatedPreviewPage() {
  const [isPlaying, setIsPlaying] = useState(true)
  const [speed, setSpeed] = useState(1)

  return (
    <div className="w-full h-screen flex flex-col">
      {/* 3D Preview with Animation */}
      <div className="flex-1">
        <PreviewScene
          modelPath="/models/animated-character.glb"
          animation={{
            autoPlay: isPlaying,
            loop: true,
            speed: speed,
          }}
        />
      </div>

      {/* Controls */}
      <div className="p-4 bg-gray-100 flex gap-4 items-center">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          {isPlaying ? 'Pause' : 'Play'}
        </button>

        <label className="flex items-center gap-2">
          Speed:
          <input
            type="range"
            min="0.25"
            max="2"
            step="0.25"
            value={speed}
            onChange={(e) => setSpeed(parseFloat(e.target.value))}
          />
          <span>{speed}x</span>
        </label>
      </div>
    </div>
  )
}
```

---

## Best Practices

### 1. Always Preload Critical Models

```tsx
// ✅ Good - Preload before render
useModelPreload(modelPath)
return <PreviewScene modelPath={modelPath} />

// ❌ Bad - No preloading
return <PreviewScene modelPath={modelPath} />
```

### 2. Use Loading States

```tsx
// ✅ Good - Show loading state
const { isLoading } = usePreloadModels(modelPaths)
if (isLoading) return <LoadingSpinner />
return <PreviewScene modelPath={modelPaths[0]} />

// ❌ Bad - No loading feedback
return <PreviewScene modelPath={modelPaths[0]} />
```

### 3. Preload on Interaction

```tsx
// ✅ Good - Preload on hover
onMouseEnter={() => useModelPreload(modelPath)}

// ✅ Good - Preload before navigation
onClick={async () => {
  await preloadModel(modelPath)
  navigate()
}}
```

### 4. Handle Errors Gracefully

```tsx
// ✅ Good - Error handling
try {
  await preloadModel(modelPath)
} catch (error) {
  console.error('Failed to preload model', error)
  // Show error UI or fallback
}

// ✅ Good - Check preload status
const { preloadedModels } = usePreloadModels(modelPaths)
if (!preloadedModels[index]) {
  return <ErrorMessage>Model not ready</ErrorMessage>
}
```

### 5. Use Model Constants

```tsx
// ✅ Good - Use constants
import { MODEL_PATHS } from '@/shared/lib/models.constants'
<PreviewScene modelPath={MODEL_PATHS.REGULAR_CASE} />

// ❌ Bad - Hardcoded paths
<PreviewScene modelPath="/models/regular-case.glb" />
```

### 6. Optimize for Performance

- Preload models during app initialization for frequently used models
- Use `usePreloadModels` for galleries to load all models upfront
- Consider lazy loading for models that might not be viewed
- Dispose resources properly (handled automatically by `Model3D`)

---

## File Structure

```
src/
├── features/
│   └── preview-scene/
│       ├── components/
│       │   ├── PreviewScene.tsx    # Main component
│       │   ├── Model3D.tsx         # Low-level model component
│       │   └── index.ts
│       ├── hooks/
│       │   ├── useModelPreload.ts  # Single model preload hook
│       │   ├── usePreloadModels.ts # Multiple models preload hook
│       │   └── index.ts
│       ├── utils/
│       │   ├── model-preload.utils.ts  # Async preload utilities
│       │   └── index.ts
│       ├── config/
│       │   ├── preview.config.ts   # Default configurations
│       │   └── index.ts
│       ├── types.ts                # TypeScript types
│       └── index.ts                # Public exports
├── shared/
│   └── lib/
│       ├── cache-model.ts          # Custom caching utility
│       └── models.constants.ts     # Model path constants
```

---

## Troubleshooting

### Model Not Loading

1. **Check file path**: Ensure the model is in `public/models/` directory
2. **Verify file format**: Only GLB and GLTF formats are supported
3. **Check console**: Look for error messages in browser console
4. **Verify cache**: Check if model is being preloaded correctly

### Model Appears Too Large/Small

- Models are automatically scaled to fit in a 2-unit space
- To change scaling, modify `MODEL_SCALE_FACTOR` in config

### Performance Issues

- Ensure models are being preloaded
- Check if models are too large (consider optimizing them)
- Verify caching is working (check network tab on second load)

### Controls Not Working

- Ensure `OrbitControls` is enabled in config
- Check if any overlaying elements are blocking mouse events
- Verify Canvas is receiving pointer events

---

## Additional Resources

- [React Three Fiber Documentation](https://docs.pmnd.rs/react-three-fiber)
- [@react-three/drei Documentation](https://github.com/pmndrs/drei)
- [Three.js Documentation](https://threejs.org/docs/)
- [GLB/GLTF Format](https://www.khronos.org/gltf/)

---

## Need Help?

If you encounter issues or have questions:

1. Check the examples above
2. Review the component source code
3. Check the troubleshooting section
4. Review React Three Fiber and drei documentation
