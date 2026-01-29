'use client'

import { Page } from '@/shared/components/Page'
import { Card } from '@/shared/components/ui'

/** Number of card placeholders to match typical API response (e.g. 5 tiers). */
const SKELETON_CARD_COUNT = 5

export function CreditsContentSkeleton() {
  return (
    <Page>
      <div className="flex flex-col w-full max-w-full min-h-0 py-4">
        {/* Title skeleton */}
        <div className="h-9 md:h-10 w-48 md:w-56 mx-auto mb-6 md:mb-8 mt-2 rounded-xl bg-white/10 animate-pulse" />

        {/* Description skeleton */}
        <div className="h-4 md:h-5 w-full max-w-md mx-auto mb-6 px-4 rounded-lg bg-white/10 animate-pulse" />

        <div className="flex flex-col gap-4 md:gap-5 w-full max-w-md mx-auto pb-24">
          {Array.from({ length: SKELETON_CARD_COUNT }, (_, i) => (
            <Card
              key={i}
              variant="elevated"
              className="p-5 md:p-6 pointer-events-none"
            >
              <div className="flex flex-col gap-4">
                {/* Credits row */}
                <div className="flex items-center justify-center gap-3 bg-white/5 rounded-2xl p-4 md:p-5 border border-white/10">
                  <div className="h-8 md:h-10 w-20 md:w-24 rounded-lg bg-white/20 animate-pulse" />
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/20 animate-pulse" />
                </div>

                {/* Stars row */}
                <div className="flex items-center justify-center gap-3 bg-yellow-500/10 rounded-2xl p-4 md:p-5 border border-yellow-400/20 -mt-2 ml-2 mr-2">
                  <div className="h-7 md:h-8 w-16 md:w-20 rounded-lg bg-white/20 animate-pulse" />
                  <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-white/20 animate-pulse" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Page>
  )
}
