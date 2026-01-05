'use client'

import React from 'react'
import { PreviewScene, useModelPreload } from '@/features/preview-scene'
import { MODEL_PATHS } from '@/shared/lib/models.constants'

export default function PreviewPage() {
  // Preload model using custom cache utility for better performance
  useModelPreload(MODEL_PATHS.REGULAR_CASE)

  return <PreviewScene modelPath={MODEL_PATHS.REGULAR_CASE} />
}
