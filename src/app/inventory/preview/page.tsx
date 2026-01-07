'use client'

import React, { useState } from 'react'
import { PreviewScene, useModelPreload } from '@/features/preview-scene'
import type { AnimationControls } from '@/features/preview-scene'
import { MODEL_PATHS } from '@/shared/lib/models.constants'
import { Button } from '@/shared/components/ui/Button'
import { Card } from '@/shared/components/ui/Card'

export default function PreviewPage() {
  const [animationControls, setAnimationControls] =
    useState<AnimationControls | null>(null)

  // Preload model using custom cache utility for better performance
  useModelPreload(MODEL_PATHS.REGULAR_CASE)

  const handleStop = () => {
    // Stop animation and seek to end (chest stays open)
    animationControls?.stop(true)
  }

  const handlePlay = () => {
    animationControls?.play()
  }

  const handleReset = () => {
    animationControls?.reset()
  }

  return (
    <div className="w-full h-full flex flex-col relative">
      <PreviewScene
        modelPath={MODEL_PATHS.REGULAR_CASE}
        animation={{
          autoPlay: true,
          loop: false,
          speed: 0.5,
          holdAtEnd: true, // Chest will stay open after animation
        }}
        onAnimationControlsReady={(controls) => {
          setAnimationControls(controls)
        }}
      />

      {/* Glass morphism control panel */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
        <Card className="p-3 md:p-4 flex gap-2 md:gap-3 flex-wrap justify-center">
          <Button
            onClick={handleStop}
            className="px-4 md:px-6 py-2 md:py-2.5 text-sm md:text-base font-medium rounded-xl"
            disabled={!animationControls}
          >
            Stop
          </Button>
          <Button
            onClick={handleReset}
            className="px-4 md:px-6 py-2 md:py-2.5 text-sm md:text-base font-medium rounded-xl"
            disabled={!animationControls}
          >
            Reset
          </Button>
          <Button
            onClick={handlePlay}
            className="px-4 md:px-6 py-2 md:py-2.5 text-sm md:text-base font-medium rounded-xl"
            disabled={!animationControls}
          >
            Play
          </Button>
        </Card>
      </div>
    </div>
  )
}
