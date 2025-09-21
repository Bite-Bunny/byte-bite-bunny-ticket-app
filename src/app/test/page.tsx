'use client'

import dynamic from 'next/dynamic'
import React from 'react'

const TestContent = dynamic(
  () => import('@/features/test').then((mod) => ({ default: mod.TestContent })),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center p-4">Loading...</div>
    ),
  },
)

const Test = () => {
  return <TestContent />
}

export default Test
