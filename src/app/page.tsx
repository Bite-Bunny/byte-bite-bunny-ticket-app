'use client'

import dynamic from 'next/dynamic'
import React from 'react'

const HomeContent = dynamic(
  () => import('@/features/home').then((mod) => ({ default: mod.HomeContent })),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center p-4">Loading...</div>
    ),
  },
)

const Home = () => {
  return <HomeContent />
}

export default Home
