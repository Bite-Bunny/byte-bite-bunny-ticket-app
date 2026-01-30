'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useModelPreload } from '@/features/preview-scene'
import { MODEL_PATHS } from '@/shared/lib/models.constants'
import { Loading } from '@/shared/components/Loading'
import { Button } from '@/shared/components/ui'
import { mapOpenCaseItemsToDisplay } from '@/features/cases/utils/map-cases-feed'
import { invalidateUserCache } from '@/shared/hooks/api'
import type { OpenCaseResult } from '@/core/api/services/cases.service'

const CASE_OPEN_RESULT_KEY = 'caseOpenResult'
/** Minimum time to show the 3D case before revealing rewards (ms). */
const MIN_SCENE_TIME_MS = 2000

const PreviewScene = dynamic(
  () =>
    import('@/features/preview-scene').then((mod) => ({
      default: mod.PreviewScene,
    })),
  { ssr: false, loading: () => <Loading /> },
)

export default function CaseOpenPage() {
  const router = useRouter()
  const [result, setResult] = useState<OpenCaseResult | null>(null)
  const [showRewards, setShowRewards] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [animationEnded, setAnimationEnded] = useState(false)
  const sceneMountedAtRef = useRef<number | null>(null)

  useModelPreload(MODEL_PATHS.REGULAR_CASE)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    try {
      const raw = sessionStorage.getItem(CASE_OPEN_RESULT_KEY)
      if (!raw) {
        router.replace('/cases')
        return
      }
      const parsed = JSON.parse(raw) as OpenCaseResult
      if (!parsed?.items?.length) {
        sessionStorage.removeItem(CASE_OPEN_RESULT_KEY)
        router.replace('/cases')
        return
      }
      setResult(parsed)
    } catch {
      sessionStorage.removeItem(CASE_OPEN_RESULT_KEY)
      router.replace('/cases')
    }
  }, [mounted, router])

  const handleClaimReward = () => {
    sessionStorage.removeItem(CASE_OPEN_RESULT_KEY)
    invalidateUserCache()
    router.push('/cases')
  }

  const handleAnimationEnd = () => {
    setAnimationEnded(true)
  }

  // Record when the 3D scene is first shown (for minimum display time)
  useEffect(() => {
    if (result === null || showRewards) return
    if (sceneMountedAtRef.current !== null) return
    sceneMountedAtRef.current = Date.now()
  }, [result, showRewards])

  // Show rewards only after (1) animation ended AND (2) minimum scene time elapsed
  useEffect(() => {
    if (!animationEnded || result === null) return
    const mountedAt = sceneMountedAtRef.current ?? Date.now()
    const elapsed = Date.now() - mountedAt
    const remaining = MIN_SCENE_TIME_MS - elapsed
    if (remaining <= 0) {
      setShowRewards(true)
      return
    }
    const t = setTimeout(() => setShowRewards(true), remaining)
    return () => clearTimeout(t)
  }, [animationEnded, result])

  if (!mounted || result === null) {
    return <Loading />
  }

  const displayItems = mapOpenCaseItemsToDisplay(result.items)

  return (
    <div className="w-full h-full flex flex-col relative min-h-0">
      {!showRewards ? (
        <Suspense fallback={<Loading />}>
          <PreviewScene
            modelPath={MODEL_PATHS.REGULAR_CASE}
            animation={{
              autoPlay: true,
              loop: false,
              speed: 0.5,
              holdAtEnd: true,
            }}
            onAnimationEnd={handleAnimationEnd}
          />
        </Suspense>
      ) : (
        <div className="flex flex-col flex-1 w-full min-h-0 overflow-auto py-8 px-4">
          <motion.h1
            className="text-center text-2xl md:text-3xl font-bold text-white mb-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            You got
          </motion.h1>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-8">
            {displayItems.map((item, index) => (
              <motion.div
                key={item.id}
                className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/5 backdrop-blur-[10px] border border-white/10 min-w-[120px]"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="relative w-20 h-20 md:w-24 md:h-24 flex-shrink-0">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-contain"
                    sizes="96px"
                  />
                </div>
                <span className="text-white font-medium text-center text-sm md:text-base">
                  {item.name}
                </span>
              </motion.div>
            ))}
          </div>
          <motion.div
            className="flex justify-center mt-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <Button
              onClick={handleClaimReward}
              className="px-8 py-3 rounded-xl bg-brand/80 hover:bg-brand border-brand/50 font-semibold text-white"
            >
              Claim Reward
            </Button>
          </motion.div>
        </div>
      )}
    </div>
  )
}
