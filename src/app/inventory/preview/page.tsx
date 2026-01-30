'use client'

import React, { Suspense } from 'react'
import dynamic from 'next/dynamic'
import { useModelPreload } from '@/features/preview-scene'
import { MODEL_PATHS } from '@/shared/lib/models.constants'
import { Loading } from '@/shared/components/Loading'

const PreviewScene = dynamic(
  () =>
    import('@/features/preview-scene').then((mod) => ({
      default: mod.PreviewScene,
    })),
  {
    ssr: false,
    loading: () => <Loading />,
  },
)

export default function PreviewPage() {
  useModelPreload(MODEL_PATHS.REGULAR_CASE)

  return (
    <div className="w-full h-full flex flex-col relative">
      <Suspense fallback={<Loading />}>
        <PreviewScene
          modelPath={MODEL_PATHS.REGULAR_CASE}
          animation={{
            autoPlay: true,
            loop: false,
            speed: 0.5,
            holdAtEnd: true,
          }}
        />
      </Suspense>
    </div>
  )
}
