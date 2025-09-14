'use client'

import { useState } from 'react'
import './MobileLayout.css'
import { MobileNavBar } from './MobileNavBar'
import Image from 'next/image'

export type TabType = 'home' | 'convert' | 'inventory'

export function MobileLayout() {
  const [activeTab, setActiveTab] = useState<TabType>('home')

  return (
    <div className="mobile-layout">
      <div className="mobile-layout__background" />
      <div className="mobile-layout__content">
        <div className="mobile-layout__header">
          <Image
            src="/logo.svg"
            alt="Bite Bunny Logo"
            width={99}
            height={20}
            className="mobile-layout__logo"
          />
        </div>

        <div className="mobile-layout__main">
          {/* Empty main content area */}
        </div>

        <MobileNavBar activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  )
}
