'use client'

import dynamic from 'next/dynamic'
import React from 'react'

const HomeContent = dynamic(() => import('@/pages/HomeContent'), {
  ssr: false,
  loading: () => <div className="page-content">Loading...</div>,
})

const Home = () => {
  return <HomeContent />
}

export default Home
